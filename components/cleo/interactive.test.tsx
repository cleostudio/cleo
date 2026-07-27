/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

afterEach(() => {
  cleanup()
})

describe('InteractiveBlock generative widgets', () => {
  it('switches tabs and renders same-site prose links', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'tabs',
          title: 'Japan at a glance',
          tabs: [
            {
              label: 'Geography',
              body: 'See the [Japan guide](/explore/japan).',
            },
            { label: 'Culture', body: 'Continuity and reinvention.' },
          ],
        }}
      />,
    )

    expect(
      screen.getByRole('link', { name: 'Japan guide' }).getAttribute('href'),
    ).toBe('/explore/japan')
    fireEvent.click(screen.getByRole('tab', { name: 'Culture' }))
    expect(screen.getByText('Continuity and reinvention.')).toBeTruthy()
  })

  it('walks through steps with continue/back controls', () => {
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

    expect(screen.getByText('Start with the shell.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    expect(screen.getByText('Infer the water below.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Back/i }))
    expect(screen.getByText('Start with the shell.')).toBeTruthy()
  })

  it('expands cards and surfaces guide links', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'cards',
          title: 'Nearby moons',
          cards: [
            {
              label: 'Io',
              summary: 'Volcanic world',
              detail: 'Tidal heating drives resurfacing.',
              href: '/space/io',
            },
            { label: 'Ganymede', summary: 'Largest moon' },
          ],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Io/i }))
    expect(screen.getByText('Tidal heating drives resurfacing.')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/io')
  })

  it('expands facts with optional guide hrefs', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'facts',
          items: [
            { label: 'Primary', value: 'Jupiter' },
            {
              label: 'Ocean',
              value: 'Under ice',
              detail: 'Kept liquid by tidal flexing.',
              href: '/space/europa',
            },
          ],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Ocean/i }))
    expect(screen.getByText('Kept liquid by tidal flexing.')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Open guide/i }).getAttribute('href'),
    ).toBe('/space/europa')
  })
})
