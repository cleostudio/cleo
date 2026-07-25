import { getPost, isPostSlug } from '~/lib/content'
import {
  createHomeOgImage,
  createNewsletterOgImage,
  createPostOgImage,
  createSectionOgImage,
} from '~/lib/og-image'
import type { Locale } from '~/lib/locale-route'
import {
  getArchivedNewsletter,
  isArchivedNewsletterId,
} from '~/lib/newsletters'
import type { PublicSection } from '~/lib/public-page-metadata'

const PUBLIC_SECTIONS = new Set<PublicSection>([
  'blog',
  'cleo',
  'explore',
  'gallery',
  'space',
  'topics',
  'projects',
])

/** Accept `en` (and legacy `zh`, treated as English) for cache-compat. */
function resolveLocale(value: string | null): Locale | null {
  if (value === 'en' || value === 'zh') return 'en'
  return null
}

function cachedImage(response: Response) {
  response.headers.set(
    'cache-control',
    'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400',
  )
  return response
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = resolveLocale(searchParams.get('locale'))
  const path = searchParams.get('path')

  if (!locale || !path?.startsWith('/')) {
    return new Response('Not found', { status: 404 })
  }

  if (path === '/') return cachedImage(await createHomeOgImage(locale))

  const segments = path.split('/').filter(Boolean)
  const section = segments[0]

  if (section === 'blog' && segments.length === 2 && isPostSlug(segments[1])) {
    return cachedImage(await createPostOgImage(getPost(segments[1]), locale))
  }

  if (
    section === 'newsletters' &&
    segments.length === 2 &&
    isArchivedNewsletterId(segments[1])
  ) {
    return cachedImage(
      await createNewsletterOgImage(getArchivedNewsletter(segments[1]), locale),
    )
  }

  if (PUBLIC_SECTIONS.has(section as PublicSection)) {
    return cachedImage(await createSectionOgImage(section as PublicSection, locale))
  }

  return new Response('Not found', { status: 404 })
}
