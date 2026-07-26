import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  MAX_IMAGES_PER_REQUEST,
  MAX_TOTAL_IMAGE_BYTES,
} from "~/lib/cleo/images"

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

type Post = (request: Request) => Promise<Response>

/**
 * The route memoizes its guard on first use, so a fresh module registry is the
 * only way to give each test clean throttle counters and its own limits.
 */
async function loadRoute(env: Record<string, string> = {}): Promise<Post> {
  vi.resetModules()
  vi.stubEnv("OPENAI_API_KEY", "test-key")
  vi.stubEnv("CLEO_RATE_LIMIT_BURST", "1000")
  vi.stubEnv("CLEO_RATE_LIMIT_HOURLY", "1000")

  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value)
  }

  return (await import("./route")).POST
}

function ask(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://cleo.example/api/responses", {
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "sec-fetch-site": "same-origin",
      "x-vercel-forwarded-for": "203.0.113.4",
      ...headers,
    },
    method: "POST",
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
  vi.spyOn(console, "error").mockImplementation(() => undefined)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe("POST /api/responses: abuse controls", () => {
  it("rejects a request posted from another site before reading the body", async () => {
    const post = await loadRoute()
    const response = await post(ask(question, { "sec-fetch-site": "cross-site" }))

    expect(response.status).toBe(403)
    expect(openai.create).not.toHaveBeenCalled()
  })

  it("rejects an oversized declared body", async () => {
    const post = await loadRoute()
    const response = await post(
      ask(question, { "content-length": String(64 * 1024 * 1024) })
    )

    expect(response.status).toBe(413)
    expect(openai.create).not.toHaveBeenCalled()
  })

  it("throttles a caller past the burst limit and reports when to retry", async () => {
    const post = await loadRoute({ CLEO_RATE_LIMIT_BURST: "2" })

    expect((await post(ask(question))).status).not.toBe(429)
    expect((await post(ask(question))).status).not.toBe(429)

    const response = await post(ask(question))

    expect(response.status).toBe(429)
    expect(response.headers.get("retry-after")).toBe("20")
    expect(openai.create).toHaveBeenCalledTimes(2)
  })

  it("throttles each caller separately", async () => {
    const post = await loadRoute({ CLEO_RATE_LIMIT_BURST: "1" })

    await post(ask(question, { "x-vercel-forwarded-for": "203.0.113.1" }))

    expect(
      (await post(ask(question, { "x-vercel-forwarded-for": "203.0.113.2" })))
        .status
    ).not.toBe(429)
    expect(
      (await post(ask(question, { "x-vercel-forwarded-for": "203.0.113.1" })))
        .status
    ).toBe(429)
  })

  it("refuses new turns while the instance is saturated, then recovers", async () => {
    const post = await loadRoute({ CLEO_MAX_CONCURRENT_STREAMS: "1" })

    let finish = () => undefined as void
    const held = new Promise<void>((resolve) => {
      finish = resolve
    })

    openai.create.mockResolvedValueOnce({
      controller: { abort: vi.fn() },
      async *[Symbol.asyncIterator]() {
        yield { delta: "one", type: "response.output_text.delta" }
        await held
      },
    })

    const streaming = await post(ask(question))

    expect(streaming.status).toBe(200)

    const rejected = await post(ask(question))

    expect(rejected.status).toBe(503)
    expect(rejected.headers.get("retry-after")).toBe("10")

    finish()
    await streaming.text()

    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "two", type: "response.output_text.delta" }])
    )

    // The slot must come back once the held stream drains.
    expect((await post(ask(question))).status).toBe(200)
  })

  it("releases the concurrency slot when the upstream call fails", async () => {
    const post = await loadRoute({ CLEO_MAX_CONCURRENT_STREAMS: "1" })

    openai.create.mockRejectedValueOnce(new Error("network down"))

    expect((await post(ask(question))).status).toBe(502)

    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "hello", type: "response.output_text.delta" }])
    )

    expect((await post(ask(question))).status).toBe(200)
  })
})

describe("POST /api/responses: request validation", () => {
  let post: Post

  beforeEach(async () => {
    post = await loadRoute()
  })

  it.each([
    ["a body that is not JSON", "not json", "The request body must be valid JSON."],
    ["a body that is not an object", "[]", "A messages array is required."],
    ["a missing messages array", {}, "A messages array is required."],
    ["an empty conversation", { messages: [] }, "Enter a question before sending."],
  ])("rejects %s", async (_label, body, error) => {
    const response = await post(ask(body))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error })
  })

  it("rejects a conversation longer than the message cap", async () => {
    const response = await post(
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
    const response = await post(
      ask({ messages: [{ content: "hi", role: "system" }] })
    )

    expect(response.status).toBe(400)
  })

  it("rejects a message past the single-message character cap", async () => {
    const response = await post(
      ask({ messages: [{ content: "x".repeat(10_001), role: "user" }] })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Messages must be 10,000 characters or fewer.",
    })
  })

  it("rejects a conversation past the total character cap", async () => {
    const response = await post(
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
    const response = await post(
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
    const response = await post(ask({ messages: [{ content: "   ", role: "user" }] }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Messages cannot be empty.",
    })
  })
})

describe("POST /api/responses: image limits", () => {
  let post: Post

  beforeEach(async () => {
    post = await loadRoute()
  })

  it.each([
    ["a non-image data URL", "data:text/html;base64,PHNjcmlwdD4="],
    ["a remote URL", "https://attacker.example/pixel.png"],
    ["an SVG payload", "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="],
  ])("rejects %s", async (_label, url) => {
    const response = await post(
      ask({ messages: [{ content: "look", images: [{ url }], role: "user" }] })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error:
        "Images must be PNG, JPEG, WEBP, or GIF data URLs within the size limit.",
    })
  })

  it("rejects more than four images on one message", async () => {
    const response = await post(
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
    const response = await post(
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

  it("rejects a conversation carrying more images than the request cap", async () => {
    const imageTurn = {
      content: "look",
      images: Array.from({ length: 4 }, () => ({ url: imageDataUrl(64) })),
      role: "user",
    }
    const response = await post(
      ask({
        messages: [
          ...Array.from({ length: MAX_IMAGES_PER_REQUEST / 4 }, () => imageTurn),
          { content: "and now", role: "user", images: [{ url: imageDataUrl(64) }] },
        ],
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: `Conversations must carry ${MAX_IMAGES_PER_REQUEST} images or fewer.`,
    })
  })

  it("rejects a conversation whose images exceed the total byte budget", async () => {
    const halfBudget = MAX_TOTAL_IMAGE_BYTES / 2
    const response = await post(
      ask({
        messages: Array.from({ length: 3 }, () => ({
          content: "look",
          images: [{ url: imageDataUrl(halfBudget) }],
          role: "user",
        })),
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Conversation images must total 6MB or less.",
    })
  })

  it("accepts images that stay inside every budget", async () => {
    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "A photo.", type: "response.output_text.delta" }])
    )

    const response = await post(
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
  it("streams NDJSON text, activity, and image events", async () => {
    const post = await loadRoute()

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

    const response = await post(ask(question))

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

  it("reports an upstream stream failure as a terminal error event", async () => {
    const post = await loadRoute()

    openai.create.mockResolvedValueOnce(
      responseStream([
        { delta: "partial", type: "response.output_text.delta" },
        { message: "upstream exploded", type: "error" },
      ])
    )

    const events = await ndjson(await post(ask(question)))

    expect(events.at(-1)).toEqual({
      error: "upstream exploded",
      type: "error",
    })
  })

  it("explains an answer cut short by the output token ceiling", async () => {
    const post = await loadRoute()

    openai.create.mockResolvedValueOnce(
      responseStream([
        {
          response: { incomplete_details: { reason: "max_output_tokens" } },
          type: "response.incomplete",
        },
      ])
    )

    const events = await ndjson(await post(ask(question)))

    expect(events.at(-1)?.error).toContain("ran out of room")
  })

  it.each([
    [429, "The AI service is receiving too many requests. Try again shortly."],
    [400, "the model refused that input"],
  ])("maps an upstream %i to the same status", async (status, error) => {
    const post = await loadRoute()

    openai.create.mockRejectedValueOnce(
      new openai.APIError(status, "the model refused that input")
    )

    const response = await post(ask(question))

    expect(response.status).toBe(status)
    await expect(response.json()).resolves.toEqual({ error })
  })

  it("maps an unexpected upstream failure to 502", async () => {
    const post = await loadRoute()

    openai.create.mockRejectedValueOnce(new Error("socket hang up"))

    const response = await post(ask(question))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: "The AI service could not complete the request. Try again.",
    })
  })

  it("reports a missing API key as unavailable without calling OpenAI", async () => {
    const post = await loadRoute()

    vi.stubEnv("OPENAI_API_KEY", "")

    const response = await post(ask(question))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: "The AI service is not configured.",
    })
    expect(openai.create).not.toHaveBeenCalled()
  })

  it("keeps the model, tools, and privacy settings the surface depends on", async () => {
    const post = await loadRoute()

    openai.create.mockResolvedValueOnce(
      responseStream([{ delta: "ok", type: "response.output_text.delta" }])
    )

    await post(ask(question))

    expect(openai.create.mock.calls[0]?.[0]).toMatchObject({
      model: "gpt-5.6-terra",
      store: false,
      stream: true,
    })
    expect(
      openai.create.mock.calls[0]?.[0].tools.map(
        (tool: { type: string }) => tool.type
      )
    ).toEqual(["web_search", "image_generation"])
  })
})
