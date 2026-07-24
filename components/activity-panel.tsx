"use client"

import { useState } from "react"
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

function summaryLabel(activities: ActivityItem[], isLive: boolean) {
  const reasoningItems = activities.filter(
    (activity) => activity.kind === "reasoning"
  )
  const searchItems = activities.filter(
    (activity) => activity.kind === "web_search"
  )
  const hasActiveReasoning = reasoningItems.some((activity) =>
    isActiveStatus(activity.status)
  )
  const hasActiveSearch = searchItems.some((activity) =>
    isActiveStatus(activity.status)
  )

  if (isLive && hasActiveSearch) {
    return "Searching the web"
  }

  if (isLive && hasActiveReasoning) {
    return "Thinking"
  }

  const searchCount = searchItems.filter(
    (activity) => !activity.action || activity.action.type === "search"
  ).length
  const pageCount = searchItems.filter(
    (activity) => activity.action?.type === "open_page"
  ).length
  const hasReasoning = reasoningItems.length > 0
  const hasSearch = searchItems.length > 0

  if (hasReasoning && hasSearch) {
    if (pageCount > 0 && searchCount > 0) {
      return `Thought · searched ${searchCount} ${
        searchCount === 1 ? "query" : "queries"
      }, ${pageCount} ${pageCount === 1 ? "page" : "pages"}`
    }

    if (pageCount > 0) {
      return `Thought · browsed ${pageCount} ${
        pageCount === 1 ? "page" : "pages"
      }`
    }

    if (searchCount > 1) {
      return `Thought · searched ${searchCount} queries`
    }

    return "Thought · searched the web"
  }

  if (hasReasoning) {
    return "Thought"
  }

  if (pageCount > 0 && searchCount > 0) {
    return `Searched the web · ${searchCount} ${
      searchCount === 1 ? "query" : "queries"
    }, ${pageCount} ${pageCount === 1 ? "page" : "pages"}`
  }

  if (pageCount > 0) {
    return `Browsed ${pageCount} ${pageCount === 1 ? "page" : "pages"}`
  }

  if (searchCount > 1) {
    return `Searched the web · ${searchCount} queries`
  }

  return "Searched the web"
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

  if (activities.length === 0) {
    return null
  }

  const hasActive = activities.some((activity) =>
    isActiveStatus(activity.status)
  )
  const hasActiveSearch = activities.some(
    (activity) =>
      activity.kind === "web_search" && isActiveStatus(activity.status)
  )
  const label = summaryLabel(activities, isLive)
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
            "min-w-0",
            showPulse ? "whitespace-nowrap" : "truncate",
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
