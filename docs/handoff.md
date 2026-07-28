# Handoff

Current as of July 2026 (Cleo fork).

## Product

English-only general-knowledge portal with:

- Homepage: unified topic search (countries + capitals → Explore, space,
  Writing essays, Maps deep links, collections, portal surfaces),
  highlighted places, topic discovery, recent Writing posts (no personal
  contact / music / books / photo-wall sections)
- MDX Writing (kept for a future Wikipedia-like knowledge layer), Explore
  country field guides, interactive Earth Maps, Space field guides, Topics
  catalog (countries, maps, and space first; more topics later)
- Gallery: searchable photographs from Explore places and Space guides
  (`content/atlas.json`, `content/space-photos.json`, optimized static JPEGs)
- Cleo AI agent at `/cleo` powered by **OpenAI only**

There is **no** Clerk auth, Neon/Postgres, Bunny media, AMA booking, Stripe,
Resend, Google, Tencent, or Upstash. Vercel Web Analytics and Speed Insights
are enabled via `@vercel/analytics` / `@vercel/speed-insights` in the root
document (enable both products in the Vercel project dashboard).

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4, Base UI
- Posts: `content/blog/<slug>/` via owned content route
- Explore / Gallery: `lib/countries.ts`, `lib/atlas/*`, `/explore`, `/gallery`
- Maps: `lib/maps.ts`, `components/earth-map.tsx`, `/maps` (full-bleed MapLibre
  + local NASA BMNG 21600 tiles z0–z6 / bilinear q90 and Natural Earth borders;
  country/continent labels via vendored MapLibre glyphs; Admin-0 capital markers
  (clickable hit pads, selected capital stays visible when Labels are off);
  curated region/capital metadata for no-guide territories; homepage search
  finds territories, capitals (Explore ahead of Maps; capital queries open
  the Maps capital camera), Writing, and continent cameras; Maps combobox
  ranks region cameras ahead of country name hits; dossier Fit country /
  Show capital, Nearby and region Place chips, idle starters, hover
  nameplate, richer search rows, Escape→map then clear (keeps camera;
  Reset/Home still world-reset), dossier Clear action, Enter selects
  center, click country/region/capital labels to select, Borders-off keeps
  country hit-testing, Nearby/Places/region/idle chips restore dossier
  focus on keyboard activation, empty search Clear + region recovery
  (click + keyboard), combobox options activate on click with
  aria-activedescendant (`tabIndex={-1}`), measured `--maps-dossier-lift`
  (scale/zoom/toast/attrib + post-measure re-fit for country-fit map
  clicks; skips capital/shared cameras) and mobile
  `--maps-top-chrome-height` (meta stacks under search; hidden while
  suggestions open), share cancel returns aborted (no silent copy),
  Share place prefers capital camera when capital-framed, Share view/place
  with camera (deep links honor shared `#zoom/lat/lng`; hydrate cleans
  country+region URLs), Cleo Maps links keep camera hashes and
  capital-camera guidance, Explore fact-plate capital → Maps capital
  camera, capital deep links arm preferCapital (Share place + “Showing
  Tokyo”), dossier Capital · control, idle Tokyo chip + Cleo Tokyo
  starter, homepage capital search retitles Maps hits, Share region toast,
  Fit region / Share region, territory→region jump, recovery for bad
  links, Maps OG + sitemap deep links, Gallery↔Maps Photos / View on map
  round-trips (`/gallery?q=`), dossier ZoomImage + Escape nesting (incl.
  dock G-chord), region dossiers with photo/Photos, Maps→Space “Earth
  from space”, Explore/Space end-matter Map·Photos·All…, Space index
  Earth row “View on map”, homepage Maps+Space CTAs + intro links, dock
  Space (`G` then `S`), footer Index Maps/Space, lean Cleo portal
  starters (incl. Earth↔Maps + Tokyo capital), keyboard/search dossier
  focus (pointer clicks keep map focus); Back/`hashchange` restore
  camera hash;
  Borders/Labels/ Graticule toggles with shareable layer query flags;
  `#zoom/lat/lng` camera hash + Share view; Back/Forward for country/region
  focus (pushState); capital-aware search + selection dossier; deep-link
  `<title>` / metadata for `?country=` / `?region=`; Cleo `/maps?` link
  presentation + territory starter; paper/glass HUD via
  `html[data-maps-route]`; country/region deep links with antimeridian-aware
  Oceania and mainland-leaning Europe cameras; Explore ↔ Maps region
  round-trips; selection a11y + mobile chrome; Cleo portal map grounding;
  `pnpm prepare:maps` / `pnpm validate:maps`)
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
pnpm validate:space
pnpm validate:maps
pnpm dev
pnpm typecheck && pnpm build
```

Previews stub missing site URLs via `scripts/ensure-preview-env.mjs`. Without
`OPENAI_API_KEY`, `/api/responses` returns 503; the rest of the site works.
