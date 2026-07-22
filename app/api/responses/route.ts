import OpenAI, { APIError } from "openai"
import type {
  EasyInputMessage,
  ResponseFunctionWebSearch,
} from "openai/resources/responses/responses"

import {
  type ActivityItem,
  type ActivityStatus,
  type ClientStreamEvent,
  encodeStreamEvent,
  type WebSearchAction,
} from "@/lib/stream"

const MODEL = "gpt-5.6-terra"
const MAX_INPUT_LENGTH = 10_000
const MAX_MESSAGES = 50
const MAX_TOTAL_INPUT_LENGTH = 100_000

type ConversationMessage = {
  content: string
  role: "assistant" | "user"
}

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status })
}

function parseMessages(body: unknown): ConversationMessage[] | Response {
  if (typeof body !== "object" || body === null) {
    return errorResponse("The request body must be a JSON object.", 400)
  }

  if (!("messages" in body) || !Array.isArray(body.messages)) {
    return errorResponse("A messages array is required.", 400)
  }

  if (body.messages.length === 0) {
    return errorResponse("Enter a question before sending.", 400)
  }

  if (body.messages.length > MAX_MESSAGES) {
    return errorResponse(
      `Conversations must be ${MAX_MESSAGES} messages or fewer.`,
      400
    )
  }

  const messages: ConversationMessage[] = []
  let totalLength = 0

  for (const item of body.messages) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("role" in item) ||
      !("content" in item) ||
      (item.role !== "user" && item.role !== "assistant") ||
      typeof item.content !== "string"
    ) {
      return errorResponse(
        "Each message must include a user or assistant role and text content.",
        400
      )
    }

    const content = item.content.trim()

    if (!content) {
      return errorResponse("Messages cannot be empty.", 400)
    }

    if (content.length > MAX_INPUT_LENGTH) {
      return errorResponse(
        `Messages must be ${MAX_INPUT_LENGTH.toLocaleString()} characters or fewer.`,
        400
      )
    }

    totalLength += content.length

    if (totalLength > MAX_TOTAL_INPUT_LENGTH) {
      return errorResponse(
        `Conversations must be ${MAX_TOTAL_INPUT_LENGTH.toLocaleString()} characters or fewer.`,
        400
      )
    }

    messages.push({ content, role: item.role })
  }

  if (messages.at(-1)?.role !== "user") {
    return errorResponse("The last message must come from the user.", 400)
  }

  return messages
}

function toWebSearchAction(
  action: ResponseFunctionWebSearch["action"] | undefined
): WebSearchAction | undefined {
  if (!action) {
    return undefined
  }

  if (action.type === "search") {
    return {
      type: "search",
      queries: action.queries,
      query: action.query,
    }
  }

  if (action.type === "open_page") {
    return {
      type: "open_page",
      url: action.url,
    }
  }

  return {
    type: "find_in_page",
    pattern: action.pattern,
    url: action.url,
  }
}

function activityFromWebSearch(
  item: ResponseFunctionWebSearch,
  status?: ActivityStatus
): ActivityItem {
  return {
    id: item.id,
    kind: "web_search",
    status: status ?? item.status,
    action: toWebSearchAction(item.action),
  }
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse("The request body must be valid JSON.", 400)
  }

  const parsed = parseMessages(body)

  if (parsed instanceof Response) {
    return parsed
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured.")
    return errorResponse("The AI service is not configured.", 503)
  }

  const client = new OpenAI({ apiKey })
  const input: EasyInputMessage[] = parsed.map((message) => ({
    role: message.role,
    content: message.content,
  }))

  try {
    const responseStream = await client.responses.create(
      {
        model: MODEL,
        input,
        instructions: [
          "Answer the user's question clearly and directly.",
          "Lead with the key point, then add supporting detail.",
          "Use the web_search tool when the question needs current,",
          "time-sensitive, or otherwise hard-to-verify information.",
          "When you use web results, cite sources with Markdown links.",
          "Use Markdown for scannable hierarchy:",
          "prefer ## and ### section headings (avoid a lone top-level # title),",
          "short paragraphs,",
          "bulleted or numbered lists for steps/options/takeaways,",
          "tables for comparisons,",
          "and fenced code blocks with language tags for code.",
          "Keep heading levels shallow and consistent; bold key terms sparingly.",
        ].join(" "),
        max_output_tokens: 4096,
        reasoning: { effort: "medium" },
        stream: true,
        text: { verbosity: "medium" },
        tools: [{ type: "web_search" }],
        store: false,
      },
      { signal: request.signal }
    )
    const encoder = new TextEncoder()
    const activities = new Map<string, ActivityItem>()

    const enqueue = (
      controller: ReadableStreamDefaultController<Uint8Array>,
      event: ClientStreamEvent
    ) => {
      controller.enqueue(encoder.encode(encodeStreamEvent(event)))
    }

    const emitActivity = (
      controller: ReadableStreamDefaultController<Uint8Array>,
      activity: ActivityItem
    ) => {
      const previous = activities.get(activity.id)
      const next: ActivityItem = {
        ...previous,
        ...activity,
        action: activity.action ?? previous?.action,
      }

      activities.set(activity.id, next)
      enqueue(controller, { type: "activity", activity: next })
    }

    const outputStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of responseStream) {
            if (event.type === "response.output_text.delta") {
              enqueue(controller, { type: "text", delta: event.delta })
              continue
            }

            if (event.type === "response.output_item.added") {
              if (event.item.type === "web_search_call") {
                emitActivity(
                  controller,
                  activityFromWebSearch(event.item, "in_progress")
                )
              }
              continue
            }

            if (event.type === "response.web_search_call.in_progress") {
              emitActivity(controller, {
                id: event.item_id,
                kind: "web_search",
                status: "in_progress",
              })
              continue
            }

            if (event.type === "response.web_search_call.searching") {
              emitActivity(controller, {
                id: event.item_id,
                kind: "web_search",
                status: "searching",
              })
              continue
            }

            if (event.type === "response.output_item.done") {
              if (event.item.type === "web_search_call") {
                emitActivity(controller, activityFromWebSearch(event.item))
              }
              continue
            }

            if (event.type === "response.web_search_call.completed") {
              emitActivity(controller, {
                id: event.item_id,
                kind: "web_search",
                status: "completed",
              })
              continue
            }

            if (event.type === "error") {
              throw new Error(event.message)
            }

            if (event.type === "response.failed") {
              throw new Error(
                event.response.error?.message ??
                  "The AI service could not complete the request."
              )
            }
          }

          controller.close()
        } catch (streamError) {
          if (!request.signal.aborted) {
            console.error("OpenAI Responses API stream failed.", streamError)

            try {
              enqueue(controller, {
                type: "error",
                error:
                  streamError instanceof Error
                    ? streamError.message
                    : "The AI service could not complete the request.",
              })
              controller.close()
            } catch {
              controller.error(streamError)
            }
          }
        }
      },
      cancel() {
        responseStream.controller.abort()
      },
    })

    return new Response(outputStream, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "X-Accel-Buffering": "no",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("OpenAI Responses API request failed.", error)

    if (error instanceof APIError && error.status === 429) {
      return errorResponse(
        "The AI service is receiving too many requests. Try again shortly.",
        429
      )
    }

    return errorResponse(
      "The AI service could not complete the request. Try again.",
      502
    )
  }
}
