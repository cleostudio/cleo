import OpenAI, { APIError } from "openai"

const MODEL = "gpt-5.6-terra"
const MAX_INPUT_LENGTH = 10_000

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status })
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse("The request body must be valid JSON.", 400)
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("input" in body) ||
    typeof body.input !== "string"
  ) {
    return errorResponse("A text input is required.", 400)
  }

  const input = body.input.trim()

  if (!input) {
    return errorResponse("Enter a question before sending.", 400)
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return errorResponse(
      `Questions must be ${MAX_INPUT_LENGTH.toLocaleString()} characters or fewer.`,
      400
    )
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured.")
    return errorResponse("The AI service is not configured.", 503)
  }

  const client = new OpenAI({ apiKey })

  try {
    const responseStream = await client.responses.create(
      {
        model: MODEL,
        input,
        instructions: "Answer the user's question clearly and directly.",
        max_output_tokens: 4096,
        reasoning: { effort: "medium" },
        stream: true,
        text: { verbosity: "medium" },
        store: false,
      },
      { signal: request.signal }
    )
    const encoder = new TextEncoder()
    const outputStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of responseStream) {
            if (event.type === "response.output_text.delta") {
              controller.enqueue(encoder.encode(event.delta))
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
            controller.error(streamError)
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
        "Content-Type": "text/plain; charset=utf-8",
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
