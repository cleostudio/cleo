import { describe, expect, it } from "vitest"

import {
  CLEO_PROMPT_CACHE_KEY,
  CONTINUE_PROMPT,
  makeIncomplete,
  messageHasVisibleContent,
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

  it("uses one stable prompt-cache key for the shared voice prefix", () => {
    expect(CLEO_PROMPT_CACHE_KEY).toBe("cleo:gpt-5.6-terra:voice-v1")
  })
})
