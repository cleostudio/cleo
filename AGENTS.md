# Cleo + cali.so

This repository hosts [Cali Castle's personal site](https://cali.so) (v3) with
**Cleo**, a general-purpose AI agent, mounted as a public dock page at `/cleo`
(and `/en/cleo`).

Picking up work? Read `docs/handoff.md` for site status, then this file for the
Cleo surface.

## Agent skills (site)

### Issue tracker / triage / design / domain

See the cali.so guidance retained under `docs/agents/` and
`docs/design-language.md`. Multi-context map: `CONTEXT-MAP.md`.

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

Conversation state is browser-only and clears on reload. Cleo itself has no
accounts. Site admin/AMA/media continue to use Clerk, Neon, Bunny, and the
fail-closed provider pairs documented in `.env.example`.

`POST /api/responses` accepts at most 50 messages, 10,000 characters each and
100,000 total, with a final `user` message. User and assistant messages may
include up to 4 image data URLs each (PNG, JPEG, WEBP, GIF).

## Development rules

- Use `pnpm` only (`packageManager` in `package.json`). Node `>=22`.
- Before changing framework code, read the relevant Next.js guide in
  `node_modules/next/dist/docs/`.
- Path alias is `~/*`. Keep OpenAI calls and `OPENAI_API_KEY` on the server.
- Use the OpenAI developer docs MCP for API/SDK/model/prompt work on Cleo.
- Preserve the accessible paper shell and bottom dock. Render Cleo Markdown
  through Streamdown, never raw HTML.
- Update `README.md` and this file when setup or Cleo behavior changes.

## Verification

- Site: follow the cali.so suite in `README.md` (`typecheck`, unit/media/ama
  tests, `build`, verify scripts) for the change surface you touched.
- Cleo: exercise `/cleo` multi-turn chat, reasoning activity, web search,
  image attach/vision, image generation, streaming, cancellation, and API
  errors. Without `OPENAI_API_KEY`, `/api/responses` returns HTTP 503 while
  the page remains available.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
<!-- END:nextjs-agent-rules -->
