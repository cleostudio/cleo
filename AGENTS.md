# Cleo

This repository hosts the **Cleo** site (v3, English-only) with Explore country
field guides at `/explore/[slug]`, a filterable Country Atlas at `/photos`, and
a general-purpose AI agent on the dock at `/cleo`.

Country atlas records live in `content/atlas.json` (one entry per Explore slug).
Generate evergreen copy with `pnpm generate:atlas-content`, then import curated
Pexels place photos into optimized local JPEG renditions with
`pnpm import:atlas-photos`. Validate with `pnpm validate:atlas`. Originals stay
in `.atlas-originals/` (gitignored); public assets are under
`public/images/atlas/{slug}/` and are served as static files with browser
`srcset` — no account, Pexels API, Bunny CDN, or `/_next/image` re-encode at
runtime.

Picking up work? Read `docs/handoff.md` for site status, then this file for the
Cleo agent surface.

## Agent skills (site)

### Issue tracker / triage / design / domain

See the site guidance retained under `docs/agents/` and
`docs/design-language.md` (homepage doorways: § Paper-artifact doorway
vignettes). Multi-context map: `CONTEXT-MAP.md`.

## Cleo agent surface

- UI: `components/cleo/ask-form.tsx` owns messages, image attachments,
  cancellation, and NDJSON stream consumption. The page shell is
  `app/_views/cleo-page.tsx`, reached from the bottom dock via `SayHiIcon`
  (`G` then `C`).
- API: `app/api/responses/route.ts` validates messages (including image data
  URLs) and calls the OpenAI Responses API with `gpt-5.6-terra`, `web_search`,
  `image_generation`, reasoning summaries, streaming, and `store: false`.
- Behavior: `lib/cleo/instructions.ts`.
- Protocol: `lib/cleo/stream.ts` (`text`, `activity`, `image`, `error`).
- Images: `lib/cleo/images.ts` and `lib/cleo/client-images.ts`.
- Styles: `app/cleo.css` (streamdown + prompt dock). Keep the prompt dock above
  the site dock via `--cleo-prompt-bottom`.

Conversation state is browser-only and clears on reload. There is no
authentication, database, media library, AMA booking, or analytics.

`POST /api/responses` accepts at most 50 messages, 10,000 characters each and
100,000 total, with a final `user` message. User and assistant messages may
include up to 4 image data URLs each (PNG, JPEG, WEBP, GIF).

## External APIs

**OpenAI is the only third-party API.** Configure `OPENAI_API_KEY`. Site URLs
use `PUBLIC_SITE_URL` / `SITE_URL`. Do not reintroduce Clerk, Neon, Bunny,
Stripe, Resend, Google, Tencent, Upstash, or Vercel Analytics without an
explicit product decision.

## Development rules

- Use `pnpm` only. Scripts include `dev`, `build`, `start`, `typecheck`, plus
  unit/security/browser suites listed in `package.json`.
- Before changing framework code, read the relevant Next.js guide in
  `node_modules/next/dist/docs/` — this App Router stack has breaking changes
  vs older Next.js.
- Keep OpenAI calls and `OPENAI_API_KEY` on the server.
- Path alias is `~/*`. Prefer existing `cn` helpers and `components/ui/*`.
- Preserve the accessible, responsive glass/paper UI. Render model output
  through Streamdown, never raw HTML.
- Update `README.md` and this file when setup or Cleo behavior changes.

## Verification

- Code: `pnpm typecheck` (and `pnpm build` when changing routes/config).
- Atlas: `pnpm validate:atlas` before deploying image or manifest changes.
- Site: relevant unit tests via `pnpm test:unit` / `pnpm test:security`.
- Cleo: multi-turn chat, reasoning activity, web search, image attach/vision,
  image generation, streaming, cancellation, and relevant errors.
- UI: manually verify changed flows on desktop/mobile and light/dark.

## Cursor Cloud / Previews

- `pnpm dev` starts the only service (default Next port).
- `OPENAI_API_KEY` is injected when available. Without it, `/api/responses`
  returns HTTP 503 while the page remains available for UI work.
- Previews do not need Neon/Bunny/Clerk. `scripts/ensure-preview-env.mjs`
  stubs missing `SITE_URL` / `PUBLIC_SITE_URL` during `prebuild`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
