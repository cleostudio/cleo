import OpenAI, { APIError } from "openai"
import type {
  EasyInputMessage,
  ResponseCodeInterpreterToolCall,
  ResponseCreateParamsStreaming,
  ResponseFunctionToolCall,
  ResponseFunctionWebSearch,
  ResponseInput,
  ResponseInputItem,
  ResponseInputMessageContentList,
  ResponseOutputItem,
  ResponseReasoningItem,
  ResponseStreamEvent,
  Tool,
} from "openai/resources/responses/responses"

/** Create params plus API fields the installed SDK typings still omit. */
type CleoResponseCreateParams = ResponseCreateParamsStreaming & {
  max_tool_calls?: number | null
}

import {
  CONTINUE_RESUME_GUIDANCE,
  isContinuePrompt,
} from "~/lib/cleo/continue"
import { CLEO_INSTRUCTIONS } from "~/lib/cleo/instructions"
import {
  MAX_IMAGES_PER_MESSAGE,
  parseImageDataUrl,
  toImageDataUrl,
} from "~/lib/cleo/images"
import {
  applyModeReasoningEffort,
  buildModeInstructions,
  buildModeWebSearchTool,
  modeAllowsCodeInterpreter,
  modeMaxToolCalls,
  modeParallelToolCalls,
  modePromptCacheKey,
  modeReasoningContext,
  modeTextVerbosity,
  parseCleoMode,
  type CleoMode,
} from "~/lib/cleo/mode"
import {
  executePortalTool,
  isPortalToolName,
  PORTAL_FUNCTION_TOOLS,
  portalToolActivityLabel,
} from "~/lib/cleo/portal-tools"
import {
  sanitizeReasoningItems,
  type EncryptedReasoningItem,
} from "~/lib/cleo/reasoning-items"
import { selectReasoningEffort } from "~/lib/cleo/reasoning-effort"
import {
  type ActivityItem,
  type ActivityStatus,
  type ClientStreamEvent,
  encodeStreamEvent,
  incompleteReasonFromApi,
  incompleteStatusMessage,
  type IncompleteReason,
  type MessageImage,
  type WebSearchAction,
} from "~/lib/cleo/stream"
import {
  buildTopicPhotoInstructions,
  conversationTopicText,
  matchTopicPhotosInText,
} from "~/lib/cleo/topic-photos"

const MODEL = "gpt-5.6-terra"
const MAX_INPUT_LENGTH = 10_000
const MAX_MESSAGES = 50
const MAX_TOTAL_INPUT_LENGTH = 100_000
/** Aggregate decoded image payload across the conversation (not per message). */
const MAX_TOTAL_IMAGE_BYTES = 12 * 1024 * 1024
/** Reject obviously oversized request bodies before JSON parse when advertised. */
const MAX_REQUEST_BODY_BYTES = 16 * 1024 * 1024
const MAX_TOOL_ROUNDS = 4

const CODE_INTERPRETER_TOOL: Tool = {
  type: "code_interpreter",
  container: { type: "auto" },
}

function buildCleoTools(mode: CleoMode): Tool[] {
  const tools: Tool[] = [
    buildModeWebSearchTool(mode),
    {
      type: "image_generation",
      partial_images: 2,
      quality: "auto",
      size: "auto",
      output_format: "png",
    },
    ...PORTAL_FUNCTION_TOOLS,
  ]

  if (modeAllowsCodeInterpreter(mode)) {
    tools.push(CODE_INTERPRETER_TOOL)
  }

  return tools
}

/** Allow long tool-using / research turns on Vercel without cutting the stream. */
export const maxDuration = 90

type ConversationMessage = {
  content: string
  images?: MessageImage[]
  reasoningItems?: EncryptedReasoningItem[]
  role: "assistant" | "user"
}

/** Running Responses input across tool rounds (output items are round-tripped). */
type AgentInput = Array<EasyInputMessage | ResponseInputItem | ResponseOutputItem>

type ResponseStream = AsyncIterable<ResponseStreamEvent> & {
  controller: { abort: () => void }
}

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status })
}

type ImageParseBudget = {
  max: number
  used: number
}

function parseMessageImages(
  value: unknown,
  budget?: ImageParseBudget
): MessageImage[] | Response {
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

    const estimatedBytes = Math.floor((parsed.base64.length * 3) / 4)
    if (budget) {
      budget.used += estimatedBytes
      if (budget.used > budget.max) {
        return errorResponse(
          `Conversations can include at most ${Math.floor(
            budget.max / (1024 * 1024)
          )}MB of images.`,
          400
        )
      }
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

function parseRequestBody(
  body: unknown
): { messages: ConversationMessage[]; mode: CleoMode } | Response {
  if (typeof body !== "object" || body === null) {
    return errorResponse("The request body must be a JSON object.", 400)
  }

  if (!("messages" in body) || !Array.isArray(body.messages)) {
    return errorResponse("A messages array is required.", 400)
  }

  const mode =
    "mode" in body && body.mode !== undefined
      ? parseCleoMode(body.mode)
      : "auto"

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
  const imageBudget: ImageParseBudget = {
    used: 0,
    max: MAX_TOTAL_IMAGE_BYTES,
  }

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
      "images" in item ? item.images : undefined,
      imageBudget
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

  return { messages, mode }
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
  output: ResponseOutputItem[]
): EncryptedReasoningItem[] {
  return (
    sanitizeReasoningItems(
      output
        .filter(
          (item): item is ResponseReasoningItem => item.type === "reasoning"
        )
        .map((item) => ({
          type: "reasoning" as const,
          id: item.id,
          encrypted_content: item.encrypted_content ?? "",
          ...(item.summary.length > 0 ? { summary: item.summary } : {}),
        }))
    ) ?? []
  )
}

function toWebSearchAction(
  action: ResponseFunctionWebSearch["action"] | undefined
): WebSearchAction | undefined {
  if (!action) {
    return undefined
  }

  if (action.type === "search") {
    const sources = action.sources
      ?.filter(
        (source): source is { type: "url"; url: string } =>
          source?.type === "url" && typeof source.url === "string" && Boolean(source.url)
      )
      .slice(0, 8)
      .map((source) => ({ type: "url" as const, url: source.url }))

    return {
      type: "search",
      queries: action.queries,
      query: action.query,
      ...(sources && sources.length > 0 ? { sources } : {}),
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

function summaryFromCodeInterpreter(
  item: ResponseCodeInterpreterToolCall
): string | undefined {
  const logs = item.outputs
    ?.filter(
      (output): output is ResponseCodeInterpreterToolCall.Logs =>
        output.type === "logs" && typeof output.logs === "string"
    )
    .map((output) => output.logs.trim())
    .filter(Boolean)

  if (!logs || logs.length === 0) {
    return undefined
  }

  return logs.join("\n\n").slice(0, 1_200)
}

function activityFromCodeInterpreter(
  item: ResponseCodeInterpreterToolCall,
  status?: ActivityStatus
): ActivityItem {
  const summary = summaryFromCodeInterpreter(item)
  return {
    id: item.id,
    kind: "code_interpreter",
    status:
      status ??
      (item.status === "failed"
        ? "failed"
        : item.status === "completed"
          ? "completed"
          : item.status === "interpreting"
            ? "interpreting"
            : "in_progress"),
    ...(summary ? { summary } : {}),
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
  const contentLengthHeader = request.headers.get("content-length")
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader)
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_REQUEST_BODY_BYTES
    ) {
      return errorResponse(
        `Request bodies must be ${Math.floor(
          MAX_REQUEST_BODY_BYTES / (1024 * 1024)
        )}MB or smaller.`,
        413
      )
    }
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse("The request body must be valid JSON.", 400)
  }

  const parsed = parseRequestBody(body)

  if (parsed instanceof Response) {
    return parsed
  }

  const { messages: conversation, mode } = parsed

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured.")
    return errorResponse("The AI service is not configured.", 503)
  }

  const client = new OpenAI({ apiKey })
  let input: AgentInput = toApiInput(conversation)
  const latestUserText = [...conversation]
    .reverse()
    .find((message) => message.role === "user")
    ?.content ?? ""
  const reasoningEffort = applyModeReasoningEffort(
    mode,
    selectReasoningEffort(latestUserText)
  )
  const topicPhotos = matchTopicPhotosInText(
    conversationTopicText(conversation)
  )
  const topicPhotoInstructions = buildTopicPhotoInstructions(topicPhotos)
  // Keep per-turn topic photo grounding out of `instructions` so the static
  // prefix (voice + mode + tools) can hit OpenAI prompt cache reliably.
  if (topicPhotoInstructions) {
    input = [
      ...input,
      {
        role: "developer",
        content: topicPhotoInstructions,
      },
    ]
  }
  const modeInstructions = buildModeInstructions(mode)
  const instructions = [
    CLEO_INSTRUCTIONS,
    modeInstructions,
    ...(isContinuePrompt(latestUserText) ? [CONTINUE_RESUME_GUIDANCE] : []),
  ].join("\n\n")
  const tools = buildCleoTools(mode)
  const verbosity = modeTextVerbosity(mode)
  const promptCacheKey = modePromptCacheKey(mode)
  const parallelToolCalls = modeParallelToolCalls(mode)
  const reasoningContext = modeReasoningContext(mode)
  const maxToolCalls = modeMaxToolCalls(mode)
  // Always request encrypted reasoning for store:false multi-turn replay.
  // Auto/Research also ask for web_search sources and python logs for the panel.
  const include: Array<
    | "reasoning.encrypted_content"
    | "web_search_call.action.sources"
    | "code_interpreter_call.outputs"
  > = ["reasoning.encrypted_content"]
  if (mode !== "quick") {
    include.push(
      "web_search_call.action.sources",
      "code_interpreter_call.outputs"
    )
  }

  const createStream = () => {
    const params: CleoResponseCreateParams = {
      model: MODEL,
      // Output items are round-tripped per the function-calling guide; the
      // SDK input type is slightly narrower than runtime-accepted output.
      input: input as ResponseInput,
      instructions,
      // Keep headroom for reasoning + tools + visible answer.
      max_output_tokens: 16_384,
      // Cap hosted tool churn; portal function rounds still use MAX_TOOL_ROUNDS.
      max_tool_calls: maxToolCalls,
      // Long restored threads with encrypted reasoning can overflow; drop
      // oldest items rather than failing the whole turn.
      truncation: "auto",
      reasoning: {
        effort: reasoningEffort,
        summary: "auto",
        context: reasoningContext,
      },
      stream: true,
      text: { verbosity },
      tools,
      parallel_tool_calls: parallelToolCalls,
      prompt_cache_key: promptCacheKey,
      store: false,
      include,
    }

    return client.responses.create(params, {
      signal: request.signal,
    }) as Promise<ResponseStream>
  }

  try {
    // Start the first upstream request before opening the NDJSON body so
    // auth/validation failures still map to HTTP error statuses.
    let pendingStream: ResponseStream | null = await createStream()

    const encoder = new TextEncoder()
    const activities = new Map<string, ActivityItem>()
    const reasoningParts = new Map<string, Map<number, string>>()
    /** Accumulate streamed function-call arguments for live activity labels. */
    const portalToolCalls = new Map<
      string,
      { name: string; arguments: string }
    >()
    let activeUpstream: { controller: { abort: () => void } } | null = null

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
        let streamedText = ""

        try {
          let toolExecutions = 0
          let incompleteNotice: IncompleteReason | null = null

          while (true) {
            const responseStream = pendingStream ?? (await createStream())
            pendingStream = null
            activeUpstream = responseStream

            let outputItems: ResponseOutputItem[] = []
            let sawCompleted = false
            let incompleteError: Error | null = null

            for await (const event of responseStream) {
              if (event.type === "response.output_text.delta") {
                streamedText += event.delta
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
                  })
                } else if (event.item.type === "function_call") {
                  const name = event.item.name
                  const args = event.item.arguments ?? ""
                  const itemId = event.item.id ?? event.item.call_id
                  if (isPortalToolName(name)) {
                    portalToolCalls.set(itemId, { name, arguments: args })
                    emitActivity(controller, {
                      id: itemId,
                      kind: "portal_tool",
                      status: "in_progress",
                      action: {
                        type: "portal_tool",
                        name,
                        label: portalToolActivityLabel(
                          name,
                          args,
                          "in_progress"
                        ),
                      },
                    })
                  }
                }
                continue
              }

              if (event.type === "response.function_call_arguments.delta") {
                const tracked = portalToolCalls.get(event.item_id)
                if (tracked) {
                  tracked.arguments += event.delta
                  emitActivity(controller, {
                    id: event.item_id,
                    kind: "portal_tool",
                    status: "in_progress",
                    action: {
                      type: "portal_tool",
                      name: tracked.name,
                      label: portalToolActivityLabel(
                        tracked.name,
                        tracked.arguments,
                        "in_progress"
                      ),
                    },
                  })
                }
                continue
              }

              if (event.type === "response.function_call_arguments.done") {
                const tracked = portalToolCalls.get(event.item_id)
                if (tracked) {
                  tracked.arguments = event.arguments
                  emitActivity(controller, {
                    id: event.item_id,
                    kind: "portal_tool",
                    status: "in_progress",
                    action: {
                      type: "portal_tool",
                      name: tracked.name,
                      label: portalToolActivityLabel(
                        tracked.name,
                        tracked.arguments,
                        "in_progress"
                      ),
                    },
                  })
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

              if (event.type === "response.code_interpreter_call.in_progress") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "code_interpreter",
                  status: "in_progress",
                })
                continue
              }

              if (event.type === "response.code_interpreter_call.interpreting") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "code_interpreter",
                  status: "interpreting",
                })
                continue
              }

              if (event.type === "response.code_interpreter_call.completed") {
                emitActivity(controller, {
                  id: event.item_id,
                  kind: "code_interpreter",
                  status: "completed",
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
                  emitActivity(
                    controller,
                    activityFromCodeInterpreter(event.item)
                  )
                } else if (event.item.type === "function_call") {
                  const name = event.item.name
                  const args = event.item.arguments ?? ""
                  if (isPortalToolName(name)) {
                    emitActivity(controller, {
                      id: event.item.id ?? event.item.call_id,
                      kind: "portal_tool",
                      status: "completed",
                      action: {
                        type: "portal_tool",
                        name,
                        label: portalToolActivityLabel(name, args, "completed"),
                      },
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

              if (event.type === "response.completed") {
                outputItems = event.response.output ?? []
                sawCompleted = true
                incompleteNotice = null
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
                outputItems = event.response.output ?? outputItems
                const reason = event.response.incomplete_details?.reason
                // Keep a partial answer when the model already streamed text.
                if (streamedText.trim()) {
                  sawCompleted = true
                  incompleteError = null
                  incompleteNotice = incompleteReasonFromApi(reason)
                } else {
                  incompleteError = new Error(
                    reason === "max_output_tokens"
                      ? "The AI service ran out of room before finishing an answer. Try a shorter question."
                      : "The AI service stopped before finishing an answer. Try again."
                  )
                }
                continue
              }
            }

            activeUpstream = null

            if (incompleteError) {
              throw incompleteError
            }

            const functionCalls = outputItems.filter(
              (item): item is ResponseFunctionToolCall =>
                item.type === "function_call"
            )

            if (functionCalls.length === 0) {
              if (!sawCompleted && !streamedText.trim()) {
                throw new Error(
                  "The AI service stopped before finishing an answer. Try again."
                )
              }
              const reasoningItems =
                extractEncryptedReasoningItems(outputItems)
              if (reasoningItems.length > 0) {
                enqueue(controller, {
                  type: "reasoning_items",
                  items: reasoningItems,
                })
              }
              if (incompleteNotice) {
                enqueue(controller, {
                  type: "status",
                  status: "incomplete",
                  reason: incompleteNotice,
                  message: incompleteStatusMessage(incompleteNotice),
                })
              }
              break
            }

            input = [...input, ...outputItems]

            const hitToolCap = toolExecutions >= MAX_TOOL_ROUNDS

            for (const call of functionCalls) {
              const output = hitToolCap
                ? JSON.stringify({
                    error:
                      "Portal tool round limit reached. Answer with the evidence you already have.",
                  })
                : executePortalTool(call.name, call.arguments)

              input = [
                ...input,
                {
                  type: "function_call_output",
                  call_id: call.call_id,
                  output,
                },
              ]
            }

            toolExecutions += 1

            if (hitToolCap) {
              // One final model turn after soft tool errors, then stop.
              const finalStream = await createStream()
              activeUpstream = finalStream
              let finalOutput: ResponseOutputItem[] = []

              for await (const event of finalStream) {
                if (event.type === "response.output_text.delta") {
                  streamedText += event.delta
                  enqueue(controller, { type: "text", delta: event.delta })
                } else if (event.type === "response.completed") {
                  finalOutput = event.response.output ?? []
                } else if (event.type === "error") {
                  throw new Error(event.message)
                } else if (event.type === "response.failed") {
                  throw new Error(
                    event.response.error?.message ??
                      "The AI service could not complete the request."
                  )
                }
              }

              activeUpstream = null
              const reasoningItems =
                extractEncryptedReasoningItems(finalOutput)
              if (reasoningItems.length > 0) {
                enqueue(controller, {
                  type: "reasoning_items",
                  items: reasoningItems,
                })
              }
              break
            }
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
        activeUpstream?.controller.abort()
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
