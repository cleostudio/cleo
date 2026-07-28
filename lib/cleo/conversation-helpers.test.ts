import { describe, expect, it } from "vitest"

import {
  hasLiveActivity,
  hydrateRestoredMessages,
  inFlightCheckpointDelayMs,
  markAssistantInterrupted,
  settleActivities,
  shouldStickToBottom,
} from "./conversation-helpers"
import { isContinuePrompt, CONTINUE_PROMPT } from "./continue"
import type { ActivityItem } from "./stream"

type TestMessage = {
  activities?: ActivityItem[]
  content: string
  incomplete?: {
    message: string
    reason?: "max_output_tokens" | "content_filter" | "stopped" | "other"
  }
  role: "assistant" | "user"
}

describe("settleActivities", () => {
  it("marks live statuses cancelled and leaves terminals alone", () => {
    const settled = settleActivities([
      { id: "r1", kind: "reasoning", status: "in_progress" },
      { id: "w1", kind: "web_search", status: "searching" },
      { id: "i1", kind: "image_generation", status: "generating" },
      { id: "c1", kind: "code_interpreter", status: "interpreting" },
      { id: "p1", kind: "portal_tool", status: "completed" },
      { id: "f1", kind: "web_search", status: "failed" },
    ])

    expect(settled.map((item) => item.status)).toEqual([
      "cancelled",
      "cancelled",
      "cancelled",
      "cancelled",
      "completed",
      "failed",
    ])
  })

  it("returns an empty list for missing activities", () => {
    expect(settleActivities(undefined)).toEqual([])
  })
})

describe("hasLiveActivity", () => {
  it("detects in-flight tool rows", () => {
    expect(
      hasLiveActivity([{ id: "1", kind: "reasoning", status: "in_progress" }])
    ).toBe(true)
    expect(
      hasLiveActivity([{ id: "1", kind: "reasoning", status: "completed" }])
    ).toBe(false)
  })
})

describe("markAssistantInterrupted", () => {
  it("settles activities and attaches an incomplete marker", () => {
    const marked = markAssistantInterrupted<TestMessage>(
      {
        role: "assistant",
        content: "Partial…",
        activities: [
          { id: "w1", kind: "web_search", status: "searching" },
        ],
      },
      "other"
    )

    expect(marked.activities?.[0]?.status).toBe("cancelled")
    expect(marked.incomplete?.reason).toBe("other")
  })
})

describe("hydrateRestoredMessages", () => {
  it("settles live activities and marks incomplete when inFlight", () => {
    const hydrated = hydrateRestoredMessages<TestMessage>(
      [
        { role: "user", content: "Mars?" },
        {
          role: "assistant",
          content: "Mars is",
          activities: [
            { id: "r1", kind: "reasoning", status: "in_progress" },
          ],
        },
      ],
      { inFlight: true }
    )

    expect(hydrated[1]?.activities?.[0]?.status).toBe("cancelled")
    expect(hydrated[1]?.incomplete?.reason).toBe("stopped")
  })

  it("marks incomplete when the last assistant still has live activities", () => {
    const hydrated = hydrateRestoredMessages<TestMessage>([
      { role: "user", content: "Hi" },
      {
        role: "assistant",
        content: "",
        activities: [
          { id: "w1", kind: "web_search", status: "searching" },
        ],
      },
    ])

    expect(hydrated[1]?.incomplete?.reason).toBe("stopped")
    expect(hydrated[1]?.activities?.[0]?.status).toBe("cancelled")
  })

  it("does not mark a finished last assistant incomplete without inFlight", () => {
    const hydrated = hydrateRestoredMessages<TestMessage>([
      { role: "user", content: "Hi" },
      {
        role: "assistant",
        content: "Hello.",
        activities: [
          { id: "r1", kind: "reasoning", status: "completed" },
        ],
      },
    ])

    expect(hydrated[1]?.incomplete).toBeUndefined()
  })

  it("preserves an existing incomplete marker", () => {
    const hydrated = hydrateRestoredMessages<TestMessage>(
      [
        { role: "user", content: "Essay" },
        {
          role: "assistant",
          content: "Once…",
          incomplete: {
            reason: "max_output_tokens",
            message: "cut short",
          },
        },
      ],
      { inFlight: true }
    )

    expect(hydrated[1]?.incomplete?.reason).toBe("max_output_tokens")
  })
})

describe("shouldStickToBottom", () => {
  it("returns true near the bottom and false when scrolled up", () => {
    expect(shouldStickToBottom(880, 100, 1000, 120)).toBe(true)
    expect(shouldStickToBottom(700, 100, 1000, 120)).toBe(false)
  })
})

describe("inFlightCheckpointDelayMs", () => {
  it("saves immediately on the first checkpoint and after the interval", () => {
    expect(inFlightCheckpointDelayMs(0, 1000, 750)).toBe(0)
    expect(inFlightCheckpointDelayMs(100, 900, 750)).toBe(0)
    expect(inFlightCheckpointDelayMs(100, 500, 750)).toBe(350)
  })
})

describe("isContinuePrompt", () => {
  it("matches the shared Continue prompt", () => {
    expect(isContinuePrompt(CONTINUE_PROMPT)).toBe(true)
    expect(isContinuePrompt(`  ${CONTINUE_PROMPT}  `)).toBe(true)
    expect(isContinuePrompt("keep going")).toBe(false)
  })
})
