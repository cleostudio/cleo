import type { Metadata } from 'next'
import { describe, expect, it } from 'vitest'

import { localeMetadata } from './locale-metadata'
import { publicPageMetadata } from './public-page-metadata'

function imageAlt(metadata: Metadata) {
  const images = metadata.openGraph?.images
  const image = Array.isArray(images) ? images[0] : images
  return typeof image === 'object' && image && 'alt' in image ? image.alt : undefined
}

function metadataFor(path: string, title: string, description: string) {
  return localeMetadata({ locale: 'en', path, title, description })
}

describe('social OG image metadata', () => {
  it('does not repeat Cali’s name in the homepage artwork description', () => {
    const home = publicPageMetadata.home

    expect(imageAlt(metadataFor('/', home.title, home.description))).toBe(
      'Cali Castle. Design Engineer. Agent Orchestrator. Creative Director.',
    )
  })

  it.each([
    [
      '/blog',
      publicPageMetadata.blog,
      'Writing · Cali Castle. Essays by Cali about design, engineering, products, and the people and ideas that matter along the way.',
    ],
    [
      '/photos',
      publicPageMetadata.photos,
      'Photos · Cali Castle. Moments Cali has kept from work, life, and everywhere in between.',
    ],
    [
      '/projects',
      publicPageMetadata.projects,
      'Projects · Cali Castle. Products, open-source tools, and small experiments I have made over the years. Some useful, some playful, all made with care.',
    ],
    [
      '/cleo',
      publicPageMetadata.cleo,
      'Cleo · Cali Castle. Cali’s general-purpose AI agent — chat, search the web, read images, and generate them.',
    ],
  ] as const)('describes the %s artwork with its own content', (path, copy, expected) => {
    expect(imageAlt(metadataFor(path, copy.title, copy.description))).toBe(expected)
  })

  it('describes article and newsletter artwork with the title', () => {
    expect(
      imageAlt(
        metadataFor(
          '/blog/do-buttons-need-pointer-cursors',
          'Do buttons need pointer cursors?',
          'Article summary',
        ),
      ),
    ).toBe('Do buttons need pointer cursors? · Cali Castle')
    expect(
      imageAlt(
        metadataFor(
          '/newsletters/1',
          'Cali.so Monthly Update Newsletter 01',
          'Archive summary',
        ),
      ),
    ).toBe('Cali.so Monthly Update Newsletter 01 · Cali Castle')
  })
})
