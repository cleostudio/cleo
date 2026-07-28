# Cleo

**Cleo** is an English-only general-knowledge portal with a chat agent on the
dock at `/cleo`.

The public site includes a homepage with unified topic search (countries, space,
collections), highlighted places, topic discovery, and recent Writing posts;
Explore country field
guides; Space field guides at `/space`; a place Gallery at `/gallery`; a Topics
catalog; Writing (for a future encyclopedia layer); and a browser-only agent
with streamed Markdown, vision, image generation, and live reasoning /
web-search activity.

Legacy `/en/...` URLs permanently redirect to the unprefixed English paths.
`/photos` permanently redirects to `/gallery`.

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4
- Base UI primitives with the `@fluid` component registry
- MDX posts under `content/blog/`; English-only public routes
- Country guides: `content/atlas.json` + optimized static JPEGs in
  `public/images/atlas/` (no image CDN/account at runtime)
- Space guides: `lib/space.ts` + `content/space-photos.json` + JPEGs in
  `public/images/space/`
- **OpenAI** is the only third-party API for app features (`OPENAI_API_KEY` →
  `POST /api/responses`)
- Vercel Web Analytics + Speed Insights in the root document (enable both in
  the Vercel project dashboard)
- Cleo agent: `components/cleo/*`, `lib/cleo/*` (instructions include the
  Explore/Space catalog so replies can deep-link field guides and embed
  curated topic photographs when a visual helps; topic and chat images use
  the same click-to-zoom lightbox as Gallery). Multi-turn turns replay
  encrypted reasoning under `store: false`; incomplete/stopped answers offer
  Retry/Continue)
- Bottom dock: Writing, Gallery, Explore, Topics, Cleo

Design contract: [`docs/theme-preset.md`](./docs/theme-preset.md) and
[`docs/design-language.md`](./docs/design-language.md). Site status:
[`docs/handoff.md`](./docs/handoff.md). Agent notes:
[`AGENTS.md`](./AGENTS.md).

## Local development

```bash
corepack enable
pnpm install
cp .env.example .env.local
# Set OPENAI_API_KEY for /cleo
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Cleo is on the dock (or
`/cleo`). The OpenAI key stays server-side; never expose it through
`NEXT_PUBLIC_` or commit `.env.local`.

## Validation

```bash
pnpm typecheck
pnpm build
```

Then manually verify `/cleo` chat, streaming, cancellation, attachments, and
theme/dock coexistence.

## Preview deploys

Vercel Git deployments build previews. `pnpm build` stubs `SITE_URL` /
`PUBLIC_SITE_URL` when missing via `scripts/ensure-preview-env.mjs`.
