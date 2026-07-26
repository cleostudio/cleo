import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

import { CLEO_INSTRUCTIONS } from './instructions'
import { buildPortalCatalogInstructions } from './portal-catalog'

describe('portal catalog instructions', () => {
  it('lists Explore and Space guides with exact site paths', () => {
    const block = buildPortalCatalogInstructions()

    expect(block).toContain(`Explore country guides (${countries.length}):`)
    expect(block).toContain(`Space guides (${spaceSubjects.length}):`)
    expect(block).toContain('Japan (/explore/japan)')
    expect(block).toContain('Mars (/space/mars)')
    expect(block).toContain('[Topics](/topics)')
    expect(block).toContain('[Maps](/maps)')
    expect(block).toContain('/maps?c={slug}')
    expect(block).toContain('[Japan on Maps](/maps?c=japan)')
    expect(block).toContain('<cleo_topic_photos>')
    expect(block).toContain('curated photograph as a Markdown image')
    expect(block).not.toContain('/explore/not-a-real-country')
  })

  it('is appended to the shipped Cleo instructions', () => {
    expect(CLEO_INSTRUCTIONS).toContain('cleo_site')
    expect(CLEO_INSTRUCTIONS).toContain('knowledge portal')
    expect(CLEO_INSTRUCTIONS).toContain('(/explore/japan)')
    expect(CLEO_INSTRUCTIONS).toContain('(/space/mars)')
  })
})
