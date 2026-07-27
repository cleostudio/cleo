/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Markdown } from './markdown'

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

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

describe('Cleo Markdown generative widgets', () => {
  it('renders tabs widgets inside the reply', () => {
    const markdown = [
      'Japan is an archipelago.',
      '',
      '```cleo',
      JSON.stringify({
        type: 'tabs',
        title: 'Japan at a glance',
        tabs: [
          { label: 'Geography', body: 'Four main islands.' },
          { label: 'Culture', body: 'Continuity and reinvention.' },
        ],
      }),
      '```',
    ].join('\n')

    render(<Markdown>{markdown}</Markdown>)

    expect(screen.getByText('Japan is an archipelago.')).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Geography' })).toBeTruthy()
    expect(screen.getByText('Four main islands.')).toBeTruthy()
  })

  it('renders compare widgets as interactive tables', () => {
    const markdown = [
      '```cleo',
      JSON.stringify({
        type: 'compare',
        title: 'Mars vs Earth',
        columns: ['Mars', 'Earth'],
        rows: [{ label: 'Moons', values: ['2', '1'] }],
      }),
      '```',
    ].join('\n')

    render(<Markdown>{markdown}</Markdown>)

    expect(screen.getByRole('button', { name: 'Mars' })).toBeTruthy()
    expect(screen.getByRole('rowheader', { name: 'Moons' })).toBeTruthy()
    expect(screen.getByRole('cell', { name: '2' })).toBeTruthy()
  })

  it('shows a pending placeholder for incomplete cleo fences while streaming', () => {
    const { container } = render(
      <Markdown isAnimating>
        {'Prose first.\n\n```cleo\n{"type":"tabs","tabs":['}
      </Markdown>,
    )

    expect(container.textContent).toContain('Prose first.')
    expect(container.textContent).toContain('Building sections')
    expect(container.textContent).not.toContain('"type":"tabs"')
    expect(container.textContent).not.toContain('```')
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy()
  })
})
