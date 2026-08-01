# ADR: Better Auth (not Clerk) for Cleo accounts

Status: Accepted (Stage 2a)

## Context

Stage 2 adds signed-in accounts. Clerk is the only Vercel Marketplace-managed
auth integration, and it is the wrong fit for this repository: CSP tests in
`lib/security/headers.test.ts` assert the policy contains neither `clerk` nor
`'unsafe-eval'`, and Clerk’s Frontend API would require a `connect-src`
exception.

## Decision

Use **Better Auth** as an in-process library with:

- Passkeys (`@better-auth/passkey`) as the primary method
- GitHub OAuth as the second / recovery path
- Drizzle schema in our Neon database (`@better-auth/drizzle-adapter`)
- No email/password, magic link, or email OTP (no transactional email vendor)

## Consequences

- Same-origin `/api/auth/*` keeps `connect-src 'self'`
- Synthetic `user.email` values (`temp@{userId}.invalid`) fill Better Auth’s
  non-nullable column for passkey-first signup and are never shown in the UI.
  The TLD is RFC 2606 reserved rather than Better Auth’s `.com` default: a user
  id is a valid domain label, so `.com` would place every address in a
  registrable namespace, and a reserved TLD additionally makes
  `isSyntheticEmail` sound because no real inbox can exist there
- Account recovery is a second passkey + GitHub linking, not inbox reset
- Neon outage takes auth down with it (accepted)

See `docs/plan-accounts-and-threads.md` §2.1 and §5.
