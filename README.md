# Cleo

**Cleo** is an English-only personal site with a general-purpose AI agent on the
dock at `/cleo`.

The public site includes MDX writing, Explore countries, projects, and a
browser-only chat agent with streamed Markdown, vision attachments, image
generation, and live reasoning / web-search activity.

Legacy `/en/...` URLs permanently redirect to the unprefixed English paths.

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4
- Base UI primitives with the `@fluid` component registry
- MDX posts under `content/blog/`; English-only public routes
- **OpenAI** is the only third-party API (`OPENAI_API_KEY` → `POST /api/responses`)
- Cleo agent: `components/cleo/*`, `lib/cleo/*`
- Bottom dock: Writing, Photos (empty placeholder), Projects, Explore, Cleo

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
`PUBLIC_SITE_URL` when missing. Cleo needs `OPENAI_API_KEY`; without it,
`/api/responses` returns HTTP 503 while the rest of the site stays available.

## Attribution

Site design system and application source originate from
[CaliCastle/cali.so](https://github.com/CaliCastle/cali.so) (MIT for original
application source; personal content and assets remain under their respective
rights — see `LICENSE`).
