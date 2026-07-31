# Cleo

**Cleo** is an English-only general-knowledge portal. Start with countries and
space; ask the dock chat agent at `/cleo` when you need a conversation.

The homepage is a neutral portal: one search bar over countries, Space bodies,
curated photographs, Writing posts, topic collections, and site surfaces, plus
highlighted places, topic discovery, and recent Writing. Explore field guides
live at `/explore/[slug]`, Space at `/space/[slug]`, photographs at `/gallery`,
topics at `/topics`, Writing at `/blog`, and the agent at `/cleo`.

Legacy `/en/...` URLs permanently redirect to unprefixed English paths.
`/photos` → `/gallery`. `/projects` → `/topics`.

## Quick start

```bash
corepack enable
pnpm install
cp .env.example .env.local
# Set OPENAI_API_KEY for /cleo (optional for the rest of the site)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Keep the OpenAI key
server-side — never expose it with `NEXT_PUBLIC_` or commit `.env.local`.

## Stack

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4
- Base UI primitives (`@fluid` registry)
- MDX Writing under `content/blog/`
- Country guides: `content/atlas.json` + static JPEGs in `public/images/atlas/`
- Space guides: `lib/space.ts` + `content/space-photos.json` + `public/images/space/`
- OpenAI Responses API for `/api/responses` only
- Vercel Web Analytics + Speed Insights (enable both in the Vercel dashboard)

## Docs

| Doc | Purpose |
| --- | --- |
| [`docs/handoff.md`](./docs/handoff.md) | Current product status |
| [`docs/README.md`](./docs/README.md) | Full documentation map |
| [`AGENTS.md`](./AGENTS.md) | Instructions for coding agents |
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
`PUBLIC_SITE_URL` via `scripts/ensure-preview-env.mjs`.
