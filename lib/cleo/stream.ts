import {
  isEncryptedReasoningItem,
  type EncryptedReasoningItem,
} from "~/lib/cleo/reasoning-items"

export type { EncryptedReasoningItem }

export type WebSearchSource = {
  type: "url"
  url: string
}

export type WebSearchAction =
  | {
      type: "search"
      queries?: string[]
      query?: string
      /** Hosted web_search sources when requested via include. */
      sources?: WebSearchSource[]
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

export type ActivityKind = "web_search" | "reasoning" | "image_generation"

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

/** Replace the full assistant text after post-processing (e.g. citations). */
export type StreamTextReplaceEvent = {
  content: string
  type: "text_replace"
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

export type StreamReasoningItemsEvent = {
  items: EncryptedReasoningItem[]
  type: "reasoning_items"
}

export type IncompleteReason =
  | "max_output_tokens"
  | "content_filter"
  | "stopped"
  | "other"

export type StreamStatusEvent = {
  message: string
  reason?: IncompleteReason
  status: "incomplete"
  type: "status"
}

export type ClientStreamEvent =
  | StreamTextEvent
  | StreamTextReplaceEvent
  | StreamActivityEvent
  | StreamImageEvent
  | StreamErrorEvent
  | StreamReasoningItemsEvent
  | StreamStatusEvent

export function incompleteReasonFromApi(
  reason: string | undefined
): IncompleteReason {
  if (
    reason === "max_output_tokens" ||
    reason === "content_filter" ||
    reason === "stopped"
  ) {
    return reason
  }
  return "other"
}

export function incompleteStatusMessage(reason: IncompleteReason): string {
  if (reason === "max_output_tokens") {
    return "This answer was cut short before it finished."
  }
  if (reason === "content_filter") {
    return "This answer stopped early because of a safety filter."
  }
  if (reason === "stopped") {
    return "Stopped before finishing."
  }
  return "This answer stopped before it finished."
}

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
    value === "image_generation"
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

    if (parsed.type === "text_replace") {
      if (!("content" in parsed) || typeof parsed.content !== "string") {
        return null
      }

      return { type: "text_replace", content: parsed.content }
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

    if (parsed.type === "reasoning_items") {
      if (!("items" in parsed) || !Array.isArray(parsed.items)) {
        return null
      }

      const items = parsed.items.filter(isEncryptedReasoningItem)

      if (items.length === 0) {
        return null
      }

      return { type: "reasoning_items", items }
    }

    if (parsed.type === "status") {
      if (
        !("status" in parsed) ||
        parsed.status !== "incomplete" ||
        !("message" in parsed) ||
        typeof parsed.message !== "string"
      ) {
        return null
      }

      const event: StreamStatusEvent = {
        type: "status",
        status: "incomplete",
        message: parsed.message,
      }

      if (
        "reason" in parsed &&
        (parsed.reason === "max_output_tokens" ||
          parsed.reason === "content_filter" ||
          parsed.reason === "stopped" ||
          parsed.reason === "other")
      ) {
        event.reason = parsed.reason
      }

      return event
    }

    return null
  } catch {
    return null
  }
}
