import { describe, expect, it } from 'vitest'

import {
  isSyntheticEmail,
  syntheticEmailForUserId,
  userIdFromSyntheticEmail,
} from './auth-synthetic-email'

describe('syntheticEmailForUserId', () => {
  it('embeds the user id so uniqueness is guaranteed from the id alone', () => {
    const a = crypto.randomUUID()
    const b = crypto.randomUUID()
    expect(syntheticEmailForUserId(a)).toBe(`temp@${a}.com`)
    expect(syntheticEmailForUserId(b)).toBe(`temp@${b}.com`)
    expect(syntheticEmailForUserId(a)).not.toBe(syntheticEmailForUserId(b))
    expect(userIdFromSyntheticEmail(syntheticEmailForUserId(a))).toBe(a)
  })

  it('rejects empty ids', () => {
    expect(() => syntheticEmailForUserId('')).toThrow(/non-empty/)
    expect(() => syntheticEmailForUserId('   ')).toThrow(/non-empty/)
  })

  it('is recognized by isSyntheticEmail and never mistaken for a real inbox', () => {
    const email = syntheticEmailForUserId('user-123')
    expect(isSyntheticEmail(email)).toBe(true)
    expect(isSyntheticEmail('person@example.com')).toBe(false)
    expect(isSyntheticEmail(null)).toBe(false)
  })
})
