/**
 * Better Auth's `user.email` column is NOT NULL, and passkey `resolveUser`
 * returns no email. We store a synthetic address that is unique per user id
 * and never shown in the UI.
 *
 * Format matches Better Auth's anonymous plugin default: `temp@{id}.com`.
 * Uniqueness is guaranteed because the local-part host is the user id itself.
 */
export const SYNTHETIC_EMAIL_DOMAIN = 'com' as const

export function syntheticEmailForUserId(userId: string): string {
  const id = userId.trim()
  if (!id) {
    throw new Error('syntheticEmailForUserId requires a non-empty user id')
  }
  return `temp@${id}.${SYNTHETIC_EMAIL_DOMAIN}`
}

export function isSyntheticEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return /^temp@[^\s@]+\.com$/i.test(email.trim())
}

/** Extract the user id embedded in a synthetic address, or null. */
export function userIdFromSyntheticEmail(
  email: string | null | undefined,
): string | null {
  if (!email) return null
  const match = /^temp@([^\s@]+)\.com$/i.exec(email.trim())
  return match?.[1] ?? null
}
