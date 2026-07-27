// Publishing a post requires adding its directory slug here. The public-route
// proxy, post index, feeds, and sitemap all consume this explicit allowlist.
export const publishedPostSlugs = [
  'a-library-written-in-ice',
  'cities-waiting-for-the-tide',
  'dust-that-feeds-a-forest',
  'islands-that-arrive-overnight',
  'listening-for-black-holes',
  'the-line-wallace-drew',
  'the-moon-that-steals-our-days',
  'the-passport-of-a-raindrop',
  'the-thin-blue-shell',
] as const

export const archivedNewsletterIds = ['1'] as const

export type ArchivedNewsletterId = (typeof archivedNewsletterIds)[number]

export function isPublishedPostSlug(slug: string) {
  return publishedPostSlugs.some((publishedSlug) => publishedSlug === slug)
}

export function isArchivedNewsletterId(
  id: string,
): id is ArchivedNewsletterId {
  return archivedNewsletterIds.some((knownId) => knownId === id)
}
