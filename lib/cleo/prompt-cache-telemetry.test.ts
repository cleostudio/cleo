import { describe, expect, it, vi } from "vitest"

import {
  logPromptCacheTelemetry,
  promptCacheTelemetryFromUsage,
} from "./prompt-cache-telemetry"

describe("promptCacheTelemetryFromUsage", () => {
  it("extracts cache read/write counts from Responses usage", () => {
    expect(
      promptCacheTelemetryFromUsage({
        input_tokens: 4200,
        output_tokens: 300,
        total_tokens: 4500,
        input_tokens_details: {
          cached_tokens: 3900,
          cache_write_tokens: 0,
        },
      })
    ).toEqual({
      cached_tokens: 3900,
      cache_write_tokens: 0,
      input_tokens: 4200,
      output_tokens: 300,
      total_tokens: 4500,
    })
  })

  it("returns null when cache fields are missing", () => {
    expect(promptCacheTelemetryFromUsage(undefined)).toBeNull()
    expect(promptCacheTelemetryFromUsage({ input_tokens: 10 })).toBeNull()
    expect(
      promptCacheTelemetryFromUsage({
        input_tokens_details: { cached_tokens: 1 },
      })
    ).toBeNull()
  })
})

describe("logPromptCacheTelemetry", () => {
  it("logs a structured payload when usage is complete", () => {
    const log = vi.fn()

    logPromptCacheTelemetry(
      {
        input_tokens: 100,
        output_tokens: 20,
        total_tokens: 120,
        input_tokens_details: {
          cached_tokens: 80,
          cache_write_tokens: 20,
        },
      },
      log
    )

    expect(log).toHaveBeenCalledWith("cleo.prompt_cache", {
      cached_tokens: 80,
      cache_write_tokens: 20,
      input_tokens: 100,
      output_tokens: 20,
      total_tokens: 120,
    })
  })

  it("stays quiet when usage cannot be parsed", () => {
    const log = vi.fn()
    logPromptCacheTelemetry(null, log)
    expect(log).not.toHaveBeenCalled()
  })
})
