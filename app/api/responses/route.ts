import OpenAI, { APIError } from "openai"
import type {
  EasyInputMessage,
  ResponseFunctionToolCall,
  ResponseFunctionWebSearch,
  ResponseInput,
  ResponseInputMessageContentList,
  ResponseOutputItem,
  ResponseReasoningItem,
} from "openai/resources/responses/responses"

import {
  CLEO_RESPONSE_INCLUDE,
  CLEO_RESPONSE_TOOLS,
  MAX_PORTAL_TOOL_ROUNDS,
} from "~/lib/cleo/cleo-tools"
import {
  buildGuideGroundingInstructions,
  conversationGroundingText,
  parseFocusGuideInput,
  selectGroundedGuides,
} from "~/lib/cleo/guide-grounding"
import {
  MAX_IMAGES_PER_MESSAGE,
  parseImageDataUrl,
  toImageDataUrl,
} from "~/lib/cleo/images"
import { CLEO_INSTRUCTIONS } from "~/lib/cleo/instructions"
import {
  executePortalTool,
  portalToolActivitySummary,
} from "~/lib/cleo/portal-tools"
import { selectReasoningEffort } from "~/lib/cleo/reasoning-effort"
import {
  type ActivityItem,
  type ActivityStatus,
  type ClientStreamEvent,
  encodeStreamEvent,
  type MessageImage,
  type WebSearchAction,
} from "~/lib/cleo/stream"

const MODEL = "gpt-5.6-terra"
const MAX_INPUT_LENGTH = 10_000
const MAX_MESSAGES = 50
const MAX_TOTAL_INPUT_LENGTH = 100_000

/** Allow long tool-using turns on Vercel without cutting the NDJSON stream short. */
export const maxDuration = 60

type ConversationMessage = {
  content: string
  images?: MessageImage[]
  role: "assistant" | "user"
}

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status })
}

function parseMessageImages(value: unknown): MessageImage[] | Response {
  if (value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    return errorResponse("Message images must be an array.", 400)
  }

  if (value.length > MAX_IMAGES_PER_MESSAGE) {
    return errorResponse(
      `Attach up to ${MAX_IMAGES_PER_MESSAGE} images per message.`,
      400
    )
  }

  const images: MessageImage[] = []

  for (const item of value) {
    if (typeof item !== "object" || item === null || !("url" in item)) {
      return errorResponse(
        "Each image must include a data URL in the url field.",
        400
      )
    }

    if (typeof item.url !== "string") {
      return errorResponse(
        "Each image must include a data URL in the url field.",
        400
      )
    }

    const parsed = parseImageDataUrl(item.url)

    if (!parsed) {
      return errorResponse(
        "Images must be PNG, JPEG, WEBP, or GIF data URLs within the size limit.",
        400
      )
    }

    const image: MessageImage = {
      url: toImageDataUrl(parsed.mediaType, parsed.base64),
    }

    if ("id" in item && item.id !== undefined) {
      if (typeof item.id !== "string" || !item.id.trim()) {
        return errorResponse(
          "Generated image ids must be non-empty strings.",
          400
        )
      }

      image.id = item.id.trim()
    }

    images.push(image)
  }

  return images
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
    const imagesResult = parseMessageImages(
      "images" in item ? item.images : undefined
    )

    if (imagesResult instanceof Response) {
      return imagesResult
    }

    if (!content && imagesResult.length === 0) {
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

    const message: ConversationMessage = {
      content,
      role: item.role,
    }

    if (imagesResult.length > 0) {
      message.images = imagesResult
    }

    messages.push(message)
  }

  if (messages.at(-1)?.role !== "user") {
    return errorResponse("The last message must come from the user.", 400)
  }

  return messages
}

function toUserContent(
  text: string,
  images: MessageImage[]
): string | ResponseInputMessageContentList {
  if (images.length === 0) {
    return text
  }

  const content: ResponseInputMessageContentList = []

  if (text) {
    content.push({ type: "input_text", text })
  }

  for (const image of images) {
    content.push({
      type: "input_image",
      image_url: image.url,
      detail: "auto",
    })
  }

  return content
}

function toApiInput(messages: ConversationMessage[]): EasyInputMessage[] {
  const input: EasyInputMessage[] = []
  // With store: false, image_generation_call ids cannot be replayed. Carry the
  // latest generated images into the next user turn as input_image instead.
  let pendingGeneratedImages: MessageImage[] = []

  for (const message of messages) {
    if (message.role === "assistant") {
      input.push({
        role: "assistant",
        content: message.content || "Generated an image.",
      })
      pendingGeneratedImages = message.images ?? []
      continue
    }

    const userImages = message.images ?? []
    // Prefer the latest generated images that still fit beside new attachments.
    const room = Math.max(0, MAX_IMAGES_PER_MESSAGE - userImages.length)
    const images = [...pendingGeneratedImages.slice(-room), ...userImages]
    pendingGeneratedImages = []

    input.push({
      role: "user",
      content: toUserContent(message.content, images),
    })
  }

  return input
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

function activityFromImageGeneration(
  item: ResponseOutputItem.ImageGenerationCall,
  status?: ActivityStatus
): ActivityItem {
  return {
    id: item.id,
    kind: "image_generation",
    status: status ?? item.status,
  }
}

function summaryFromReasoning(item: ResponseReasoningItem) {
  const parts = item.summary.map((part) => part.text.trim()).filter(Boolean)

  if (parts.length === 0) {
    return undefined
  }

  return parts.join("\n\n")
}

function activityFromReasoning(
  item: ResponseReasoningItem,
  status?: ActivityStatus
): ActivityItem {
  return {
    id: item.id,
    kind: "reasoning",
    status:
      status ??
      (item.status === "completed" || item.status === "incomplete"
        ? "completed"
        : "in_progress"),
    summary: summaryFromReasoning(item),
  }
}

function activityFromFunctionCall(
  item: ResponseFunctionToolCall,
  status: ActivityStatus
): ActivityItem {
  return {
    id: item.id ?? item.call_id,
    kind: "portal_lookup",
    status,
    summary: portalToolActivitySummary(item.name, item.arguments),
  }
}

function joinReasoningParts(parts: Map<number, string>) {
  return [...parts.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, text]) => text.trim())
    .filter(Boolean)
    .join("\n\n")
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

  const focusGuides = parseFocusGuideInput(
    typeof body === "object" &&
      body !== null &&
      "focusGuides" in body
      ? body.focusGuides
      : undefined
  )

  if (focusGuides === null) {
    return errorResponse(
      "focusGuides must be an array of explore/… or space/… paths (max 3).",
      400
    )
  }

  const groundedGuides = selectGroundedGuides({
    focusGuides,
    text: conversationGroundingText(parsed),
  })
  const grounding = buildGuideGroundingInstructions(groundedGuides)
  const instructions = grounding
    ? `${CLEO_INSTRUCTIONS}\n\n${grounding}`
    : CLEO_INSTRUCTIONS

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured.")
    return errorResponse("The AI service is not configured.", 503)
  }

  const client = new OpenAI({ apiKey })
  const reasoningEffort = selectReasoningEffort(parsed)
  let modelInput: ResponseInput = toApiInput(parsed)

  const createResponseParams = () => ({
    model: MODEL,
    input: modelInput,
    instructions,
    // Keep headroom for reasoning + tools + visible answer. Effort "max"
    // with a tight budget often ends incomplete with zero answer text.
    max_output_tokens: 16_384,
    reasoning: { effort: reasoningEffort, summary: "auto" as const },
    stream: true as const,
    text: { verbosity: "medium" as const },
    tools: CLEO_RESPONSE_TOOLS,
    store: false as const,
    include: [...CLEO_RESPONSE_INCLUDE],
  })

  try {
    // First create stays outside the NDJSON body so upstream 429/400/503 map
    // to HTTP status codes. Later tool-loop rounds stream errors instead.
    const firstResponseStream = await client.responses.create(
      createResponseParams(),
      { signal: request.signal }
    )

    const encoder = new TextEncoder()
    const activities = new Map<string, ActivityItem>()
    const reasoningParts = new Map<string, Map<number, string>>()
    let activeStream: { controller: { abort: () => void } } | null =
      firstResponseStream

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
        summary: activity.summary ?? previous?.summary,
      }

      activities.set(activity.id, next)
      enqueue(controller, { type: "activity", activity: next })
    }

    const emitReasoningSummary = (
      controller: ReadableStreamDefaultController<Uint8Array>,
      itemId: string,
      summaryIndex: number,
      text: string,
      status: ActivityStatus = "in_progress"
    ) => {
      const parts = reasoningParts.get(itemId) ?? new Map<number, string>()
      parts.set(summaryIndex, text)
      reasoningParts.set(itemId, parts)

      emitActivity(controller, {
        id: itemId,
        kind: "reasoning",
        status,
        summary: joinReasoningParts(parts) || undefined,
      })
    }

    const outputStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          let responseStream = firstResponseStream

          for (let round = 0; round < MAX_PORTAL_TOOL_ROUNDS; round += 1) {
            if (round > 0) {
              responseStream = await client.responses.create(
                createResponseParams(),
                { signal: request.signal }
              )
              activeStream = responseStream
            }

            let completedOutput: ResponseOutputItem[] | null = null

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
                } else if (event.item.type === "reasoning") {
                  emitActivity(
                    controller,
                    activityFromReasoning(event.item, "in_progress")
                  )
                } else if (event.item.type === "image_generation_call") {
                  emitActivity(
                    controller,
                    activityFromImageGeneration(event.item, "in_progress")
                  )
                } else if (event.item.type === "code_interpreter_call") {
                  emitActivity(controller, {
                    id: event.item.id,
                    kind: "code_interpreter",
                    status: "in_progress",
                    summary: "Running Python",
                  })
                } else if (event.item.type === "function_call") {
                  emitActivity(
                    controller,
                    activityFromFunctionCall(event.item, "in_progress")
                  )
                }
                continue
              }

              if (event.type === "response.reasoning_summary_text.delta") {
                const parts =
                  reasoningParts.get(event.item_id) ?? new Map<number, string>()
                const previous = parts.get(event.summary_index) ?? ""
                emitReasoningSummary(
                  controller,
                  event.item_id,
                  event.summary_index,
                  previous + event.delta
                )
                continue
              }

              if (event.type === "response.reasoning_summary_text.done") {
                emitReasoningSummary(
                  controller,
                  event.item_id,
                  event.summary_index,
                  event.text
                )
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

              if (event.type === "response.image_generation_call.in_progress") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "image_generation",
                  status: "in_progress",
                })
                continue
              }

              if (event.type === "response.image_generation_call.generating") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "image_generation",
                  status: "generating",
                })
                continue
              }

              if (event.type === "response.image_generation_call.partial_image") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "image_generation",
                  status: "generating",
                })
                enqueue(controller, {
                  type: "image",
                  id: event.item_id,
                  imageUrl: toImageDataUrl("image/png", event.partial_image_b64),
                  partial: true,
                })
                continue
              }

              if (event.type === "response.image_generation_call.completed") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "image_generation",
                  status: "completed",
                })
                continue
              }

              if (event.type === "response.code_interpreter_call.in_progress") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "code_interpreter",
                  status: "in_progress",
                  summary: "Running Python",
                })
                continue
              }

              if (event.type === "response.code_interpreter_call.interpreting") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "code_interpreter",
                  status: "generating",
                  summary: "Interpreting code",
                })
                continue
              }

              if (event.type === "response.code_interpreter_call.completed") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "code_interpreter",
                  status: "completed",
                  summary: "Ran Python",
                })
                continue
              }

              if (event.type === "response.output_item.done") {
                if (event.item.type === "web_search_call") {
                  emitActivity(controller, activityFromWebSearch(event.item))
                } else if (event.item.type === "reasoning") {
                  const summary =
                    summaryFromReasoning(event.item) ||
                    joinReasoningParts(
                      reasoningParts.get(event.item.id) ?? new Map()
                    ) ||
                    undefined

                  emitActivity(controller, {
                    ...activityFromReasoning(event.item, "completed"),
                    summary,
                  })
                } else if (event.item.type === "image_generation_call") {
                  emitActivity(
                    controller,
                    activityFromImageGeneration(event.item, "completed")
                  )

                  if (event.item.result) {
                    enqueue(controller, {
                      type: "image",
                      id: event.item.id,
                      imageUrl: toImageDataUrl("image/png", event.item.result),
                    })
                  }
                } else if (event.item.type === "code_interpreter_call") {
                  emitActivity(controller, {
                    id: event.item.id,
                    kind: "code_interpreter",
                    status: "completed",
                    summary: "Ran Python",
                  })
                } else if (event.item.type === "function_call") {
                  emitActivity(
                    controller,
                    activityFromFunctionCall(event.item, "in_progress")
                  )
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

              if (event.type === "response.completed") {
                completedOutput = event.response.output
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

              if (event.type === "response.incomplete") {
                const reason = event.response.incomplete_details?.reason
                throw new Error(
                  reason === "max_output_tokens"
                    ? "The AI service ran out of room before finishing an answer. Try a shorter question."
                    : "The AI service stopped before finishing an answer. Try again."
                )
              }
            }

            activeStream = null

            const functionCalls = (completedOutput ?? []).filter(
              (item): item is ResponseFunctionToolCall =>
                item.type === "function_call"
            )

            if (functionCalls.length === 0) {
              break
            }

            const priorInput = Array.isArray(modelInput)
              ? modelInput
              : [modelInput]
            const toolOutputs = functionCalls.map((call) => {
              const output = executePortalTool(call.name, call.arguments)
              emitActivity(controller, {
                ...activityFromFunctionCall(call, "completed"),
                summary:
                  portalToolActivitySummary(call.name, call.arguments) ??
                  `Looked up via ${call.name}`,
              })
              return {
                type: "function_call_output" as const,
                call_id: call.call_id,
                output,
              }
            })

            // Response output items are valid next-turn input for the tool loop
            // (including encrypted reasoning when store is false).
            modelInput = [
              ...priorInput,
              ...(completedOutput ?? []),
              ...toolOutputs,
            ] as ResponseInput
          }

          controller.close()
        } catch (streamError) {
          if (request.signal.aborted) {
            // The client is gone. End the stream rather than leaving it open.
            try {
              controller.close()
            } catch {
              // Already closed or errored by the runtime.
            }
          } else {
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
        activeStream?.controller.abort()
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

    if (error instanceof APIError && error.status === 400) {
      return errorResponse(
        error.message || "The request could not be completed.",
        400
      )
    }

    return errorResponse(
      "The AI service could not complete the request. Try again.",
      502
    )
  }
}
