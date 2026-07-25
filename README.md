# Cleo

**Cleo** is an English-only personal site with a general-purpose AI agent on the
dock at `/cleo`.

The public site includes MDX writing, photos, projects, AMA booking, and an
owner admin. Cleo adds a browser-only chat agent with streamed Markdown, vision
attachments, image generation, and live reasoning / web-search activity.

Legacy `/en/...` URLs permanently redirect to the unprefixed English paths.

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4
- Base UI primitives with the `@fluid` component registry
- MDX posts under `content/blog/`; English-only public routes
- Owner admin (Clerk + owner metadata), Bunny media library, AMA booking
- Cleo agent: `components/cleo/*`, `lib/cleo/*`, `POST /api/responses`
- Bottom dock navigation includes Writing, Photos, Projects, AMA, and Cleo

Site, media, AMA, and security docs live under `docs/`. Cleo-specific agent
notes live in [`AGENTS.md`](./AGENTS.md).

## Local development

Use the pnpm version declared in `package.json` and isolated development
credentials. Never copy production data or secrets into a local or Preview
environment.

```bash
corepack enable
pnpm install
cp .env.example .env.local
# Set OPENAI_API_KEY for /cleo. Other vars follow fail-closed provider rules.
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Cleo is on the dock (or
`/cleo`). The OpenAI key stays in the server-side route; never expose it
through `NEXT_PUBLIC_` or commit `.env.local`.

`.env.example` documents runtime variables and fail-closed provider boundaries
for the site, plus `OPENAI_API_KEY` for Cleo.

## Validation

Run the checks relevant to a change:

```bash
pnpm typecheck
pnpm build
```

Then manually verify `/cleo` chat, streaming, cancellation, attachments, and
theme/dock coexistence. Broader site/media/ama suites are listed in
`package.json`.

## Preview deploys

This repo enables Vercel Git deployments for branch previews. Hobby-incompatible
cron jobs are omitted so `cleostudio/cleo` previews can ship.

`pnpm build` runs `scripts/ensure-preview-env.mjs` so a preview host that only
has `OPENAI_API_KEY` can still compile: missing Neon/Clerk/Bunny pairs are
stubbed for build, and those features fail closed at runtime until real
credentials are configured.

Photos require a real Neon `DATABASE_URL`, Bunny CDN, and a published selection
from `/admin/photos`. Without those, `/photos` shows an empty state on Preview.

## Attribution

Site design system and application source originate from
[CaliCastle/cali.so](https://github.com/CaliCastle/cali.so) (MIT for original
application source; personal content and assets remain under their respective
rights — see `LICENSE`). The live site URL may still be configured via
`PUBLIC_SITE_URL` (defaults to `https://cali.so` in production).
