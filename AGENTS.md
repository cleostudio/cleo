# Cleo

This repository hosts the **Cleo** site (v3, English-only): a general-knowledge
portal starting with countries and space. The homepage is a neutral portal
(unified topic search, highlighted places, topic discovery, recent Writing
posts). Explore field guides live
at `/explore/[slug]`, an interactive Earth map at `/maps`, Space guides at
`/space/[slug]`, the place Gallery at `/gallery`, Topics at `/topics`, Writing
at `/blog` (future encyclopedia-like layer), and the AI agent at `/cleo`.
`/photos` permanently redirects to `/gallery`; `/projects` permanently
redirects to `/topics`. Projects UI, vinyl/bookshelf, and social card
components remain in the repo for later reuse.

Country guide records live in `content/atlas.json` (one entry per Explore slug).
Orientation prose is curated, not generated at build time. It lives in
`scripts/atlas/atlas-about.json` and is written once by hand with
`pnpm write:atlas-about` (needs `OPENAI_API_KEY`; every draft is checked for
length, recycled phrasing, and volatile claims before it is kept). The site
never calls a model to render a page. `lib/atlas/prose.test.ts` holds the
corpus to that bar — no sentence may appear in two countries.

Assemble the manifest with `pnpm generate:atlas-content`, curate accurate
Wikimedia Commons place photos with `pnpm curate:atlas-photos`, then import
optimized local JPEG renditions with `pnpm import:atlas-photos`. Validate with
`pnpm validate:atlas`. After atlas or space photo imports change caption or
rendition metadata, refresh Cleo’s slim zoom index with
`pnpm generate:cleo-topic-photo-zoom`. Originals stay in `.atlas-originals/` (gitignored);
public assets are under `public/images/atlas/{slug}/` and are served as static
files with browser `srcset` — no account, CDN, or `/_next/image` re-encode at
runtime.

Space field guides live in `lib/space.ts` (Solar System, Moons, Deep Space —
planets, major moons, ISS, galaxies, nebulae) and render at `/space` and
`/space/[slug]`. Curated NASA photographs are imported with
`pnpm import:space-photos` into `public/images/space/{slug}/` and
`content/space-photos.json`; validate with `pnpm validate:space`. The Gallery
at `/gallery` shows both Explore place photos and Space body photos.
The Topics catalog in `lib/topics.ts` lists Countries, Maps, and Space.

Maps (`/maps`) is a full-bleed MapLibre Earth plate: NASA Blue Marble
Next Generation (21600×10800, July 2004 topo+bathymetry) reprojected to
Web-Mercator JPEG tiles z0–z6 under `public/images/maps/tiles/` (bilinear,
mozjpeg q90, 4:4:4) and Natural Earth admin-0 borders at
`public/maps/countries.geojson`, with a camera index at
`public/maps/country-index.json`. Country and continent symbol labels use
first-party Open Sans SDF glyphs under `public/maplibre/fonts/`. Admin-0
capital points live in `public/maps/capitals.geojson` (Natural Earth 10m,
cross-checked against atlas capital names; curated territory capitals/regions
in `scripts/maps/territory-meta.json`). HUD toggles show/hide borders,
labels (including capital dots/names), and a 30° graticule (session preference
+ shareable `borders` / `labels` / `graticule` query flags). The shell unlocks
via `html[data-maps-route]` (same pattern as Cleo) so the basemap fills the
viewport with paper/glass HUD chrome above the dock. Deep links use
`/maps?country=[slug|iso]` or
`/maps?region=[africa|americas|asia|europe|oceania]`. Pan/zoom also syncs a
MapLibre-style camera hash (`#zoom/lat/lng`) so “Share” can copy the exact
view; country/region params still win on load and use `history.pushState` so
Back/Forward restores focus; clearing focus (or `hashchange` without a
country/region) restores the camera hash. Search matches country name or
capital (capital hits fly to the city; search ranks capital matches and labels
territories). The idle plate offers starter chips; the selection dossier
offers Nearby / region Place chips, Fit country/region, Show capital, Share
place/region (with live camera hash), region jump from territories, and
“Back to map”. Shared `?country=` / `?region=` links that include
`#zoom/lat/lng` keep that framing on open. Escape from the dossier or
search refocuses the canvas; Escape on the map clears. Enter selects the
place at center. The meta HUD shows a hover nameplate and Share view.
Mobile dossiers scroll inside a height budget. Explore guides and Gallery
tiles link with “View on map” / Photos (`/gallery?q=`); dossier thumbs and
Photos actions open the filtered Gallery; homepage search/highlights
deep-link into Maps; `?country=` / `?region=` set titles and canonicals
(Maps OG + sitemap include region/country deep links); Cleo may cite the
same map paths (including territory ISO links).
MapLibre’s module workers are
vendored to `public/maplibre/` so Turbopack/Next can load them under the site
CSP. Regenerate from a local 21600 source with
`pnpm prepare:maps -- --blue-marble=/path/to/21600.jpg` (`--skip-tiles`
refreshes vectors/index/capitals only; capitals need
`--places=/path/to/ne_10m_populated_places`); validate with
`pnpm validate:maps`. No third-party tile or glyph CDN — assets stay on-origin.

Picking up work? Read `docs/handoff.md` for site status, then this file for the
Cleo agent surface.

## UI/UX theme preset

The theme is inherited from [cali.so](https://github.com/CaliCastle/cali.so),
which this repo forks. Treat it as upstream for anything visual.

- Contract: `lib/theme-preset.ts` names every token the UI may depend on and
 pins the values that define the look. `lib/theme-preset.test.ts` enforces it
 against `app/globals.css`.
- Rules and deviations: `docs/theme-preset.md`.
- Full visual spec: `docs/design-language.md`.

Before adding a color, duration, radius, or width, find the token. Semantic
colors only — never a hex, never a raw `--gray-N` in a component. Two easings
(`--ease-swift`, `--ease-spring`) and nothing else. The page column is
`max-w-content` / `max-w-content-narrow`, never a literal. Departing from
cali.so is a design decision: record it in both the deviations table and
`presetDeviations`.

## Design notes

Homepage doorway vignettes: `docs/design-language.md` § Paper-artifact doorway
vignettes (`NavCards` retained for reuse, not mounted on the current homepage).

## Cleo agent surface

- UI: `components/cleo/ask-form.tsx` owns messages, image attachments,
  cancellation, and NDJSON stream consumption. The page shell is
  `app/_views/cleo-page.tsx`, reached from the bottom dock via `SayHiIcon`
  (`G` then `C`).
- API: `app/api/responses/route.ts` validates messages (including image data
  URLs) and calls the OpenAI Responses API with `gpt-5.6-terra`, `web_search`,
  `image_generation`, reasoning summaries, streaming, and `store: false`.
- Behavior: `lib/cleo/instructions.ts` (base voice + portal catalog from
  `lib/cleo/portal-catalog.ts` so Cleo deep-links Explore/Space guides).
- Protocol: `lib/cleo/stream.ts` (`text`, `activity`, `image`, `error`).
- Images: `lib/cleo/images.ts` and `lib/cleo/client-images.ts`. Topic answers
  may embed curated Explore/Space JPEGs via Markdown (`lib/cleo/topic-photos.ts`
  grounds matching subjects on each turn); Streamdown only allows
  `/images/atlas|space/...` paths. Those Markdown photos (and attachment /
  generated data-URL images) use the shared `ZoomImage` lightbox — curated
  topic photos resolve Gallery-parity caption plates via
  `content/cleo-topic-photo-zoom.json` (`pnpm generate:cleo-topic-photo-zoom`,
  kept in sync by `lib/cleo/topic-photo-zoom.test.ts`).
- Portal starters: `lib/cleo/portal-links.ts` empty-state prompts consumed by
  `components/cleo/ask-form.tsx` (click submits immediately). Guide deep-links
  are inline Markdown in the reply (no separate chip row).
- Styles: `app/cleo.css` (streamdown + prompt dock). Keep the prompt dock above
  the site dock via `--cleo-prompt-bottom`.

Conversation state is browser-only and clears on reload. There is no
authentication, database, media library, or AMA booking.

Vercel Web Analytics and Speed Insights are mounted in
`app/_components/site-document.tsx` (`@vercel/analytics/next`,
`@vercel/speed-insights/next`). Enable both in the Vercel project dashboard
so the first-party `/_vercel/insights/*` and `/_vercel/speed-insights/*`
endpoints are served after deploy.

`POST /api/responses` accepts at most 50 messages, 10,000 characters each and
100,000 total, with a final `user` message. User and assistant messages may
include up to 4 image data URLs each (PNG, JPEG, WEBP, GIF).

## External APIs

**OpenAI is the only third-party API** for application features. Configure
`OPENAI_API_KEY`. Site URLs use `PUBLIC_SITE_URL` / `SITE_URL`. Platform
observability uses Vercel Web Analytics and Speed Insights (no API keys in
the app). Do not reintroduce Clerk, Neon, Bunny, Stripe, Resend, Google,
Tencent, or Upstash without an explicit product decision.

## Development rules

- Use `pnpm` only. Scripts include `dev`, `build`, `start`, `typecheck`, plus
  unit/security suites listed in `package.json`.
- Before changing framework code, read the relevant Next.js guide in
  `node_modules/next/dist/docs/` — this App Router stack has breaking changes
  vs older Next.js.
- Keep OpenAI calls and `OPENAI_API_KEY` on the server.
- Path alias is `~/*`. Prefer existing `cn` helpers and `components/ui/*`.
- Preserve the accessible, responsive glass/paper UI. Render model output
  through Streamdown, never raw HTML.
- Update `README.md` and this file when setup or Cleo behavior changes.

## Verification

- Code: `pnpm typecheck` (and `pnpm build` when changing routes/config).
- Country media: `pnpm validate:atlas` before deploying image or manifest changes.
- Space media: `pnpm validate:space` before deploying Space photo changes.
- Maps media: `pnpm validate:maps` before deploying tiles, borders, or index changes.
- Site: relevant unit tests via `pnpm test:unit` / `pnpm test:security`.
- Cleo: multi-turn chat, reasoning activity, web search, image attach/vision,
  image generation, streaming, cancellation, and relevant errors.
- UI: manually verify changed flows on desktop/mobile and light/dark.

## Cursor Cloud / Previews

- `pnpm dev` starts the only service (default Next port).
- `OPENAI_API_KEY` is injected when available. Without it, `/api/responses`
  returns HTTP 503 while the page remains available for UI work.
- Previews do not need Neon/Bunny/Clerk. `scripts/ensure-preview-env.mjs`
  stubs missing `SITE_URL` / `PUBLIC_SITE_URL` during `prebuild`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
