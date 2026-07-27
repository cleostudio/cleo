import { describe, expect, it } from 'vitest'

import { newsletterRetiredMetadata } from './_views/newsletter-retired-page'

describe('retired newsletter confirmation metadata', () => {
  it('matches the visible English explanation and remains private', () => {
    const english = newsletterRetiredMetadata('en')

    expect(english).toMatchObject({
      title: 'Newsletter confirmation is retired',
      description:
        'This old link no longer reads or updates subscriber information. The newsletter service has ended.',
      robots: { index: false, follow: false },
    })
  })
})
