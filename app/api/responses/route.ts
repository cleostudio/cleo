import OpenAI, { APIError } from "openai"
import type {
  EasyInputMessage,
  ResponseCreateParamsStreaming,
  ResponseFunctionWebSearch,
  ResponseInput,
  ResponseInputMessageContentList,
  ResponseOutputItem,
  ResponseReasoningItem,
} from "openai/resources/responses/responses"

/** Create params plus API fields the installed SDK typings still omit. */
type CleoResponseCreateParams = ResponseCreateParamsStreaming & {
  max_tool_calls?: number | null
}

import { getSession } from "~/lib/auth"
import { promptCacheKeyForConversation } from "~/lib/cleo/conversation-helpers"
import { CLEO_INSTRUCTIONS } from "~/lib/cleo/instructions"
import {
  buildUserLocationInstructions,
  parseUserLocation,
} from "~/lib/cleo/location"
import {
  GENERATED_IMAGE_MEDIA_TYPE,
  GENERATED_IMAGE_OUTPUT_COMPRESSION,
  GENERATED_IMAGE_OUTPUT_FORMAT,
  GENERATED_IMAGE_PARTIAL_IMAGES,
  MAX_IMAGES_PER_MESSAGE,
  parseImageDataUrl,
  toImageDataUrl,
} from "~/lib/cleo/images"
import { selectReasoningEffort } from "~/lib/cleo/reasoning-effort"
import {
  sanitizeReasoningItems,
  type EncryptedReasoningItem,
} from "~/lib/cleo/reasoning-items"
import {
  buildTopicPhotoInstructions,
  conversationTopicText,
  matchTopicPhotosInText,
} from "~/lib/cleo/topic-photos"
import { buildUserProfileInstructions } from "~/lib/cleo/user-profile"
import {
  type ActivityItem,
  type ActivityStatus,
  type ClientStreamEvent,
  encodeStreamEvent,
  incompleteReasonFromApi,
  incompleteStatusMessage,
  type MessageImage,
  type WebSearchAction,
  type WebSearchSource,
} from "~/lib/cleo/stream"

const MODEL = "gpt-5.6-terra"
const MAX_INPUT_LENGTH = 10_000
const MAX_MESSAGES = 50
const MAX_TOTAL_INPUT_LENGTH = 100_000
/** Cap hosted tool churn (web_search + image_generation) per turn. */
const MAX_TOOL_CALLS = 8

/** Allow long tool-using turns on Vercel without cutting the NDJSON stream short. */
export const maxDuration = 90

let openAIClient: OpenAI | null = null
let openAIClientKey: string | null = null

function getOpenAIClient(apiKey: string) {
  if (!openAIClient || openAIClientKey !== apiKey) {
    openAIClient = new OpenAI({ apiKey })
    openAIClientKey = apiKey
  }

  return openAIClient
}

type ConversationMessage = {
  content: string
  images?: MessageImage[]
  reasoningItems?: EncryptedReasoningItem[]
  role: "assistant" | "user"
}

type AgentInput = Array<EasyInputMessage | ResponseReasoningItem>

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

    if (item.role === "assistant") {
      const reasoningItems = sanitizeReasoningItems(
        "reasoningItems" in item ? item.reasoningItems : undefined
      )
      if (reasoningItems) {
        message.reasoningItems = reasoningItems
      }
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

function toApiInput(messages: ConversationMessage[]): AgentInput {
  const input: AgentInput = []
  // With store: false, image_generation_call ids cannot be replayed. Carry the
  // latest generated images into the next user turn as input_image instead.
  let pendingGeneratedImages: MessageImage[] = []

  for (const message of messages) {
    if (message.role === "assistant") {
      // Replay encrypted reasoning before the assistant message so
      // reasoning.context all_turns can render prior chain-of-thought.
      for (const item of message.reasoningItems ?? []) {
        input.push({
          type: "reasoning",
          id: item.id,
          summary: item.summary ?? [],
          encrypted_content: item.encrypted_content,
        } satisfies ResponseReasoningItem)
      }
      input.push({
        role: "assistant",
        content: message.content || "Generated an image.",
      } satisfies EasyInputMessage)
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
    } satisfies EasyInputMessage)
  }

  return input
}

/** Collect opaque encrypted reasoning items for the client to persist. */
function extractEncryptedReasoningItems(
  items: EncryptedReasoningItem[]
): EncryptedReasoningItem[] {
  return sanitizeReasoningItems(items) ?? []
}

function toWebSearchSources(
  sources: ResponseFunctionWebSearch.Search["sources"] | undefined
): WebSearchSource[] | undefined {
  if (!sources || sources.length === 0) {
    return undefined
  }

  const kept: WebSearchSource[] = []

  for (const source of sources) {
    if (source.type === "url" && typeof source.url === "string" && source.url) {
      kept.push({ type: "url", url: source.url })
    }
  }

  return kept.length > 0 ? kept : undefined
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
      sources: toWebSearchSources(action.sources),
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

  const locationValue =
    typeof body === "object" && body !== null && "location" in body
      ? body.location
      : undefined
  const location =
    locationValue === undefined ? undefined : parseUserLocation(locationValue)

  if (locationValue !== undefined && !location) {
    return errorResponse(
      "Location must include finite coordinates, a reported accuracy, and a valid IANA time zone.",
      400
    )
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured.")
    return errorResponse("The AI service is not configured.", 503)
  }

  const client = getOpenAIClient(apiKey)
  const input = toApiInput(parsed)
  const topicPhotos = matchTopicPhotosInText(conversationTopicText(parsed))
  const topicPhotoInstructions = buildTopicPhotoInstructions(topicPhotos)
  const locationInstructions = location
    ? buildUserLocationInstructions(location)
    : undefined
  // Account name comes from the Better Auth session cookie — never trust a
  // client-supplied name field on the request body. Fail open if session
  // lookup errors so a Neon blip cannot take Cleo down.
  let profileInstructions: string | undefined
  try {
    const session = await getSession(request.headers)
    if (session?.user?.name) {
      profileInstructions = buildUserProfileInstructions(session.user.name)
    }
  } catch (error) {
    console.error("Failed to load auth session for Cleo personalization.", error)
  }
  const instructions = [
    CLEO_INSTRUCTIONS,
    topicPhotoInstructions,
    profileInstructions,
    locationInstructions,
  ]
    .filter(Boolean)
    .join("\n\n")
  const latestUserText =
    [...parsed].reverse().find((message) => message.role === "user")?.content ??
    ""
  const reasoningEffort = selectReasoningEffort(latestUserText)
  const promptCacheKey = promptCacheKeyForConversation(parsed)

  try {
    const createParams: CleoResponseCreateParams = {
      model: MODEL,
      // Output items (encrypted reasoning) are round-tripped; the SDK input
      // type is slightly narrower than runtime-accepted output.
      input: input as ResponseInput,
      instructions,
      // Keep headroom for reasoning + tools + visible answer.
      max_output_tokens: 16_384,
      max_tool_calls: MAX_TOOL_CALLS,
      // Long threads with encrypted reasoning can overflow; drop oldest items.
      truncation: "auto",
      reasoning: {
        effort: reasoningEffort,
        summary: "auto",
        context: "all_turns",
      },
      stream: true,
      text: { verbosity: "medium" },
      tools: [
        { type: "web_search" },
        {
          type: "image_generation",
          partial_images: GENERATED_IMAGE_PARTIAL_IMAGES,
          quality: "auto",
          size: "auto",
          output_format: GENERATED_IMAGE_OUTPUT_FORMAT,
          output_compression: GENERATED_IMAGE_OUTPUT_COMPRESSION,
        },
      ],
      prompt_cache_key: promptCacheKey,
      store: false,
      include: [
        "reasoning.encrypted_content",
        "web_search_call.action.sources",
      ],
    }

    const responseStream = await client.responses.create(createParams, {
      signal: request.signal,
    })
    const encoder = new TextEncoder()
    const activities = new Map<string, ActivityItem>()
    const reasoningParts = new Map<string, Map<number, string>>()
    const collectedReasoningItems: EncryptedReasoningItem[] = []
    let emittedText = false
    let emittedImage = false

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

    const emitCollectedReasoningItems = (
      controller: ReadableStreamDefaultController<Uint8Array>
    ) => {
      const items = extractEncryptedReasoningItems(collectedReasoningItems)
      if (items.length === 0) {
        return
      }
      enqueue(controller, { type: "reasoning_items", items })
    }

    const outputStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          let incompleteNotice: ReturnType<typeof incompleteReasonFromApi> | null =
            null

          for await (const event of responseStream) {
            if (event.type === "response.output_text.delta") {
              emittedText = true
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
              emittedImage = true
              emitActivity(controller, {
                id: event.item_id,
                kind: "image_generation",
                status: "generating",
              })
              enqueue(controller, {
                type: "image",
                id: event.item_id,
                imageUrl: toImageDataUrl(
                  GENERATED_IMAGE_MEDIA_TYPE,
                  event.partial_image_b64
                ),
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

                if (event.item.encrypted_content) {
                  collectedReasoningItems.push({
                    type: "reasoning",
                    id: event.item.id,
                    encrypted_content: event.item.encrypted_content,
                    ...(event.item.summary.length > 0
                      ? { summary: event.item.summary }
                      : {}),
                  })
                }
              } else if (event.item.type === "image_generation_call") {
                emitActivity(
                  controller,
                  activityFromImageGeneration(event.item, "completed")
                )

                if (event.item.result) {
                  emittedImage = true
                  enqueue(controller, {
                    type: "image",
                    id: event.item.id,
                    imageUrl: toImageDataUrl(
                      GENERATED_IMAGE_MEDIA_TYPE,
                      event.item.result
                    ),
                  })
                }
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

            if (event.type === "response.incomplete") {
              const reason = event.response.incomplete_details?.reason
              const mapped = incompleteReasonFromApi(reason)

              // Soft-incomplete when usable content already streamed; hard
              // error only when the turn produced nothing visible.
              if (emittedText || emittedImage) {
                incompleteNotice = mapped
              } else {
                throw new Error(
                  reason === "max_output_tokens"
                    ? "The AI service ran out of room before finishing an answer. Try a shorter question."
                    : "The AI service stopped before finishing an answer. Try again."
                )
              }
            }
          }

          emitCollectedReasoningItems(controller)

          if (incompleteNotice) {
            enqueue(controller, {
              type: "status",
              status: "incomplete",
              reason: incompleteNotice,
              message: incompleteStatusMessage(incompleteNotice),
            })
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
              emitCollectedReasoningItems(controller)
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
