# Public-repository security baseline

The repository is public. Source code, route names, and client-visible
configuration are not security boundaries. Controls must remain effective when
an attacker can read the implementation.

Cleo is an English-only knowledge portal. OpenAI is the only third-party API
for application features. There is no auth, database, media library, or AMA
booking. Vercel Web Analytics and Speed Insights are the approved platform
observability stack (same-origin `/_vercel/*` scripts; no app secrets).
Do not reintroduce Clerk, Neon, Bunny, Stripe, Resend, Google, Tencent, or
Upstash without an explicit product decision.

## Deployment and secret isolation

| Environment | Data and integrations | Secret policy |
| --- | --- | --- |
| Production | Live site; OpenAI Responses API | Production-scoped `OPENAI_API_KEY`, `SITE_URL`, `PUBLIC_SITE_URL` |
| Preview | Vercel Git preview for one branch | Preview-scoped key or omit (API returns 503); never production-only secrets |
| Local | Developer machine | `.env.local` only; never commit secrets |

- Never encode secrets in source, build output, client bundles, logs, issue
  text, or config files. Keep `OPENAI_API_KEY` server-side only — never
  `NEXT_PUBLIC_*`.
- Scope Vercel environment variables explicitly. A production secret must not
  be exposed to Preview or Development unless that is intentional and reviewed.
- Forks and untrusted pull requests must not receive production credentials.
- Rotate on suspected exposure and remove old credentials after a verified
  cutover.

## Logging

Application logs must not contain API tokens, authorization headers, full
request bodies that may carry user chat content or image data URLs, or raw
provider payloads. Redaction is a fallback, not permission to log sensitive
input.

Keep access to logs least-privileged and set retention deliberately.

## Repository and CI controls

- This repository does not commit GitHub Actions workflows, Dependabot config,
  funding metadata, or `.claude` / `.codex` agent tooling. Preview and
  Production deploys are driven by Vercel Git integration.
- Prefer pull requests with review before merging to the production branch.
  Disable force pushes and branch deletion on protected branches when the host
  supports it.
- Enable private vulnerability reporting, secret scanning, and push protection
  in GitHub repository settings when available.
- Run local checks before deploy: `pnpm typecheck`, `pnpm test:security`,
  `pnpm audit:prod`, and a full-history secret scan when releasing. Treat
  findings as exposed: rotate the credential first, then remove it from
  current code and, where appropriate, rewrite history through a separately
  approved process.

## Content Security Policy

The public Production CSP keeps `script-src 'unsafe-inline'` because Next.js
static, ISR, and partial-prerendered output includes inline hydration payloads.
A per-request nonce would disable those rendering modes. Next.js SRI is enabled
for supported build assets, `unsafe-eval` is development-only, script
attributes are blocked, and all other directives remain restricted. Inline
styles remain allowed because shared React UI emits style attributes. Revisit
the script and shared style exceptions when Next.js and the UI can remove them
without giving up static shells or functionality.

Configuration committed to this repository does not prove that a hosted
setting is enabled. Track hosted verification separately in
[verification.md](./verification.md).
