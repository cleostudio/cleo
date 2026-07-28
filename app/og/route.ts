import { getAtlasEntry } from '~/lib/atlas'
import { getPost, isPostSlug } from '~/lib/content'
import type { Locale } from '~/lib/locale-route'
import {
  createExploreGuideOgImage,
  createHomeOgImage,
  createPostOgImage,
  createSectionOgImage,
  createSpaceGuideOgImage,
} from '~/lib/og-image'
import type { PublicSection } from '~/lib/public-page-metadata'
import { getSpaceSubject } from '~/lib/space'

/** Active public section indexes that still render OG artwork. */
const PUBLIC_SECTIONS = new Set<PublicSection>([
  'blog',
  'cleo',
  'explore',
  'gallery',
  'space',
  'topics',
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

  if (section === 'explore' && segments.length === 2) {
    const entry = getAtlasEntry(segments[1])
    if (entry) {
      return cachedImage(await createExploreGuideOgImage(entry, locale))
    }
  }

  if (section === 'space' && segments.length === 2) {
    const subject = getSpaceSubject(segments[1])
    if (subject) {
      return cachedImage(await createSpaceGuideOgImage(subject, locale))
    }
  }

  if (
    PUBLIC_SECTIONS.has(section as PublicSection) &&
    segments.length === 1
  ) {
    return cachedImage(await createSectionOgImage(section as PublicSection, locale))
  }

  return new Response('Not found', { status: 404 })
}
