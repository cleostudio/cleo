# Cleo

**Cleo** is a general-knowledge portal. Start with countries and space; ask the
dock chat agent at `/cleo` when you need a conversation.

The homepage is a neutral portal: one search bar over countries, Space bodies,
curated photographs, Writing posts, topic collections, and site surfaces, plus
highlighted places, topic discovery, and recent Writing. Explore field guides
live at `/explore/[slug]`, Space at `/space/[slug]`, photographs at `/gallery`,
topics at `/topics`, Writing at `/blog`, and the agent at `/cleo`.

Legacy `/en/...` URLs permanently redirect to the unprefixed paths.
`/photos` → `/gallery`. `/projects` → `/topics`.

## Quick start

```bash
corepack enable
pnpm install
cp .env.example .env.local
# Set OPENAI_API_KEY for /cleo (optional for the rest of the site)
# Set DATABASE_URL + BETTER_AUTH_SECRET (+ optional GitHub OAuth) for /sign-in
# Local Postgres works; on Vercel use `vercel install neon`.
pnpm db:push
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Cleo is on the dock (or
`/cleo`). Sign-in is under dock Preferences → Sign in, or `/sign-in`. Keep the
OpenAI key server-side — never expose it with `NEXT_PUBLIC_` or commit
`.env.local`.

Auth + thread schema is applied with `pnpm db:push` (`drizzle-kit`; load
`.env.local` yourself — drizzle-kit does not). See
[`docs/plan-accounts-and-threads.md`](./docs/plan-accounts-and-threads.md) and
[`docs/adr-better-auth.md`](./docs/adr-better-auth.md).

## Stack

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4
- Base UI primitives (`@fluid` registry)
- MDX Writing under `content/blog/`
- Country guides: `content/atlas.json` + static JPEGs in `public/images/atlas/`
- Space guides: `lib/space.ts` + `content/space-photos.json` + `public/images/space/`
- OpenAI Responses API for `/api/responses` only
- Better Auth (passkeys + GitHub) + Neon/Postgres for accounts and signed-in
  Cleo threads; signed-out visitors keep IndexedDB threads
- Vercel Web Analytics + Speed Insights (enable both in the Vercel dashboard)

## Docs

| Doc | Purpose |
| --- | --- |
| [`docs/handoff.md`](./docs/handoff.md) | Current product status |
| [`docs/README.md`](./docs/README.md) | Full documentation map |
| [`AGENTS.md`](./AGENTS.md) | Instructions for coding agents |
| [`docs/plan-accounts-and-threads.md`](./docs/plan-accounts-and-threads.md) | Accounts + thread history plan |
| [`docs/theme-preset.md`](./docs/theme-preset.md) | Enforced visual token contract |
| [`docs/design-language.md`](./docs/design-language.md) | Full UI/UX spec |

## Validate

```bash
pnpm typecheck
pnpm test:unit
pnpm build
```

After media or manifest edits: `pnpm validate:atlas` and/or `pnpm validate:space`.

Manually check homepage search (typing, arrows, Ask Cleo), `/cleo` streaming and
cancellation, the dock Location preference (including denied permission), and
theme/dock coexistence on desktop and mobile.

## Preview deploys

Vercel Git deployments build previews. `pnpm build` stubs missing `SITE_URL` /
`PUBLIC_SITE_URL` and auth/DB placeholders via `scripts/ensure-preview-env.mjs`.
Real Neon and GitHub OAuth credentials are required before sign-in works on a
preview.
