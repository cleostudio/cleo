// Publishing a post requires adding its directory slug here. The public-route
// proxy, post index, feeds, and sitemap all consume this explicit allowlist.
export const publishedPostSlugs = [
  'welcome-to-cleo',
  'country-field-guides',
  'space-field-guides',
  'places-and-sky',
  'ask-cleo',
  'curated-not-generated',
  'topics-first',
  'photos-stay-local',
  'writing-comes-next',
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
