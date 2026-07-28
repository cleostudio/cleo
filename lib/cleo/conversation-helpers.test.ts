import { describe, expect, it } from "vitest"

import {
  CONTINUE_PROMPT,
  makeIncomplete,
  messageHasVisibleContent,
  promptCacheKeyForConversation,
  toConversationPayload,
} from "./conversation-helpers"

describe("conversation helpers", () => {
  it("detects visible drafts including incomplete markers", () => {
    expect(
      messageHasVisibleContent({
        role: "assistant",
        content: "",
        incomplete: makeIncomplete("stopped"),
      })
    ).toBe(true)
    expect(
      messageHasVisibleContent({ role: "assistant", content: "  " })
    ).toBe(false)
  })

  it("builds API payloads with reasoning items and skips hidden turns", () => {
    expect(
      toConversationPayload([
        { role: "user", content: "Hi" },
        {
          role: "assistant",
          content: "Hello",
          reasoningItems: [
            {
              type: "reasoning",
              id: "rs_1",
              encrypted_content: "enc",
            },
          ],
        },
        { role: "user", content: CONTINUE_PROMPT, hidden: true },
      ])
    ).toEqual([
      { role: "user", content: "Hi" },
      {
        role: "assistant",
        content: "Hello",
        reasoningItems: [
          {
            type: "reasoning",
            id: "rs_1",
            encrypted_content: "enc",
          },
        ],
      },
    ])
  })

  it("stable prompt cache keys per first user message", () => {
    const a = promptCacheKeyForConversation([
      { role: "user", content: "Tell me about Japan" },
    ])
    const b = promptCacheKeyForConversation([
      { role: "user", content: "Tell me about Japan" },
      { role: "assistant", content: "…" },
      { role: "user", content: "more" },
    ])
    const c = promptCacheKeyForConversation([
      { role: "user", content: "Tell me about Mars" },
    ])

    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(a.startsWith("cleo:")).toBe(true)
  })
})
