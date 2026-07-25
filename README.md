# Cleo

Cleo is the product repository that now hosts [cali.so](https://cali.so) — Cali
Castle's personal site — with the **Cleo** AI agent available as a dock page at
`/cleo` (English: `/en/cleo`).

The site remains bilingual (Chinese unprefixed, English under `/en`), with
MDX writing, photos, projects, AMA booking, and an owner admin. Cleo adds a
browser-only chat agent with streamed Markdown, vision attachments, image
generation, and live reasoning / web-search activity.

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4
- Base UI primitives with the `@fluid` component registry
- MDX posts under `content/blog/`; Chinese and English route families
- Owner admin (Clerk + owner metadata), Bunny media library, AMA booking
- Cleo agent: `components/cleo/*`, `lib/cleo/*`, `POST /api/responses`
- Bottom dock navigation includes Writing, Photos, Projects, AMA, and Cleo

Upstream cali.so documentation in `docs/` still applies to site, media, AMA,
and security work. Cleo-specific agent notes live in [`AGENTS.md`](./AGENTS.md).

## Local development

Use the pnpm version declared in `package.json` and isolated development
credentials. Never copy production data or secrets into a local or Preview
environment.

```bash
corepack enable
pnpm install
cp .env.example .env.local
# Set OPENAI_API_KEY for /cleo. Other vars follow cali.so fail-closed rules.
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Cleo is on the dock (or
`/cleo`). The OpenAI key stays in the server-side route; never expose it
through `NEXT_PUBLIC_` or commit `.env.local`.

`.env.example` documents runtime variables and fail-closed provider boundaries
for the site, plus `OPENAI_API_KEY` for Cleo.

## Validation

Run the checks relevant to a change. Before release of site surfaces, prefer
the full cali.so suite from upstream. For Cleo-only changes:

```bash
pnpm typecheck
pnpm build
```

Then manually verify `/cleo` chat, streaming, cancellation, attachments, and
theme/dock coexistence.

## Attribution

Site design system and application source originate from
[CaliCastle/cali.so](https://github.com/CaliCastle/cali.so) (MIT for original
application source; personal content and assets remain under their respective
rights — see `LICENSE`).
