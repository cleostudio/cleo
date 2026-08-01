# Handoff

Current as of August 2026 (Cleo fork).

## Product

English-only general-knowledge portal with:

- Homepage: one search bar over the whole portal — countries, Space bodies,
  curated photographs, Writing posts, topic collections, portal surfaces — with
  an Ask Cleo row that hands the question to `/cleo?q=…`; highlighted places,
  topic discovery, recent Writing posts (no personal contact / music / books /
  photo-wall sections)
- MDX Writing (kept for a future Wikipedia-like knowledge layer), Explore
  country field guides, Space field guides, Topics catalog (countries and
  space first; more topics later)
- Gallery: photographs from Explore places and Space guides
  (`content/atlas.json`, `content/space-photos.json`, optimized static JPEGs)
- Cleo AI agent at `/cleo` powered by **OpenAI only**
- **Accounts + thread sync (Stage 2a/2b):** Better Auth passkeys + GitHub at
  `/sign-in`. Signed-in Cleo threads persist to Postgres and follow the user
  across devices; signed-out visitors keep Stage 1 IndexedDB threads. Local
  threads can be adopted on first sign-in (same UUID PKs). Soft delete +
  JSON export live as Server Actions. Image bytes in Blob are Stage 3.

There is **no** Clerk, Bunny media, AMA booking, Stripe, Resend, Google,
Tencent, or Upstash. Neon Postgres holds Better Auth tables plus Cleo
`thread` / `message` / `message_image` / `message_reasoning`. Vercel Web
Analytics and Speed Insights are enabled via `@vercel/analytics` /
`@vercel/speed-insights` in the root document (enable both products in the
Vercel project dashboard).

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4, Base UI
- Posts: `content/blog/<slug>/` via owned content route
- Explore / Gallery: `lib/countries.ts`, `lib/atlas/*`, `/explore`, `/gallery`
- Space: `lib/space.ts`, `content/space-photos.json`, `/space`, `/space/[slug]`
- Gallery: `lib/gallery.ts` unifies atlas + space photos for `/gallery`
- Homepage search: `lib/site-search-catalog.ts`, `lib/site-search.ts`,
  `components/home-site-search.tsx`, `lib/cleo/ask-link.ts`
- Cleo: `components/cleo/*`, `lib/cleo/*`, `POST /api/responses`; signed-out
  threads in IndexedDB (`lib/cleo/thread-store.ts`); signed-in threads in
  Postgres (`lib/cleo/thread-repository.ts`, `/cleo/[threadId]`)
- Auth: `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`,
  session hint `cleo.session-hint` (`lib/auth-session-hint.ts`), dock chrome in
  Preferences. Content routes never read the session; `/cleo` RSC may.
- Env: see `.env.example` (`OPENAI_API_KEY`, site URLs, `DATABASE_URL`,
  `BETTER_AUTH_*`, GitHub OAuth)
- Plan: `docs/plan-accounts-and-threads.md`

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
`prebuild` does not fail without a live database.
