import { describe, expect, it } from "vitest"

import {
  isEncryptedReasoningItem,
  sanitizeReasoningItems,
} from "./reasoning-items"

describe("encrypted reasoning items", () => {
  it("accepts well-formed items and strips junk", () => {
    const items = sanitizeReasoningItems([
      {
        type: "reasoning",
        id: "rs_1",
        encrypted_content: "enc-abc",
        summary: [{ type: "summary_text", text: "plan" }],
      },
      { type: "reasoning", id: "bad", encrypted_content: "" },
      { type: "message", id: "m1" },
      null,
    ])

    expect(items).toEqual([
      {
        type: "reasoning",
        id: "rs_1",
        encrypted_content: "enc-abc",
        summary: [{ type: "summary_text", text: "plan" }],
      },
    ])
    expect(
      isEncryptedReasoningItem({
        type: "reasoning",
        id: "rs_1",
        encrypted_content: "enc-abc",
      })
    ).toBe(true)
  })

  it("rejects oversized encrypted payloads", () => {
    expect(
      isEncryptedReasoningItem({
        type: "reasoning",
        id: "rs_big",
        encrypted_content: "x".repeat(200_000),
      })
    ).toBe(false)
  })
})
