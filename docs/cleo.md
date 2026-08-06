# Cleo agent surface

Read this when changing `/cleo`, `POST /api/responses`, or anything under
`components/cleo/*` / `lib/cleo/*`. For feedback, evals, memory, or
prompt-evolution design, see [`cleo-self-improving.md`](./cleo-self-improving.md).

## Map

| Piece | Path |
| --- | --- |
| UI (messages, attachments, stream, Retry/Continue, `?q=` handoff) | `components/cleo/ask-form.tsx` |
| Thread autoscroll + turn anchoring (`use-stick-to-bottom`) | `lib/cleo/stick-to-bottom.ts`, `components/cleo/scroll-to-bottom.tsx` |
| Page shell | `app/_views/cleo-page.tsx` |
| API route | `app/api/responses/route.ts` |
| Voice + portal catalog | `lib/cleo/instructions.ts`, `lib/cleo/portal-catalog.ts` |
| Guardrails (strip invented Explore/Space/Civilizations/Cities/Oceans/Rivers paths) | `lib/cleo/guardrails.ts` |
| Offline eval cases + deterministic graders | `content/cleo-evals/`, `lib/cleo/evals/`, `lib/cleo/graders/` (`pnpm test:cleo-eval`) |
| Turn feedback (thumbs + note) | `components/cleo/message-feedback.tsx`, `POST /api/cleo/feedback`, `lib/db/cleo-schema.ts` |
| Opt-in account memory | `lib/cleo/memory.ts`, `GET/POST/DELETE /api/cleo/memory`, `/account` + `RememberNote` |
| Offline instruction optimize | `lib/cleo/optimize/*`, `pnpm optimize:cleo` (dry-run) / `--live` |
| Public turn rate limit | `lib/cleo/rate-limit.ts` |
| NDJSON protocol | `lib/cleo/stream.ts` |
| Images (server / client) | `lib/cleo/images.ts`, `lib/cleo/client-images.ts` |
| Curated topic photos in Markdown | `lib/cleo/topic-photos.ts` |
| Zoom caption index | `content/cleo-topic-photo-zoom.json` (`pnpm generate:cleo-topic-photo-zoom`) |
| Empty-state starters | `lib/cleo/portal-links.ts` |
| Ask link builder | `lib/cleo/ask-link.ts` |
| Location (client / preference / cache / server validate) | `lib/cleo/client-location.ts`, `lib/cleo/location-preference.ts`, `lib/cleo/location-preference-account.ts`, `lib/cleo/location-cache.ts`, `lib/cleo/location.ts` |
| Signed-in name for personalization | `lib/cleo/user-profile.ts` (via `getSession` in the API route) |
| Signed-in memory for personalization | `lib/cleo/memory.ts` + `memory-store.ts` (via session in the API route) |
| Styles | `app/cleo.css` (keep prompt dock above site dock via `--cleo-prompt-bottom`) |
| Route layout flag | `components/cleo-route-attribute.tsx` (`html[data-cleo-route]`, cleared in `useLayoutEffect` before destination paint) |

Entry: bottom dock `SayHiIcon` (`G` then `C`) or homepage search Ask Cleo row.

## Thread scroll

Conversation mode locks the Cleo shell to the viewport and scrolls inside
`StickToBottom` (same library/pattern as [chloei](https://github.com/chloeilabs/chloei)):

- Messages are grouped into user→assistant turns (`groupThreadMessages`).
  Hidden Continue prompts stay off-screen and keep the follow-up assistant on
  the prior turn.
- The latest turn gets a screenful `min-height` so a freshly sent user bubble
  can rest near the top while the answer grows below.
- `resolveThreadScrollTarget` anchors that turn with `ANCHOR_TOP_GAP_PX`, then
  falls through to true bottom-stick once the turn approaches the fixed prompt
  (and keeps that pin for the turn after streaming ends).
- Scrolling up escapes the lock; the sticky **Scroll to bottom** control
  re-engages absolute bottom stick for one jump.
- The prompt dock stays `position: fixed` (Safari must not remount it mid-send);
  clearance uses `--cleo-content-pad` / `.cleo-messages-end`.

## API

`app/api/responses/route.ts` validates messages (incl. image data URLs) and
optional browser-authorized location, then calls the OpenAI Responses API with:

- Model: `gpt-5.6-terra`
- Tools: `web_search` (adaptive `search_context_size`; opt-in
  `user_location.timezone` when Location is shared)
- Adaptive reasoning effort (`low` greetings → `medium` default → `high`
  research → `xhigh` only for explicit deep-research asks). Greetings use
  `low` rather than `minimal` because hosted `web_search` rejects
  `reasoning.effort: "minimal"`. Encrypted reasoning replay
  (`reasoning.context: "all_turns"`)
- `max_tool_calls`, `truncation: "auto"`, streaming
- GPT-5.6 prompt caching: stable `prompt_cache_key`,
  `prompt_cache_options.mode: "explicit"`, and an explicit breakpoint after
  the shared voice/catalog developer prefix (per-turn topic photos, account
  name, and location sit after the breakpoint). Completed turns log
  `cleo.prompt_cache` with `cached_tokens` / `cache_write_tokens`.
- Hashed `safety_identifier` from the signed-in user id or guest client key
- `maxDuration` 90s, `store: false`
- Signed-in account name from Better Auth session (private developer context;
  see § Account name)

### Request limits

- ≤ 50 messages; ≤ 10,000 characters each; ≤ 100,000 total
- Final message must be `user`
- User messages: ≤ 4 image data URLs each (PNG, JPEG, WEBP, GIF); assistant
  messages cannot include images
- ≤ 16 images and ≤ ~12MB decoded image bytes across the whole request
- ≤ ~240k characters of encrypted reasoning across the whole request
- `Content-Length` over 16MB → HTTP 413
- Best-effort per-IP rate limit (12 turns / minute / warm isolate) → HTTP 429
- Optional `location`: finite lat/lng, reported accuracy, valid IANA time zone —
  ephemeral developer context (coords) plus `web_search.user_location.timezone`,
  never chat text
- Account name is **not** accepted on the request body — the route reads it from
  the Better Auth session cookie via `getSession`

Without `OPENAI_API_KEY`, the route returns HTTP 503.

## Stream protocol

`lib/cleo/stream.ts` events: `text`, `text_replace`, `activity`,
`reasoning_items`, `status` (incomplete), `error`.

- Soft **incomplete** keeps partial answers (Retry/Continue in the UI).
- Hard **error** is for true failures.
- After a turn, `url_citation` annotations from hosted web search are merged
  into Markdown links and emitted as `text_replace` when the streamed text
  lacked clickable citations.

## Behavior rules

- Base voice + Explore/Space/Civilizations/Cities/Oceans/Rivers catalog so replies deep-link real guides.
- Invented Explore/Space/Civilizations/Cities/Oceans/Rivers Markdown paths are stripped (`guardrails.ts`), including
  titled inline links, angle-bracket destinations, and reference-style forms.
- Topic answers may embed curated atlas/space/civilizations/cities/oceans/rivers JPEGs as Markdown.
  `topic-photos.ts` grounds every image in matching subject sets each turn
  (one view, or all three when asked). The UI allowlists only
  `/images/atlas|space|civilizations|cities|oceans|rivers/...` paths via `isCuratedTopicImageSrc`
  (`lib/cleo/portal-links.ts`) before Streamdown renders them.
- Markdown topic photos and user-attachment data-URL images use shared
  `ZoomImage`. Curated topic photos resolve Gallery-parity caption plates via
  `content/cleo-topic-photo-zoom.json` (kept in sync by
  `lib/cleo/topic-photo-zoom.test.ts`).
- Guide deep-links are inline Markdown in the reply (no separate chip row).
- Portal starters in `portal-links.ts`: click submits immediately (incl. full
  Japan photo-set prompt).

## `/cleo?q=…` handoff

Only external entry into a pre-filled turn. Max 1,000 characters. Built by
`lib/cleo/ask-link.ts`, which reads `location` directly rather than
`useSearchParams` so `/cleo` stays prerenderable.

The URL carries the question until a turn claims it:

- `AskForm` re-reads `readCleoPromptFromLocation()` on every arrival pass, not
  only first mount. Cache Components park recently visited trees in a hidden
  React `<Activity>`, so the second Ask Cleo handoff of a session lands on the
  chat shell that answered the first — a question latched to mount would be
  dropped, and the parameter left in the URL.
- `clearCleoPromptFromLocation()` runs from `sendTurn`, once the turn is
  committed to. A cancelled tick, a teardown, or a Strict Mode remount therefore
  leaves the handoff intact for the next pass instead of destroying it.
- A handoff continues the visible transcript; it does not clear it.
- `initialPrompt` is the same handoff for callers that already hold the
  question; the shell records the value it asked instead of using the URL.

Leaving `/cleo` aborts an in-flight turn, but its bookkeeping still lands so a
re-activated shell is never stuck mid-send.

## Account name

When the request carries a signed-in Better Auth session, Cleo receives the
account `user.name` as ephemeral developer context after the cached voice
prefix (`lib/cleo/user-profile.ts` → `<cleo_user_profile>`), the same privacy
pattern as opt-in location:

- Server-only: `getSession(request.headers)` in `POST /api/responses`. A
  client-supplied `name` field is ignored.
- Guests and unconfigured auth get no profile block. Session lookup failures
  fail open (chat continues without the name) so Neon blips cannot take Cleo
  down.
- The hashed account id (or guest client key) is sent as
  `safety_identifier` for abuse monitoring — never the raw email or name.
- Instructions tell Cleo to use the name for natural personalization (greetings,
  direct address) without forcing it every turn or inventing other personal
  details. Email is never included.

## Account memory

Signed-in users may save short preference notes (opt-in). Notes are Neon rows
owned by `user.id`, visible and deletable on `/account`, and injectable as a
bounded `<cleo_user_memory>` developer block on each chat turn:

- CRUD: `GET/POST/DELETE /api/cleo/memory` (session required; rate-limited).
- Caps: 20 notes × 280 characters; injection block soft-capped (~1800 chars,
  newest retained).
- Injection fails open (empty) if Neon is unset or the load errors — chat
  continues without memory.
- Guests never receive a memory block and cannot write notes. Chat **Remember**
  is hidden when signed out.
- Notes must not invent facts beyond the stored list; they never rewrite shared
  `CLEO_INSTRUCTIONS` (that stays on the offline optimize + PR path).

## Location

- Dock Preferences: opt-in Location tabs (same fluid On/Off control as Sound),
  **off by default**.
- Persistence:
  - Guests: `localStorage` (`cleo-location-sync`).
  - Signed-in: Better Auth user field `locationSyncEnabled` (Neon) via
    `persistLocationSyncToAccount` / `authClient.updateUser` (reverts local
    quietly if the write fails). Account is canonical on a fresh load —
    `hydrateLocationSyncFromAccount` restores quietly (`allowPrompt: false`).
    If the user toggles Location while the session is still resolving,
    `reconcileLocationSyncOnSession` keeps the local choice and pushes it to
    the account instead of letting a stale `false` wipe the preference.
- Turning on may open the browser geolocation dialog; `client-location.ts`
  requests one fresh high-accuracy position and remembers a successful browser
  grant in `localStorage` (`cleo-location-browser-granted`).
- On refresh / leaving and returning: restore quietly when permission is
  already `granted`, or when the Permissions API is unavailable/`unknown`
  but this origin previously returned a position (Safari). Never re-prompt
  automatically for `prompt` / “Allow once” (including after account hydrate /
  sign-in). Quiet restore accepts a recent GPS fix (`maximumAge` 60s) and
  falls back to the last reading in `localStorage` (`cleo-location-last`,
  24h TTL) so the footer / Cleo do not show “unavailable” after refresh when
  Location is still on.
- Off clears the in-memory location and the cached last reading immediately.
- Server validates in `location.ts`, adds coords + IANA TZ to private per-turn
  developer context, and passes the IANA TZ to `web_search.user_location` for
  local search bias. Browser settings remain the grant/revoke control.
- `components/footer-coordinates.tsx` may render coordinates when present.
  The site footer stays mounted (CSS-hidden) on `/cleo` so leaving chat does
  not remount the stamp into a “Locating…” wait. The last reading stays
  visible, and leaving `/cleo` triggers a quiet revalidation (clearing the
  stamp if browser permission was revoked).

## Client-only state

Conversation and encrypted reasoning items are browser-only and clear on
reload. Location preference persists (localStorage for guests; account field
when signed in). The last successful fix also persists while Location is on
(`cleo-location-last`) so refresh can restore coordinates without
re-prompting. Reasoning items keep multi-turn coherent under `store: false`.
Signed-in account name is read per turn from the session on the server — it
is not stored in the browser conversation transcript.

Account auth is Better Auth + Neon (see [`auth.md`](./auth.md)). No media
library or AMA booking.

## Analytics

Vercel Web Analytics + Speed Insights in `app/_components/site-document.tsx`.
Enable both in the Vercel project dashboard so `/_vercel/insights/*` and
`/_vercel/speed-insights/*` are served after deploy.

## Verify

- Multi-turn chat, reasoning activity, web search
- Image attach/vision, streaming, cancellation
- Thread scroll: new turn anchors near the top; long answers bottom-stick;
  scroll-up escapes; Scroll to bottom re-locks
- Retry/Continue on incomplete/failed turns
- Location preference (grant, deny, refresh/leave-and-return without
  re-prompt; Safari/`unknown` Permissions API restores after a prior grant;
  signed-in restore across devices without re-prompt; toggle while session
  is loading is not wiped by a stale account `false`)
- Signed-in personalization: after login, Cleo can address the account name;
  guests get no name context
- After atlas/space caption or rendition metadata changes:
  `pnpm generate:cleo-topic-photo-zoom`
