/** @vitest-environment node */
import { describe, expect, it } from 'vitest'

import {
  topicPhotoZoomForSrc,
  topicPhotoZoomKeyFromSrc,
} from '~/lib/cleo/topic-photo-zoom'
import { allGalleryItems } from '~/lib/gallery'

describe('topicPhotoZoomKeyFromSrc', () => {
  it('parses curated atlas and space paths', () => {
    expect(topicPhotoZoomKeyFromSrc('/images/atlas/japan/w1280.jpg')).toBe(
      'atlas/japan',
    )
    expect(topicPhotoZoomKeyFromSrc('/images/space/mars/w640.jpg')).toBe(
      'space/mars',
    )
  })

  it('rejects non-curated paths', () => {
    expect(topicPhotoZoomKeyFromSrc('https://evil.example/x.jpg')).toBeNull()
    expect(topicPhotoZoomKeyFromSrc('/images/other/x.jpg')).toBeNull()
  })
})

describe('topicPhotoZoomForSrc', () => {
  it('stays in parity with Gallery catalog fields', () => {
    const items = allGalleryItems()
    expect(items.length).toBeGreaterThan(0)

    for (const item of items) {
      const mid = item.photo.renditions.find((r) => r.width === 1280)
      expect(mid, item.id).toBeTruthy()
      const zoom = topicPhotoZoomForSrc(mid!.src)
      expect(zoom, item.id).toBeTruthy()
      expect(zoom!.collection).toBe(item.collection)
      expect(zoom!.title).toBe(item.title)
      expect(zoom!.subtitle).toBe(item.subtitle)
      expect(zoom!.photographer).toBe(item.photo.photographer)
      expect(zoom!.license).toBe(item.photo.license)
      expect(zoom!.width).toBe(item.photo.width)
      expect(zoom!.height).toBe(item.photo.height)
      expect(zoom!.renditions.map((r) => r.src)).toEqual(
        item.photo.renditions.map((r) => r.src),
      )
    }
  })

  it('resolves Japan Mount Fuji for the portal starter path', () => {
    const zoom = topicPhotoZoomForSrc('/images/atlas/japan/w1280.jpg')
    expect(zoom).toMatchObject({
      collection: 'places',
      title: 'Mount Fuji',
      subtitle: 'Japan',
    })
  })
})
