/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  AskCleoEssayLink,
  AskCleoGuideLink,
  AskCleoPlaceLink,
  AskCleoSurfaceLink,
} from '~/components/ask-cleo-link'

describe('AskCleoGuideLink', () => {
  it('links into /cleo with an auto-submit orientation prompt', () => {
    render(<AskCleoGuideLink collection="explore" name="Japan" />)

    const link = screen.getByRole('link', { name: /Ask Cleo about Japan/i })
    const href = link.getAttribute('href') ?? ''
    expect(href.startsWith('/cleo?')).toBe(true)
    expect(href).toContain('q=')
    expect(href).toContain('auto=1')
    expect(decodeURIComponent(href)).toContain('Japan')
  })
})

describe('AskCleoPlaceLink', () => {
  it('links a notable place into Cleo', () => {
    render(
      <AskCleoPlaceLink placeName="Mount Fuji" countryName="Japan" />,
    )

    const link = screen.getByRole('link', { name: /Ask Cleo about Mount Fuji/i })
    const href = link.getAttribute('href') ?? ''
    const q = new URL(href, 'https://cleo.example').searchParams.get('q') ?? ''
    expect(q).toContain('Mount Fuji')
  })
})

describe('AskCleoEssayLink', () => {
  it('links a Writing essay into Cleo', () => {
    render(
      <AskCleoEssayLink title="Pale Blue Marble" slug="pale-blue-marble" />,
    )

    const link = screen.getByRole('link', {
      name: /Ask Cleo about this essay/i,
    })
    expect(decodeURIComponent(link.getAttribute('href') ?? '')).toContain(
      '/blog/pale-blue-marble',
    )
  })
})

describe('AskCleoSurfaceLink', () => {
  it('links Topics and Writing into Cleo tour prompts', () => {
    const { rerender } = render(<AskCleoSurfaceLink surface="topics" />)
    expect(
      screen
        .getByRole('link', { name: /Ask Cleo for a Topics tour/i })
        .getAttribute('href'),
    ).toContain('/cleo?')

    rerender(<AskCleoSurfaceLink surface="writing" />)
    expect(
      screen
        .getByRole('link', { name: /Ask Cleo to pick an essay/i })
        .getAttribute('href'),
    ).toContain('/cleo?')
  })
})
