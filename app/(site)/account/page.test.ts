import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

/**
 * Regression: session + headers() must stay inside Suspense. Putting
 * getSession(await headers()) on the page body caused Neon session queries
 * during prerender (HANGING_PROMISE_REJECTION) even with instant = false.
 */
describe('account page Cache Components contract', () => {
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'page.tsx'),
    'utf8',
  )

  it('streams the session lookup behind Suspense', () => {
    expect(source).toContain('<Suspense')
    expect(source).toContain('AccountLoadingShell')
    expect(source).toContain('AccountSession')
    expect(source).toMatch(/getSession\(await headers\(\)\)/)
    expect(source).not.toMatch(/export const instant\s*=\s*false/)
  })
})
