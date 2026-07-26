import { describe, expect, it } from 'vitest'

import {
  COMPARE_GUIDES_TOOL_NAME,
  executePortalTool,
  LIST_GUIDES_TOOL_NAME,
  LOOKUP_GUIDE_TOOL_NAME,
  SEARCH_GALLERY_TOOL_NAME,
} from './portal-tools'

describe('executePortalTool', () => {
  it('looks up an Explore guide by slug', () => {
    const result = JSON.parse(
      executePortalTool(
        LOOKUP_GUIDE_TOOL_NAME,
        JSON.stringify({
          collection: 'explore',
          slug: 'japan',
          name: null,
        }),
      ),
    ) as {
      ok: boolean
      guide?: { href: string; photo?: { galleryHref: string } }
    }

    expect(result.ok).toBe(true)
    expect(result.guide?.href).toBe('/explore/japan')
    expect(result.guide?.photo?.galleryHref).toBe('/gallery?q=Japan')
  })

  it('searches gallery photographs', () => {
    const result = JSON.parse(
      executePortalTool(
        SEARCH_GALLERY_TOOL_NAME,
        JSON.stringify({ query: 'Europa', limit: 3 }),
      ),
    ) as {
      ok: boolean
      count: number
      results: { subtitle: string; galleryHref: string }[]
    }

    expect(result.ok).toBe(true)
    expect(result.count).toBeGreaterThan(0)
    expect(result.results[0]?.subtitle).toMatch(/Europa/i)
    expect(result.results[0]?.galleryHref).toContain('/gallery?q=')
  })

  it('returns a structured miss for unknown guides', () => {
    const result = JSON.parse(
      executePortalTool(
        LOOKUP_GUIDE_TOOL_NAME,
        JSON.stringify({
          collection: 'explore',
          slug: 'not-a-real-place',
          name: null,
        }),
      ),
    ) as { ok: boolean }

    expect(result.ok).toBe(false)
  })

  it('lists Explore guides by region', () => {
    const result = JSON.parse(
      executePortalTool(
        LIST_GUIDES_TOOL_NAME,
        JSON.stringify({
          collection: 'explore',
          group: 'Asia',
          query: 'japan',
          limit: 5,
        }),
      ),
    ) as {
      ok: boolean
      results: { href: string; name: string }[]
    }

    expect(result.ok).toBe(true)
    expect(result.results.some((guide) => guide.href === '/explore/japan')).toBe(
      true,
    )
  })

  it('compares Earth and Mars side by side', () => {
    const result = JSON.parse(
      executePortalTool(
        COMPARE_GUIDES_TOOL_NAME,
        JSON.stringify({
          left: { collection: 'space', slug: 'earth', name: 'Earth' },
          right: { collection: 'space', slug: 'mars', name: 'Mars' },
        }),
      ),
    ) as {
      ok: boolean
      left?: { href: string; name: string }
      right?: { href: string; name: string }
    }

    expect(result.ok).toBe(true)
    expect(result.left?.href).toBe('/space/earth')
    expect(result.right?.name).toBe('Mars')
  })
})
