/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  AskCleoCompareLink,
  AskCleoEssayLink,
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

describe('AskCleoGalleryItemLink', () => {
  it('links a Gallery photograph into Cleo', () => {
    render(
      <AskCleoGalleryItemLink
        title="Mount Fuji"
        subjectName="Japan"
        collection="places"
      />,
    )

    expect(
      screen.getByRole('link', { name: /^Ask Cleo →$/i }).getAttribute('href'),
    ).toContain('/cleo?')
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
