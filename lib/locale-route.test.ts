import { describe, expect, it } from 'vitest'

import { localeFromPathname, localePath, unlocalizedPathname } from './locale-route'

describe('locale routes', () => {
  it('keeps English paths unprefixed', () => {
    expect(localePath('en', '/')).toBe('/')
    expect(localePath('en', '/blog/a-post')).toBe('/blog/a-post')
  })

  it('normalizes a legacy /en prefix without losing its suffix', () => {
    expect(localePath('en', '/blog/a-post?from=feed#details')).toBe(
      '/blog/a-post?from=feed#details',
    )
    expect(localePath('en', '/en/blog/a-post?from=feed#details')).toBe(
      '/blog/a-post?from=feed#details',
    )
  })

  it('always reports English as the active locale', () => {
    expect(localeFromPathname('/')).toBe('en')
    expect(localeFromPathname('/blog/a-post')).toBe('en')
    expect(localeFromPathname('/en')).toBe('en')
    expect(localeFromPathname('/en/blog/a-post')).toBe('en')
    expect(localeFromPathname('/english')).toBe('en')
  })

  it('removes only an explicit English route segment', () => {
    expect(unlocalizedPathname('/en')).toBe('/')
    expect(unlocalizedPathname('/en/')).toBe('/')
    expect(unlocalizedPathname('/en/photos')).toBe('/photos')
    expect(unlocalizedPathname('/english')).toBe('/english')
  })

  it.each([
    'blog/a-post',
    '//example.com/blog',
    '/blog\\admin',
    '/blog/\0admin',
  ])('rejects malformed or traversal-like path input: %s', (path) => {
    expect(() => localePath('en', path)).toThrow('Invalid locale path')
  })
})
