# Cleo agent surface

Read this when changing `/cleo`, `POST /api/responses`, or anything under
`components/cleo/*` / `lib/cleo/*`.

## Map

| Piece | Path |
| --- | --- |
| UI (messages, attachments, stream, Retry/Continue, `?q=` handoff) | `components/cleo/ask-form.tsx` |
| Page shell | `app/_views/cleo-page.tsx` |
| API route | `app/api/responses/route.ts` |
| Voice + portal catalog | `lib/cleo/instructions.ts`, `lib/cleo/portal-catalog.ts` |
| Guardrails (strip invented Explore/Space paths) | `lib/cleo/guardrails.ts` |
| NDJSON protocol | `lib/cleo/stream.ts` |
| Images (server / client) | `lib/cleo/images.ts`, `lib/cleo/client-images.ts` |
| Curated topic photos in Markdown | `lib/cleo/topic-photos.ts` |
| Zoom caption index | `content/cleo-topic-photo-zoom.json` (`pnpm generate:cleo-topic-photo-zoom`) |
| Empty-state starters | `lib/cleo/portal-links.ts` |
| Ask link builder | `lib/cleo/ask-link.ts` |
| Location (client / preference / server validate) | `lib/cleo/client-location.ts`, `lib/cleo/location-preference.ts`, `lib/cleo/location.ts` |
| Styles | `app/cleo.css` (keep prompt dock above site dock via `--cleo-prompt-bottom`) |
| Route layout flag | `components/cleo-route-attribute.tsx` (`html[data-cleo-route]`, cleared in `useLayoutEffect` before destination paint) |

Entry: bottom dock `SayHiIcon` (`G` then `C`) or homepage search Ask Cleo row.

## API

`app/api/responses/route.ts` validates messages (incl. image data URLs) and
optional browser-authorized location, then calls the OpenAI Responses API with:

- Model: `gpt-5.6-terra`
- Tools: `web_search`, `image_generation` (jpeg + compression, one partial preview)
- Adaptive reasoning effort; encrypted reasoning replay (`reasoning.context: "all_turns"`)
- `max_tool_calls`, `truncation: "auto"`, prompt caching, streaming
- `maxDuration` 90s, `store: false`

### Request limits

- ≤ 50 messages; ≤ 10,000 characters each; ≤ 100,000 total
- Final message must be `user`
- User/assistant messages: ≤ 4 image data URLs each (PNG, JPEG, WEBP, GIF)
- Optional `location`: finite lat/lng, reported accuracy, valid IANA time zone —
  ephemeral developer context, never chat text

Without `OPENAI_API_KEY`, the route returns HTTP 503.

## Stream protocol

`lib/cleo/stream.ts` events: `text`, `activity`, `image`, `reasoning_items`,
`status` (incomplete), `error`.

- Soft **incomplete** keeps partial answers (Retry/Continue in the UI).
- Hard **error** is for true failures.

## Behavior rules

- Base voice + Explore/Space catalog so replies deep-link real guides.
- Invented Explore/Space Markdown paths are stripped (`guardrails.ts`).
- Topic answers may embed curated atlas/space JPEGs as Markdown.
  `topic-photos.ts` grounds every image in matching subject sets each turn
  (one view, or all three when asked). The UI allowlists only
  `/images/atlas|space/...` paths via `isCuratedTopicImageSrc`
  (`lib/cleo/portal-links.ts`) before Streamdown renders them.
- Markdown topic photos and attachment/generated data-URL images use shared
  `ZoomImage`. Curated topic photos resolve Gallery-parity caption plates via
  `content/cleo-topic-photo-zoom.json` (kept in sync by
  `lib/cleo/topic-photo-zoom.test.ts`).
- Guide deep-links are inline Markdown in the reply (no separate chip row).
- Portal starters in `portal-links.ts`: click submits immediately (incl. full
  Japan photo-set prompt).

## `/cleo?q=…` handoff

Only external entry into a pre-filled turn. Max 1,000 characters. `AskForm`
consumes it once on mount (or via `initialPrompt`), asks, then strips the
parameter so `/cleo` stays prerenderable and reload does not re-run the turn.
Built by `lib/cleo/ask-link.ts`.

## Location

- Dock Preferences: opt-in Location tabs (same fluid On/Off control as Sound),
  persisted, **off by default**.
- Turning on may open the browser geolocation dialog; `client-location.ts`
  requests one fresh high-accuracy position.
- On refresh: restore quietly only if permission is already `granted` — never
  re-prompt automatically.
- Off clears in-memory location immediately.
- Server validates in `location.ts` and adds coords + IANA TZ only to private
  per-turn instructions. Browser settings remain the grant/revoke control.
- `components/footer-coordinates.tsx` may render coordinates when present.
  The site footer stays mounted (CSS-hidden) on `/cleo` so leaving chat does
  not remount the stamp into a “Locating…” wait; the last reading is kept
  while a quiet refresh runs.

## Client-only state

Conversation, current location value, and encrypted reasoning items are
browser-only. Conversation clears on reload. Location preference persists.
Reasoning items keep multi-turn coherent under `store: false`.

No authentication, database, media library, or AMA booking.

## Analytics

Vercel Web Analytics + Speed Insights in `app/_components/site-document.tsx`.
Enable both in the Vercel project dashboard so `/_vercel/insights/*` and
`/_vercel/speed-insights/*` are served after deploy.

## Verify

- Multi-turn chat, reasoning activity, web search
- Image attach/vision, image generation, streaming, cancellation
- Retry/Continue on incomplete/failed turns
- Location preference (grant, deny, refresh without re-prompt)
- After atlas/space caption or rendition metadata changes:
  `pnpm generate:cleo-topic-photo-zoom`
