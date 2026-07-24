export type WebSearchAction =
  | {
      type: "search"
      queries?: string[]
      query?: string
    }
  | {
      type: "open_page"
      url?: string | null
    }
  | {
      type: "find_in_page"
      pattern: string
      url: string
    }

export type ActivityStatus =
  "in_progress" | "searching" | "completed" | "failed"

export type ActivityKind = "web_search" | "reasoning"

export type ActivityItem = {
  action?: WebSearchAction
  id: string
  kind: ActivityKind
  status: ActivityStatus
  summary?: string
}

export type StreamTextEvent = {
  delta: string
  type: "text"
}

export type StreamActivityEvent = {
  activity: ActivityItem
  type: "activity"
}

export type StreamErrorEvent = {
  error: string
  type: "error"
}

export type ClientStreamEvent =
  StreamTextEvent | StreamActivityEvent | StreamErrorEvent

function isActivityStatus(value: unknown): value is ActivityStatus {
  return (
    value === "in_progress" ||
    value === "searching" ||
    value === "completed" ||
    value === "failed"
  )
}

function isActivityKind(value: unknown): value is ActivityKind {
  return value === "web_search" || value === "reasoning"
}

function parseActivityItem(value: unknown): ActivityItem | null {
  if (typeof value !== "object" || value === null) {
    return null
  }

  if (
    !("id" in value) ||
    typeof value.id !== "string" ||
    !("kind" in value) ||
    !isActivityKind(value.kind) ||
    !("status" in value) ||
    !isActivityStatus(value.status)
  ) {
    return null
  }

  const activity: ActivityItem = {
    id: value.id,
    kind: value.kind,
    status: value.status,
  }

  if (
    "summary" in value &&
    value.summary !== undefined &&
    typeof value.summary !== "string"
  ) {
    return null
  }

  if ("summary" in value && typeof value.summary === "string") {
    activity.summary = value.summary
  }

  if ("action" in value && value.action !== undefined) {
    if (typeof value.action !== "object" || value.action === null) {
      return null
    }

    activity.action = value.action as WebSearchAction
  }

  return activity
}

export function encodeStreamEvent(event: ClientStreamEvent) {
  return `${JSON.stringify(event)}\n`
}

export function parseStreamLine(line: string): ClientStreamEvent | null {
  const trimmed = line.trim()

  if (!trimmed) {
    return null
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("type" in parsed) ||
      typeof parsed.type !== "string"
    ) {
      return null
    }

    if (parsed.type === "text") {
      if (!("delta" in parsed) || typeof parsed.delta !== "string") {
        return null
      }

      return { type: "text", delta: parsed.delta }
    }

    if (parsed.type === "activity") {
      if (!("activity" in parsed)) {
        return null
      }

      const activity = parseActivityItem(parsed.activity)

      if (!activity) {
        return null
      }

      return {
        type: "activity",
        activity,
      }
    }

    if (parsed.type === "error") {
      if (!("error" in parsed) || typeof parsed.error !== "string") {
        return null
      }

      return { type: "error", error: parsed.error }
    }

    return null
  } catch {
    return null
  }
}
