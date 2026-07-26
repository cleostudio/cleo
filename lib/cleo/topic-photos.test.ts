import { describe, expect, it } from 'vitest'

import {
  buildTopicPhotoInstructions,
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

  it('builds instructions that allow Markdown image embeds', () => {
    const photos = resolveTopicPhotos([{ collection: 'explore', slug: 'japan' }])
    const block = buildTopicPhotoInstructions(photos)

    expect(block).toContain('<cleo_topic_photos>')
    expect(block).toContain('You MAY and SHOULD include the curated photograph')
    expect(block).toContain('![Mount Fuji](/images/atlas/japan/w1280.jpg)')
    expect(block).toContain('Prefer these curated photos over `image_generation`')
    expect(buildTopicPhotoInstructions([])).toBe('')
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
