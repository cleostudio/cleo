import { describe, expect, it } from "vitest"

import {
  selectReasoningEffort,
  selectSearchContextSize,
} from "./reasoning-effort"

describe("selectReasoningEffort", () => {
  it("uses minimal effort for short social turns", () => {
    expect(selectReasoningEffort("Hey Cleo")).toBe("minimal")
    expect(selectReasoningEffort("thanks!")).toBe("minimal")
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

  it("reserves xhigh for explicit deep-research asks", () => {
    expect(
      selectReasoningEffort(
        "Do a deep research report on semaglutide healthcare costs"
      )
    ).toBe("xhigh")
    expect(
      selectReasoningEffort(
        "Write an exhaustive in-depth research analysis of Nile basin politics"
      )
    ).toBe("xhigh")
    // Ordinary "research" stays at high so we do not blow the 90s budget.
    expect(selectReasoningEffort("Research the capital of Japan")).toBe("high")
  })

  it("defaults to medium for ordinary questions", () => {
    expect(selectReasoningEffort("What is the capital of Japan?")).toBe(
      "medium"
    )
  })
})

describe("selectSearchContextSize", () => {
  it("maps effort bands onto web_search context budgets", () => {
    expect(selectSearchContextSize("minimal")).toBe("low")
    expect(selectSearchContextSize("low")).toBe("low")
    expect(selectSearchContextSize("medium")).toBe("medium")
    expect(selectSearchContextSize("high")).toBe("high")
    expect(selectSearchContextSize("xhigh")).toBe("high")
  })
})
