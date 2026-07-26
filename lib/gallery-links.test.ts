import { describe, expect, it } from 'vitest'

import { galleryFilterHref, gallerySearchHref } from './gallery'

describe('gallery deep links', () => {
  it('builds search and filter hrefs', () => {
    expect(gallerySearchHref('Japan')).toBe('/gallery?q=Japan')
    expect(gallerySearchHref('  ')).toBe('/gallery')
    expect(galleryFilterHref('Solar System')).toBe(
      '/gallery?filter=Solar%20System',
    )
    expect(galleryFilterHref('all')).toBe('/gallery')
  })
})
