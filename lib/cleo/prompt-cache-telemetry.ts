/**
 * Server-side prompt-cache telemetry for GPT-5.6 Responses turns.
 * Logs cached vs cache-write token counts so we can confirm the explicit
 * breakpoint is hitting without exposing conversation content.
 */

export type PromptCacheUsageLike = {
  input_tokens?: number
  output_tokens?: number
  total_tokens?: number
  input_tokens_details?: {
    cached_tokens?: number
    cache_write_tokens?: number
  } | null
}

export type PromptCacheTelemetry = {
  cached_tokens: number
  cache_write_tokens: number
  input_tokens: number
  output_tokens: number
  total_tokens: number
}

/** Normalize Responses `usage` into a compact cache telemetry record. */
export function promptCacheTelemetryFromUsage(
  usage: PromptCacheUsageLike | null | undefined
): PromptCacheTelemetry | null {
  if (!usage || typeof usage !== "object") {
    return null
  }

  const details = usage.input_tokens_details
  if (!details || typeof details !== "object") {
    return null
  }

  const cached_tokens = details.cached_tokens
  const cache_write_tokens = details.cache_write_tokens

  if (
    typeof cached_tokens !== "number" ||
    !Number.isFinite(cached_tokens) ||
    typeof cache_write_tokens !== "number" ||
    !Number.isFinite(cache_write_tokens)
  ) {
    return null
  }

  return {
    cached_tokens,
    cache_write_tokens,
    input_tokens:
      typeof usage.input_tokens === "number" && Number.isFinite(usage.input_tokens)
        ? usage.input_tokens
        : 0,
    output_tokens:
      typeof usage.output_tokens === "number" &&
      Number.isFinite(usage.output_tokens)
        ? usage.output_tokens
        : 0,
    total_tokens:
      typeof usage.total_tokens === "number" && Number.isFinite(usage.total_tokens)
        ? usage.total_tokens
        : 0,
  }
}

/** Emit one structured log line for operators / Vercel logs. */
export function logPromptCacheTelemetry(
  usage: PromptCacheUsageLike | null | undefined,
  log: (message: string, payload: PromptCacheTelemetry) => void = console.info
) {
  const telemetry = promptCacheTelemetryFromUsage(usage)
  if (!telemetry) {
    return
  }

  log("cleo.prompt_cache", telemetry)
}
