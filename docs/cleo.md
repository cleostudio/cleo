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
| Public turn rate limit | `lib/cleo/rate-limit.ts` |
| NDJSON protocol | `lib/cleo/stream.ts` |
| Images (server / client) | `lib/cleo/images.ts`, `lib/cleo/client-images.ts` |
| Curated topic photos in Markdown | `lib/cleo/topic-photos.ts` |
| Zoom caption index | `content/cleo-topic-photo-zoom.json` (`pnpm generate:cleo-topic-photo-zoom`) |
| Empty-state starters | `lib/cleo/portal-links.ts` |
| Ask link builder | `lib/cleo/ask-link.ts` |
| Location (client / preference / cache / server validate) | `lib/cleo/client-location.ts`, `lib/cleo/location-preference.ts`, `lib/cleo/location-preference-account.ts`, `lib/cleo/location-cache.ts`, `lib/cleo/location.ts` |
| Signed-in name for personalization | `lib/cleo/user-profile.ts` (via `getSession` in the API route) |
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
- Signed-in account name from Better Auth session (private instructions; see
  § Account name)

### Request limits

- ≤ 50 messages; ≤ 10,000 characters each; ≤ 100,000 total
- Final message must be `user`
- User/assistant messages: ≤ 4 image data URLs each (PNG, JPEG, WEBP, GIF)
- ≤ 16 images and ≤ ~12MB decoded image bytes across the whole request
- ≤ ~240k characters of encrypted reasoning across the whole request
- `Content-Length` over 16MB → HTTP 413
- Best-effort per-IP rate limit (12 turns / minute / warm isolate) → HTTP 429
- Optional `location`: finite lat/lng, reported accuracy, valid IANA time zone —
  ephemeral developer context, never chat text
- Account name is **not** accepted on the request body — the route reads it from
  the Better Auth session cookie via `getSession`

Without `OPENAI_API_KEY`, the route returns HTTP 503.

## Stream protocol

`lib/cleo/stream.ts` events: `text`, `activity`, `image`, `reasoning_items`,
`status` (incomplete), `error`.

- Soft **incomplete** keeps partial answers (Retry/Continue in the UI).
- Hard **error** is for true failures.

## Behavior rules

- Base voice + Explore/Space catalog so replies deep-link real guides.
- Invented Explore/Space Markdown paths are stripped (`guardrails.ts`), including
  titled inline links, angle-bracket destinations, and reference-style forms.
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
account `user.name` as ephemeral developer context
(`lib/cleo/user-profile.ts` → `<cleo_user_profile>`), the same privacy pattern
as opt-in location:

- Server-only: `getSession(request.headers)` in `POST /api/responses`. A
  client-supplied `name` field is ignored.
- Guests and unconfigured auth get no profile block. Session lookup failures
  fail open (chat continues without the name) so Neon blips cannot take Cleo
  down.
- Instructions tell Cleo to use the name for natural personalization (greetings,
  direct address) without forcing it every turn or inventing other personal
  details. Email is never included.

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
- Server validates in `location.ts` and adds coords + IANA TZ only to private
  per-turn instructions. Browser settings remain the grant/revoke control.
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
- Image attach/vision, image generation, streaming, cancellation
- Retry/Continue on incomplete/failed turns
- Location preference (grant, deny, refresh/leave-and-return without
  re-prompt; Safari/`unknown` Permissions API restores after a prior grant;
  signed-in restore across devices without re-prompt; toggle while session
  is loading is not wiped by a stale account `false`)
- Signed-in personalization: after login, Cleo can address the account name;
  guests get no name context
- After atlas/space caption or rendition metadata changes:
  `pnpm generate:cleo-topic-photo-zoom`
