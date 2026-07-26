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
  "in_progress" | "searching" | "generating" | "completed" | "failed"

export type ActivityKind =
  | "web_search"
  | "reasoning"
  | "image_generation"
  | "code_interpreter"
  | "portal_lookup"

export type ActivityItem = {
  action?: WebSearchAction
  id: string
  kind: ActivityKind
  status: ActivityStatus
  summary?: string
}

export type MessageImage = {
  /** OpenAI image_generation_call id when the image was generated. */
  id?: string
  /** data: URL or https URL for display and API input. */
  url: string
}

export type StreamTextEvent = {
  delta: string
  type: "text"
}

export type StreamActivityEvent = {
  activity: ActivityItem
  type: "activity"
}

export type StreamImageEvent = {
  id: string
  imageUrl: string
  partial?: boolean
  type: "image"
}

export type StreamErrorEvent = {
  error: string
  type: "error"
}

export type ClientStreamEvent =
  StreamTextEvent | StreamActivityEvent | StreamImageEvent | StreamErrorEvent

function isActivityStatus(value: unknown): value is ActivityStatus {
  return (
    value === "in_progress" ||
    value === "searching" ||
    value === "generating" ||
    value === "completed" ||
    value === "failed"
  )
}

function isActivityKind(value: unknown): value is ActivityKind {
  return (
    value === "web_search" ||
    value === "reasoning" ||
    value === "image_generation" ||
    value === "code_interpreter" ||
    value === "portal_lookup"
  )
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

    if (parsed.type === "image") {
      if (
        !("id" in parsed) ||
        typeof parsed.id !== "string" ||
        !("imageUrl" in parsed) ||
        typeof parsed.imageUrl !== "string"
      ) {
        return null
      }

      const event: StreamImageEvent = {
        type: "image",
        id: parsed.id,
        imageUrl: parsed.imageUrl,
      }

      if ("partial" in parsed && parsed.partial === true) {
        event.partial = true
      }

      return event
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
