/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

afterEach(() => {
  cleanup()
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
