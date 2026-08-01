import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
// Experimental React channel export — available because next.config.ts sets
// experimental.viewTransition (see docs/design-language.md, page transitions)
import { Suspense } from 'react'

import { AmbientBackground } from '~/components/ambient-background'
import { CleoRouteAttribute } from '~/components/cleo-route-attribute'
import { DockAuthSessionClient } from '~/components/dock-auth-session-client'
import { Dock, DockFallback } from '~/components/dock'
import { PreviewCardTimingProvider } from '~/components/preview-card-timing'
import {
  RouteMotionController,
  RouteViewTransition,
} from '~/components/route-motion-controller'
import { SiteChrome } from '~/components/site-chrome'
import { SiteFooter } from '~/components/site-footer'
import { SiteFooterSlot } from '~/components/site-footer-slot'
import { ThemeProvider } from '~/components/theme-provider'
import { PREPAINT_SCRIPT } from '~/lib/security/inline-scripts'
import { seo } from '~/lib/seo'
import { cn } from '~/lib/utils'

import { fontVariables } from '../fonts'

export const rootMetadata: Metadata = {
  metadataBase: seo.url,
  title: {
    default: 'Cleo',
    template: '%s | Cleo',
  },
}

export async function SiteDocument({
  children,
}: Readonly<{
  children: React.ReactNode
  /** @deprecated Ignored; site is English-only. */
  locale?: 'en'
  /** @deprecated Ignored; site is English-only. */
  restoreLocale?: boolean
}>) {
  return (
    <html
      lang="en"
      data-locale="en"
      data-route-motion="none"
      suppressHydrationWarning
      className={cn('font-sans', fontVariables, 'public-site')}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <PreviewCardTimingProvider>
            <RouteMotionController />
            <CleoRouteAttribute />
            <AmbientBackground />
            <SiteChrome
              footer={
                <SiteFooterSlot>
                  <SiteFooter locale="en" />
                </SiteFooterSlot>
              }
            >
              {/* The non-none default isolates route content while keeping the
                  CSS-named list → loading shell → article groups active. */}
              <RouteViewTransition>{children}</RouteViewTransition>
            </SiteChrome>
            <Suspense fallback={<DockFallback locale="en" />}>
              <Dock />
            </Suspense>
            {/* Stage 0 follow-up: client-only useSession probe (site-wide). */}
            <DockAuthSessionClient />
            <Analytics />
            <SpeedInsights />
          </PreviewCardTimingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
