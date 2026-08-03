# Cleo

**Cleo** is a general-knowledge portal. Start with countries, space,
civilizations, cities, oceans, and rivers; ask the dock chat agent at `/cleo` when you need a
conversation.

The homepage is a neutral portal: one search bar over countries, Space bodies,
civilizations, cities, oceans, rivers, curated photographs, Writing posts, topic collections,
and site surfaces, plus highlighted places, topic discovery, and recent Writing.
Explore country pages live at `/explore/[slug]`, Space at `/space/[slug]`,
Civilizations at `/civilizations/[slug]`, Cities at `/cities/[slug]`, Oceans at
`/oceans/[slug]`, Rivers at `/rivers/[slug]`,
photographs at `/gallery`, topics at `/topics`, Writing at `/blog`, and the
agent at `/cleo`.

Legacy `/en/...` URLs permanently redirect to the unprefixed paths.
`/photos` → `/gallery`. `/projects` → `/topics`.

## Quick start

```bash
corepack enable
pnpm install
cp .env.example .env.local
# Set OPENAI_API_KEY for /cleo (optional for the rest of the site)
# For account auth: provision Neon via Vercel Marketplace, pull DATABASE_URL,
# set BETTER_AUTH_SECRET, then `pnpm db:push` (see docs/auth.md)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Keep the OpenAI key,
`BETTER_AUTH_SECRET`, `BETTER_AUTH_API_KEY`, and database URLs server-side — never expose them with
`NEXT_PUBLIC_` or commit `.env.local`.

## Stack

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4
- Base UI primitives (`@fluid` registry)
- MDX Writing under `content/blog/`
- Country pages: `content/atlas.json` + static JPEGs in `public/images/atlas/`
- Space pages: `lib/space.ts` + `content/space-photos.json` + `public/images/space/`
- Civilizations pages: `lib/civilizations.ts` + `content/civilizations-photos.json` + `public/images/civilizations/`
- Cities pages: `lib/cities.ts` + `content/cities-photos.json` + `public/images/cities/`
- Oceans pages: `lib/oceans.ts` + `content/oceans-photos.json` + `public/images/oceans/`
- Rivers pages: `lib/rivers.ts` + `content/rivers-photos.json` + `public/images/rivers/`
- OpenAI Responses API for `/api/responses` only
- Better Auth (email/password) on Neon Postgres for `/sign-in` / `/account`
- Vercel Web Analytics + Speed Insights (enable both in the Vercel dashboard)

## Docs

| Doc | Purpose |
| --- | --- |
| [`docs/handoff.md`](./docs/handoff.md) | Current product status |
| [`docs/README.md`](./docs/README.md) | Full documentation map |
| [`AGENTS.md`](./AGENTS.md) | Instructions for coding agents |
| [`docs/theme-preset.md`](./docs/theme-preset.md) | Enforced visual token contract |
| [`docs/design-language.md`](./docs/design-language.md) | Full UI/UX spec |
| [`docs/auth.md`](./docs/auth.md) | Better Auth + Neon account setup |

## Validate

```bash
pnpm typecheck
pnpm test:unit
pnpm build
```

After media or manifest edits: `pnpm validate:atlas`, `pnpm validate:space`,
`pnpm validate:civilizations`, `pnpm validate:cities`, `pnpm validate:oceans`,
and/or `pnpm validate:rivers`.

Manually check homepage search (typing, arrows, Ask Cleo), `/cleo` streaming and
cancellation, the dock Location preference (including denied permission), and
theme/dock coexistence on desktop and mobile.

## Preview deploys

Vercel Git deployments build previews. `pnpm build` stubs missing `SITE_URL` /
`PUBLIC_SITE_URL` via `scripts/ensure-preview-env.mjs`.
