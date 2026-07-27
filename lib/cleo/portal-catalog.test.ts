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
    expect(block).toContain('<cleo_topic_photos>')
    expect(block).toContain('curated photograph as a Markdown image')
    expect(block).not.toContain('/explore/not-a-real-country')
  })

  it('is appended to the shipped Cleo instructions', () => {
    expect(CLEO_INSTRUCTIONS).toContain('cleo_site')
    expect(CLEO_INSTRUCTIONS).toContain('knowledge portal')
    expect(CLEO_INSTRUCTIONS).toContain('(/explore/japan)')
    expect(CLEO_INSTRUCTIONS).toContain('(/space/mars)')
    expect(CLEO_INSTRUCTIONS).toContain('<interactive_components>')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"tabs"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"timeline"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"steps"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"cards"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"gallery"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"path"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"scale"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"layers"')
    expect(CLEO_INSTRUCTIONS).toContain('"type":"compare"')
    expect(CLEO_INSTRUCTIONS).toContain('"hrefs"')
    expect(CLEO_INSTRUCTIONS).toContain('cleo-ui')
    expect(CLEO_INSTRUCTIONS).not.toContain('"type":"quiz"')
    expect(CLEO_INSTRUCTIONS).not.toContain('"type":"follow_ups"')
  })
})
