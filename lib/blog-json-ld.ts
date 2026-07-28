import { seo } from '~/lib/seo'
import { socialImageUrl } from '~/lib/locale-metadata'

export type BlogPostingJsonLdInput = {
  slug: string
  title: string
  description: string
  datePublished: Date
  /** Absolute or site-relative image URL; falls back to the OG card. */
  image?: string
}

/** Schema.org BlogPosting payload for Writing essays. */
export function blogPostingJsonLd({
  slug,
  title,
  description,
  datePublished,
  image,
}: BlogPostingJsonLdInput) {
  const url = new URL(`/blog/${slug}`, seo.url).href
  const imageUrl = image
    ? new URL(image, seo.url).href
    : socialImageUrl('en', `/blog/${slug}`).href

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: datePublished.toISOString(),
    mainEntityOfPage: url,
    url,
    image: [imageUrl],
    author: {
      '@type': 'Organization',
      name: 'Cleo',
      url: seo.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cleo',
      url: seo.url,
    },
  }
}
