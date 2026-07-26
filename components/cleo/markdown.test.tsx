/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Markdown } from './markdown'

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
    'matchMedia',
    vi.fn(() => ({ matches: true }) as MediaQueryList),
  )
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 })
  vi.spyOn(HTMLImageElement.prototype, 'getBoundingClientRect').mockReturnValue({
    bottom: 300,
    height: 200,
    left: 100,
    right: 400,
    top: 100,
    width: 300,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Cleo Markdown topic photos', () => {
  it('renders curated topic photos as Gallery-style zoom triggers', () => {
    render(
      <Markdown>
        {
          'Japan is an archipelago.\n\n![Mount Fuji](/images/atlas/japan/w1280.jpg)\n\n- Capital: Tokyo'
        }
      </Markdown>,
    )

    expect(
      screen.getByRole('button', { name: 'Zoom image: Mount Fuji' }),
    ).toBeTruthy()
    expect(screen.getByAltText('Mount Fuji').getAttribute('src')).toBe(
      '/images/atlas/japan/w1280.jpg',
    )
  })

  it('opens the Gallery lightbox with Place/Country caption plate', () => {
    render(
      <Markdown>
        {'![Mount Fuji](/images/atlas/japan/w1280.jpg)'}
      </Markdown>,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Zoom image: Mount Fuji' }),
      { detail: 0 },
    )

    const dialog = screen.getByRole('dialog', { name: 'Mount Fuji' })
    expect(dialog.getAttribute('data-state')).toBe('open')
    expect(dialog.textContent).toContain('Place')
    expect(dialog.textContent).toContain('Mount Fuji')
    expect(dialog.textContent).toContain('Country')
    expect(dialog.textContent).toContain('Japan')
    expect(dialog.textContent).toContain('Photograph')
    expect(dialog.textContent).toContain('License')
  })

  it('drops non-curated Markdown images', () => {
    const { container } = render(
      <Markdown>{'Safe ![x](https://evil.example/x.jpg) text.'}</Markdown>,
    )
    expect(container.querySelector('img')).toBeNull()
    expect(
      screen.queryByRole('button', { name: /Zoom image/i }),
    ).toBeNull()
  })
})
