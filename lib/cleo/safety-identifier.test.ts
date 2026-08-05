import { describe, expect, it } from "vitest"

import { cleoSafetyIdentifier } from "./safety-identifier"

describe("cleoSafetyIdentifier", () => {
  it("hashes seeds into a stable hex digest", () => {
    const a = cleoSafetyIdentifier("user:abc")
    const b = cleoSafetyIdentifier("user:abc")
    const c = cleoSafetyIdentifier("guest:1.2.3.4")

    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(a).toMatch(/^[a-f0-9]{64}$/)
    expect(a).not.toContain("user:abc")
  })

  it("treats blank seeds as anonymous", () => {
    expect(cleoSafetyIdentifier("")).toBe(cleoSafetyIdentifier("anonymous"))
    expect(cleoSafetyIdentifier("   ")).toBe(cleoSafetyIdentifier("anonymous"))
  })
})
