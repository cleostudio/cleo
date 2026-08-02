import { appendFile } from "node:fs/promises"

const MESSAGES = new Set([
  "save-outgoing-position",
  "prepare-thread-position",
  "restore-skipped-active-mismatch",
  "restore-before-scroll",
  "restore-after-scroll",
  "restore-post-paint",
  "auto-follow-scroll",
])

const HYPOTHESES = new Set(["A", "B", "C", "D"])

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function parseData(value: unknown) {
  if (!value || typeof value !== "object") return null

  const source = value as Record<string, unknown>
  const numberKeys = [
    "sequence",
    "activeThread",
    "targetThread",
    "savedY",
    "actualY",
    "maxY",
    "scrollHeight",
    "innerHeight",
    "scrollTick",
  ] as const
  const booleanKeys = ["hasSavedPosition", "reachedExpected"] as const

  const data: Record<string, boolean | number | null> = {}
  for (const key of numberKeys) {
    const entry = source[key]
    if (entry === null || isFiniteNumber(entry)) data[key] = entry
  }
  for (const key of booleanKeys) {
    const entry = source[key]
    if (typeof entry === "boolean") data[key] = entry
  }

  return isFiniteNumber(data.sequence) ? data : null
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 204 })
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>
    const data = parseData(payload.data)
    const timestamp = payload.timestamp

    if (
      !data ||
      !isFiniteNumber(timestamp) ||
      typeof payload.message !== "string" ||
      !MESSAGES.has(payload.message) ||
      typeof payload.hypothesisId !== "string" ||
      !HYPOTHESES.has(payload.hypothesisId)
    ) {
      return new Response(null, { status: 204 })
    }

    // #region agent log
    await appendFile(
      "/opt/cursor/logs/debug.log",
      `${JSON.stringify({
        id: `thread-scroll-${timestamp}-${data.sequence}`,
        timestamp,
        location: "components/cleo/ask-form.tsx",
        message: payload.message,
        data,
        hypothesisId: payload.hypothesisId,
      })}\n`,
    )
    // #endregion
  } catch {
    // Debug telemetry must never affect the interactive thread switch.
  }

  return new Response(null, { status: 204 })
}
