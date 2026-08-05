import { describe, expect, it } from 'vitest'

import {
  buildTopicPhotoInstructions,
  conversationTopicText,
  matchTopicPhotosInText,
  resolveTopicPhotos,
} from './topic-photos'

describe('topic photos', () => {
  it('resolves complete Explore, Space, and Civilizations photograph sets', () => {
    const photos = resolveTopicPhotos([
      { collection: 'explore', slug: 'japan' },
      { collection: 'space', slug: 'mars' },
      { collection: 'civilizations', slug: 'ancient-egypt' },
      { collection: 'explore', slug: 'not-a-country' },
    ])

    expect(photos).toHaveLength(9)
    expect(photos.slice(0, 3)).toMatchObject([
      {
        collection: 'explore',
        slug: 'japan',
        name: 'Japan',
        href: '/explore/japan',
        title: 'Mount Fuji',
        position: 1,
        total: 3,
        src: '/images/atlas/japan/w1280.jpg',
      },
      {
        position: 2,
        src: '/images/atlas/japan/w1280-2.jpg',
      },
      {
        position: 3,
        src: '/images/atlas/japan/w1280-3.jpg',
      },
    ])
    expect(photos[3]).toMatchObject({
      collection: 'space',
      slug: 'mars',
      name: 'Mars',
      href: '/space/mars',
      position: 1,
      total: 3,
      src: '/images/space/mars/w1280.jpg',
    })
    expect(photos.slice(3, 6).map((photo) => photo.src)).toEqual([
      '/images/space/mars/w1280.jpg',
      '/images/space/mars/w1280-2.jpg',
      '/images/space/mars/w1280-3.jpg',
    ])
    expect(photos[6]).toMatchObject({
      collection: 'civilizations',
      slug: 'ancient-egypt',
      name: 'Ancient Egypt',
      href: '/civilizations/ancient-egypt',
      position: 1,
      total: 3,
      src: '/images/civilizations/ancient-egypt/w1280.jpg',
    })
  })

  it('resolves complete Cities photograph sets', () => {
    const photos = resolveTopicPhotos([
      { collection: 'cities', slug: 'istanbul' },
      { collection: 'cities', slug: 'not-a-city' },
    ])

    expect(photos).toHaveLength(3)
    expect(photos[0]).toMatchObject({
      collection: 'cities',
      slug: 'istanbul',
      name: 'Istanbul',
      href: '/cities/istanbul',
      position: 1,
      total: 3,
      src: '/images/cities/istanbul/w1280.jpg',
    })
    expect(photos.map((photo) => photo.src)).toEqual([
      '/images/cities/istanbul/w1280.jpg',
      '/images/cities/istanbul/w1280-2.jpg',
      '/images/cities/istanbul/w1280-3.jpg',
    ])
  })

  it('matches catalog subjects by name and path in conversation text', () => {
    const photos = matchTopicPhotosInText(
      'Tell me about Japan and also /space/europa — what do they look like?',
    )

    expect([...new Set(photos.map((photo) => photo.slug))].sort()).toEqual([
      'europa',
      'japan',
    ])
    expect(photos).toHaveLength(6)
    expect(photos.every((photo) => photo.collection === 'explore' || photo.collection === 'space')).toBe(
      true,
    )
  })

  it('keeps Classical Japan distinct from Explore Japan for topic photos', () => {
    const explore = matchTopicPhotosInText('Tell me about Japan')
    expect(explore.map((photo) => photo.collection)).toEqual([
      'explore',
      'explore',
      'explore',
    ])
    expect(explore.every((photo) => photo.slug === 'japan')).toBe(true)

    const classical = matchTopicPhotosInText('Orient me to Classical Japan')
    expect(classical.map((photo) => photo.collection)).toEqual([
      'civilizations',
      'civilizations',
      'civilizations',
    ])
    expect(classical.every((photo) => photo.slug === 'classical-japan')).toBe(
      true,
    )
  })

  it('matches Civilizations guides by path', () => {
    const photos = matchTopicPhotosInText(
      'Compare /civilizations/roman-empire with the Maya story.',
    )
    expect([...new Set(photos.map((photo) => photo.slug))].sort()).toEqual([
      'maya',
      'roman-empire',
    ])
  })

  it('matches Cities guides by name and path', () => {
    const byName = matchTopicPhotosInText('Orient me to Istanbul')
    expect(byName.map((photo) => photo.collection)).toEqual([
      'cities',
      'cities',
      'cities',
    ])
    expect(byName.every((photo) => photo.slug === 'istanbul')).toBe(true)

    const byPath = matchTopicPhotosInText('Compare /cities/kyoto with Cairo.')
    expect([...new Set(byPath.map((photo) => photo.slug))].sort()).toEqual([
      'cairo',
      'kyoto',
    ])
  })

  it('resolves and matches Oceans guides by name and path', () => {
    const photos = resolveTopicPhotos([
      { collection: 'oceans', slug: 'pacific-ocean' },
      { collection: 'oceans', slug: 'not-an-ocean' },
    ])
    expect(photos).toHaveLength(3)
    expect(photos[0]).toMatchObject({
      collection: 'oceans',
      slug: 'pacific-ocean',
      name: 'Pacific Ocean',
      href: '/oceans/pacific-ocean',
      src: '/images/oceans/pacific-ocean/w1280.jpg',
    })

    const byName = matchTopicPhotosInText('Orient me to the Pacific Ocean')
    expect(byName.every((photo) => photo.slug === 'pacific-ocean')).toBe(true)

    const byPath = matchTopicPhotosInText(
      'Compare /oceans/atlantic-ocean with the Southern Ocean.',
    )
    expect([...new Set(byPath.map((photo) => photo.slug))].sort()).toEqual([
      'atlantic-ocean',
      'southern-ocean',
    ])
  })

  it('resolves and matches Rivers guides by name and path', () => {
    const photos = resolveTopicPhotos([
      { collection: 'rivers', slug: 'nile' },
      { collection: 'rivers', slug: 'not-a-river' },
    ])
    expect(photos).toHaveLength(3)
    expect(photos[0]).toMatchObject({
      collection: 'rivers',
      slug: 'nile',
      name: 'Nile',
      href: '/rivers/nile',
      src: '/images/rivers/nile/w1280.jpg',
    })

    const byName = matchTopicPhotosInText('Orient me to the Nile')
    expect(byName.every((photo) => photo.slug === 'nile')).toBe(true)

    const byPath = matchTopicPhotosInText(
      'Compare /rivers/amazon with the Yangtze.',
    )
    expect([...new Set(byPath.map((photo) => photo.slug))].sort()).toEqual([
      'amazon',
      'yangtze',
    ])
  })

  it('prefers longer country names over nested shorter ones', () => {
    const photos = matchTopicPhotosInText('What is Nigeria known for?')
    expect(photos.map((photo) => photo.slug)).toEqual([
      'nigeria',
      'nigeria',
      'nigeria',
    ])
  })

  it('builds instructions that expose every image in a topic set', () => {
    const photos = resolveTopicPhotos([{ collection: 'explore', slug: 'japan' }])
    const block = buildTopicPhotoInstructions(photos)

    expect(block).toContain('<cleo_topic_photos>')
    expect(block).toContain('complete curated photograph sets')
    expect(block).toContain('![Mount Fuji](/images/atlas/japan/w1280.jpg)')
    expect(block).toContain('/images/atlas/japan/w1280-2.jpg')
    expect(block).toContain('/images/atlas/japan/w1280-3.jpg')
    expect(block).toContain('embed every listed photograph')
    expect(block).toContain('Prefer these curated photos for real places')
    expect(block).toContain('You cannot generate new images')
    expect(buildTopicPhotoInstructions([])).toBe('')
  })

  it('keeps parenthetical photo titles usable as Markdown image alts', () => {
    const photos = resolveTopicPhotos([
      { collection: 'explore', slug: 'palestine' },
    ])
    const block = buildTopicPhotoInstructions(photos)

    expect(photos[0]?.title).toContain('(')
    expect(block).toContain(
      `![${photos[0]!.title}](/images/atlas/palestine/w1280.jpg)`,
    )
  })

  it('grounds from the latest user turns', () => {
    expect(
      conversationTopicText([
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello' },
        { role: 'user', content: 'Tell me about Mars' },
      ]),
    ).toContain('Mars')
  })
})
