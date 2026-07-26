# Handoff

Current as of July 2026 (Cleo fork).

## Product

English-only general-knowledge portal with:

- Homepage: country search, highlighted places, topic discovery (no personal
  contact / music / books / photo-wall sections)
- MDX Writing (kept for a future Wikipedia-like knowledge layer), Explore
  country field guides, interactive Earth Maps, Space field guides, Topics
  catalog (countries, maps, and space first; more topics later)
- Gallery: filterable photographs from Explore places and Space guides
  (`content/atlas.json`, `content/space-photos.json`, optimized static JPEGs)
- Cleo AI agent at `/cleo` powered by **OpenAI only**

There is **no** Clerk auth, Neon/Postgres, Bunny media, AMA booking, Stripe,
Resend, Google, Tencent, Upstash, or Vercel Analytics.

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4, Base UI
- Posts: `content/blog/<slug>/` via owned content route
- Explore / Gallery: `lib/countries.ts`, `lib/atlas/*`, `/explore`, `/gallery`
- Maps: `lib/maps.ts`, `components/earth-map.tsx`, `/maps` (MapLibre + local
  NASA Blue Marble tiles and Natural Earth borders; country/region deep links
  with antimeridian-aware Oceania and mainland-leaning Europe cameras; Explore
  region “View on map”; Cleo portal map grounding; `pnpm prepare:maps` /
  `pnpm validate:maps`)
- Space: `lib/space.ts`, `content/space-photos.json`, `/space`, `/space/[slug]`
  (Solar System, Moons, Deep Space — planets, major moons, ISS, galaxies, nebulae)
- Gallery: `lib/gallery.ts` unifies atlas + space photos for `/gallery`
- Place images: import-time mozjpeg 640/1280/2048 under `public/images/atlas/`
  (Wikimedia Commons curation, relevance-first + assessments; hand-picks via
  `scripts/atlas/apply-handpicks.mjs` when scoring still misses) and
  `public/images/space/` (NASA); rendered with static `srcset`. No runtime
  image account, API, or third-party fetch. Review aid:
  `tsx scripts/atlas/contact-sheet.mjs --collection=places|space`.
- Country prose: curated in `scripts/atlas/atlas-about.json` via
  `pnpm write:atlas-about` (one-time, needs `OPENAI_API_KEY`); never generated
  at build or request time
- Media workflow: `pnpm generate:atlas-content` → `pnpm curate:atlas-photos` →
  `pnpm import:atlas-photos` → `pnpm validate:atlas`; Space via
  `pnpm import:space-photos` → `pnpm validate:space`
- Cleo: `components/cleo/*`, `lib/cleo/*`, `POST /api/responses`
  (instructions include Explore/Space catalog paths for guide deep-links;
  matching turns also ground curated topic photo paths so replies can embed
  atlas/space JPEGs as Markdown images)
- Env: `OPENAI_API_KEY`, `PUBLIC_SITE_URL`, `SITE_URL` (see `.env.example`)
- Social footer counts: baked JSON in `content/social.json` + `content/github.json`
  (components retained; not linked from the public chrome)
- Former `/ama`, `/admin`, `/projects`, and `/photos` URLs redirect away

## Design

Visual contract: `docs/design-language.md` (including § Paper-artifact doorway
vignettes — `NavCards` retained for reuse, not mounted on the current
homepage). Country pages use the warm-paper field-guide layout (passport
labels, hairline rules, zoomable contact-print hero).

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
