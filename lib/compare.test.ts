import { describe, expect, it } from 'vitest'

import {
  compareHref,
  formatCompareRef,
  isComparableSpaceSubject,
  parseCompareRef,
  resolveComparePair,
} from './compare'
import { getSpaceSubject } from './space'

describe('compare refs', () => {
  it('parses namespaced refs and unambiguous bare slugs', () => {
    expect(parseCompareRef('explore:japan')).toEqual({
      collection: 'explore',
      slug: 'japan',
    })
    expect(parseCompareRef('space:mars')).toEqual({
      collection: 'space',
      slug: 'mars',
    })
    expect(parseCompareRef('japan')).toEqual({
      collection: 'explore',
      slug: 'japan',
    })
    expect(parseCompareRef('mars')).toEqual({
      collection: 'space',
      slug: 'mars',
    })
    expect(parseCompareRef('not-a-subject')).toBeNull()
  })

  it('builds shareable compare URLs', () => {
    expect(
      compareHref(
        { collection: 'explore', slug: 'japan' },
        { collection: 'explore', slug: 'france' },
      ),
    ).toBe('/compare?a=explore%3Ajapan&b=explore%3Afrance')
    expect(formatCompareRef({ collection: 'space', slug: 'earth' })).toBe(
      'space:earth',
    )
  })
})

describe('resolveComparePair', () => {
  it('builds country fact rows', () => {
    const result = resolveComparePair('explore:japan', 'explore:france')
    expect(result.status).toBe('ready')
    if (result.status !== 'ready') return
    expect(result.pair.kind).toBe('explore')
    expect(result.pair.rows.map((row) => row.label)).toEqual([
      'Capital',
      'Languages',
      'Currency',
      'Area',
      'Region',
      'ISO 3166-1',
    ])
    expect(result.pair.rows[0]?.a).toBeTruthy()
    expect(result.pair.rows[0]?.b).toBeTruthy()
  })

  it('builds planet fact rows and rejects non-planet space pairs', () => {
    const planets = resolveComparePair('space:earth', 'space:mars')
    expect(planets.status).toBe('ready')
    if (planets.status === 'ready') {
      expect(planets.pair.kind).toBe('space')
      expect(planets.pair.rows.some((row) => row.label === 'Mean distance')).toBe(
        true,
      )
    }

    const moons = resolveComparePair('space:europa', 'space:titan')
    expect(moons.status).toBe('unsupported')

    const europa = getSpaceSubject('europa')
    expect(europa && isComparableSpaceSubject(europa)).toBe(false)
  })

  it('rejects mixed collections and unknown refs', () => {
    expect(resolveComparePair('explore:japan', 'space:mars').status).toBe('mixed')
    expect(resolveComparePair('explore:not-real', 'explore:japan').status).toBe(
      'unknown',
    )
    expect(resolveComparePair(undefined, undefined).status).toBe('empty')
    expect(resolveComparePair('explore:japan', undefined).status).toBe(
      'incomplete',
    )
  })
})
