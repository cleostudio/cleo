/** @vitest-environment node */
import { describe, expect, it } from 'vitest'

import {
  topicPhotoZoomForSrc,
  topicPhotoZoomKeyFromSrc,
} from '~/lib/cleo/topic-photo-zoom'
import { allTopicPhotoItems } from '~/lib/gallery'
import { staticRendition } from '~/lib/static-photo'

describe('topicPhotoZoomKeyFromSrc', () => {
  it('parses curated atlas, space, civilizations, cities, and oceans paths', () => {
    expect(topicPhotoZoomKeyFromSrc('/images/atlas/japan/w1280.jpg')).toBe(
      'atlas/japan',
    )
    expect(topicPhotoZoomKeyFromSrc('/images/space/mars/w640.jpg')).toBe(
      'space/mars',
    )
    expect(
      topicPhotoZoomKeyFromSrc('/images/civilizations/ancient-egypt/w1280.jpg'),
    ).toBe('civilizations/ancient-egypt')
    expect(topicPhotoZoomKeyFromSrc('/images/cities/istanbul/w1280.jpg')).toBe(
      'cities/istanbul',
    )
    expect(
      topicPhotoZoomKeyFromSrc('/images/oceans/pacific-ocean/w1280.jpg'),
    ).toBe('oceans/pacific-ocean')
    expect(topicPhotoZoomKeyFromSrc('/images/atlas/japan/w1280-2.jpg')).toBe(
      'atlas/japan-2',
    )
    expect(topicPhotoZoomKeyFromSrc('/images/space/mars/w2048-3.jpg')).toBe(
      'space/mars-3',
    )
    expect(
      topicPhotoZoomKeyFromSrc('/images/civilizations/maya/w2048-3.jpg'),
    ).toBe('civilizations/maya-3')
    expect(topicPhotoZoomKeyFromSrc('/images/cities/kyoto/w2048-3.jpg')).toBe(
      'cities/kyoto-3',
    )
    expect(
      topicPhotoZoomKeyFromSrc('/images/oceans/arctic-ocean/w2048-3.jpg'),
    ).toBe('oceans/arctic-ocean-3')
  })

  it('rejects non-curated paths', () => {
    expect(topicPhotoZoomKeyFromSrc('https://evil.example/x.jpg')).toBeNull()
    expect(topicPhotoZoomKeyFromSrc('/images/other/x.jpg')).toBeNull()
    expect(topicPhotoZoomForSrc('/images/space/sun/w2048.jpg')).toBeNull()
  })
})

describe('topicPhotoZoomForSrc', () => {
  it('stays in parity with Gallery catalog fields', () => {
    const items = allTopicPhotoItems()
    expect(items.length).toBeGreaterThan(0)

    for (const item of items) {
      const display = staticRendition(item.photo, 1280)
      const zoom = topicPhotoZoomForSrc(display.src)
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
