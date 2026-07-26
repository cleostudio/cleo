import { describe, expect, it } from 'vitest'

import { atlasRendition, atlasSrcSet } from './static-image'
import type { AtlasRendition } from './types'

const renditions: AtlasRendition[] = [
  { width: 2048, src: '/images/atlas/japan/w2048.jpg', bytes: 3 },
  { width: 640, src: '/images/atlas/japan/w640.jpg', bytes: 1 },
  { width: 1280, src: '/images/atlas/japan/w1280.jpg', bytes: 2 },
]

describe('atlas static image helpers', () => {
  it('builds a width-sorted static srcset from local paths only', () => {
    expect(atlasSrcSet(renditions)).toBe(
      [
        '/images/atlas/japan/w640.jpg 640w',
        '/images/atlas/japan/w1280.jpg 1280w',
        '/images/atlas/japan/w2048.jpg 2048w',
      ].join(', '),
    )
    expect(atlasSrcSet(renditions)).not.toContain('_next/image')
    expect(atlasSrcSet(renditions)).not.toContain('pexels.com')
  })

  it('picks the smallest rendition that covers the requested width', () => {
    expect(atlasRendition({ renditions }, 320).width).toBe(640)
    expect(atlasRendition({ renditions }, 800).width).toBe(1280)
    expect(atlasRendition({ renditions }, 2000).width).toBe(2048)
  })
})
