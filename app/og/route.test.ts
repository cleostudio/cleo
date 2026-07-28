import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  createExploreGuideOgImage,
  createSpaceGuideOgImage,
  createSectionOgImage,
  createHomeOgImage,
  createPostOgImage,
  createNewsletterOgImage,
} = vi.hoisted(() => ({
  createExploreGuideOgImage: vi.fn(async () => new Response('explore-guide')),
  createSpaceGuideOgImage: vi.fn(async () => new Response('space-guide')),
  createSectionOgImage: vi.fn(async () => new Response('section')),
  createHomeOgImage: vi.fn(async () => new Response('home')),
  createPostOgImage: vi.fn(async () => new Response('post')),
  createNewsletterOgImage: vi.fn(async () => new Response('newsletter')),
}))

vi.mock('~/lib/og-image', () => ({
  createExploreGuideOgImage,
  createSpaceGuideOgImage,
  createSectionOgImage,
  createHomeOgImage,
  createPostOgImage,
  createNewsletterOgImage,
}))

import { GET } from './route'

function requestFor(path: string) {
  return new Request(
    `http://localhost:3000/og?locale=en&path=${encodeURIComponent(path)}`,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('OG image route', () => {
  it('routes Explore and Space guide paths to per-guide artwork', async () => {
    const japan = await GET(requestFor('/explore/japan'))
    expect(await japan.text()).toBe('explore-guide')
    expect(createExploreGuideOgImage).toHaveBeenCalledOnce()
    expect(createSectionOgImage).not.toHaveBeenCalled()

    const mars = await GET(requestFor('/space/mars'))
    expect(await mars.text()).toBe('space-guide')
    expect(createSpaceGuideOgImage).toHaveBeenCalledOnce()
  })

  it('keeps section indexes on the generic section cards', async () => {
    const explore = await GET(requestFor('/explore'))
    expect(await explore.text()).toBe('section')
    expect(createSectionOgImage).toHaveBeenCalledWith('explore', 'en')
    expect(createExploreGuideOgImage).not.toHaveBeenCalled()
  })

  it('returns 404 for unknown guide slugs', async () => {
    const missing = await GET(requestFor('/explore/not-a-country'))
    expect(missing.status).toBe(404)
    expect(createExploreGuideOgImage).not.toHaveBeenCalled()
    expect(createSectionOgImage).not.toHaveBeenCalled()
  })
})
