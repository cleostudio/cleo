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
  | "in_progress"
  | "searching"
  | "completed"
  | "failed"

export type ActivityItem = {
  action?: WebSearchAction
  id: string
  kind: "web_search"
  status: ActivityStatus
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
  | StreamTextEvent
  | StreamActivityEvent
  | StreamErrorEvent

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
      if (
        !("activity" in parsed) ||
        typeof parsed.activity !== "object" ||
        parsed.activity === null
      ) {
        return null
      }

      return {
        type: "activity",
        activity: parsed.activity as ActivityItem,
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
