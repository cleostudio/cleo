# Cleo

**Cleo** is an English-only general-knowledge portal with a chat agent on the
dock at `/cleo`.

The public site includes a homepage for country search, highlighted places, and
topic discovery; Explore country field guides; Space field guides at `/space`;
a place Gallery at `/gallery`; a Topics catalog; Writing (for a future
encyclopedia layer); and a browser-only agent with streamed Markdown, vision,
image generation, and live reasoning / web-search activity.

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
- **OpenAI** is the only third-party API (`OPENAI_API_KEY` → `POST /api/responses`)
- Cleo agent: `components/cleo/*`, `lib/cleo/*`
- Bottom dock: Writing, Gallery, Explore, Topics, Cleo

Site design notes live under `docs/`. Cleo-specific agent notes live in
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
