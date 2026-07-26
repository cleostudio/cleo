# Public-repository security baseline

The repository is public. Source code, route names, and client-visible
configuration are not security boundaries. Controls must remain effective when
an attacker can read the implementation.

Cleo is an English-only knowledge portal. OpenAI is the only third-party API.
There is no auth, database, media library, AMA booking, or analytics stack.
Do not reintroduce Clerk, Neon, Bunny, Stripe, Resend, Google, Tencent,
Upstash, or Vercel Analytics without an explicit product decision.

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

## Public endpoint abuse and cost controls

`POST /api/responses` is the one route where an anonymous caller can spend
money. It is unauthenticated by design, and every accepted call bills OpenAI for
a reasoning model with web search, image generation, and a 16,384-token output
ceiling. Because the repository is public, the absence of a limit is
discoverable rather than obscure.

`lib/security/api-guard.ts` screens each request before the body is read:

| Control | Response | Bounds |
| --- | --- | --- |
| Origin, from `Sec-Fetch-Site` with `Origin` as fallback | 403 | Requests a browser on this deployment could not have made |
| Declared body size | 413 | Payloads too large to be a real conversation |
| Per-client throttle, burst and hourly | 429 with `Retry-After` | Sustained spend from one caller |
| Simultaneous upstream streams | 503 with `Retry-After` | Peak spend rate per instance |

Whole-conversation image count and decoded bytes are capped in
`app/api/responses/route.ts`, because per-message limits alone allow a
50-message conversation to carry hundreds of megabytes of billed vision input.

Counters live in the running serverless instance. That is a deliberate
trade-off: hosted rate limiting can only be configured in a dashboard, and a
control that is not committed here cannot be reviewed or verified from the
repository. Warm instance reuse means sustained abuse from one caller still
converges on the limit, and the concurrency gate bounds spend per instance
regardless of how keys are rotated. A caller who rotates addresses across many
instances is the residual gap; close it with a hosted WAF rate limit and an
OpenAI spend cap, and track both in [verification.md](./verification.md).

Limits are read from the environment at runtime — `CLEO_RATE_LIMIT_BURST`,
`CLEO_RATE_LIMIT_BURST_WINDOW_SECONDS`, `CLEO_RATE_LIMIT_HOURLY`, and
`CLEO_MAX_CONCURRENT_STREAMS` — so they can be tightened during an incident
without a deploy.

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
