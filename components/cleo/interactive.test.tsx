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
    expect(screen.getByText(/1 marked/i)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Complete step/i }))
    expect(screen.getByRole('button', { name: /^Complete$/i })).toBeTruthy()
  })

  it('shows a focused compare subject panel with guide href', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'compare',
          title: 'Mars vs Earth',
          columns: ['Mars', 'Earth'],
          hrefs: ['/space/mars', '/space/earth'],
          rows: [{ label: 'Moons', values: ['2', '1'] }],
        }}
      />,
    )

    expect(
      screen
        .getByRole('button', { name: 'Mars', pressed: true })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/mars')
    fireEvent.click(
      screen.getByRole('columnheader', { name: 'Earth' }).querySelector(
        'button',
      )!,
    )
    expect(
      document.querySelector('.cleo-widget-compare-focus-label')?.textContent,
    ).toBe('Earth')
    expect(
      document.querySelector('.cleo-widget-compare-focus-row dd')?.textContent,
    ).toBe('1')
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/earth')
  })

  it('renders a gallery with prev/next and selectable photographs', () => {
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
      document.querySelector('.cleo-widget-gallery-counter')?.textContent,
    ).toBe('1 / 2')
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/explore/japan')

    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    expect(
      document.querySelector('.cleo-widget-gallery-caption')?.textContent,
    ).toBe('Mars')
    expect(
      document.querySelector('.cleo-widget-gallery-counter')?.textContent,
    ).toBe('2 / 2')
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/mars')

    fireEvent.click(screen.getByRole('option', { name: 'Mount Fuji' }))
    expect(
      document.querySelector('.cleo-widget-gallery-caption')?.textContent,
    ).toBe('Mount Fuji')
  })

  it('rotates through a cycle and wraps', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'cycle',
          title: "Japan's seasons",
          stages: [
            { label: 'Spring', body: 'Blossoms open the year.' },
            { label: 'Summer', body: 'Humid heat.' },
            { label: 'Autumn', body: 'Clear skies.' },
          ],
        }}
      />,
    )

    expect(screen.getByText('Blossoms open the year.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    expect(screen.getByText('Humid heat.')).toBeTruthy()
    fireEvent.click(screen.getByRole('option', { name: /Autumn/i }))
    expect(screen.getByText('Clear skies.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    expect(screen.getByText('Blossoms open the year.')).toBeTruthy()
  })

  it('focuses cross-section layers', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'layers',
          title: 'Europa interior',
          layers: [
            {
              label: 'Ice shell',
              depth: '~20 km',
              body: 'Cracked icy crust.',
              href: '/space/europa',
            },
            { label: 'Ocean', body: 'Global salty ocean.' },
          ],
        }}
      />,
    )

    expect(screen.getByText('Cracked icy crust.')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/europa')
    fireEvent.click(screen.getByRole('option', { name: /Ocean/i }))
    expect(screen.getByText('Global salty ocean.')).toBeTruthy()
  })

  it('focuses scale bars and shows relative magnitude', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'scale',
          title: 'Mean diameter',
          unit: 'km',
          mode: 'log',
          items: [
            {
              label: 'Earth',
              value: 12742,
              note: 'Reference rocky world.',
              href: '/space/earth',
            },
            {
              label: 'Sun',
              value: 1_391_400,
              note: 'Orders larger.',
              href: '/space/sun',
            },
          ],
        }}
      />,
    )

    expect(screen.getByText('Log scale')).toBeTruthy()
    expect(screen.getByText(/largest/i)).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/earth')
    fireEvent.click(screen.getByRole('option', { name: /Sun/i }))
    expect(screen.getByText(/Orders larger/i)).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/sun')
  })

  it('walks a reading path and marks stops done', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'path',
          title: 'Read Japan',
          stops: [
            {
              title: 'Landscape',
              body: 'Start with islands.',
              href: '/explore/japan',
            },
            { title: 'Cities', body: 'Then dense continuity.' },
          ],
        }}
      />,
    )

    expect(screen.getByText('0 of 2 complete')).toBeTruthy()
    expect(screen.getByText('Start with islands.')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/explore/japan')
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    expect(screen.getByText('Then dense continuity.')).toBeTruthy()
    expect(screen.getByText('1 of 2 complete')).toBeTruthy()
  })

  it('expands all cards when available', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'cards',
          title: 'Moons',
          cards: [
            { label: 'Io', summary: 'Volcanic', detail: 'Detail Io' },
            { label: 'Europa', summary: 'Icy', detail: 'Detail Europa' },
            { label: 'Ganymede', summary: 'Largest', detail: 'Detail Ganymede' },
          ],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
    expect(screen.getByText('Detail Io')).toBeTruthy()
    expect(screen.getByText('Detail Europa')).toBeTruthy()
    expect(screen.getByText('Detail Ganymede')).toBeTruthy()
  })

  it('expands all facts and timeline details when available', () => {
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

    cleanup()

    render(
      <InteractiveBlock
        block={{
          type: 'timeline',
          title: 'Apollo',
          events: [
            { when: '1961', title: 'Goal', detail: 'Moon commitment' },
            { when: '1969', title: 'Landing', detail: 'Apollo 11' },
            { when: '1972', title: 'Last crew', detail: 'Apollo 17' },
          ],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
    expect(screen.getByText('Moon commitment')).toBeTruthy()
    expect(screen.getByText('Apollo 11')).toBeTruthy()
    expect(screen.getByText('Apollo 17')).toBeTruthy()
  })
})
