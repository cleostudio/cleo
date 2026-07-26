/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest'

import { copyTextToClipboard } from './clipboard'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('copyTextToClipboard', () => {
  it('uses the Clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    await expect(copyTextToClipboard('https://example.com/maps?c=japan')).resolves.toBe(
      true,
    )
    expect(writeText).toHaveBeenCalledWith('https://example.com/maps?c=japan')
  })

  it('falls back to execCommand when Clipboard API fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('denied')),
      },
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    })

    await expect(copyTextToClipboard('maps-link')).resolves.toBe(true)
    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })
})
