import { describe, expect, it } from 'vitest'

import {
  buildTopicPhotoInstructions,
  clipTopicOrientation,
  conversationTopicText,
  matchTopicPhotosInText,
  resolveTopicPhotos,
} from './topic-photos'

describe('topic photos', () => {
  it('resolves Explore and Space photographs with embeddable paths', () => {
    const photos = resolveTopicPhotos([
      { collection: 'explore', slug: 'japan' },
      { collection: 'space', slug: 'mars' },
      { collection: 'explore', slug: 'not-a-country' },
    ])

    expect(photos).toHaveLength(2)
    expect(photos[0]).toMatchObject({
      collection: 'explore',
      slug: 'japan',
      name: 'Japan',
      href: '/explore/japan',
      title: 'Mount Fuji',
      src: '/images/atlas/japan/w1280.jpg',
    })
    expect(photos[1]).toMatchObject({
      collection: 'space',
      slug: 'mars',
      name: 'Mars',
      href: '/space/mars',
      src: '/images/space/mars/w1280.jpg',
    })
  })

  it('matches catalog subjects by name and path in conversation text', () => {
    const photos = matchTopicPhotosInText(
      'Tell me about Japan and also /space/europa — what do they look like?',
    )

    expect(photos.map((photo) => photo.slug).sort()).toEqual([
      'europa',
      'japan',
    ])
  })

  it('prefers longer country names over nested shorter ones', () => {
    const photos = matchTopicPhotosInText('What is Nigeria known for?')
    expect(photos.map((photo) => photo.slug)).toEqual(['nigeria'])
  })

  it('builds instructions that allow Markdown image embeds and orientation', () => {
    const photos = resolveTopicPhotos([{ collection: 'explore', slug: 'japan' }])
    const block = buildTopicPhotoInstructions(photos)

    expect(block).toContain('<cleo_topic_photos>')
    expect(block).toContain('You MAY and SHOULD include the curated photograph')
    expect(block).toContain('![Mount Fuji](/images/atlas/japan/w1280.jpg)')
    expect(block).toContain('Prefer these curated photos over `image_generation`')
    expect(block).toContain('Orientation (site copy')
    expect(photos[0]?.orientation.length).toBeGreaterThan(40)
    expect(buildTopicPhotoInstructions([])).toBe('')
  })

  it('clips long orientation prose without mid-word cuts when possible', () => {
    const long = `${'word '.repeat(200)}final.`
    const clipped = clipTopicOrientation(long, 80)
    expect(clipped.endsWith('…')).toBe(true)
    expect(clipped.length).toBeLessThanOrEqual(81)
    expect(clipped.includes('word')).toBe(true)
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

  it('grounds from the latest user turns and the latest assistant reply', () => {
    const text = conversationTopicText([
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello — interested in Europa?' },
      { role: 'user', content: 'Show me a photo' },
    ])

    expect(text).toContain('Show me a photo')
    expect(text).toContain('Europa')
  })
})

