/**
 * Pure helpers for Cleo transcript continuity: settling mid-flight activities
 * after Stop/reload, marking unfinished assistants incomplete, and deciding
 * whether the document should autoscroll with new tokens.
 */

import { incompleteStatusMessage, type ActivityItem } from "~/lib/cleo/stream"

const LIVE_ACTIVITY_STATUSES = new Set<ActivityItem["status"]>([
  "in_progress",
  "searching",
  "generating",
  "interpreting",
])

export const AUTOSCROLL_BOTTOM_THRESHOLD_PX = 120

export function isLiveActivityStatus(
  status: ActivityItem["status"]
): boolean {
  return LIVE_ACTIVITY_STATUSES.has(status)
}

export function hasLiveActivity(
  activities: readonly ActivityItem[] | undefined
): boolean {
  return Boolean(
    activities?.some((activity) => isLiveActivityStatus(activity.status))
  )
}

/** Flip in-progress tool/reasoning rows to completed so the panel can settle. */
export function settleActivities(
  activities: readonly ActivityItem[] | undefined
): ActivityItem[] {
  if (!activities?.length) return []
  return activities.map((activity) =>
    isLiveActivityStatus(activity.status)
      ? { ...activity, status: "completed" as const }
      : activity
  )
}

type HydrateAssistant = {
  activities?: ActivityItem[]
  content: string
  images?: unknown[]
  incomplete?: {
    message: string
    reason?: "max_output_tokens" | "content_filter" | "stopped" | "other"
  }
  role: "assistant" | "user"
}

/**
 * After a mid-turn reload (or defensive repair of stuck rows), settle live
 * activities and attach an incomplete marker so Continue/Retry remain available.
 */
export function hydrateRestoredMessages<T extends HydrateAssistant>(
  messages: readonly T[],
  options?: { inFlight?: boolean }
): T[] {
  const inFlight = Boolean(options?.inFlight)

  return messages.map((message, index) => {
    if (message.role !== "assistant") return message

    const hadLive = hasLiveActivity(message.activities)
    const activities = message.activities
      ? settleActivities(message.activities)
      : message.activities
    const isLast = index === messages.length - 1
    let incomplete = message.incomplete

    if (
      isLast &&
      !incomplete &&
      (inFlight || hadLive)
    ) {
      incomplete = {
        reason: "stopped",
        message: incompleteStatusMessage("stopped"),
      }
    }

    return {
      ...message,
      ...(activities ? { activities } : {}),
      ...(incomplete ? { incomplete } : {}),
    }
  })
}

export function distanceFromDocumentBottom(
  scrollY: number,
  viewportHeight: number,
  scrollHeight: number
): number {
  return scrollHeight - scrollY - viewportHeight
}

export function shouldStickToBottom(
  scrollY: number,
  viewportHeight: number,
  scrollHeight: number,
  thresholdPx = AUTOSCROLL_BOTTOM_THRESHOLD_PX
): boolean {
  return (
    distanceFromDocumentBottom(scrollY, viewportHeight, scrollHeight) <=
    thresholdPx
  )
}
