/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest"

import { imageFilesFromDataTransfer } from "./client-images"

function fakeFile(name: string, type: string) {
  return new File(["x"], name, { type })
}

describe("imageFilesFromDataTransfer", () => {
  it("returns an empty list when DataTransfer is missing", () => {
    expect(imageFilesFromDataTransfer(null)).toEqual([])
    expect(imageFilesFromDataTransfer(undefined)).toEqual([])
  })

  it("collects image files from clipboard items", () => {
    const png = fakeFile("a.png", "image/png")
    const txt = fakeFile("note.txt", "text/plain")
    const data = {
      items: [
        {
          kind: "file",
          type: "image/png",
          getAsFile: () => png,
        },
        {
          kind: "string",
          type: "text/plain",
          getAsFile: () => null,
        },
        {
          kind: "file",
          type: "text/plain",
          getAsFile: () => txt,
        },
      ],
      files: [] as File[],
    } as unknown as DataTransfer

    expect(imageFilesFromDataTransfer(data)).toEqual([png])
  })

  it("falls back to files for drag-and-drop", () => {
    const jpeg = fakeFile("b.jpg", "image/jpeg")
    const pdf = fakeFile("c.pdf", "application/pdf")
    const data = {
      items: [] as unknown as DataTransferItemList,
      files: [jpeg, pdf],
    } as unknown as DataTransfer

    expect(imageFilesFromDataTransfer(data)).toEqual([jpeg])
  })
})
