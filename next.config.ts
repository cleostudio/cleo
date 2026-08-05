import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

import legacyUrlManifest from './content/legacy-url-manifest.json'
import { securityHeaders } from './lib/security/headers'

const legacyRedirects = legacyUrlManifest.entries.flatMap((entry) =>
  entry.kind === 'redirect' && typeof entry.destination === 'string'
    ? [
        {
          source: entry.source,
          destination: entry.destination,
          permanent: true,
        },
      ]
    : [],
)

const ogRuntimeAssets = [
  './app/_fonts/FrexSansGB-OG-*.ttf',
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // Posts and newsletters are read from the repository at render time. The
  // slug is dynamic, so output tracing cannot discover these files from the
  // readFile calls on its own when packaging serverless functions.
  outputFileTracingIncludes: {
    '/og': [
      ...ogRuntimeAssets,
      './content/blog/**/*',
      './content/newsletters/**/*',
    ],
    '/blog/**': ['./content/blog/**/*', ...ogRuntimeAssets],
    '/newsletters/**': ['./content/newsletters/**/*', ...ogRuntimeAssets],
    '/content/\\[\\.\\.\\.path\\]': [
      './content/blog/**/*',
      './content/newsletters/**/*',
    ],
  },

  // Pin the project root: when developing from a git worktree nested inside
  // another checkout, Next's lockfile-based root inference walks too far up.
  turbopack: { root: import.meta.dirname },

  // Shared-element morphs (cover/title) on route navigation; browsers
  // without the View Transitions API just navigate instantly.
  experimental: {
    viewTransition: true,
    globalNotFound: true,
    sri: { algorithm: 'sha256' },
  },

  images: {
    // Post images are served from content/ via app/content/[...path]/route.ts;
    // country place photos and other static media live under public/images.
    localPatterns: [
      { pathname: '/content/**' },
      { pathname: '/images/**' },
      { pathname: '/_next/static/**' },
    ],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [...securityHeaders],
    },
    {
      // Proxied link media (favicons, Open Graph images) are never a
      // document that may run in this origin. Same-key entries later in
      // this list override the global policy above, so exactly one
      // Content-Security-Policy header is sent.
      source: '/link-media/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'none'; sandbox",
        },
      ],
    },
  ],

  // The checked-in manifest is the v3 cutover contract for every preserved,
  // replaced or retired public URL from the legacy site. English-only:
  // former `/en` URLs permanently redirect to the unprefixed paths.
  redirects: async () => [
    { source: '/en', destination: '/', permanent: true },
    // Former AMA marketing page; booking APIs were removed.
    { source: '/ama', destination: '/explore', permanent: true },
    { source: '/ama/:path*', destination: '/explore', permanent: true },
    // Projects catalog became Topics (general-knowledge collections).
    { source: '/projects', destination: '/topics', permanent: true },
    { source: '/projects/:path*', destination: '/topics', permanent: true },
    // Photos became Gallery.
    { source: '/photos', destination: '/gallery', permanent: true },
    { source: '/photos/:path*', destination: '/gallery', permanent: true },
    { source: '/en/photos', destination: '/gallery', permanent: true },
    // Retired post.
    {
      source: '/blog/we-decided-to-stop-buying-saas',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/en/blog/we-decided-to-stop-buying-saas',
      destination: '/blog',
      permanent: true,
    },
    { source: '/admin', destination: '/', permanent: true },
    { source: '/admin/:path*', destination: '/', permanent: true },
    // Specific /en/* legacy rules must win over the prefix strip below.
    ...legacyRedirects,
    { source: '/en/:path*', destination: '/:path*', permanent: true },
  ],
}

export default withSentryConfig(nextConfig, {
  org: 'cleo-studio',
  project: 'sentry-cleo',

  // Source map upload (set SENTRY_AUTH_TOKEN in CI / Vercel / Cursor Cloud).
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a wider set of client source files for better stack traces.
  widenClientFileUpload: true,

  // Same-origin tunnel so browsers can reach Sentry behind ad blockers / CSP.
  tunnelRoute: '/monitoring',

  silent: !process.env.CI,
})
