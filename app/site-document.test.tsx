import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>()

  return {
    ...react,
    ViewTransition: ({ children }: { children: React.ReactNode }) => children,
  }
})

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => <span data-vercel-analytics="" />,
}))

vi.mock('~/components/ambient-background', () => ({
  AmbientBackground: () => null,
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
vi.mock('~/components/site-footer', () => ({
  SiteFooter: () => <span data-public-footer="" />,
}))
vi.mock('~/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('~/lib/security/inline-scripts', () => ({
  PREPAINT_SCRIPT: '',
}))
vi.mock('~/lib/social-live', () => ({
  getGitHub: vi.fn().mockResolvedValue({}),
  getSocial: vi.fn().mockResolvedValue({}),
}))
vi.mock('~/components/route-motion-controller', () => ({
  RouteMotionController: () => <span data-public-route-motion="" />,
  RouteViewTransition: ({ children }: { children: React.ReactNode }) => (
    <div data-public-route-transition="">{children}</div>
  ),
}))
vi.mock('./fonts', () => ({
  fontVariables: 'latin-font',
}))

import { SiteDocument } from './_components/site-document'
import { getGitHub, getSocial } from '~/lib/social-live'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SiteDocument analytics', () => {
  it('renders an English public document with latin font variables', async () => {
    const html = renderToStaticMarkup(
      await SiteDocument({ children: <p>English page</p> }),
    )

    expect(html).toContain('lang="en"')
    expect(html).toContain('data-locale="en"')
    expect(html).toContain('latin-font')
    expect(html).not.toContain('cjk-font')
  })

  it('collects page views on the public shell', async () => {
    const html = renderToStaticMarkup(
      await SiteDocument({
        children: <p>Public page</p>,
      }),
    )

    expect(html).toContain('data-vercel-analytics')
    expect(html).toContain('data-public-dock')
    expect(html).toContain('data-public-footer')
    expect(html).toContain('data-public-route-transition')
    expect(html).toContain('data-public-preview-cards')
    expect(html).not.toContain('data-locale-suggestion')
  })

  it('keeps owner-admin routes outside public chrome and social reads', async () => {
    const html = renderToStaticMarkup(
      await SiteDocument({
        children: <p>Owner admin</p>,
        isAdmin: true,
      }),
    )

    expect(html).not.toContain('data-vercel-analytics')
    expect(html).not.toContain('data-public-dock')
    expect(html).not.toContain('data-public-footer')
    expect(html).not.toContain('data-public-route-motion')
    expect(html).not.toContain('data-public-route-transition')
    expect(html).not.toContain('data-public-preview-cards')
    expect(html).not.toContain('data-locale-suggestion')
    expect(html).toContain('Owner admin')
    // The admin shares the warm working-paper palette (July 2026 decision)
    // while staying outside analytics and social reads.
    expect(html).toContain('public-site')
    expect(getSocial).not.toHaveBeenCalled()
    expect(getGitHub).not.toHaveBeenCalled()
  })
})
