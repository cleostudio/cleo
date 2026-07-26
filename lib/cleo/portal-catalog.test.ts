import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

import { CLEO_INSTRUCTIONS } from './instructions'
import { buildPortalCatalogInstructions } from './portal-catalog'

describe('portal catalog instructions', () => {
  it('describes portal tools without stuffing every guide path', () => {
    const block = buildPortalCatalogInstructions()

    expect(block).toContain(`Catalog scale: ${countries.length} Explore`)
    expect(block).toContain(`${spaceSubjects.length} Space guides`)
    expect(block).toContain('search_portal_topics')
    expect(block).toContain('lookup_guide')
    expect(block).toContain('get_topic_photos')
    expect(block).toContain('[Topics](/topics)')
    expect(block).toContain('curated photograph as a Markdown image')
    expect(block).not.toContain('Japan (/explore/japan)')
    expect(block).not.toContain('Explore country guides (')
  })

  it('is appended to the shipped Cleo instructions with a research policy', () => {
    expect(CLEO_INSTRUCTIONS).toContain('cleo_site')
    expect(CLEO_INSTRUCTIONS).toContain('knowledge portal')
    expect(CLEO_INSTRUCTIONS).toContain('search_portal_topics')
    expect(CLEO_INSTRUCTIONS).toContain('<research_policy>')
  })
})
