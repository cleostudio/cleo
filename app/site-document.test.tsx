import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>()

  return {
    ...react,
    ViewTransition: ({ children }: { children: React.ReactNode }) => children,
  }
})

vi.mock('~/components/ambient-background', () => ({
  AmbientBackground: () => null,
}))
vi.mock('~/components/cleo-route-attribute', () => ({
  CleoRouteAttribute: () => null,
}))
vi.mock('~/components/dock', () => ({
  Dock: () => <span data-public-dock="" />,
  DockFallback: () => <span data-public-dock-fallback="" />,
}))
vi.mock('~/components/preview-card-timing', () => ({
  PreviewCardTimingProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-public-preview-cards="">{children}</div>
  ),
}))
vi.mock('~/components/site-chrome', () => ({
  SiteChrome: ({
    children,
    footer,
  }: {
    children: React.ReactNode
    footer: React.ReactNode
  }) => (
    <div data-public-chrome="">
      {children}
      {footer}
    </div>
  ),
}))
vi.mock('~/components/site-footer', () => ({
  SiteFooter: () => <span data-public-footer-body="" />,
}))
vi.mock('~/components/site-footer-slot', () => ({
  SiteFooterSlot: ({ children }: { children: React.ReactNode }) => (
    <span data-public-footer="">{children}</span>
  ),
}))
vi.mock('~/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('~/lib/security/inline-scripts', () => ({
  PREPAINT_SCRIPT: '',
}))
vi.mock('~/components/route-motion-controller', () => ({
  RouteMotionController: () => <span data-public-route-motion="" />,
  RouteViewTransition: ({ children }: { children: React.ReactNode }) => (
    <div data-public-route-transition="">{children}</div>
  ),
}))
vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => <span data-vercel-analytics="" />,
}))
vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <span data-vercel-speed-insights="" />,
}))
vi.mock('./fonts', () => ({
  fontVariables: 'latin-font',
}))

import { SiteDocument } from './_components/site-document'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SiteDocument', () => {
  it('renders an English public document with latin font variables', async () => {
    const html = renderToStaticMarkup(
      await SiteDocument({ children: <p>English page</p> }),
    )

    expect(html).toContain('lang="en"')
    expect(html).toContain('data-locale="en"')
    expect(html).toContain('latin-font')
    expect(html).not.toContain('cjk-font')
  })

  it('renders the public chrome with Vercel Analytics and Speed Insights', async () => {
    const html = renderToStaticMarkup(
      await SiteDocument({
        children: <p>Public page</p>,
      }),
    )

    expect(html).toContain('data-vercel-analytics')
    expect(html).toContain('data-vercel-speed-insights')
    expect(html).toContain('data-public-dock')
    expect(html).toContain('data-public-footer')
    expect(html).toContain('data-public-route-transition')
    expect(html).toContain('data-public-preview-cards')
  })
})
