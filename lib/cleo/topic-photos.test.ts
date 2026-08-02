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

  it('matches catalog subjects by name and path in conversation text', () => {
    const photos = matchTopicPhotosInText(
      'Tell me about Japan and also /space/europa — what do they look like?',
    )

    expect([...new Set(photos.map((photo) => photo.slug))].sort()).toEqual([
      'europa',
      'japan',
    ])
    expect(photos).toHaveLength(6)
  })

  it('matches Civilizations guides by path', () => {
    const photos = matchTopicPhotosInText(
      'Compare /civilizations/roman-empire with the Nile story.',
    )
    expect(photos.map((photo) => photo.slug)).toEqual([
      'roman-empire',
      'roman-empire',
      'roman-empire',
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
    expect(block).toContain('Prefer these curated photos over `image_generation`')
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
