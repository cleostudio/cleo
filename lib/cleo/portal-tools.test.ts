import { describe, expect, it } from 'vitest'

import {
  executePortalTool,
  PORTAL_FUNCTION_TOOLS,
  portalToolActivityLabel,
} from './portal-tools'

describe('portal tools', () => {
  it('exposes strict function tools for guides, gallery, and writing', () => {
    expect(PORTAL_FUNCTION_TOOLS.map((tool) => tool.name)).toEqual([
      'search_portal_topics',
      'lookup_guide',
      'get_topic_photos',
      'search_gallery',
      'search_writing',
      'lookup_writing',
    ])
    for (const tool of PORTAL_FUNCTION_TOOLS) {
      expect(tool.type).toBe('function')
      expect(tool.strict).toBe(true)
    }
  })

  it('searches Explore and Space guides', () => {
    const payload = JSON.parse(
      executePortalTool(
        'search_portal_topics',
        JSON.stringify({ query: 'japan', limit: 6 }),
      ),
    ) as {
      count: number
      results: { href: string; name: string }[]
    }

    expect(payload.count).toBeGreaterThan(0)
    expect(payload.results.some((hit) => hit.href === '/explore/japan')).toBe(
      true,
    )
  })

  it('looks up a Space guide with embed paths', () => {
    const payload = JSON.parse(
      executePortalTool(
        'lookup_guide',
        JSON.stringify({ collection: 'space', slug: 'mars' }),
      ),
    ) as {
      found: boolean
      href: string
      markdownImage: string
      markdownLink: string
    }

    expect(payload.found).toBe(true)
    expect(payload.href).toBe('/space/mars')
    expect(payload.markdownLink).toBe('[Mars](/space/mars)')
    expect(payload.markdownImage).toContain('/images/space/mars/w1280.jpg')
  })

  it('resolves topic photographs for Markdown embeds', () => {
    const payload = JSON.parse(
      executePortalTool(
        'get_topic_photos',
        JSON.stringify({
          topics: [
            { collection: 'explore', slug: 'japan' },
            { collection: 'space', slug: 'europa' },
          ],
        }),
      ),
    ) as { count: number; photos: { src: string }[] }

    expect(payload.count).toBe(2)
    expect(payload.photos.map((photo) => photo.src).sort()).toEqual([
      '/images/atlas/japan/w1280.jpg',
      '/images/space/europa/w1280.jpg',
    ])
  })

  it('returns a structured miss for unknown guides', () => {
    const payload = JSON.parse(
      executePortalTool(
        'lookup_guide',
        JSON.stringify({ collection: 'explore', slug: 'not-a-country' }),
      ),
    ) as { found: boolean }

    expect(payload.found).toBe(false)
  })

  it('searches Gallery photographs', () => {
    const payload = JSON.parse(
      executePortalTool(
        'search_gallery',
        JSON.stringify({ query: 'fuji', limit: 4 }),
      ),
    ) as {
      count: number
      photos: {
        src: string
        href: string
        galleryHref: string
        galleryMarkdownLink: string
      }[]
    }

    expect(payload.count).toBeGreaterThan(0)
    expect(payload.photos[0]?.src).toContain('/images/')
    expect(payload.photos[0]?.href).toMatch(/^\/(explore|space)\//)
    expect(payload.photos[0]?.galleryHref).toBe('/gallery?q=fuji')
    expect(payload.photos[0]?.galleryMarkdownLink).toBe(
      '[Gallery](/gallery?q=fuji)',
    )
  })

  it('searches and looks up Writing essays', () => {
    const search = JSON.parse(
      executePortalTool(
        'search_writing',
        JSON.stringify({ query: 'marble', limit: 4 }),
      ),
    ) as {
      results: { slug: string; href: string }[]
      writingHref: string
      writingMarkdownLink: string
    }

    expect(search.results.length).toBeGreaterThan(0)
    expect(search.writingHref).toBe('/blog?q=marble')
    expect(search.writingMarkdownLink).toBe('[Writing](/blog?q=marble)')
    const slug = search.results[0]!.slug
    const lookup = JSON.parse(
      executePortalTool('lookup_writing', JSON.stringify({ slug })),
    ) as { found: boolean; href: string; excerpt: string }

    expect(lookup.found).toBe(true)
    expect(lookup.href).toBe(`/blog/${slug}`)
    expect(lookup.excerpt.length).toBeGreaterThan(40)
  })

  it('labels portal tool activity for the panel', () => {
    expect(
      portalToolActivityLabel(
        'search_portal_topics',
        JSON.stringify({ query: 'nebula', limit: 4 }),
        'in_progress',
      ),
    ).toBe('Searching guides for “nebula”')

    expect(
      portalToolActivityLabel(
        'lookup_guide',
        JSON.stringify({ collection: 'space', slug: 'europa' }),
        'completed',
      ),
    ).toBe('Opened guide “europa”')

    expect(
      portalToolActivityLabel(
        'search_gallery',
        JSON.stringify({ query: 'nebula', limit: 3 }),
        'completed',
      ),
    ).toBe('Searched Gallery for “nebula”')

    expect(
      portalToolActivityLabel(
        'lookup_guide',
        JSON.stringify({ collection: 'explore', slug: 'japan' }),
        'failed',
      ),
    ).toBe('Failed to open guide “japan”')
  })
})
