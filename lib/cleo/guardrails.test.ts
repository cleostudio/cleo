import { describe, expect, it } from "vitest"

import { hasInventedPortalPaths, sanitizePortalMarkdown } from "./guardrails"

describe("portal markdown guardrails", () => {
  it("keeps real guide links and curated photos", () => {
    const markdown =
      "See [Japan](/explore/japan), ![Mount Fuji](/images/atlas/japan/w1280.jpg), and ![Second view](/images/atlas/japan/w1280-2.jpg)."

    expect(sanitizePortalMarkdown(markdown)).toBe(markdown)
    expect(hasInventedPortalPaths(markdown)).toBe(false)
  })

  it("keeps real Cities guide links and curated city photos", () => {
    const markdown =
      "See [Istanbul](/cities/istanbul) and ![Hagia Sophia](/images/cities/istanbul/w1280.jpg)."

    expect(sanitizePortalMarkdown(markdown)).toBe(markdown)
    expect(hasInventedPortalPaths(markdown)).toBe(false)
  })

  it("strips invented Cities guide links", () => {
    const markdown = "Visit [El Dorado](/cities/el-dorado) sometime."

    expect(sanitizePortalMarkdown(markdown)).toBe("Visit El Dorado sometime.")
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })

  it("strips invented guide links to plain labels", () => {
    const markdown = "Visit [Atlantis](/explore/atlantis) sometime."

    expect(sanitizePortalMarkdown(markdown)).toBe("Visit Atlantis sometime.")
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })

  it("strips invented guide links that carry Markdown titles", () => {
    const markdown =
      'See [Atlantis](/explore/atlantis "Lost city") and [Mars](/space/mars "Planet").'

    expect(sanitizePortalMarkdown(markdown)).toBe(
      "See Atlantis and [Mars](/space/mars).",
    )
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })

  it("strips invented angle-bracket destinations", () => {
    const markdown = "See [Atlantis](</explore/atlantis>) next."

    expect(sanitizePortalMarkdown(markdown)).toBe("See Atlantis next.")
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })

  it("strips invented reference-style guide links", () => {
    const markdown = [
      "Read [Atlantis][lost] and [Japan][jp].",
      "",
      "[lost]: /explore/atlantis \"Myth\"",
      "[jp]: /explore/japan",
    ].join("\n")

    expect(sanitizePortalMarkdown(markdown)).toBe(
      ["Read Atlantis and [Japan][jp].", "", "[jp]: /explore/japan"].join("\n"),
    )
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })

  it("drops invented curated image paths", () => {
    const markdown =
      "Photo: ![Fake](/images/atlas/not-a-country/w1280.jpg) done."

    expect(sanitizePortalMarkdown(markdown)).toBe("Photo: Fake done.")
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })

  it("drops rendition-shaped paths that are not shipped", () => {
    const markdown = "Photo: ![Missing](/images/space/sun/w2048.jpg) done."

    expect(sanitizePortalMarkdown(markdown)).toBe("Photo: Missing done.")
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })
})
