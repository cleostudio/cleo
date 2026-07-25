# Handoff

Current as of July 2026 (Cleo fork).

## Product

English-only personal site with:

- MDX blog, Explore countries (about + place photo each), projects, newsletters
- Photos: masonry of beautiful places for every country (`content/country-guides.json`)
- Cleo AI agent at `/cleo` powered by **OpenAI only**

There is **no** Clerk auth, Neon/Postgres, Bunny media, AMA booking, Stripe,
Resend, Google, Tencent, Upstash, or Vercel Analytics.

## Architecture

- Next.js 16.3 preview, React 19, TypeScript, Tailwind CSS v4, Base UI
- Posts: `content/blog/<slug>/` via owned content route
- Explore: `lib/countries.ts` + `/explore`
- Cleo: `components/cleo/*`, `lib/cleo/*`, `POST /api/responses`
- Env: `OPENAI_API_KEY`, `PUBLIC_SITE_URL`, `SITE_URL` (see `.env.example`)
- Social footer counts: baked JSON in `content/social.json` + `content/github.json`
- Former `/ama` and `/admin` URLs redirect away (Explore / home)

## Design

Visual contract: `docs/design-language.md` (including § Paper-artifact doorway
vignettes for homepage NavCards).

## Local / Preview

```bash
pnpm install
cp .env.example .env.local   # set OPENAI_API_KEY
pnpm dev
pnpm typecheck && pnpm build
```

Previews stub missing site URLs via `scripts/ensure-preview-env.mjs`. Without
`OPENAI_API_KEY`, `/api/responses` returns 503; the rest of the site works.
