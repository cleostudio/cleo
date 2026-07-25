import { describe, expect, it } from 'vitest'

import nextConfig from '../next.config'

describe('server output tracing', () => {
  it('packages content and OG dependencies for runtime routes', () => {
    expect(nextConfig.outputFileTracingIncludes).toMatchObject({
      '/blog/**': expect.arrayContaining([
        './content/blog/**/*',
        './app/_fonts/FrexSansGB-OG-*.ttf',
      ]),
      '/newsletters/**': expect.arrayContaining([
        './content/newsletters/**/*',
        './app/_fonts/FrexSansGB-OG-*.ttf',
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
  it('permanently redirects legacy /en and English feed URLs', async () => {
    const redirects = await nextConfig.redirects!()
    expect(redirects).toEqual(
      expect.arrayContaining([
        { source: '/en', destination: '/', permanent: true },
        { source: '/en/:path*', destination: '/:path*', permanent: true },
        { source: '/feed.en.xml', destination: '/feed.xml', permanent: true },
      ]),
    )
  })
})

describe('route security headers', () => {
  it('allows the Google OAuth form redirect only from AMA settings', async () => {
    const rules = await nextConfig.headers!()
    const globalPolicy = rules
      .find(({ source }) => source === '/:path*')
      ?.headers.find(({ key }) => key === 'Content-Security-Policy')?.value
    const googleOAuthPolicy = rules
      .find(({ source }) => source === '/admin/ama/settings')
      ?.headers.find(({ key }) => key === 'Content-Security-Policy')?.value

    expect(globalPolicy).toContain("form-action 'self'")
    expect(globalPolicy).not.toContain('https://accounts.google.com')
    expect(googleOAuthPolicy).toContain(
      "form-action 'self' https://accounts.google.com",
    )
  })
})
