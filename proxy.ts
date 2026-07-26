import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  isArchivedNewsletterId,
  isPublishedPostSlug,
} from './lib/public-content-routes'

function missingPublicContent(pathname: string) {
  const postMatch = pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (postMatch) {
    const slug = postMatch[1]
    if (/^(?:opengraph-image|twitter-image)-/.test(slug)) return false
    return !isPublishedPostSlug(slug)
  }

  const newsletterMatch = pathname.match(/^\/newsletters\/([^/]+)\/?$/)
  return newsletterMatch
    ? !isArchivedNewsletterId(newsletterMatch[1])
    : false
}

/**
 * Public-content proxy: rewrite unknown blog/newsletter slugs to 404 before
 * Cache Components streams a loading shell.
 *
 * `export const dynamicParams = false` would be the usual closed-set 404, but
 * Next rejects that segment config when `cacheComponents` is enabled — so this
 * edge rewrite stays required for an immediate 404 status.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (missingPublicContent(pathname)) {
    const notFoundUrl = request.nextUrl.clone()
    notFoundUrl.pathname = '/_not-found'
    return NextResponse.rewrite(notFoundUrl, { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:slug', '/newsletters/:id'],
}
