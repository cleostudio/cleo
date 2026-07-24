"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import { ThinkingOrb, type OrbState } from "thinking-orbs"

import type { ActivityItem } from "@/lib/stream"
import { cn } from "@/lib/utils"

type ActivityPanelProps = {
  activities: ActivityItem[]
  isLive?: boolean
}

type ShimmerTextProps = {
  active?: boolean
  children: string
  className?: string
}

function ShimmerText({
  active = false,
  children,
  className,
}: ShimmerTextProps) {
  return (
    <span className={cn(className, active && "activity-shimmer")}>
      {children}
    </span>
  )
}

function hostnameFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function isActiveStatus(status: ActivityItem["status"]) {
  return status === "in_progress" || status === "searching"
}

function formatReasoningSummary(summary: string) {
  return summary
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim()
}

function latestReasoningHeading(summary: string) {
  const headings: string[] = []
  const boldHeading = /(?:^|\n\n)\s*\*\*(.+?)\*\*/g

  for (const match of summary.matchAll(boldHeading)) {
    const heading = match[1]?.trim()

    if (heading) {
      headings.push(formatReasoningSummary(heading))
    }
  }

  if (headings.length > 0) {
    return headings[headings.length - 1]!
  }

  return (
    formatReasoningSummary(summary)
      .split(/\n+/)
      .map((line) => line.trim())
      .find(Boolean) ?? null
  )
}

function activityLabel(activity: ActivityItem) {
  if (activity.kind === "reasoning") {
    const summary = activity.summary?.trim()

    if (summary) {
      return formatReasoningSummary(summary)
    }

    return isActiveStatus(activity.status) ? "Thinking" : "Thought"
  }

  const action = activity.action

  if (!action) {
    if (activity.status === "completed") {
      return "Searched the web"
    }

    return "Searching the web"
  }

  if (action.type === "search") {
    const query = action.queries?.[0] ?? action.query

    if (activity.status === "completed") {
      return query ? `Searched “${query}”` : "Searched the web"
    }

    return query ? `Searching “${query}”` : "Searching the web"
  }

  if (action.type === "open_page") {
    const host = action.url ? hostnameFromUrl(action.url) : null

    if (activity.status === "completed") {
      return host ? `Opened ${host}` : "Opened a page"
    }

    return host ? `Opening ${host}` : "Opening a page"
  }

  const host = hostnameFromUrl(action.url)

  if (activity.status === "completed") {
    return `Found “${action.pattern}” on ${host}`
  }

  return `Looking for “${action.pattern}” on ${host}`
}

function hasActionDetail(activity: ActivityItem) {
  const action = activity.action

  if (!action) {
    return false
  }

  if (action.type === "search") {
    return Boolean(action.queries?.[0] ?? action.query)
  }

  if (action.type === "open_page") {
    return Boolean(action.url)
  }

  return Boolean(action.pattern && action.url)
}

function hasSpecificCollapsedDetail(activity: ActivityItem) {
  if (activity.kind === "reasoning") {
    return Boolean(activity.summary?.trim())
  }

  return hasActionDetail(activity)
}

function collapsedActivityLabel(activity: ActivityItem) {
  if (activity.kind === "reasoning") {
    const summary = activity.summary?.trim()

    if (!summary) {
      return isActiveStatus(activity.status) ? "Thinking" : "Thought"
    }

    return (
      latestReasoningHeading(summary) ??
      (isActiveStatus(activity.status) ? "Thinking" : "Thought")
    )
  }

  return activityLabel(activity)
}

function formatThoughtDuration(ms: number) {
  const totalSeconds = Math.max(1, Math.round(ms / 1000))

  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (seconds === 0) {
    return `${minutes}m`
  }

  return `${minutes}m ${seconds}s`
}

function liveSummaryLabel(activities: ActivityItem[]) {
  // Search actions often arrive only when the call completes, so skip
  // generic placeholders and keep the latest concrete step visible.
  for (let index = activities.length - 1; index >= 0; index -= 1) {
    const activity = activities[index]!

    if (hasSpecificCollapsedDetail(activity)) {
      return collapsedActivityLabel(activity)
    }
  }

  const latest = activities.at(-1)

  if (latest) {
    return collapsedActivityLabel(latest)
  }

  return "Thinking"
}

function summaryLabel(
  activities: ActivityItem[],
  isLive: boolean,
  durationMs: number | null
) {
  // Only show the completed duration after the stream finishes. Gaps between
  // reasoning and search steps briefly clear `hasActive` and would flash this.
  if (!isLive && durationMs !== null) {
    return `Thought for ${formatThoughtDuration(durationMs)}`
  }

  return liveSummaryLabel(activities)
}

function panelOrbState(activities: ActivityItem[], isLive: boolean): OrbState {
  const hasActiveSearch = activities.some(
    (activity) =>
      activity.kind === "web_search" && isActiveStatus(activity.status)
  )
  const hasActiveReasoning = activities.some(
    (activity) =>
      activity.kind === "reasoning" && isActiveStatus(activity.status)
  )
  const hasSearch = activities.some(
    (activity) => activity.kind === "web_search"
  )

  if (isLive && hasActiveSearch) {
    return "searching"
  }

  if (isLive && hasActiveReasoning) {
    return "composing"
  }

  return hasSearch ? "searching" : "composing"
}

export function ActivityPanel({
  activities,
  isLive = false,
}: ActivityPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const startedAtRef = useRef<number | null>(null)
  const [durationMs, setDurationMs] = useState<number | null>(null)

  const hasActive = activities.some((activity) =>
    isActiveStatus(activity.status)
  )

  useEffect(() => {
    if (activities.length === 0) {
      return
    }

    if (startedAtRef.current === null) {
      startedAtRef.current = performance.now()
    }

    // Record duration whenever steps settle. Gaps between steps may update this
    // early; the label only uses it after the stream is no longer live.
    if (!hasActive) {
      setDurationMs(performance.now() - startedAtRef.current)
    }
  }, [activities, hasActive])

  if (activities.length === 0) {
    return null
  }

  const hasActiveSearch = activities.some(
    (activity) =>
      activity.kind === "web_search" && isActiveStatus(activity.status)
  )
  const label = summaryLabel(activities, isLive, durationMs)
  const showPulse = isLive && hasActive
  const showShimmer = isLive && hasActiveSearch
  const orbState = panelOrbState(activities, isLive)

  return (
    <div className="activity-panel mb-3">
      <button
        aria-expanded={isOpen}
        className="group flex max-w-full items-center gap-1.5 rounded-md text-left text-sm transition-colors"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <ThinkingOrb
          aria-label={orbState === "searching" ? "Searching" : "Thinking"}
          className="shrink-0"
          paused={!showPulse}
          size={20}
          state={orbState}
        />
        <ShimmerText
          active={showShimmer}
          className={cn(
            "min-w-0 truncate whitespace-nowrap",
            !showShimmer && "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {label}
        </ShimmerText>
        <ChevronRight
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:text-foreground",
            isOpen && "rotate-90"
          )}
        />
      </button>

      {isOpen ? (
        <ul className="mt-2 space-y-1.5 pl-5">
          {activities.map((activity) => {
            const detail = activityLabel(activity)
            const isActive = isActiveStatus(activity.status)
            const isReasoning = activity.kind === "reasoning"
            const shimmerActive = !isReasoning && isActive && isLive

            return (
              <li className="min-w-0" key={activity.id}>
                <ShimmerText
                  active={shimmerActive}
                  className={cn(
                    "text-xs leading-5 break-words",
                    isReasoning && "whitespace-pre-wrap",
                    !shimmerActive && "text-muted-foreground"
                  )}
                >
                  {detail}
                </ShimmerText>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
