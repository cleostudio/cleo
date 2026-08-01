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
    expect(syntheticEmailForUserId(a)).toBe(`temp@${a}.invalid`)
    expect(syntheticEmailForUserId(b)).toBe(`temp@${b}.invalid`)
    expect(syntheticEmailForUserId(a)).not.toBe(syntheticEmailForUserId(b))
    expect(userIdFromSyntheticEmail(syntheticEmailForUserId(a))).toBe(a)
  })

  it('uses a reserved TLD that can never be registered', () => {
    expect(syntheticEmailForUserId(crypto.randomUUID())).toMatch(/\.invalid$/)
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

  it('does not misclassify a deliverable address sharing the local part', () => {
    // A GitHub account really could use temp@<something>.com. Hiding that
    // person's email in the dock would be a bug, so the reserved TLD — not the
    // `temp@` prefix — is what marks an address synthetic.
    expect(isSyntheticEmail('temp@example.com')).toBe(false)
    expect(isSyntheticEmail('temp@gmail.com')).toBe(false)
    expect(userIdFromSyntheticEmail('temp@example.com')).toBeNull()
  })
})
