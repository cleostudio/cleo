# Cleo

This repository hosts the **Cleo** site (v3, English-only): a general-knowledge
portal starting with countries and space. The homepage is a neutral portal
(country search, highlighted places, topic discovery). Explore field guides live
at `/explore/[slug]`, Space guides at `/space/[slug]`, the place Gallery at
`/gallery`, Topics at `/topics`, Writing at `/blog` (future encyclopedia-like
layer), and the AI agent at `/cleo`. `/photos` permanently redirects to
`/gallery`; `/projects` permanently redirects to `/topics`. Projects UI,
vinyl/bookshelf, and social card components remain in the repo for later reuse.

Country guide records live in `content/atlas.json` (one entry per Explore slug).
Generate evergreen copy with `pnpm generate:atlas-content`, curate accurate
Wikimedia Commons place photos with `pnpm curate:atlas-photos`, then import
optimized local JPEG renditions with `pnpm import:atlas-photos`. Validate with
`pnpm validate:atlas`. Originals stay in `.atlas-originals/` (gitignored);
public assets are under `public/images/atlas/{slug}/` and are served as static
files with browser `srcset` — no account, CDN, or `/_next/image` re-encode at
runtime.

Space field guides live in `lib/space.ts` (Solar System, Moons, Deep Space —
planets, major moons, ISS, galaxies, nebulae) and render at `/space` and
`/space/[slug]`. Curated NASA photographs are imported with
`pnpm import:space-photos` into `public/images/space/{slug}/` and
`content/space-photos.json`; validate with `pnpm validate:space`. The Gallery
at `/gallery` shows both Explore place photos and Space body photos.
The Topics catalog in `lib/topics.ts` lists Countries and Space.

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
- Behavior: `lib/cleo/instructions.ts` (base voice + portal catalog from
  `lib/cleo/portal-catalog.ts` so Cleo deep-links Explore/Space guides).
- Abuse and cost controls: `lib/security/api-guard.ts` screens every request
  before the body is read. Keep new paid work behind it.
- Protocol: `lib/cleo/stream.ts` (`text`, `activity`, `image`, `error`).
- Images: `lib/cleo/images.ts` and `lib/cleo/client-images.ts`.
- Portal starters: `lib/cleo/portal-links.ts` empty-state prompts consumed by
  `components/cleo/ask-form.tsx`. Guide deep-links are inline Markdown in the
  reply (no separate chip row).
- Styles: `app/cleo.css` (streamdown + prompt dock). Keep the prompt dock above
  the site dock via `--cleo-prompt-bottom`.

Conversation state is browser-only and clears on reload. There is no
authentication, database, media library, AMA booking, or analytics.

`POST /api/responses` accepts at most 50 messages, 10,000 characters each and
100,000 total, with a final `user` message. User and assistant messages may
include up to 4 image data URLs each (PNG, JPEG, WEBP, GIF), capped at 16
images and 6MB decoded across the whole conversation.

The endpoint is unauthenticated and bills OpenAI per call, so
`lib/security/api-guard.ts` rejects cross-origin posts (403) and oversized
bodies (413), throttles per client address (429 with `Retry-After`), and caps
simultaneous upstream streams per instance (503). Tune the limits with
`CLEO_RATE_LIMIT_BURST`, `CLEO_RATE_LIMIT_BURST_WINDOW_SECONDS`,
`CLEO_RATE_LIMIT_HOURLY`, and `CLEO_MAX_CONCURRENT_STREAMS`.

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
- Country media: `pnpm validate:atlas` before deploying image or manifest changes.
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

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
