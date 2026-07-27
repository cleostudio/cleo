import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import { placeGuides } from './places'
import { spaceSubjects } from './space'
import { buildSiteSearchHits } from './site-search-catalog'
import { filterSiteSearchHits } from './site-search'
import { allTopics } from './topics'

describe('site search catalog', () => {
  const hits = buildSiteSearchHits()

  it('indexes topic collections, country guides, place guides, space guides, and portal surfaces', () => {
    const kinds = new Set(hits.map((hit) => hit.kind))
    expect(kinds).toEqual(new Set(['topic', 'explore', 'place', 'space', 'surface']))

    expect(hits.filter((hit) => hit.kind === 'explore')).toHaveLength(countries.length)
    expect(hits.filter((hit) => hit.kind === 'place')).toHaveLength(placeGuides.length)
    expect(hits.filter((hit) => hit.kind === 'space')).toHaveLength(spaceSubjects.length)
    expect(hits.filter((hit) => hit.kind === 'topic')).toHaveLength(allTopics().length)
    expect(hits.some((hit) => hit.href === '/gallery')).toBe(true)
    expect(hits.some((hit) => hit.href === '/cleo')).toBe(true)
    expect(hits.some((hit) => hit.href === '/blog')).toBe(true)
  })

  it('keeps hits lean for the client (no guide prose fields)', () => {
    for (const hit of hits) {
      expect(hit).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          kind: expect.any(String),
          title: expect.any(String),
          subtitle: expect.any(String),
          href: expect.any(String),
          searchText: expect.any(String),
        }),
      )
      expect(hit.searchText).toBe(hit.searchText.toLowerCase())
      expect(Object.keys(hit).sort()).toEqual([
        'href',
        'id',
        'kind',
        'searchText',
        'subtitle',
        'title',
      ])
    }
  })

  it('finds countries by name, code, and region', () => {
    expect(filterSiteSearchHits(hits, 'japan')[0]).toMatchObject({
      href: '/explore/japan',
      kind: 'explore',
    })
    expect(filterSiteSearchHits(hits, 'jp')[0]?.href).toBe('/explore/japan')
    expect(filterSiteSearchHits(hits, 'western europe').some((hit) => hit.kind === 'explore')).toBe(
      true,
    )
  })

  it('finds place guides by city and kind', () => {
    expect(filterSiteSearchHits(hits, 'paris')[0]).toMatchObject({
      href: '/explore/france/paris',
      kind: 'place',
    })
    expect(filterSiteSearchHits(hits, 'island').some((hit) => hit.kind === 'place')).toBe(
      true,
    )
  })

  it('finds space guides alongside countries', () => {
    const mars = filterSiteSearchHits(hits, 'mars')
    expect(mars[0]).toMatchObject({ href: '/space/mars', kind: 'space' })

    const moon = filterSiteSearchHits(hits, 'moon')
    expect(moon.some((hit) => hit.href === '/space/moon')).toBe(true)
  })

  it('ranks exact topic titles ahead of looser substring matches', () => {
    const space = filterSiteSearchHits(hits, 'space')
    expect(space[0]).toMatchObject({ kind: 'topic', title: 'Space', href: '/space' })
  })

  it('returns nothing for an empty query', () => {
    expect(filterSiteSearchHits(hits, '   ')).toEqual([])
  })
})
