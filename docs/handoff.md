# Handoff

Current as of July 2026 (Cleo fork).

## Product

English-only general-knowledge portal with:

- Homepage: country search, highlighted places, topic discovery (no personal
  contact / music / books / photo-wall sections)
- MDX Writing (kept for a future Wikipedia-like knowledge layer), Explore
  country field guides, Topics catalog (countries first; more topics later)
- Gallery: filterable place photographs (`content/atlas.json` + optimized static
  JPEGs in `public/images/atlas/`) — one curated place photograph per country
- Cleo AI agent at `/cleo` powered by **OpenAI only**

There is **no** Clerk auth, Neon/Postgres, Bunny media, AMA booking, Stripe,
Resend, Google, Tencent, Upstash, or Vercel Analytics.

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4, Base UI
- Posts: `content/blog/<slug>/` via owned content route
- Explore / Gallery: `lib/countries.ts`, `lib/atlas/*`, `/explore`, `/gallery`
- Place images: import-time mozjpeg 640/1024/1600 under `public/images/atlas/`;
  rendered with static `srcset` (`AtlasImage` / unoptimized ZoomImage). No
  runtime image account, API, or third-party fetch.
- Media workflow: `pnpm generate:atlas-content` → `pnpm import:atlas-photos` →
  `pnpm validate:atlas` (originals in `.atlas-originals/`)
- Cleo: `components/cleo/*`, `lib/cleo/*`, `POST /api/responses`
- Env: `OPENAI_API_KEY`, `PUBLIC_SITE_URL`, `SITE_URL` (see `.env.example`)
- Social footer counts: baked JSON in `content/social.json` + `content/github.json`
  (components retained; not linked from the public chrome)
- Former `/ama`, `/admin`, `/projects`, and `/photos` URLs redirect away

## Design

Visual contract: `docs/design-language.md` (including § Paper-artifact doorway
vignettes for homepage NavCards). Country pages use the warm-paper field-guide
layout (passport labels, hairline rules, zoomable contact-print hero).

## Local / Preview

```bash
pnpm install
cp .env.example .env.local   # set OPENAI_API_KEY
pnpm validate:atlas
pnpm dev
pnpm typecheck && pnpm build
```

Previews stub missing site URLs via `scripts/ensure-preview-env.mjs`. Without
`OPENAI_API_KEY`, `/api/responses` returns 503; the rest of the site works.
