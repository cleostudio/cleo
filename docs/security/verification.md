# Security verification

Last checked: 2026-07-25. This note separates repository evidence from hosted
settings. Do not paste credentials, scan findings, or exploit details here;
use GitHub private vulnerability reporting.

Cleo is a public, English-only knowledge portal. The only third-party API is
OpenAI (`OPENAI_API_KEY` on the server for `POST /api/responses`). There is no
auth, database, media library, AMA booking, or analytics stack.

## Local repository

- [x] No committed `.github/` workflows, Dependabot config, or funding
  metadata. Deploys use Vercel Git integration.
- [x] No committed `.claude/` or `.codex/` agent tooling config.
- [x] `pnpm audit:prod` audits the installed production dependency graph via
  OSV.
- [x] Application security tests cover CSP and headers and related
  same-origin / route-limit controls under `lib/security`.
- [x] `POST /api/responses` is screened by `lib/security/api-guard.ts` for
  origin, body size, per-client throttling, and stream concurrency, with the
  route's validation and error mapping covered by tests.
- [ ] Re-run a full-history gitleaks scan before the next public release and
  keep `.gitleaksignore` fingerprints current.

Local recheck:

```sh
pnpm typecheck
pnpm test:unit
pnpm test:security
pnpm audit:prod
gitleaks git --redact --no-banner --log-opts='--branches --tags' --verbose
test ! -e .github
test ! -e .claude
test ! -e .codex
```

The production dependency audit queries OSV from the installed pnpm graph.
Re-run privately with `AUDIT_DETAILS=true` for package and advisory
identifiers. Security scan output must remain private.

## GitHub

Hosted settings (verify in the GitHub UI; not encoded in this repo):

- [ ] Private vulnerability reporting, secret scanning, and push protection
  remain enabled.
- [ ] Branch protection / rulesets no longer require retired `Quality` or
  `CodeQL` check names from the removed Actions workflows.
- [ ] Non-provider secret patterns and validity checks — recheck after a
  product or plan change if unavailable.

## Vercel

- [ ] Production and Preview keep distinct env scopes. `OPENAI_API_KEY` must
  never be exposed as `NEXT_PUBLIC_*` or committed.
- [ ] `SITE_URL` / `PUBLIC_SITE_URL` are set for Production; Preview may stub
  them via `scripts/ensure-preview-env.mjs` during `prebuild`.
- [ ] Git fork protection remains enabled so untrusted forks cannot receive
  production secrets.
- [ ] Confirm log access, retention, and that no unexpected drains or
  third-party analytics integrations were reintroduced.
- [ ] Add a WAF rate limit on `/api/responses`. The in-process guard cannot see
  a caller who rotates addresses across instances; only an edge rule counts
  requests before they reach a function.

## OpenAI

- [ ] Set a hard monthly spend cap and a usage alert on the project that issues
  `OPENAI_API_KEY`. This is the last backstop if the endpoint is abused faster
  than the guard and the WAF can absorb.
- [ ] Scope the key to the Responses API and rotate it on suspected exposure.
