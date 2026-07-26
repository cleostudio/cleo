/**
 * Lightweight eval harness for Cleo’s portal agent loop:
 * browse → lookup → synthesize reading paths, plus link verification.
 */

import { describe, expect, it } from 'vitest'

import { CLEO_INSTRUCTIONS } from './instructions'
import {
  extractPortalGuideLinks,
  presentPortalGuideMarkdown,
} from './portal-links'
import {
  COMPARE_GUIDES_TOOL_NAME,
  executePortalTool,
  LIST_GUIDES_TOOL_NAME,
  LOOKUP_GUIDE_TOOL_NAME,
  PLAN_READING_PATH_TOOL_NAME,
  PORTAL_FUNCTION_TOOLS,
  SEARCH_GALLERY_TOOL_NAME,
  portalToolActivitySummary,
} from './portal-tools'

describe('portal agentic eval harness', () => {
  it('exposes list, lookup, compare, plan, and gallery portal tools', () => {
    expect(PORTAL_FUNCTION_TOOLS.map((tool) => tool.name)).toEqual([
      LOOKUP_GUIDE_TOOL_NAME,
      LIST_GUIDES_TOOL_NAME,
      COMPARE_GUIDES_TOOL_NAME,
      PLAN_READING_PATH_TOOL_NAME,
      SEARCH_GALLERY_TOOL_NAME,
    ])
  })

  it('lists real Space category guides for browsing', () => {
    const result = JSON.parse(
      executePortalTool(
        LIST_GUIDES_TOOL_NAME,
        JSON.stringify({
          collection: 'space',
          group: 'Moons',
          query: null,
          limit: 8,
        }),
      ),
    ) as {
      ok: boolean
      results: { href: string; slug: string; group: string }[]
      spaceGroups: string[]
    }

    expect(result.ok).toBe(true)
    expect(result.spaceGroups).toContain('Moons')
    expect(result.results.length).toBeGreaterThan(0)
    expect(result.results.every((guide) => guide.group === 'Moons')).toBe(true)
    expect(result.results.some((guide) => guide.slug === 'europa')).toBe(true)
    expect(
      result.results.every((guide) => guide.href.startsWith('/space/')),
    ).toBe(true)
  })

  it('supports a plan → list → lookup reading-path fixture', () => {
    const listed = JSON.parse(
      executePortalTool(
        LIST_GUIDES_TOOL_NAME,
        JSON.stringify({
          collection: 'space',
          group: 'Deep Space',
          query: null,
          limit: 6,
        }),
      ),
    ) as {
      ok: boolean
      results: { name: string; slug: string; href: string }[]
    }

    expect(listed.ok).toBe(true)
    const pick = listed.results.find((guide) => guide.slug === 'orion-nebula')
    expect(pick).toBeTruthy()

    const lookedUp = JSON.parse(
      executePortalTool(
        LOOKUP_GUIDE_TOOL_NAME,
        JSON.stringify({
          collection: 'space',
          slug: pick!.slug,
          name: pick!.name,
        }),
      ),
    ) as {
      ok: boolean
      guide?: { href: string; photo?: { galleryHref: string } }
    }

    expect(lookedUp.ok).toBe(true)
    expect(lookedUp.guide?.href).toBe('/space/orion-nebula')
    expect(lookedUp.guide?.photo?.galleryHref).toContain('/gallery?q=')

    const synthesized = [
      `Start with [${pick!.name}](${pick!.href}).`,
      '',
      `Then stretch into [Europa](/space/europa) before a photo stop at [Orion Nebula](${lookedUp.guide?.photo?.galleryHref}).`,
      '',
      'Skip the fake [Krypton](/space/krypton) detour.',
    ].join('\n')

    const presented = presentPortalGuideMarkdown(synthesized)
    expect(presented).toContain('[Orion Nebula](/space/orion-nebula)')
    expect(presented).toContain('[Europa](/space/europa)')
    expect(presented).toContain('/gallery?q=')
    expect(presented).toContain('Krypton')
    expect(presented).not.toContain('/space/krypton')
    expect(extractPortalGuideLinks(presented).map((link) => link.href)).toEqual(
      ['/space/orion-nebula', '/space/europa'],
    )
  })

  it('compares two guides in one tool call', () => {
    const result = JSON.parse(
      executePortalTool(
        COMPARE_GUIDES_TOOL_NAME,
        JSON.stringify({
          left: { collection: 'space', slug: 'earth', name: null },
          right: { collection: 'space', slug: 'mars', name: null },
        }),
      ),
    ) as {
      ok: boolean
      left?: { href: string }
      right?: { href: string }
    }

    expect(result.ok).toBe(true)
    expect(result.left?.href).toBe('/space/earth')
    expect(result.right?.href).toBe('/space/mars')
  })

  it('plans then presents a reading path without invented slugs', () => {
    const planned = JSON.parse(
      executePortalTool(
        PLAN_READING_PATH_TOOL_NAME,
        JSON.stringify({
          theme: 'icy moons',
          collection: 'space',
          stops: 3,
        }),
      ),
    ) as {
      ok: boolean
      stops: { name: string; href: string; galleryHref?: string }[]
    }

    expect(planned.ok).toBe(true)
    expect(planned.stops.length).toBeGreaterThanOrEqual(2)

    const body = planned.stops
      .map(
        (stop, index) =>
          `${index + 1}. [${stop.name}](${stop.href})${
            stop.galleryHref ? ` — [photo](${stop.galleryHref})` : ''
          }`,
      )
      .join('\n\n')
    const presented = presentPortalGuideMarkdown(
      `${body}\n\nSkip [Krypton](/space/krypton).`,
    )

    expect(presented).not.toContain('/space/krypton')
    expect(extractPortalGuideLinks(presented).length).toBe(planned.stops.length)
  })

  it('ships reading-path and portal-tool guidance in instructions', () => {
    expect(CLEO_INSTRUCTIONS).toContain('plan_reading_path')
    expect(CLEO_INSTRUCTIONS).toContain('list_guides')
    expect(CLEO_INSTRUCTIONS).toContain('lookup_guide')
    expect(CLEO_INSTRUCTIONS).toContain('compare_guides')
    expect(CLEO_INSTRUCTIONS).toContain('search_gallery')
    expect(CLEO_INSTRUCTIONS).toContain('<reading_paths>')
    expect(CLEO_INSTRUCTIONS).toContain('Do not stop after tool JSON')
    expect(CLEO_INSTRUCTIONS).toContain('Never invent')
  })

  it('summarizes list_guides activity for the UI', () => {
    expect(
      portalToolActivitySummary(
        LIST_GUIDES_TOOL_NAME,
        JSON.stringify({
          collection: 'explore',
          group: 'Asia',
          query: null,
          limit: null,
        }),
      ),
    ).toBe('Browsing Asia')
  })
})
