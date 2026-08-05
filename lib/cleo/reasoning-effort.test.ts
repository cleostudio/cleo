import { describe, expect, it } from "vitest"

import {
  selectReasoningEffort,
  selectSearchContextSize,
} from "./reasoning-effort"

describe("selectReasoningEffort", () => {
  it("uses low effort for short social turns", () => {
    expect(selectReasoningEffort("Hey Cleo")).toBe("low")
    expect(selectReasoningEffort("thanks!")).toBe("low")
    expect(selectReasoningEffort("Tell me about Japan")).toBe("medium")
  })

  it("uses high effort for research and comparisons", () => {
    expect(selectReasoningEffort("Compare Mars and Earth with sources")).toBe(
      "high"
    )
    expect(
      selectReasoningEffort("Fact-check this claim about the ISS altitude")
    ).toBe("high")
  })

  it("defaults to medium for ordinary questions", () => {
    expect(selectReasoningEffort("What is the capital of Japan?")).toBe(
      "medium"
    )
  })
})

describe("selectSearchContextSize", () => {
  it("mirrors reasoning effort for web_search context budget", () => {
    expect(selectSearchContextSize("low")).toBe("low")
    expect(selectSearchContextSize("medium")).toBe("medium")
    expect(selectSearchContextSize("high")).toBe("high")
  })
})
