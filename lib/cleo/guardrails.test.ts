import { describe, expect, it } from "vitest"

import { hasInventedPortalPaths, sanitizePortalMarkdown } from "./guardrails"

describe("portal markdown guardrails", () => {
  it("keeps real guide links and curated photos", () => {
    const markdown =
      "See [Japan](/explore/japan), ![Mount Fuji](/images/atlas/japan/w1280.jpg), and ![Second view](/images/atlas/japan/w1280-2.jpg)."

    expect(sanitizePortalMarkdown(markdown)).toBe(markdown)
    expect(hasInventedPortalPaths(markdown)).toBe(false)
  })

  it("strips invented guide links to plain labels", () => {
    const markdown = "Visit [Atlantis](/explore/atlantis) sometime."

    expect(sanitizePortalMarkdown(markdown)).toBe("Visit Atlantis sometime.")
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })

  it("drops invented curated image paths", () => {
    const markdown =
      "Photo: ![Fake](/images/atlas/not-a-country/w1280.jpg) done."

    expect(sanitizePortalMarkdown(markdown)).toBe("Photo: Fake done.")
    expect(hasInventedPortalPaths(markdown)).toBe(true)
  })
})
