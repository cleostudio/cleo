/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InteractiveBlock } from './interactive'

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
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('InteractiveBlock generative widgets', () => {
  it('walks through steps with a progress bar', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'steps',
          title: 'How to read Europa',
          steps: [
            { title: 'Ice', body: 'Start with the shell.' },
            { title: 'Ocean', body: 'Infer the water below.' },
          ],
        }}
      />,
    )

    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '50',
    )
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    expect(screen.getByText('Infer the water below.')).toBeTruthy()
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '100',
    )
  })

  it('shows a focused compare subject panel', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'compare',
          title: 'Mars vs Earth',
          columns: ['Mars', 'Earth'],
          rows: [{ label: 'Moons', values: ['2', '1'] }],
        }}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Mars' }).getAttribute('aria-pressed'),
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Earth' }))
    expect(
      document.querySelector('.cleo-widget-compare-focus-label')?.textContent,
    ).toBe('Earth')
    expect(
      document.querySelector('.cleo-widget-compare-focus-row dd')?.textContent,
    ).toBe('1')
  })

  it('renders a gallery with selectable photographs', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'gallery',
          title: 'Places',
          items: [
            {
              src: '/images/atlas/japan/w1280.jpg',
              caption: 'Mount Fuji',
              href: '/explore/japan',
            },
            {
              src: '/images/space/mars/w1280.jpg',
              caption: 'Mars',
              href: '/space/mars',
            },
          ],
        }}
      />,
    )

    expect(
      document.querySelector('.cleo-widget-gallery-caption')?.textContent,
    ).toBe('Mount Fuji')
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/explore/japan')

    fireEvent.click(screen.getByRole('option', { name: 'Mars' }))
    expect(
      document.querySelector('.cleo-widget-gallery-caption')?.textContent,
    ).toBe('Mars')
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/mars')
  })

  it('expands all facts when available', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'facts',
          title: 'Europa',
          items: [
            { label: 'A', value: '1', detail: 'Detail A' },
            { label: 'B', value: '2', detail: 'Detail B' },
            { label: 'C', value: '3', detail: 'Detail C' },
          ],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
    expect(screen.getByText('Detail A')).toBeTruthy()
    expect(screen.getByText('Detail B')).toBeTruthy()
    expect(screen.getByText('Detail C')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))
    expect(screen.queryByText('Detail A')).toBeNull()
  })
})
