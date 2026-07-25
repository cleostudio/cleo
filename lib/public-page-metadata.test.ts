import { describe, expect, it } from 'vitest'

import { publicPageMetadata } from './public-page-metadata'

describe('public page metadata copy', () => {
  it('uses a timeless homepage title and OG description', () => {
    expect(publicPageMetadata.home).toEqual({
      title: 'Cleo',
      description: 'Design Engineer. Agent Orchestrator. Creative Director.',
      ogDescription: 'Design Engineer. Agent Orchestrator. Creative Director.',
    })
  })

  it('keeps each public section content-specific', () => {
    expect(publicPageMetadata.blog).toEqual({
      title: 'Writing',
      description:
        'Essays by Cleo about design, engineering, products, and the people and ideas that matter along the way.',
    })
    expect(publicPageMetadata.photos).toEqual({
      title: 'Photos',
      description:
        'Country atlas — one curated place photograph for every country, filterable by region.',
    })
    expect(publicPageMetadata.projects).toEqual({
      title: 'Projects',
      description:
        'Products, open-source tools, and small experiments I have made over the years. Some useful, some playful, all made with care.',
    })
    expect(publicPageMetadata.explore).toEqual({
      title: 'Explore',
      description:
        'Evergreen field guides for every country — orientation, three places, facts, and a photograph.',
    })
    expect(publicPageMetadata.cleo).toEqual({
      title: 'Cleo',
      description:
        'A general-purpose AI agent — chat, search the web, read images, and generate them.',
    })
  })

  it('keeps section descriptions within social preview budgets', () => {
    for (const section of ['blog', 'photos', 'projects', 'explore', 'cleo'] as const) {
      expect(publicPageMetadata[section].description.length, section).toBeLessThanOrEqual(160)
    }
  })
})
