import { describe, expect, it } from 'vitest'

import { citySubjects } from '~/lib/cities'
import { civilizationSubjects } from '~/lib/civilizations'
import { countries } from '~/lib/countries'
import { oceanSubjects } from '~/lib/oceans'
import { spaceSubjects } from '~/lib/space'

import { CLEO_INSTRUCTIONS } from './instructions'
import { buildPortalCatalogInstructions } from './portal-catalog'

describe('portal catalog instructions', () => {
  it('lists Explore, Space, Civilizations, Cities, and Oceans guides with exact site paths', () => {
    const block = buildPortalCatalogInstructions()

    expect(block).toContain(`Explore country guides (${countries.length}):`)
    expect(block).toContain(`Space guides (${spaceSubjects.length}):`)
    expect(block).toContain(
      `Civilizations guides (${civilizationSubjects.length}):`,
    )
    expect(block).toContain(`Cities guides (${citySubjects.length}):`)
    expect(block).toContain(`Oceans guides (${oceanSubjects.length}):`)
    expect(block).toContain('Japan (/explore/japan)')
    expect(block).toContain('Mars (/space/mars)')
    expect(block).toContain('Ancient Egypt (/civilizations/ancient-egypt)')
    expect(block).toContain('Istanbul (/cities/istanbul)')
    expect(block).toContain('Pacific Ocean (/oceans/pacific-ocean)')
    expect(block).toContain('[Topics](/topics)')
    expect(block).toContain('[Civilizations](/civilizations)')
    expect(block).toContain('[Cities](/cities)')
    expect(block).toContain('[Oceans](/oceans)')
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
    expect(CLEO_INSTRUCTIONS).toContain('(/cities/istanbul)')
    expect(CLEO_INSTRUCTIONS).toContain('(/oceans/pacific-ocean)')
  })
})
