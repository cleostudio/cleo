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
      responseStream([
        { delta: "A photo.", type: "response.output_text.delta" },
        { response: { output: [] }, type: "response.completed" },
      ])
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
        { response: { output: [] }, type: "response.completed" },
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
          response: {
            incomplete_details: { reason: "max_output_tokens" },
            output: [],
          },
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
      responseStream([
        { delta: "ok", type: "response.output_text.delta" },
        { response: { output: [] }, type: "response.completed" },
      ])
    )

    await POST(ask(question))

    expect(openai.create.mock.calls[0]?.[0]).toMatchObject({
      model: "gpt-5.6-terra",
      store: false,
      stream: true,
      reasoning: { effort: "medium", summary: "auto" },
    })
    expect(
      openai.create.mock.calls[0]?.[0].tools.map(
        (tool: { type: string; name?: string }) => tool.name ?? tool.type
      )
    ).toEqual([
      "web_search",
      "image_generation",
      "search_portal_topics",
      "lookup_guide",
      "get_topic_photos",
    ])
  })

  it("raises reasoning effort for comparison prompts", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "ok", type: "response.output_text.delta" },
        { response: { output: [] }, type: "response.completed" },
      ])
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

  it("runs portal function tools and continues the agent loop", async () => {
    openai.create
      .mockResolvedValueOnce(
        responseStream([
          {
            item: {
              arguments: JSON.stringify({
                collection: "explore",
                slug: "japan",
              }),
              call_id: "call_lookup_1",
              id: "fc_1",
              name: "lookup_guide",
              type: "function_call",
            },
            type: "response.output_item.added",
          },
          {
            item: {
              arguments: JSON.stringify({
                collection: "explore",
                slug: "japan",
              }),
              call_id: "call_lookup_1",
              id: "fc_1",
              name: "lookup_guide",
              status: "completed",
              type: "function_call",
            },
            type: "response.output_item.done",
          },
          {
            response: {
              output: [
                {
                  arguments: JSON.stringify({
                    collection: "explore",
                    slug: "japan",
                  }),
                  call_id: "call_lookup_1",
                  id: "fc_1",
                  name: "lookup_guide",
                  type: "function_call",
                },
              ],
            },
            type: "response.completed",
          },
        ])
      )
      .mockResolvedValueOnce(
        responseStream([
          { delta: "Japan is an archipelago.", type: "response.output_text.delta" },
          { response: { output: [] }, type: "response.completed" },
        ])
      )

    const events = await ndjson(await POST(ask(question)))

    expect(openai.create).toHaveBeenCalledTimes(2)
    expect(
      events.some(
        (event) =>
          event.type === "activity" &&
          event.activity?.kind === "portal_tool" &&
          event.activity?.action?.name === "lookup_guide"
      )
    ).toBe(true)
    expect(events.filter((event) => event.type === "text")).toEqual([
      { delta: "Japan is an archipelago.", type: "text" },
    ])

    const secondInput = openai.create.mock.calls[1]?.[0].input as unknown[]
    expect(
      secondInput.some(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "type" in item &&
          item.type === "function_call_output"
      )
    ).toBe(true)
  })

  it("keeps a partial answer when the stream is incomplete after text", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "Partial Japan note.", type: "response.output_text.delta" },
        {
          response: {
            incomplete_details: { reason: "max_output_tokens" },
            output: [],
          },
          type: "response.incomplete",
        },
      ])
    )

    const events = await ndjson(await POST(ask(question)))

    expect(events).toEqual([
      { delta: "Partial Japan note.", type: "text" },
    ])
  })

  it("grounds topic photograph paths when the user asks about a catalog subject", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "ok", type: "response.output_text.delta" },
        { response: { output: [] }, type: "response.completed" },
      ])
    )

    await POST(ask(question))

    const instructions = openai.create.mock.calls[0]?.[0].instructions as string
    expect(instructions).toContain("<cleo_topic_photos>")
    expect(instructions).toContain("![Mount Fuji](/images/atlas/japan/w1280.jpg)")
    expect(instructions).toContain("You MAY and SHOULD include the curated photograph")
  })
})
