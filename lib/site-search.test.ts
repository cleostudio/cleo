import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import { loadMapCountryIndex } from './maps-index'
import { spaceSubjects } from './space'
import { buildSiteSearchHits } from './site-search-catalog'
import { filterSiteSearchHits } from './site-search'
import { allTopics } from './topics'

describe('site search catalog', () => {
  const hits = buildSiteSearchHits()
  const mapIndex = loadMapCountryIndex()
  const territoryCount = mapIndex.countries.filter((entry) => !entry.slug).length

  it('indexes topic collections, country guides, Maps deep links, space guides, and portal surfaces', () => {
    const kinds = new Set(hits.map((hit) => hit.kind))
    expect(kinds).toEqual(
      new Set(['topic', 'explore', 'maps', 'space', 'surface']),
    )

    expect(hits.filter((hit) => hit.kind === 'explore')).toHaveLength(countries.length)
    expect(hits.filter((hit) => hit.kind === 'maps')).toHaveLength(
      countries.length + 5 + territoryCount,
    )
    expect(hits.filter((hit) => hit.kind === 'space')).toHaveLength(spaceSubjects.length)
    expect(hits.filter((hit) => hit.kind === 'topic')).toHaveLength(allTopics().length)
    expect(hits.some((hit) => hit.href === '/maps')).toBe(true)
    expect(hits.some((hit) => hit.href === '/maps?region=africa')).toBe(true)
    expect(hits.some((hit) => hit.href === '/maps?country=hk')).toBe(true)
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
    const japan = filterSiteSearchHits(hits, 'japan')
    expect(japan[0]).toMatchObject({
      href: '/explore/japan',
      kind: 'explore',
    })
    expect(japan.some((hit) => hit.href === '/maps?country=japan')).toBe(true)
    expect(filterSiteSearchHits(hits, 'jp')[0]?.href).toBe('/explore/japan')
    expect(filterSiteSearchHits(hits, 'western europe').some((hit) => hit.kind === 'explore')).toBe(
      true,
    )
  })

  it('ranks Explore guides ahead of Maps deep links for the same country', () => {
    const japan = filterSiteSearchHits(hits, 'japan')
    const exploreIndex = japan.findIndex((hit) => hit.kind === 'explore')
    const mapsIndex = japan.findIndex((hit) => hit.kind === 'maps')
    expect(exploreIndex).toBeGreaterThanOrEqual(0)
    expect(mapsIndex).toBeGreaterThan(exploreIndex)
  })

  it('finds continent cameras on Maps', () => {
    expect(filterSiteSearchHits(hits, 'oceania')[0]).toMatchObject({
      kind: 'maps',
      href: '/maps?region=oceania',
    })
  })

  it('finds no-guide territories on Maps by name and capital', () => {
    expect(filterSiteSearchHits(hits, 'hong kong')[0]).toMatchObject({
      kind: 'maps',
      href: '/maps?country=hk',
    })
    expect(
      filterSiteSearchHits(hits, 'nuuk').some(
        (hit) => hit.href === '/maps?country=gl',
      ),
    ).toBe(true)
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
