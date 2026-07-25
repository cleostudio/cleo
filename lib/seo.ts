import { publicPageMetadata } from './public-page-metadata'

function publicSiteUrl() {
  const configured = process.env.PUBLIC_SITE_URL?.trim()
  const raw =
    configured ||
    (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3199')
  if (!raw) {
    throw new Error('PUBLIC_SITE_URL must be set in production')
  }
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error('PUBLIC_SITE_URL must be a valid URL')
  }
  if (
    url.protocol !== 'https:' &&
    !['localhost', '127.0.0.1'].includes(url.hostname)
  ) {
    throw new Error('PUBLIC_SITE_URL must use HTTPS outside local development')
  }
  return url
}

export const seo = {
  title: publicPageMetadata.home.title,
  description: publicPageMetadata.home.description,
  url: publicSiteUrl(),
} as const

/** @deprecated Alias kept for call-site compatibility during cleanup. */
export const seoEn = seo
