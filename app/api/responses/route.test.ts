import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const openai = vi.hoisted(() => {
  class APIError extends Error {
    status: number

    constructor(status: number, message: string) {
      super(message)
      this.status = status
    }
  }

  return { APIError, create: vi.fn() }
})

vi.mock("openai", () => {
  class OpenAI {
    responses = { create: openai.create }
  }

  return { APIError: openai.APIError, default: OpenAI }
})

import { POST } from "./route"

function ask(body: unknown, init: RequestInit = {}) {
  return new Request("https://cleo.example/api/responses", {
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
    ...init,
  })
}

const question = { messages: [{ content: "Tell me about Japan", role: "user" }] }

/** A data URL whose base64 payload decodes to roughly `bytes`. */
function imageDataUrl(bytes: number) {
  return `data:image/png;base64,${"A".repeat(Math.ceil(bytes / 3) * 4)}`
}

function responseStream(events: unknown[]) {
  return {
    controller: { abort: vi.fn() },
    async *[Symbol.asyncIterator]() {
      for (const event of events) {
        yield event
      }
    },
  }
}

async function ndjson(response: Response) {
  const body = await response.text()

  return body
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

beforeEach(() => {
  openai.create.mockReset()
  vi.stubEnv("OPENAI_API_KEY", "test-key")
  vi.spyOn(console, "error").mockImplementation(() => undefined)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe("POST /api/responses: request validation", () => {
  it.each([
    ["a body that is not JSON", "not json", "The request body must be valid JSON."],
    ["a body that is not an object", "[]", "A messages array is required."],
    ["a missing messages array", {}, "A messages array is required."],
    ["an empty conversation", { messages: [] }, "Enter a question before sending."],
  ])("rejects %s", async (_label, body, error) => {
    const response = await POST(ask(body))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error })
    expect(openai.create).not.toHaveBeenCalled()
  })

  it("rejects a conversation longer than the message cap", async () => {
    const response = await POST(
      ask({
        messages: Array.from({ length: 51 }, () => ({
          content: "hi",
          role: "user",
        })),
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Conversations must be 50 messages or fewer.",
    })
  })

  it("rejects an unknown role", async () => {
    const response = await POST(
      ask({ messages: [{ content: "hi", role: "system" }] })
    )

    expect(response.status).toBe(400)
  })

  it("rejects a message past the single-message character cap", async () => {
    const response = await POST(
      ask({ messages: [{ content: "x".repeat(10_001), role: "user" }] })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Messages must be 10,000 characters or fewer.",
    })
  })

  it("rejects a conversation past the total character cap", async () => {
    const response = await POST(
      ask({
        messages: Array.from({ length: 12 }, () => ({
          content: "x".repeat(10_000),
          role: "user",
        })),
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Conversations must be 100,000 characters or fewer.",
    })
  })

  it("requires the conversation to end with a user turn", async () => {
    const response = await POST(
      ask({
        messages: [
          { content: "hi", role: "user" },
          { content: "hello", role: "assistant" },
        ],
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "The last message must come from the user.",
    })
  })

  it("rejects an empty message", async () => {
    const response = await POST(ask({ messages: [{ content: "   ", role: "user" }] }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Messages cannot be empty.",
    })
  })
})

describe("POST /api/responses: opt-in location context", () => {
  it.each([
    [
      "coordinates outside the valid range",
      {
        accuracy: 12,
        latitude: 91,
        longitude: -122.4194,
        timeZone: "America/Los_Angeles",
      },
    ],
    [
      "an invalid time zone",
      {
        accuracy: 12,
        latitude: 37.7749,
        longitude: -122.4194,
        timeZone: "not/a-time-zone",
      },
    ],
  ])("rejects %s", async (_label, location) => {
    const response = await POST(ask({ ...question, location }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error:
        "Location must include finite coordinates, a reported accuracy, and a valid IANA time zone.",
    })
    expect(openai.create).not.toHaveBeenCalled()
  })

  it("adds explicitly shared location only to private request instructions", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "A local answer.", type: "response.output_text.delta" }])
    )

    await POST(
      ask({
        ...question,
        location: {
          accuracy: 12.4,
          latitude: 37.7749,
          longitude: -122.4194,
          timeZone: "America/Los_Angeles",
        },
      })
    )

    const request = openai.create.mock.calls[0]?.[0]

    expect(request.instructions).toContain("<cleo_user_location>")
    expect(request.instructions).toContain("Latitude: 37.77490")
    expect(request.instructions).toContain("Longitude: -122.41940")
    expect(request.instructions).toContain("IANA time zone: America/Los_Angeles")
    expect(request.instructions).toContain("never volunteer it")
    expect(request.input[0].content).toBe("Tell me about Japan")
  })
})

describe("POST /api/responses: image attachments", () => {
  it.each([
    ["a non-image data URL", "data:text/html;base64,PHNjcmlwdD4="],
    ["a remote URL", "https://attacker.example/pixel.png"],
    ["an SVG payload", "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="],
  ])("rejects %s", async (_label, url) => {
    const response = await POST(
      ask({ messages: [{ content: "look", images: [{ url }], role: "user" }] })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error:
        "Images must be PNG, JPEG, WEBP, or GIF data URLs within the size limit.",
    })
  })

  it("rejects more than four images on one message", async () => {
    const response = await POST(
      ask({
        messages: [
          {
            content: "look",
            images: Array.from({ length: 5 }, () => ({
              url: imageDataUrl(64),
            })),
            role: "user",
          },
        ],
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Attach up to 4 images per message.",
    })
  })

  it("rejects a single image over the per-image ceiling", async () => {
    const response = await POST(
      ask({
        messages: [
          {
            content: "look",
            images: [{ url: imageDataUrl(5 * 1024 * 1024) }],
            role: "user",
          },
        ],
      })
    )

    expect(response.status).toBe(400)
  })

  it("forwards an accepted attachment as vision input", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "A photo.", type: "response.output_text.delta" }])
    )

    const response = await POST(
      ask({
        messages: [
          {
            content: "what is this",
            images: [{ url: imageDataUrl(1024) }],
            role: "user",
          },
        ],
      })
    )

    expect(response.status).toBe(200)
    expect(openai.create.mock.calls[0]?.[0].input[0].content).toEqual([
      { text: "what is this", type: "input_text" },
      expect.objectContaining({ type: "input_image" }),
    ])
  })
})

describe("POST /api/responses: streaming and upstream errors", () => {
  it("streams NDJSON text and activity events", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        {
          item: { id: "ws_1", status: "in_progress", type: "web_search_call" },
          type: "response.output_item.added",
        },
        { item_id: "ws_1", type: "response.web_search_call.completed" },
        { delta: "Japan ", type: "response.output_text.delta" },
        { delta: "is an island country.", type: "response.output_text.delta" },
      ])
    )

    const response = await POST(ask(question))

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe(
      "application/x-ndjson; charset=utf-8"
    )
    expect(response.headers.get("x-content-type-options")).toBe("nosniff")

    const events = await ndjson(response)

    expect(events.filter((event) => event.type === "text")).toEqual([
      { delta: "Japan ", type: "text" },
      { delta: "is an island country.", type: "text" },
    ])
    expect(events.at(-3)).toEqual({
      activity: { id: "ws_1", kind: "web_search", status: "completed" },
      type: "activity",
    })
  })

  it("closes the stream when the client disconnects mid-turn", async () => {
    const aborter = new AbortController()

    openai.create.mockResolvedValueOnce({
      controller: { abort: vi.fn() },
      async *[Symbol.asyncIterator]() {
        yield { delta: "partial", type: "response.output_text.delta" }
        aborter.abort()
        throw new Error("upstream closed with the client")
      },
    })

    const response = await POST(ask(question, { signal: aborter.signal }))

    // Without an explicit close on the abort path this read never settles.
    await expect(ndjson(response)).resolves.toEqual([
      { delta: "partial", type: "text" },
    ])
  })

  it("reports an upstream stream failure as a terminal error event", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "partial", type: "response.output_text.delta" },
        { message: "upstream exploded", type: "error" },
      ])
    )

    const events = await ndjson(await POST(ask(question)))

    expect(events.at(-1)).toEqual({
      error: "upstream exploded",
      type: "error",
    })
  })

  it("explains an answer cut short by the output token ceiling", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        {
          response: { incomplete_details: { reason: "max_output_tokens" } },
          type: "response.incomplete",
        },
      ])
    )

    const events = await ndjson(await POST(ask(question)))

    expect(events.at(-1)?.error).toContain("ran out of room")
  })

  it.each([
    [429, "The AI service is receiving too many requests. Try again shortly."],
    [400, "the model refused that input"],
  ])("maps an upstream %i to the same status", async (status, error) => {
    openai.create.mockRejectedValueOnce(
      new openai.APIError(status, "the model refused that input")
    )

    const response = await POST(ask(question))

    expect(response.status).toBe(status)
    await expect(response.json()).resolves.toEqual({ error })
  })

  it("maps an unexpected upstream failure to 502", async () => {
    openai.create.mockRejectedValueOnce(new Error("socket hang up"))

    const response = await POST(ask(question))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: "The AI service could not complete the request. Try again.",
    })
  })

  it("reports a missing API key as unavailable without calling OpenAI", async () => {
    vi.stubEnv("OPENAI_API_KEY", "")

    const response = await POST(ask(question))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: "The AI service is not configured.",
    })
    expect(openai.create).not.toHaveBeenCalled()
  })

  it("keeps the model, tools, and privacy settings the surface depends on", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "ok", type: "response.output_text.delta" }])
    )

    await POST(ask(question))

    expect(openai.create.mock.calls[0]?.[0]).toMatchObject({
      model: "gpt-5.6-terra",
      store: false,
      stream: true,
      max_tool_calls: 8,
      truncation: "auto",
      reasoning: {
        effort: "medium",
        summary: "auto",
        context: "all_turns",
      },
      include: [
        "reasoning.encrypted_content",
        "web_search_call.action.sources",
      ],
    })
    expect(openai.create.mock.calls[0]?.[0].prompt_cache_key).toMatch(
      /^cleo:[0-9a-f]+$/
    )
    expect(
      openai.create.mock.calls[0]?.[0].tools.map(
        (tool: { type: string }) => tool.type
      )
    ).toEqual(["web_search", "image_generation"])
    expect(
      openai.create.mock.calls[0]?.[0].tools.find(
        (tool: { type: string }) => tool.type === "image_generation"
      )
    ).toMatchObject({
      output_compression: 85,
      output_format: "jpeg",
      partial_images: 1,
    })
  })

  it("streams generated images as jpeg data URLs", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        {
          item: {
            id: "img_1",
            status: "in_progress",
            type: "image_generation_call",
          },
          type: "response.output_item.added",
        },
        {
          item_id: "img_1",
          partial_image_b64: "partialbytes",
          type: "response.image_generation_call.partial_image",
        },
        {
          item: {
            id: "img_1",
            result: "finalbytes",
            status: "completed",
            type: "image_generation_call",
          },
          type: "response.output_item.done",
        },
      ])
    )

    const events = await ndjson(await POST(ask(question)))
    const images = events.filter((event) => event.type === "image")

    expect(images).toEqual([
      {
        id: "img_1",
        imageUrl: "data:image/jpeg;base64,partialbytes",
        partial: true,
        type: "image",
      },
      {
        id: "img_1",
        imageUrl: "data:image/jpeg;base64,finalbytes",
        type: "image",
      },
    ])
  })

  it("uses low reasoning effort for short social turns", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "hi", type: "response.output_text.delta" }])
    )

    await POST(ask({ messages: [{ content: "Hey Cleo", role: "user" }] }))

    expect(openai.create.mock.calls[0]?.[0].reasoning.effort).toBe("low")
  })

  it("uses high reasoning effort for comparison prompts", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "ok", type: "response.output_text.delta" }])
    )

    await POST(
      ask({
        messages: [
          {
            content: "Compare Mars and Earth with sources",
            role: "user",
          },
        ],
      })
    )

    expect(openai.create.mock.calls[0]?.[0].reasoning.effort).toBe("high")
  })

  it("replays encrypted reasoning items before assistant turns", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "ok", type: "response.output_text.delta" }])
    )

    await POST(
      ask({
        messages: [
          { content: "Tell me about Japan", role: "user" },
          {
            content: "Japan is an island country.",
            role: "assistant",
            reasoningItems: [
              {
                type: "reasoning",
                id: "rs_1",
                encrypted_content: "enc-abc",
                summary: [{ type: "summary_text", text: "plan" }],
              },
            ],
          },
          { content: "Now compare it to Korea", role: "user" },
        ],
      })
    )

    const input = openai.create.mock.calls[0]?.[0].input as unknown[]
    expect(input).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "reasoning",
          id: "rs_1",
          encrypted_content: "enc-abc",
        }),
        expect.objectContaining({
          role: "assistant",
          content: "Japan is an island country.",
        }),
      ])
    )
    const reasoningIndex = input.findIndex(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        item.type === "reasoning"
    )
    const assistantIndex = input.findIndex(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "role" in item &&
        item.role === "assistant"
    )
    expect(reasoningIndex).toBeGreaterThanOrEqual(0)
    expect(assistantIndex).toBeGreaterThan(reasoningIndex)
  })

  it("emits reasoning_items when encrypted content arrives", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        {
          item: {
            id: "rs_1",
            status: "completed",
            type: "reasoning",
            summary: [{ type: "summary_text", text: "plan" }],
            encrypted_content: "enc-xyz",
          },
          type: "response.output_item.done",
        },
        { delta: "Done.", type: "response.output_text.delta" },
      ])
    )

    const events = await ndjson(await POST(ask(question)))

    expect(events).toContainEqual({
      type: "reasoning_items",
      items: [
        {
          type: "reasoning",
          id: "rs_1",
          encrypted_content: "enc-xyz",
          summary: [{ type: "summary_text", text: "plan" }],
        },
      ],
    })
  })

  it("emits soft incomplete status when partial text already streamed", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "Partial answer", type: "response.output_text.delta" },
        {
          response: { incomplete_details: { reason: "max_output_tokens" } },
          type: "response.incomplete",
        },
      ])
    )

    const events = await ndjson(await POST(ask(question)))

    expect(events.filter((event) => event.type === "error")).toEqual([])
    expect(events.at(-1)).toEqual({
      type: "status",
      status: "incomplete",
      reason: "max_output_tokens",
      message: "This answer was cut short before it finished.",
    })
  })

  it("grounds complete topic photograph sets when the user asks about a catalog subject", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "ok", type: "response.output_text.delta" }])
    )

    await POST(ask(question))

    const instructions = openai.create.mock.calls[0]?.[0].instructions as string
    expect(instructions).toContain("<cleo_topic_photos>")
    expect(instructions).toContain("![Mount Fuji](/images/atlas/japan/w1280.jpg)")
    expect(instructions).toContain(
      "![Hiroshima Peace Memorial](/images/atlas/japan/w1280-2.jpg)"
    )
    expect(instructions).toContain("![Kyoto Temples](/images/atlas/japan/w1280-3.jpg)")
    expect(instructions).toContain("embed every listed photograph")
  })
})
