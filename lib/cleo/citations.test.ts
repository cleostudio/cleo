import { describe, expect, it } from "vitest"

import { applyUrlCitations, parseUrlCitation } from "./citations"

describe("parseUrlCitation", () => {
  it("accepts a well-formed url_citation annotation", () => {
    expect(
      parseUrlCitation({
        type: "url_citation",
        start_index: 10,
        end_index: 20,
        url: "https://example.com/a",
        title: "Example",
      })
    ).toEqual({
      type: "url_citation",
      start_index: 10,
      end_index: 20,
      url: "https://example.com/a",
      title: "Example",
    })
  })

  it("rejects unsafe or incomplete annotations", () => {
    expect(parseUrlCitation(null)).toBeNull()
    expect(
      parseUrlCitation({
        type: "url_citation",
        start_index: 0,
        end_index: 4,
        url: "javascript:alert(1)",
        title: "nope",
      })
    ).toBeNull()
    expect(
      parseUrlCitation({
        type: "file_citation",
        start_index: 0,
        end_index: 4,
        url: "https://example.com",
        title: "file",
      })
    ).toBeNull()
  })
})

describe("applyUrlCitations", () => {
  it("wraps bare cited spans as Markdown links", () => {
    const text = "Paris is the capital of France."
    const next = applyUrlCitations(text, [
      {
        type: "url_citation",
        start_index: 0,
        end_index: 5,
        url: "https://example.com/paris",
        title: "Paris",
      },
    ])

    expect(next).toBe("[Paris](https://example.com/paris) is the capital of France.")
  })

  it("leaves already-linked spans alone", () => {
    const text = "See [Paris](https://example.com/paris) for more."
    expect(
      applyUrlCitations(text, [
        {
          type: "url_citation",
          start_index: 4,
          end_index: 38,
          url: "https://example.com/paris",
          title: "Paris",
        },
      ])
    ).toBe(text)
  })

  it("applies multiple citations from right to left", () => {
    const text = "Mars and Earth differ."
    const next = applyUrlCitations(text, [
      {
        type: "url_citation",
        start_index: 0,
        end_index: 4,
        url: "https://example.com/mars",
        title: "Mars",
      },
      {
        type: "url_citation",
        start_index: 9,
        end_index: 14,
        url: "https://example.com/earth",
        title: "Earth",
      },
    ])

    expect(next).toBe(
      "[Mars](https://example.com/mars) and [Earth](https://example.com/earth) differ."
    )
  })
})
