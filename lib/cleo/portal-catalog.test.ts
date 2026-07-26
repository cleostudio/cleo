import { describe, expect, it } from 'vitest'

import { biomeSubjects } from '~/lib/biomes'
import { countries } from '~/lib/countries'
import { oceanSubjects } from '~/lib/oceans'
import { spaceSubjects } from '~/lib/space'

import { CLEO_INSTRUCTIONS } from './instructions'
import { buildPortalCatalogInstructions } from './portal-catalog'

describe('portal catalog instructions', () => {
  it('lists Explore, Space, Oceans, and Biomes guides with exact site paths', () => {
    const block = buildPortalCatalogInstructions()

    expect(block).toContain(`Explore country guides (${countries.length}):`)
    expect(block).toContain(`Space guides (${spaceSubjects.length}):`)
    expect(block).toContain(`Oceans guides (${oceanSubjects.length}):`)
    expect(block).toContain(`Biomes guides (${biomeSubjects.length}):`)
    expect(block).toContain('Japan (/explore/japan)')
    expect(block).toContain('Mars (/space/mars)')
    expect(block).toContain('Pacific Ocean (/oceans/pacific)')
    expect(block).toContain('Tundra (/biomes/tundra)')
    expect(block).toContain('[Topics](/topics)')
    expect(block).toContain('[Sky](/sky)')
    expect(block).toContain('[Biomes](/biomes)')
    expect(block).toContain('[Compare](/compare)')
    expect(block).toContain('/compare?a=explore:japan&b=explore:france')
    expect(block).toContain('<cleo_topic_photos>')
    expect(block).toContain('curated photograph as a Markdown image')
    expect(block).not.toContain('/explore/not-a-real-country')
  })

  it('is appended to the shipped Cleo instructions', () => {
    expect(CLEO_INSTRUCTIONS).toContain('cleo_site')
    expect(CLEO_INSTRUCTIONS).toContain('knowledge portal')
    expect(CLEO_INSTRUCTIONS).toContain('(/explore/japan)')
    expect(CLEO_INSTRUCTIONS).toContain('(/space/mars)')
    expect(CLEO_INSTRUCTIONS).toContain('(/oceans/pacific)')
    expect(CLEO_INSTRUCTIONS).toContain('(/biomes/tundra)')
  })
})


