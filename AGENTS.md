# Cleo — agent instructions

General-knowledge portal (countries + space first) with a browser chat agent at
`/cleo`. Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS v4,
Base UI. **OpenAI is the only model third-party API.** Auth uses self-hosted
Better Auth on Neon Postgres (Marketplace).

## Start here

1. [`docs/handoff.md`](docs/handoff.md) — current product/status
2. [`docs/README.md`](docs/README.md) — doc map (“read when…”)
3. The matching runbook below before editing that subsystem

| Concern | Doc |
| --- | --- |
| Cleo chat / API / location / topic photos | [`docs/cleo.md`](docs/cleo.md) |
| Cleo self-improving loops (evals / feedback / memory) | [`docs/cleo-self-improving.md`](docs/cleo-self-improving.md) |
| Homepage portal search + Ask Cleo handoff | [`docs/homepage-search.md`](docs/homepage-search.md) |
| Explore countries, prose, Wikimedia photos | [`docs/atlas.md`](docs/atlas.md) |
| Space guides + NASA photos | [`docs/space.md`](docs/space.md) |
| Civilizations guides + Commons photos | [`docs/civilizations.md`](docs/civilizations.md) |
| Cities guides + Commons photos | [`docs/cities.md`](docs/cities.md) |
| Oceans guides + Commons photos | [`docs/oceans.md`](docs/oceans.md) |
| Rivers guides + Commons photos | [`docs/rivers.md`](docs/rivers.md) |
| Better Auth + Neon | [`docs/auth.md`](docs/auth.md) |
| Sentry (errors / tracing / replay) | [`docs/sentry.md`](docs/sentry.md) |
| Tokens, deviations from cali.so | [`docs/theme-preset.md`](docs/theme-preset.md) |
| Full visual/interaction spec | [`docs/design-language.md`](docs/design-language.md) |

Human onboarding: [`README.md`](README.md).

## Invariants

- Legacy `/en/...` redirects to unprefixed paths. `/photos` → `/gallery`,
  `/projects` → `/topics` (permanent). Do not restore
  AMA, owner admin, Media Library, Clerk, Bunny, Stripe, Resend, Google,
  Tencent, or Upstash without an explicit product decision. Neon + Better Auth
  are in product — see [`docs/auth.md`](docs/auth.md).
- Country about prose is curated (`scripts/atlas/atlas-about.json`), never
  generated at build or request time. The site never calls a model to render a
  page.
- Place/space/civilization/city/ocean/river images are static JPEGs under
  `public/images/{atlas,space,civilizations,cities,oceans,rivers}/` with browser
  `srcset`. No image CDN, account, or `/_next/image` re-encode at runtime.
- Theme: semantic tokens only — never hex or raw `--gray-N` in components. Two
  easings (`--ease-swift`, `--ease-spring`). Column widths via `max-w-content` /
  `max-w-content-narrow`. Departures from [cali.so](https://github.com/CaliCastle/cali.so)
  go in `docs/theme-preset.md` **and** `presetDeviations` in `lib/theme-preset.ts`.
- Render model output through Streamdown, never raw HTML. Invented
  Explore/Space/Civilizations/Cities/Oceans/Rivers paths are stripped by
  `lib/cleo/guardrails.ts`.
- Keep `OPENAI_API_KEY`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_API_KEY`,
  `SENTRY_AUTH_TOKEN`, and database URLs server-side. Never `NEXT_PUBLIC_`
  those secrets. `NEXT_PUBLIC_SENTRY_DSN` is public by design (see
  [`docs/sentry.md`](docs/sentry.md)).
- Path alias: `~/*`. Prefer `cn` and `components/ui/*`.
- Package manager: **pnpm only**.

## How to work

```bash
pnpm install
cp .env.example .env.local   # OPENAI_API_KEY for /cleo; Neon + Better Auth for account; Sentry DSN optional
pnpm dev                     # only service; default Next port
pnpm typecheck
pnpm test:unit               # and/or pnpm test:security when relevant
pnpm test:cleo-eval          # offline Cleo graders + golden cases + optimize unit tests
pnpm build                   # when changing routes/config (needs SENTRY_AUTH_TOKEN for source maps)
# Auth + Cleo feedback schema (when DATABASE_URL is set):
pnpm db:push
# Optional: export feedback → eval case candidates for triage
pnpm export:cleo-feedback
# Optional: instruction optimize dry-run (add -- --live with OPENAI_API_KEY)
pnpm optimize:cleo
```

Before changing Next.js framework usage, read the matching guide under
`node_modules/next/dist/docs/` — this App Router stack differs from older Next.

Update [`README.md`](README.md) and this file when setup or Cleo **boundaries**
change; update the matching `docs/*` runbook when subsystem behavior changes.

## Verification bar

| Change | Check |
| --- | --- |
| Code / types | `pnpm typecheck` |
| Routes / config | `pnpm build` |
| Atlas media / manifest | `pnpm validate:atlas` |
| Space media | `pnpm validate:space` |
| Civilizations media | `pnpm validate:civilizations` |
| Cities media | `pnpm validate:cities` |
| Oceans media | `pnpm validate:oceans` |
| Rivers media | `pnpm validate:rivers` |
| Unit / security | `pnpm test:unit` / `pnpm test:security` |
| Cleo offline evals | `pnpm test:cleo-eval` |
| Homepage search | `lib/site-search.test.ts`, `components/home-site-search.test.tsx`, `lib/cleo/ask-link.test.ts` |
| Cleo topic-photo zoom index | after atlas/space/oceans/rivers caption or rendition changes: `pnpm generate:cleo-topic-photo-zoom` |
| UI | Changed flows on desktop/mobile and light/dark |

Cleo manual smoke (when touching the agent): multi-turn chat, reasoning activity,
web search, image attach/vision, image generation, streaming, cancellation,
Retry/Continue, Location preference (including denied permission).

## Cursor Cloud / Previews

- `pnpm dev` is the only service.
- `OPENAI_API_KEY` is injected when available; without it `/api/responses`
  returns HTTP 503 and the rest of the site stays usable for UI work.
- Neon + Better Auth: without `DATABASE_URL` / `BETTER_AUTH_SECRET`,
  `/api/auth/*` returns HTTP 503; portal pages stay usable.
- Sentry: without `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN`, the SDK no-ops and
  the site stays usable; without `SENTRY_AUTH_TOKEN`, builds skip source map
  upload. See [`docs/sentry.md`](docs/sentry.md).
- Previews stub missing `SITE_URL` / `PUBLIC_SITE_URL` via
  `scripts/ensure-preview-env.mjs` during `prebuild`. No Bunny/Clerk.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
