/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

afterEach(() => {
  cleanup()
})

import {
  AskCleoCompareLink,
  AskCleoEssayLink,
  AskCleoFactsLink,
  AskCleoFeatureLink,
  AskCleoGalleryItemLink,
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

  it('uses compact topic= URLs when a slug is provided', () => {
    render(
      <AskCleoGuideLink collection="explore" name="Japan" slug="japan" />,
    )

    const href =
      screen.getByRole('link', { name: /Ask Cleo about Japan/i }).getAttribute(
        'href',
      ) ?? ''
    expect(href).toContain('topic=explore%2Fjapan')
    expect(href).not.toContain('q=')
  })

  it('supports a compact visible label while keeping the aria-label', () => {
    render(
      <AskCleoGuideLink
        collection="explore"
        name="Japan"
        slug="japan"
        label="Ask Cleo →"
      />,
    )

    const link = screen.getByRole('link', { name: /Ask Cleo about Japan/i })
    expect(link.textContent).toBe('Ask Cleo →')
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

describe('AskCleoFeatureLink', () => {
  it('links a Space feature into Cleo', () => {
    render(
      <AskCleoFeatureLink featureName="Olympus Mons" subjectName="Mars" />,
    )

    const link = screen.getByRole('link', {
      name: /Ask Cleo about Olympus Mons/i,
    })
    const q =
      new URL(link.getAttribute('href') ?? '', 'https://cleo.example')
        .searchParams.get('q') ?? ''
    expect(q).toContain('Olympus Mons')
    expect(q).toContain('Mars')
  })
})

describe('AskCleoCompareLink', () => {
  it('links a compare prompt into Cleo', () => {
    render(
      <AskCleoCompareLink
        collection="space"
        leftName="Mars"
        rightName="Earth"
      />,
    )

    expect(
      screen
        .getByRole('link', { name: /Ask Cleo to compare Mars and Earth/i })
        .getAttribute('href'),
    ).toContain('/cleo?')
  })

  it('supports a compact visible label', () => {
    render(
      <AskCleoCompareLink
        collection="space"
        leftName="Mars"
        rightName="Earth"
        label="Ask Cleo to compare →"
      />,
    )

    const link = screen.getByRole('link', {
      name: /Ask Cleo to compare Mars and Earth/i,
    })
    expect(link.textContent).toBe('Ask Cleo to compare →')
  })
})

describe('AskCleoFactsLink', () => {
  it('links a fact-plate prompt into Cleo', () => {
    render(<AskCleoFactsLink collection="explore" name="Japan" />)

    const link = screen.getByRole('link', {
      name: /Ask Cleo about the fact plate for Japan/i,
    })
    const q =
      new URL(link.getAttribute('href') ?? '', 'https://cleo.example')
        .searchParams.get('q') ?? ''
    expect(q).toMatch(/fact plate for Japan/)
    expect(link.textContent).toMatch(/Ask Cleo about the fact plate/)
  })
})

describe('AskCleoEssayLink', () => {
  it('links a Writing essay into Cleo via compact topic=', () => {
    render(
      <AskCleoEssayLink title="Pale Blue Marble" slug="pale-blue-marble" />,
    )

    const link = screen.getByRole('link', {
      name: /Ask Cleo about “Pale Blue Marble”/i,
    })
    expect(link.getAttribute('href')).toContain(
      'topic=writing%2Fpale-blue-marble',
    )
    expect(link.getAttribute('href')).not.toContain('q=')
    expect(link.textContent).toMatch(/Ask Cleo about this essay/)
  })

  it('supports a compact related-post label', () => {
    render(
      <AskCleoEssayLink
        title="Pale Blue Marble"
        slug="pale-blue-marble"
        label="Ask Cleo →"
      />,
    )

    const link = screen.getByRole('link', {
      name: /Ask Cleo about “Pale Blue Marble”/i,
    })
    expect(link.textContent).toBe('Ask Cleo →')
  })
})

describe('AskCleoGalleryItemLink', () => {
  it('links a Gallery photograph into Cleo with a descriptive aria-label', () => {
    render(
      <AskCleoGalleryItemLink
        title="Mount Fuji"
        subjectName="Japan"
        collection="places"
      />,
    )

    const link = screen.getByRole('link', {
      name: /Ask Cleo about Mount Fuji \(Japan\)/i,
    })
    expect(link.getAttribute('href')).toContain('/cleo?')
    expect(link.textContent).toMatch(/Ask Cleo →/)
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
