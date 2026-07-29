import { describe, expect, it } from "vitest"

import {
  incompleteReasonFromApi,
  incompleteStatusMessage,
  parseStreamLine,
} from "./stream"

describe("incomplete status helpers", () => {
  it("maps API and stopped reasons", () => {
    expect(incompleteReasonFromApi("max_output_tokens")).toBe(
      "max_output_tokens"
    )
    expect(incompleteReasonFromApi("stopped")).toBe("stopped")
    expect(incompleteReasonFromApi("mystery")).toBe("other")
    expect(incompleteStatusMessage("stopped")).toBe(
      "Stopped before finishing."
    )
  })

  it("parses status incomplete events including stopped", () => {
    expect(
      parseStreamLine(
        JSON.stringify({
          type: "status",
          status: "incomplete",
          reason: "stopped",
          message: "Stopped before finishing.",
        })
      )
    ).toEqual({
      type: "status",
      status: "incomplete",
      reason: "stopped",
      message: "Stopped before finishing.",
    })
  })

  it("parses reasoning_items events", () => {
    expect(
      parseStreamLine(
        JSON.stringify({
          type: "reasoning_items",
          items: [
            {
              type: "reasoning",
              id: "rs_1",
              encrypted_content: "enc",
            },
          ],
        })
      )
    ).toEqual({
      type: "reasoning_items",
      items: [
        {
          type: "reasoning",
          id: "rs_1",
          encrypted_content: "enc",
        },
      ],
    })
  })
})
