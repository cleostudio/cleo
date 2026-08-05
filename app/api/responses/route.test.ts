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

const auth = vi.hoisted(() => ({
  getSession: vi.fn(),
}))

const memoryStore = vi.hoisted(() => ({
  loadUserMemoryNotesForInjection: vi.fn(),
}))

vi.mock("openai", () => {
  class OpenAI {
    responses = { create: openai.create }
  }

  return { APIError: openai.APIError, default: OpenAI }
})

vi.mock("~/lib/auth", () => ({
  getSession: auth.getSession,
}))

vi.mock("~/lib/cleo/memory-store", () => ({
  loadUserMemoryNotesForInjection: memoryStore.loadUserMemoryNotesForInjection,
}))

import { resetCleoRateLimitForTests } from "~/lib/cleo/rate-limit"

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

function developerTexts(request: {
  input?: Array<{
    role?: string
    content?: string | Array<{ type?: string; text?: string }>
  }>
}) {
  return (request.input ?? [])
    .filter((item) => item.role === "developer")
    .map((item) => {
      if (typeof item.content === "string") return item.content
      if (!Array.isArray(item.content)) return ""
      return item.content
        .map((part) => (typeof part.text === "string" ? part.text : ""))
        .join("")
    })
}

function developerCorpus(request: {
  input?: Array<{
    role?: string
    content?: string | Array<{ type?: string; text?: string }>
  }>
}) {
  return developerTexts(request).join("\n\n")
}

beforeEach(() => {
  openai.create.mockReset()
  auth.getSession.mockReset()
  auth.getSession.mockResolvedValue(null)
  memoryStore.loadUserMemoryNotesForInjection.mockReset()
  memoryStore.loadUserMemoryNotesForInjection.mockResolvedValue([])
  resetCleoRateLimitForTests()
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

  it("rejects an oversized Content-Length before parsing JSON", async () => {
    const response = await POST(
      ask(question, {
        headers: {
          "content-type": "application/json",
          "content-length": String(17 * 1024 * 1024),
        },
      })
    )

    expect(response.status).toBe(413)
    await expect(response.json()).resolves.toEqual({
      error: "The request body is too large.",
    })
    expect(openai.create).not.toHaveBeenCalled()
  })

  it("rate-limits repeated turns from the same client", async () => {
    openai.create.mockResolvedValue(
      responseStream([
        { delta: "ok", type: "response.output_text.delta" },
        { type: "response.completed" },
      ])
    )

    for (let i = 0; i < 12; i++) {
      const response = await POST(
        ask(question, {
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "203.0.113.50",
          },
        })
      )
      expect(response.status).toBe(200)
    }

    const blocked = await POST(
      ask(question, {
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.50",
        },
      })
    )

    expect(blocked.status).toBe(429)
    expect(blocked.headers.get("retry-after")).toBeTruthy()
    await expect(blocked.json()).resolves.toEqual({
      error: "Too many requests. Try again shortly.",
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

  it("adds explicitly shared location only to private developer context", async () => {
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
    const privateContext = developerCorpus(request)
    const userMessage = request.input.find(
      (item: { role?: string; content?: unknown }) =>
        item.role === "user" && item.content === "Tell me about Japan"
    )

    expect(request.instructions).toBeUndefined()
    expect(privateContext).toContain("<cleo_user_location>")
    expect(privateContext).toContain("Latitude: 37.77490")
    expect(privateContext).toContain("Longitude: -122.41940")
    expect(privateContext).toContain("IANA time zone: America/Los_Angeles")
    expect(privateContext).toContain("never volunteer it")
    expect(userMessage).toBeTruthy()
    expect(
      request.tools.find((tool: { type: string }) => tool.type === "web_search")
    ).toMatchObject({
      search_context_size: "medium",
      user_location: {
        type: "approximate",
        timezone: "America/Los_Angeles",
      },
    })
  })
})

describe("POST /api/responses: signed-in user profile", () => {
  it("adds the session account name only to private developer context", async () => {
    auth.getSession.mockResolvedValueOnce({
      user: { id: "user_ada", name: "Ada Lovelace", email: "ada@example.com" },
    })
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hi Ada.", type: "response.output_text.delta" }])
    )

    await POST(ask(question))

    const request = openai.create.mock.calls[0]?.[0]
    const privateContext = developerCorpus(request)

    expect(privateContext).toContain("<cleo_user_profile>")
    expect(privateContext).toContain("Preferred name: Ada Lovelace")
    expect(privateContext).toContain("Do not force the name into every reply")
    expect(privateContext).not.toContain("ada@example.com")
    expect(request.safety_identifier).toMatch(/^[a-f0-9]{64}$/)
    expect(request.safety_identifier).not.toContain("user_ada")
    expect(
      request.input.some(
        (item: { role?: string; content?: unknown }) =>
          item.role === "user" && item.content === "Tell me about Japan"
      )
    ).toBe(true)
  })

  it("omits profile instructions for guests", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hello.", type: "response.output_text.delta" }])
    )

    await POST(ask(question))

    const request = openai.create.mock.calls[0]?.[0]

    expect(developerCorpus(request)).not.toContain("<cleo_user_profile>")
    expect(request.safety_identifier).toMatch(/^[a-f0-9]{64}$/)
  })

  it("ignores a client-supplied name on the request body", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hello.", type: "response.output_text.delta" }])
    )

    await POST(ask({ ...question, name: "Spoofed Name" }))

    const request = openai.create.mock.calls[0]?.[0]
    const privateContext = developerCorpus(request)

    expect(auth.getSession).toHaveBeenCalled()
    expect(privateContext).not.toContain("Spoofed Name")
    expect(privateContext).not.toContain("<cleo_user_profile>")
  })

  it("fails open when session lookup throws", async () => {
    auth.getSession.mockRejectedValueOnce(new Error("database unavailable"))
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hello.", type: "response.output_text.delta" }])
    )

    const response = await POST(ask(question))
    const request = openai.create.mock.calls[0]?.[0]

    expect(response.status).toBe(200)
    expect(developerCorpus(request)).not.toContain("<cleo_user_profile>")
  })

  it("skips profile instructions when the session name is unusable", async () => {
    auth.getSession.mockResolvedValueOnce({
      user: { id: "user_ada", name: "   <>   ", email: "ada@example.com" },
    })
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hello.", type: "response.output_text.delta" }])
    )

    await POST(ask(question))

    const request = openai.create.mock.calls[0]?.[0]

    expect(developerCorpus(request)).not.toContain("<cleo_user_profile>")
  })

  it("injects opt-in memory notes for signed-in users only", async () => {
    auth.getSession.mockResolvedValueOnce({
      user: { id: "user_ada", name: "Ada Lovelace", email: "ada@example.com" },
    })
    memoryStore.loadUserMemoryNotesForInjection.mockResolvedValueOnce([
      {
        id: "n1",
        note: "Prefer metric units",
        createdAt: new Date("2026-01-01T00:00:00Z"),
      },
    ])
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hi Ada.", type: "response.output_text.delta" }])
    )

    await POST(ask(question))

    const request = openai.create.mock.calls[0]?.[0]
    const privateContext = developerCorpus(request)

    expect(memoryStore.loadUserMemoryNotesForInjection).toHaveBeenCalledWith(
      "user_ada"
    )
    expect(privateContext).toContain("<cleo_user_memory>")
    expect(privateContext).toContain("Prefer metric units")
    expect(privateContext).toContain("Do not invent memories")
  })

  it("omits memory for guests and does not load notes", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hello.", type: "response.output_text.delta" }])
    )

    await POST(ask(question))

    expect(memoryStore.loadUserMemoryNotesForInjection).not.toHaveBeenCalled()
    expect(developerCorpus(openai.create.mock.calls[0]?.[0])).not.toContain(
      "<cleo_user_memory>"
    )
  })

  it("can combine signed-in name with opt-in location instructions", async () => {
    auth.getSession.mockResolvedValueOnce({
      user: { id: "user_ada", name: "Ada Lovelace", email: "ada@example.com" },
    })
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "Hi Ada.", type: "response.output_text.delta" }])
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
    const privateContext = developerCorpus(request)

    expect(privateContext).toContain("<cleo_user_profile>")
    expect(privateContext).toContain("Preferred name: Ada Lovelace")
    expect(privateContext).toContain("<cleo_user_location>")
    expect(privateContext).toContain("America/Los_Angeles")
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

  it("rejects more than sixteen images across the conversation", async () => {
    const response = await POST(
      ask({
        messages: Array.from({ length: 5 }, (_, index) => ({
          content: `batch ${index}`,
          images: Array.from({ length: 4 }, () => ({
            url: imageDataUrl(64),
          })),
          role: index % 2 === 0 ? "user" : "assistant",
        })),
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Conversations must include 16 images or fewer.",
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
    const userMessage = openai.create.mock.calls[0]?.[0].input.find(
      (item: { role?: string }) => item.role === "user"
    )
    expect(userMessage?.content).toEqual([
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

    const request = openai.create.mock.calls[0]?.[0]
    const cachedPrefix = request.input[0]

    expect(request).toMatchObject({
      model: "gpt-5.6-terra",
      store: false,
      stream: true,
      max_tool_calls: 8,
      truncation: "auto",
      prompt_cache_key: "cleo:gpt-5.6-terra:voice-v1",
      prompt_cache_options: { mode: "explicit" },
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
    expect(request.safety_identifier).toMatch(/^[a-f0-9]{64}$/)
    expect(cachedPrefix).toMatchObject({
      role: "developer",
      content: [
        {
          type: "input_text",
          prompt_cache_breakpoint: { mode: "explicit" },
        },
      ],
    })
    expect(typeof cachedPrefix.content[0].text).toBe("string")
    expect(cachedPrefix.content[0].text.length).toBeGreaterThan(100)
    expect(request.tools.map((tool: { type: string }) => tool.type)).toEqual([
      "web_search",
      "image_generation",
    ])
    expect(
      request.tools.find((tool: { type: string }) => tool.type === "web_search")
    ).toMatchObject({
      search_context_size: "medium",
    })
    expect(
      request.tools.find(
        (tool: { type: string }) => tool.type === "image_generation"
      )
    ).toMatchObject({
      output_compression: 85,
      output_format: "jpeg",
      partial_images: 1,
    })
  })

  it("uses a larger web_search context budget for research turns", async () => {
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

    expect(
      openai.create.mock.calls[0]?.[0].tools.find(
        (tool: { type: string }) => tool.type === "web_search"
      )
    ).toMatchObject({
      search_context_size: "high",
    })
    expect(openai.create.mock.calls[0]?.[0].reasoning.effort).toBe("high")
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

    const request = openai.create.mock.calls[0]?.[0]
    // `minimal` is rejected by the API while web_search + image_generation
    // stay attached on every Cleo turn.
    expect(request.reasoning.effort).toBe("low")
    expect(
      request.tools.find((tool: { type: string }) => tool.type === "web_search")
    ).toMatchObject({ search_context_size: "low" })
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

  it("uses xhigh reasoning effort only for explicit deep-research asks", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "ok", type: "response.output_text.delta" }])
    )

    await POST(
      ask({
        messages: [
          {
            content: "Do a deep research report on Nile basin water politics",
            role: "user",
          },
        ],
      })
    )

    expect(openai.create.mock.calls[0]?.[0].reasoning.effort).toBe("xhigh")
  })

  it("replaces streamed text with Markdown links from url_citation annotations", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "Paris is lovely.", type: "response.output_text.delta" },
        {
          annotation: {
            type: "url_citation",
            start_index: 0,
            end_index: 5,
            url: "https://example.com/paris",
            title: "Paris",
          },
          type: "response.output_text.annotation.added",
        },
        {
          text: "Paris is lovely.",
          type: "response.output_text.done",
        },
        {
          response: {
            usage: {
              input_tokens: 10,
              output_tokens: 4,
              total_tokens: 14,
              input_tokens_details: {
                cached_tokens: 0,
                cache_write_tokens: 0,
              },
            },
          },
          type: "response.completed",
        },
      ])
    )

    const events = await ndjson(await POST(ask(question)))

    expect(events).toContainEqual({
      type: "text",
      delta: "Paris is lovely.",
    })
    expect(events).toContainEqual({
      type: "text_replace",
      content: "[Paris](https://example.com/paris) is lovely.",
    })
  })

  it("logs prompt-cache telemetry when a turn completes", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined)
    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "ok", type: "response.output_text.delta" },
        {
          response: {
            usage: {
              input_tokens: 4200,
              output_tokens: 120,
              total_tokens: 4320,
              input_tokens_details: {
                cached_tokens: 3900,
                cache_write_tokens: 0,
              },
            },
          },
          type: "response.completed",
        },
      ])
    )

    await ndjson(await POST(ask(question)))

    expect(info).toHaveBeenCalledWith("cleo.prompt_cache", {
      cached_tokens: 3900,
      cache_write_tokens: 0,
      input_tokens: 4200,
      output_tokens: 120,
      total_tokens: 4320,
    })
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

    const privateContext = developerCorpus(openai.create.mock.calls[0]?.[0])
    expect(privateContext).toContain("<cleo_topic_photos>")
    expect(privateContext).toContain(
      "![Mount Fuji](/images/atlas/japan/w1280.jpg)"
    )
    expect(privateContext).toContain(
      "![Hiroshima Peace Memorial](/images/atlas/japan/w1280-2.jpg)"
    )
    expect(privateContext).toContain(
      "![Kyoto Temples](/images/atlas/japan/w1280-3.jpg)"
    )
    expect(privateContext).toContain("embed every listed photograph")
  })
})
