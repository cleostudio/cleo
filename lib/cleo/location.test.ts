import { describe, expect, it } from "vitest"

import {
  buildUserLocationInstructions,
  buildWebSearchUserLocation,
  parseUserLocation,
} from "./location"

const validLocation = {
  accuracy: 12.4,
  latitude: 37.7749,
  longitude: -122.4194,
  timeZone: "America/Los_Angeles",
}

describe("parseUserLocation", () => {
  it("accepts a browser-shaped high-accuracy location", () => {
    expect(parseUserLocation(validLocation)).toEqual({
      accuracy: 12.4,
      latitude: 37.7749,
      longitude: -122.4194,
      timeZone: "America/Los_Angeles",
    })
  })

  it("rejects incomplete or invalid values", () => {
    expect(parseUserLocation(null)).toBeNull()
    expect(
      parseUserLocation({ ...validLocation, timeZone: "Not/A_Zone" })
    ).toBeNull()
    expect(
      parseUserLocation({ ...validLocation, latitude: Number.NaN })
    ).toBeNull()
  })
})

describe("buildWebSearchUserLocation", () => {
  it("passes only approximate timezone to hosted web_search", () => {
    expect(buildWebSearchUserLocation(validLocation)).toEqual({
      type: "approximate",
      timezone: "America/Los_Angeles",
    })
  })
})

describe("buildUserLocationInstructions", () => {
  it("keeps coordinates in private developer context", () => {
    const block = buildUserLocationInstructions(validLocation)

    expect(block).toContain("<cleo_user_location>")
    expect(block).toContain("Latitude: 37.77490")
    expect(block).toContain("Longitude: -122.41940")
    expect(block).toContain("never volunteer it")
  })
})
