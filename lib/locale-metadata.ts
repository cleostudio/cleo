import type { Metadata } from 'next'

import type { Locale } from './locale-route'
import { localePath } from './locale-route'
import { seo } from './seo'

interface LocaleMetadataOptions {
  locale?: Locale
  path: string
  title: string
  description: string
  type?: 'article' | 'website'
}

const SOCIAL_IMAGE_VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12)
const SECTION_IMAGE_PATHS = new Set([
  '/blog',
  '/cleo',
  '/explore',
  '/gallery',
  '/space',
  '/civilizations',
  '/topics',
  '/projects',
])

export function socialImageUrl(_locale: Locale = 'en', path: string) {
  const url = new URL('/og', seo.url)
  url.searchParams.set('locale', 'en')
  url.searchParams.set('path', path)
  if (SOCIAL_IMAGE_VERSION) url.searchParams.set('v', SOCIAL_IMAGE_VERSION)
  return url
}

/** English-only canonical URL helper. */
export function localeRoutePair(path: string) {
  const canonical = new URL(localePath('en', path), seo.url)

  return {
    en: canonical,
    languages: {
      en: canonical.href,
      'x-default': canonical.href,
    },
  }
}

/** Build server-rendered metadata for a public English route. */
export function localeMetadata({
  path,
  title,
  description,
  type = 'website',
}: LocaleMetadataOptions): Metadata {
  const pair = localeRoutePair(path)
  const canonical = pair.en
  const siteName = 'Cleo'
  const trimmedDescription = description.trim()
  const image = {
    url: socialImageUrl('en', path),
    width: 1200,
    height: 630,
    alt:
      path === '/' || title === siteName
        ? trimmedDescription
          ? `${title}. ${trimmedDescription}`
          : title
        : SECTION_IMAGE_PATHS.has(path)
          ? trimmedDescription
            ? `${title} · ${siteName}. ${trimmedDescription}`
            : `${title} · ${siteName}`
          : `${title} · ${siteName}`,
    type: 'image/png',
  }

  return {
    title,
    description: trimmedDescription || undefined,
    alternates: {
      canonical,
      languages: pair.languages,
    },
    openGraph: {
      title,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
      type,
      locale: 'en_US',
      siteName,
      url: canonical,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
      images: [image],
    },
  }
}
