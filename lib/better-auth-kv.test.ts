import { describe, expect, it } from 'vitest'

import {
  getSentinelIdentifyUrl,
  isProjectScopedIdentifyUrl,
  normalizeIdentifyUrl,
} from '~/lib/better-auth-kv'

describe('better-auth-kv', () => {
  it('normalizes trailing slashes', () => {
    expect(normalizeIdentifyUrl(' https://kv.better-auth.com/projects/abc/ ')).toBe(
      'https://kv.better-auth.com/projects/abc',
    )
  })

  it('detects project-scoped identify URLs', () => {
    expect(
      isProjectScopedIdentifyUrl(
        'https://kv.better-auth.com/projects/org_123',
      ),
    ).toBe(true)
    expect(
      isProjectScopedIdentifyUrl(
        'https://kv.better-auth.com/projects/org_123/',
      ),
    ).toBe(true)
    expect(isProjectScopedIdentifyUrl('https://kv.better-auth.com')).toBe(
      false,
    )
    expect(
      isProjectScopedIdentifyUrl(
        'https://kv.better-auth.com/projects/org_123/extra',
      ),
    ).toBe(false)
  })

  it('reads NEXT_PUBLIC_BETTER_AUTH_KV_URL when set', () => {
    expect(
      getSentinelIdentifyUrl({
        NEXT_PUBLIC_BETTER_AUTH_KV_URL:
          'https://kv.better-auth.com/projects/abc/',
      }),
    ).toBe('https://kv.better-auth.com/projects/abc')
  })

  it('returns undefined when the public KV URL is unset', () => {
    expect(getSentinelIdentifyUrl({})).toBeUndefined()
    expect(
      getSentinelIdentifyUrl({ BETTER_AUTH_KV_URL: 'https://kv.better-auth.com/projects/abc' }),
    ).toBeUndefined()
  })
})
