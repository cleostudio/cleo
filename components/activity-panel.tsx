"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"

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

function ShimmerText({ active = false, children, className }: ShimmerTextProps) {
  return (
    <span className={cn(className, active && "activity-shimmer")}>{children}</span>
  )
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
    <div className="activity-panel mb-3">
      <button
        aria-expanded={isOpen}
        className="group flex max-w-full items-center gap-1.5 rounded-md text-left text-sm transition-colors"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Globe
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground",
            !showPulse && "group-hover:text-foreground"
          )}
        />
        <ShimmerText
          active={showPulse}
          className={cn(
            "min-w-0",
            showPulse ? "whitespace-nowrap" : "truncate",
            !showPulse && "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {label}
        </ShimmerText>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:text-foreground",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen ? (
        <ul className="mt-2 space-y-1 pl-5">
          {activities.map((activity) => {
            const detail = activityLabel(activity)
            const isActive =
              activity.status === "in_progress" ||
              activity.status === "searching"

            return (
              <li className="min-w-0" key={activity.id}>
                <ShimmerText
                  active={isActive && isLive}
                  className={cn(
                    "text-xs leading-5 break-words",
                    !(isActive && isLive) && "text-muted-foreground"
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
