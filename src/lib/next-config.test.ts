import { describe, expect, it } from 'vitest'

import nextConfig from '../next.config'

describe('server output tracing', () => {
  it('packages content and OG dependencies for runtime routes', () => {
    expect(nextConfig.outputFileTracingIncludes).toMatchObject({
      '/blog/**': expect.arrayContaining([
        './content/blog/**/*',
        './src/app/_fonts/FrexSansGB-OG-*.ttf',
      ]),
      '/newsletters/**': expect.arrayContaining([
        './content/newsletters/**/*',
        './src/app/_fonts/FrexSansGB-OG-*.ttf',
      ]),
      '/content/\\[\\.\\.\\.path\\]': [
        './content/blog/**/*',
        './content/newsletters/**/*',
      ],
    })
    expect(nextConfig.outputFileTracingIncludes).not.toHaveProperty('/en/blog/**')
    expect(nextConfig.outputFileTracingIncludes).not.toHaveProperty('/en/newsletters/**')
  })
})

describe('English-only redirects', () => {
  it('permanently redirects legacy /en, AMA, and admin URLs', async () => {
    const redirects = await nextConfig.redirects!()
    expect(redirects).toEqual(
      expect.arrayContaining([
        { source: '/en', destination: '/', permanent: true },
        { source: '/en/:path*', destination: '/:path*', permanent: true },
        { source: '/feed.en.xml', destination: '/feed.xml', permanent: true },
        { source: '/ama', destination: '/explore', permanent: true },
        { source: '/ama/:path*', destination: '/explore', permanent: true },
        { source: '/admin', destination: '/', permanent: true },
        { source: '/admin/:path*', destination: '/', permanent: true },
      ]),
    )
  })
})

describe('route security headers', () => {
  it('applies the public CSP without admin or OAuth overrides', async () => {
    const rules = await nextConfig.headers!()
    const globalPolicy = rules
      .find(({ source }) => source === '/:path*')
      ?.headers.find(({ key }) => key === 'Content-Security-Policy')?.value

    expect(globalPolicy).toContain("form-action 'self'")
    expect(globalPolicy).not.toContain('https://accounts.google.com')
    expect(rules.find(({ source }) => source === '/admin/:path*')).toBeUndefined()
    expect(rules.find(({ source }) => source === '/admin/ama/settings')).toBeUndefined()
    expect(rules.find(({ source }) => source === '/api/admin/:path*')).toBeUndefined()
  })
})
