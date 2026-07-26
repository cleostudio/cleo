import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { proxy } from '../proxy'

describe('public content proxy', () => {
  it.each(['/blog/not-a-published-post', '/newsletters/not-an-id'])(
    'rewrites an unknown content route before streaming: %s',
    (pathname) => {
      const response = proxy(new NextRequest(`https://example.com${pathname}`))

      expect(response.status).toBe(404)
      expect(response.headers.get('x-middleware-rewrite')).toBe(
        'https://example.com/_not-found',
      )
    },
  )

  it.each([
    '/blog/welcome-to-cleo',
    '/newsletters/1',
  ])('passes through a published content route: %s', (pathname) => {
    const response = proxy(new NextRequest(`https://example.com${pathname}`))

    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
    expect(response.headers.has('x-middleware-rewrite')).toBe(false)
  })

  it('does not mistake a generated metadata route for a post slug', () => {
    const response = proxy(
      new NextRequest('https://example.com/blog/opengraph-image-generated'),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
    expect(response.headers.has('x-middleware-rewrite')).toBe(false)
  })
})
