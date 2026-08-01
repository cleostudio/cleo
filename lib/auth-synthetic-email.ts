/**
 * Better Auth's `user.email` column is NOT NULL, and passkey `resolveUser`
 * returns no email. We store a synthetic address that is unique per user id
 * and never shown in the UI.
 *
 * The domain is `.invalid`, which RFC 2606 reserves and guarantees can never
 * be registered. Better Auth's anonymous plugin defaults to `.com`, but a user
 * id is a valid domain label, so that default puts every synthetic address in
 * a namespace a stranger can own — which matters the moment anything attempts
 * delivery or a DNS lookup. A reserved TLD also makes `isSyntheticEmail`
 * sound: no real inbox can exist at `.invalid`, so there is nothing to
 * misclassify.
 */
export const SYNTHETIC_EMAIL_DOMAIN = 'invalid' as const

const SYNTHETIC_EMAIL_RE = /^temp@([^\s@]+)\.invalid$/i

export function syntheticEmailForUserId(userId: string): string {
  const id = userId.trim()
  if (!id) {
    throw new Error('syntheticEmailForUserId requires a non-empty user id')
  }
  return `temp@${id}.${SYNTHETIC_EMAIL_DOMAIN}`
}

export function isSyntheticEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return SYNTHETIC_EMAIL_RE.test(email.trim())
}

/** Extract the user id embedded in a synthetic address, or null. */
export function userIdFromSyntheticEmail(
  email: string | null | undefined,
): string | null {
  if (!email) return null
  const match = SYNTHETIC_EMAIL_RE.exec(email.trim())
  return match?.[1] ?? null
}
