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
        alt="Attached image 1"
        className="message-image"
        src="data:image/png;base64,abc"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Zoom image: Attached image 1' }),
      ).toBeTruthy()
    })

    await act(async () => {
      await Promise.resolve()
    })
  })

  it('resets measured size when the image src changes', async () => {
    const { rerender } = render(
      <ZoomableMessageImage
        alt="Attached image 1"
        src="data:image/jpeg;base64,partial"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Zoom image: Attached image 1' }),
      ).toBeTruthy()
    })

    rerender(
      <ZoomableMessageImage
        alt="Attached image 1"
        src="data:image/jpeg;base64,final"
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Zoom image: Attached image 1' }),
    ).toBeNull()
    expect(screen.getByAltText('Attached image 1').getAttribute('src')).toBe(
      'data:image/jpeg;base64,final',
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Zoom image: Attached image 1' }),
      ).toBeTruthy()
    })
  })
})
