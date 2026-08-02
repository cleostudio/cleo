import { describe, expect, it } from 'vitest'

import { civilizationSubjects } from '~/lib/civilizations'
import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

import { CLEO_INSTRUCTIONS } from './instructions'
import { buildPortalCatalogInstructions } from './portal-catalog'

describe('portal catalog instructions', () => {
  it('lists Explore, Space, and Civilizations guides with exact site paths', () => {
    const block = buildPortalCatalogInstructions()

    expect(block).toContain(`Explore country guides (${countries.length}):`)
    expect(block).toContain(`Space guides (${spaceSubjects.length}):`)
    expect(block).toContain(
      `Civilizations guides (${civilizationSubjects.length}):`,
    )
    expect(block).toContain('Japan (/explore/japan)')
    expect(block).toContain('Mars (/space/mars)')
    expect(block).toContain('Ancient Egypt (/civilizations/ancient-egypt)')
    expect(block).toContain('[Topics](/topics)')
    expect(block).toContain('[Civilizations](/civilizations)')
    expect(block).toContain('<cleo_topic_photos>')
    expect(block).toContain('curated photograph as a Markdown image')
    expect(block).not.toContain('/explore/not-a-real-country')
  })

  it('is appended to the shipped Cleo instructions', () => {
    expect(CLEO_INSTRUCTIONS).toContain('cleo_site')
    expect(CLEO_INSTRUCTIONS).toContain('knowledge portal')
    expect(CLEO_INSTRUCTIONS).toContain('(/explore/japan)')
    expect(CLEO_INSTRUCTIONS).toContain('(/space/mars)')
    expect(CLEO_INSTRUCTIONS).toContain('(/civilizations/ancient-egypt)')
  })
})
