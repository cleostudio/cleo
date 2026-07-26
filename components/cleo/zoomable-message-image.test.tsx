/** @vitest-environment jsdom */

import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ZoomableMessageImage } from './zoomable-message-image'

vi.mock('next/image', () => ({
  default: ({
    loader: _loader,
    unoptimized: _unoptimized,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    loader?: unknown
    unoptimized?: boolean
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))

vi.mock('~/lib/locale-client', () => ({
  localize: (_locale: string, _zh: string, en: string) => en,
  useLocale: () => 'en',
}))

beforeEach(() => {
  vi.stubGlobal(
    'Image',
    class {
      decoding = 'async'
      naturalWidth = 800
      naturalHeight = 600
      onload: ((this: this, ev: Event) => unknown) | null = null
      onerror: ((this: this, ev: Event) => unknown) | null = null
      set src(_value: string) {
        queueMicrotask(() => {
          this.onload?.(new Event('load'))
        })
      }
    },
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('ZoomableMessageImage', () => {
  it('upgrades a data-URL image to a zoom trigger after sizing', async () => {
    render(
      <ZoomableMessageImage
        alt="Generated image 1"
        className="message-image message-image-assistant"
        src="data:image/png;base64,abc"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Zoom image: Generated image 1' }),
      ).toBeTruthy()
    })

    await act(async () => {
      await Promise.resolve()
    })
  })
})
