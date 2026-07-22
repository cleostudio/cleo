"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"

import type { ActivityItem } from "@/lib/stream"
import { cn } from "@/lib/utils"

type ActivityPanelProps = {
  activities: ActivityItem[]
  isLive?: boolean
}

function hostnameFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function activityLabel(activity: ActivityItem) {
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
  const hasActive = activities.some(
    (activity) =>
      activity.status === "in_progress" || activity.status === "searching"
  )

  if (isLive && hasActive) {
    return "Searching the web"
  }

  const searchCount = activities.filter(
    (activity) => !activity.action || activity.action.type === "search"
  ).length
  const pageCount = activities.filter(
    (activity) => activity.action?.type === "open_page"
  ).length

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

export function ActivityPanel({
  activities,
  isLive = false,
}: ActivityPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (activities.length === 0) {
    return null
  }

  const hasActive = activities.some(
    (activity) =>
      activity.status === "in_progress" || activity.status === "searching"
  )
  const label = summaryLabel(activities, isLive)
  const showPulse = isLive && hasActive

  return (
    <div className="mb-3">
      <button
        aria-expanded={isOpen}
        className="group flex max-w-full items-center gap-1.5 rounded-md text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Globe
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0",
            showPulse && "animate-pulse"
          )}
        />
        <span
          className={cn(
            "min-w-0 truncate",
            showPulse && "activity-shimmer"
          )}
        >
          {label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen ? (
        <ul className="mt-2 space-y-1.5 pl-0.5">
          {activities.map((activity) => {
            const detail = activityLabel(activity)
            const isActive =
              activity.status === "in_progress" ||
              activity.status === "searching"

            return (
              <li
                className="flex min-w-0 items-start gap-2 text-xs leading-5 text-muted-foreground"
                key={activity.id}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50",
                    isActive && "animate-pulse bg-foreground"
                  )}
                />
                <span
                  className={cn(
                    "min-w-0 break-words",
                    isActive && isLive && "activity-shimmer"
                  )}
                >
                  {detail}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
