# Handoff

Current as of July 2026 (Cleo fork).

## Product

General-knowledge portal:

- **Homepage** — paper-artifact doorway cards (Writing, Gallery, Explore,
  Topics); one search bar over the whole portal (countries, Space bodies,
  civilizations, cities, oceans, rivers, curated photographs, Writing, topic
  collections, portal surfaces) with an Ask Cleo row → `/cleo?q=…`; highlighted
  places; topic discovery; recent Writing. No personal contact / music / books /
  photo-wall sections.
- **Explore** — country field guides at `/explore/[slug]`
- **Space** — Solar System, Moons, Deep Space at `/space` and `/space/[slug]`
- **Gallery** — editor-selected featured photo per Explore place, Space body,
  Civilizations site, Cities guide, Oceans basin, and Rivers course
- **Civilizations** — historical field guides at `/civilizations` and
  `/civilizations/[slug]` (Africa & Near East, Mediterranean, Asia, Americas,
  Oceania; twenty-eight regional guides)
- **Cities** — capital and route-city field guides at `/cities` and
  `/cities/[slug]` (Mediterranean & Europe, Asia, Africa & Americas; sixteen
  guides)
- **Oceans** — world ocean basin and polar-sea field guides at `/oceans` and
  `/oceans/[slug]` (Pacific, Atlantic, Indian, Arctic, Southern)
- **Rivers** — major world-river field guides at `/rivers` and `/rivers/[slug]`
  (Africa, Asia, Europe & Americas; eleven guides)
- **Topics** — catalog in `lib/topics.ts` (Countries, Space, Civilizations,
  Cities, Oceans, Rivers)
- **Writing** — MDX under `content/blog/` (kept for a future encyclopedia layer)
- **Cleo** — browser-only agent at `/cleo`, OpenAI only
- **Account** — Better Auth email/password on Neon (`/sign-in`, `/sign-up`,
  `/account`); portal content stays public

**Not in product:** Clerk, Bunny media, AMA booking, Stripe, Resend, Google,
Tencent, Upstash. Neon + Better Auth are in product (see [`auth.md`](./auth.md)).
Vercel Web Analytics and Speed Insights are mounted in the root document —
enable both products in the Vercel dashboard.

Former `/ama`, `/admin` redirect away. `/projects` → `/topics`, `/photos` →
`/gallery`. Projects UI, vinyl/bookshelf, and social cards remain in-repo for
reuse.

## Architecture map

| Area | Key paths |
| --- | --- |
| Posts | `content/blog/<slug>/` |
| Explore / atlas | `lib/countries.ts`, `lib/atlas/*`, `content/atlas.json`, `/explore` |
| Space | `lib/space.ts`, `content/space-photos.json`, `/space` |
| Civilizations | `lib/civilizations.ts`, `content/civilizations-photos.json`, `/civilizations` |
| Cities | `lib/cities.ts`, `content/cities-photos.json`, `/cities` |
| Oceans | `lib/oceans.ts`, `content/oceans-photos.json`, `/oceans` |
| Rivers | `lib/rivers.ts`, `content/rivers-photos.json`, `/rivers` |
| Gallery | `lib/gallery.ts`, `/gallery` (`galleryItemDomId` + `place-gallery-target`) |
| Homepage doorways | `components/nav-cards.tsx`, `.nav-card` / `.nc-*` in `app/globals.css` |
| Homepage search | `lib/site-search-catalog.ts`, `lib/site-search.ts`, `components/home-site-search.tsx` |
| Cleo | `components/cleo/*`, `lib/cleo/*`, `POST /api/responses` |
| Auth | `lib/auth.ts`, `lib/db/*`, `/api/auth/[...all]`, `/sign-in` |
| Place images | `public/images/atlas/`, `public/images/space/`, `public/images/civilizations/`, `public/images/cities/`, `public/images/oceans/`, `public/images/rivers/` (static `srcset`) |
| Country prose | `scripts/atlas/atlas-about.json` via `pnpm write:atlas-about` |
| Env | `OPENAI_API_KEY`; Neon `DATABASE_URL` + `BETTER_AUTH_SECRET` for account; optional `PUBLIC_SITE_URL` / `SITE_URL` (`.env.example`) |
| Social seeds | `content/social.json`, `content/github.json` (components retained; not in chrome) |

Deep runbooks: [`cleo.md`](./cleo.md), [`homepage-search.md`](./homepage-search.md),
[`atlas.md`](./atlas.md), [`space.md`](./space.md),
[`civilizations.md`](./civilizations.md), [`cities.md`](./cities.md),
[`oceans.md`](./oceans.md), [`rivers.md`](./rivers.md), [`auth.md`](./auth.md).

## Design

- Token contract: [`theme-preset.md`](./theme-preset.md)
- Full visual/interaction spec: [`design-language.md`](./design-language.md)
  (incl. paper-artifact doorway vignettes — `NavCards` on the homepage for
  Writing, Gallery, Explore, and Topics)
- Country pages: warm-paper field-guide layout (passport labels, hairline rules,
  zoomable contact-print hero)

## Local / Preview

```bash
pnpm install
cp .env.example .env.local   # set OPENAI_API_KEY; Neon + BETTER_AUTH_SECRET for account
pnpm validate:atlas
pnpm dev
pnpm typecheck && pnpm build
```

Previews stub missing site URLs via `scripts/ensure-preview-env.mjs`. Without
`OPENAI_API_KEY`, `/api/responses` returns 503. Without Neon /
`BETTER_AUTH_SECRET`, `/api/auth/*` returns 503; the rest of the site works.
