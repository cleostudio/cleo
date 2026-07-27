"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import { ThinkingOrb, type OrbState } from "thinking-orbs"

import type { ActivityItem, WebSearchSource } from "~/lib/cleo/stream"
import { cn } from "~/lib/utils"

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
  return (
    status === "in_progress" ||
    status === "searching" ||
    status === "generating" ||
    status === "interpreting"
  )
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

  if (activity.kind === "image_generation") {
    if (activity.status === "completed") {
      return "Generated an image"
    }

    if (activity.status === "failed") {
      return "Image generation failed"
    }

    return "Generating an image"
  }

  if (activity.kind === "portal_tool") {
    const portalAction =
      activity.action && activity.action.type === "portal_tool"
        ? activity.action
        : null
    if (portalAction?.label) {
      return portalAction.label
    }
    if (activity.status === "completed") {
      return "Used a portal tool"
    }
    return "Using a portal tool"
  }

  if (activity.kind === "code_interpreter") {
    if (activity.status === "completed") {
      return "Ran python"
    }
    if (activity.status === "failed") {
      return "Python tool failed"
    }
    if (activity.status === "interpreting") {
      return "Running python"
    }
    return "Preparing python"
  }

  const action = activity.action

  if (!action || action.type === "portal_tool") {
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

function searchSources(activity: ActivityItem): WebSearchSource[] {
  const action = activity.action
  if (!action || action.type !== "search" || !action.sources) {
    return []
  }
  return action.sources.filter((source) => Boolean(source.url)).slice(0, 5)
}

function hasActionDetail(activity: ActivityItem) {
  const action = activity.action

  if (!action) {
    return false
  }

  if (action.type === "portal_tool") {
    return Boolean(action.label || action.name)
  }

  if (action.type === "search") {
    return Boolean(
      action.queries?.[0] ?? action.query ?? action.sources?.length
    )
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

  if (
    activity.kind === "image_generation" ||
    activity.kind === "portal_tool" ||
    activity.kind === "code_interpreter"
  ) {
    return true
  }

  return hasActionDetail(activity)
}

function shouldShowExpandedActivity(activity: ActivityItem, isLive: boolean) {
  if (activity.kind !== "reasoning") {
    return true
  }

  if (activity.summary?.trim()) {
    return true
  }

  // Keep a live empty reasoning step as "Thinking"; hide completed placeholders
  // that otherwise repeat as bare "Thought" between search actions.
  return isLive && isActiveStatus(activity.status)
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
  const hasActiveImageGeneration = activities.some(
    (activity) =>
      activity.kind === "image_generation" && isActiveStatus(activity.status)
  )
  const hasActivePortalTool = activities.some(
    (activity) =>
      activity.kind === "portal_tool" && isActiveStatus(activity.status)
  )
  const hasActiveCodeInterpreter = activities.some(
    (activity) =>
      activity.kind === "code_interpreter" && isActiveStatus(activity.status)
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

  if (
    isLive &&
    (hasActiveImageGeneration ||
      hasActivePortalTool ||
      hasActiveCodeInterpreter)
  ) {
    return "composing"
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
          {activities
            .filter((activity) => shouldShowExpandedActivity(activity, isLive))
            .map((activity) => {
              const detail = activityLabel(activity)
              const isActive = isActiveStatus(activity.status)
              const isReasoning = activity.kind === "reasoning"
              const shimmerActive =
                activity.kind !== "reasoning" && isActive && isLive
              const sources =
                activity.status === "completed" ? searchSources(activity) : []

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
                  {sources.length > 0 ? (
                    <ul className="activity-sources">
                      {sources.map((source) => {
                        const host = hostnameFromUrl(source.url)
                        return (
                          <li key={source.url}>
                            <a
                              className="activity-source-link"
                              href={source.url}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {host || source.url}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </li>
              )
            })}
        </ul>
      ) : null}
    </div>
  )
}
