# Handoff

Current as of August 2026 (Cleo fork).

## Product

General-knowledge portal:

- **Homepage** — one search bar over the whole portal (countries, Space bodies,
  curated photographs, Writing, topic collections, portal surfaces) with an Ask
  Cleo row → `/cleo?q=…`; highlighted places; topic discovery; recent Writing.
  No personal contact / music / books / photo-wall sections.
- **Explore** — country field guides at `/explore/[slug]`
- **Space** — Solar System, Moons, Deep Space at `/space` and `/space/[slug]`
- **Gallery** — editor-selected featured photo per Explore place and Space body
- **Topics** — catalog in `lib/topics.ts` (Countries + Space first)
- **Writing** — MDX under `content/blog/` (kept for a future encyclopedia layer)
- **Cleo** — agent at `/cleo`, OpenAI only
- **Accounts + threads** — Better Auth (passkeys + GitHub) at `/sign-in`.
  Signed-in Cleo threads persist to Postgres and follow the user across
  devices; signed-out visitors keep IndexedDB threads. Local threads can be
  adopted on first sign-in (same UUID PKs). Soft delete + JSON export are
  Server Actions. Image bytes in Blob are still Stage 3.

**Not in product:** Clerk, Bunny media, AMA booking, Stripe, Resend, Google,
Tencent, Upstash. Neon Postgres holds Better Auth tables plus Cleo `thread` /
`message` / `message_image` / `message_reasoning`. Vercel Web Analytics and
Speed Insights are mounted in the root document — enable both products in the
Vercel dashboard.

Former `/ama`, `/admin` redirect away. `/projects` → `/topics`, `/photos` →
`/gallery`. Projects UI, vinyl/bookshelf, and social cards remain in-repo for
reuse.

## Architecture map

| Area | Key paths |
| --- | --- |
| Posts | `content/blog/<slug>/` |
| Explore / atlas | `lib/countries.ts`, `lib/atlas/*`, `content/atlas.json`, `/explore` |
| Space | `lib/space.ts`, `content/space-photos.json`, `/space` |
| Gallery | `lib/gallery.ts`, `/gallery` (`galleryItemDomId` + `place-gallery-target`) |
| Homepage search | `lib/site-search-catalog.ts`, `lib/site-search.ts`, `components/home-site-search.tsx` |
| Cleo | `components/cleo/*`, `lib/cleo/*`, `POST /api/responses` |
| Threads (signed-out) | IndexedDB via `lib/cleo/thread-store.ts`, `/cleo/[threadId]` |
| Threads (signed-in) | Postgres via `lib/cleo/thread-repository.ts`, `/cleo/[threadId]` |
| Auth | `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`, session hint `cleo.session-hint` |
| Place images | `public/images/atlas/`, `public/images/space/` (static `srcset`) |
| Country prose | `scripts/atlas/atlas-about.json` via `pnpm write:atlas-about` |
| Env | `OPENAI_API_KEY`, site URLs, `DATABASE_URL`, `BETTER_AUTH_*`, GitHub OAuth (`.env.example`) |
| Social seeds | `content/social.json`, `content/github.json` (components retained; not in chrome) |

Deep runbooks: [`cleo.md`](./cleo.md), [`homepage-search.md`](./homepage-search.md),
[`atlas.md`](./atlas.md), [`space.md`](./space.md),
[`plan-accounts-and-threads.md`](./plan-accounts-and-threads.md),
[`adr-better-auth.md`](./adr-better-auth.md).

Content routes never read the session (○). `/cleo` may read it in an RSC (◐).

## Design

- Token contract: [`theme-preset.md`](./theme-preset.md)
- Full visual/interaction spec: [`design-language.md`](./design-language.md)
  (incl. paper-artifact doorway vignettes — `NavCards` retained, not mounted on
  the current homepage)
- Country pages: warm-paper field-guide layout (passport labels, hairline rules,
  zoomable contact-print hero)

## Local / Preview

```bash
pnpm install
cp .env.example .env.local   # set OPENAI_API_KEY; DATABASE_URL + BETTER_AUTH_*
# Local Postgres is fine when Neon is not provisioned yet.
pnpm db:push                 # apply auth + thread schema (drizzle-kit)
pnpm validate:atlas
pnpm dev
pnpm typecheck && pnpm build
```

On Vercel: `vercel install neon`, set `BETTER_AUTH_SECRET`, create a GitHub
OAuth app with callback `{origin}/api/auth/callback/github` for production and
preview URLs. `scripts/ensure-preview-env.mjs` stubs missing auth/DB vars so
`prebuild` does not fail without a live database. Without `OPENAI_API_KEY`,
`/api/responses` returns 503; the rest of the site works.
