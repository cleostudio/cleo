/**
 * Pure helpers for Cleo transcript continuity: settling mid-flight activities
 * after Stop/reload, marking unfinished assistants incomplete, and deciding
 * whether the document should autoscroll with new tokens.
 */

import {
  incompleteStatusMessage,
  type ActivityItem,
  type IncompleteReason,
} from "~/lib/cleo/stream"

const LIVE_ACTIVITY_STATUSES = new Set<ActivityItem["status"]>([
  "in_progress",
  "searching",
  "generating",
  "interpreting",
])

export const AUTOSCROLL_BOTTOM_THRESHOLD_PX = 120
/** Minimum gap between mid-turn localStorage checkpoints while streaming. */
export const IN_FLIGHT_CHECKPOINT_MS = 750

/**
 * Delay until the next in-flight checkpoint should run.
 * `0` means save immediately (first checkpoint or interval elapsed).
 */
export function inFlightCheckpointDelayMs(
  lastSavedAt: number,
  now: number,
  intervalMs = IN_FLIGHT_CHECKPOINT_MS
): number {
  if (lastSavedAt <= 0) return 0
  const elapsed = now - lastSavedAt
  if (elapsed >= intervalMs) return 0
  return intervalMs - elapsed
}

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

/**
 * Flip in-progress tool/reasoning rows to cancelled so the panel can settle
 * without claiming the step finished successfully.
 */
export function settleActivities(
  activities: readonly ActivityItem[] | undefined
): ActivityItem[] {
  if (!activities?.length) return []
  return activities.map((activity) =>
    isLiveActivityStatus(activity.status)
      ? { ...activity, status: "cancelled" as const }
      : activity
  )
}

type HydrateAssistant = {
  activities?: ActivityItem[]
  content: string
  images?: unknown[]
  incomplete?: {
    message: string
    reason?: IncompleteReason
  }
  role: "assistant" | "user"
}

/**
 * Mark an assistant turn interrupted: settle live activities and attach an
 * incomplete marker for Continue / Retry.
 */
export function markAssistantInterrupted<T extends HydrateAssistant>(
  message: T,
  reason: IncompleteReason
): T {
  return {
    ...message,
    activities: message.activities
      ? settleActivities(message.activities)
      : message.activities,
    incomplete: {
      reason,
      message: incompleteStatusMessage(reason),
    },
  }
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
    const isLast = index === messages.length - 1

    if (isLast && !message.incomplete && (inFlight || hadLive)) {
      return markAssistantInterrupted(message, "stopped")
    }

    if (!message.activities) return message

    return {
      ...message,
      activities: settleActivities(message.activities),
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
