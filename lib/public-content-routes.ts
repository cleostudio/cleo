// Publishing a post requires adding its directory slug here. The public-route
// proxy, post index, feeds, and sitemap all consume this explicit allowlist.
export const publishedPostSlugs = [
  'a-brief-history-of-dawn',
  'an-island-still-becoming',
  'how-rivers-draw-nations',
  'letters-from-low-earth-orbit',
  'pale-blue-marble',
  'silence-between-galaxies',
  'the-atlas-of-vanishing-things',
  'the-long-night-of-enceladus',
  'what-the-equator-remembers',
  'when-the-sahara-was-green',
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
