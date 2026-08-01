# Plan: accounts and Cleo thread history

Status: Stages 0–2b implemented on feature branches (Stage 0 PR #105; Stage 1
local threads; Stage 2a accounts; Stage 2b thread sync). See
`docs/stage0-prerender-findings.md`. Image bytes remain Stage 3.

This plan adds signed-in accounts and durable Cleo conversation threads to a
site that today has no authentication, no database, and no server-side writes.
It is written to be executed in stages, each independently shippable.

Every integration is either a Vercel first-party product, a Vercel Marketplace
native integration, or a library that runs inside the app with no external
service. Nothing here introduces a new vendor dashboard, a new origin in the
CSP, or an egress dependency at request time.

---

## 1. What we are building

Signed-in visitors get named conversation threads that persist across reloads,
sessions, and devices: a thread list, resume, rename, delete, and search over
their own history. Attachments and generated images survive with the thread.

Signed-out visitors keep exactly today's behaviour — Cleo works, conversation
state is ephemeral and clears on reload. This preserves the product decision
recorded in `c120dc3` that Cleo stays free to use, and it means the sign-in
wall is an upgrade rather than a gate.

### Non-goals

- No owner/admin surface. Editorial curation stays in `pnpm` scripts and PRs.
- No comments, guestbook, reactions, or public sharing of threads.
- No email newsletter. No transactional email at all (see §5.3).
- No migration of `content/atlas.json`, MDX, or `public/images/` into the
  database. Editorial content stays in git and stays build-time.

---

## 2. Stack

| Concern | Choice | Vercel status |
| --- | --- | --- |
| Auth | Better Auth (+ passkey plugin) | Library in-app; no external service |
| Database | Neon Postgres | Marketplace native (`vercel install neon`) |
| ORM / migrations | Drizzle + drizzle-kit | Library |
| Image bytes | Vercel Blob (private) | First-party |
| Background writes | `after()` from `next/server` | First-party |
| Abuse control | Vercel WAF rate limiting | First-party |
| Cost backstop | Spend Management | First-party |
| Cleo kill switch | Edge Config | First-party |
| Pooling under Fluid Compute | `attachDatabasePool` | First-party |

### 2.1 Why Better Auth rather than the Marketplace-native auth option

Clerk is the only Marketplace-managed auth integration, and it is the wrong
choice for this repository for a reason already encoded in the test suite.
`lib/security/headers.test.ts` asserts:

```ts
expect(headers['content-security-policy']).not.toContain('clerk')
expect(headers['content-security-policy']).not.toContain("'unsafe-eval'")
```

Adopting Clerk means deleting a security assertion we deliberately wrote, and
relaxing `connect-src 'self'` to admit Clerk's Frontend API origin. Clerk ships
a `frontendApiProxy` option precisely because policies like ours reject it.

Better Auth is a library, not a service, so "Vercel managed" does not apply to
it in the Marketplace sense — there is nothing to provision or bill. It is
maximally Vercel-friendly on the axes that matter here:

- It deploys atomically with the app as ordinary Next.js code. No separate
  service, no version skew between app and auth.
- All traffic is same-origin `/api/auth/*`. `connect-src 'self'` is sufficient.
  Social OAuth is a top-level navigation, which `connect-src` does not govern.
- Its browser bundle contains no `eval`, `new Function`, or WebAssembly, so
  `script-src 'self' 'unsafe-inline'` stands unchanged.
- Its state lives in the Marketplace-managed Neon database, so the durable part
  of auth *is* Vercel-managed and Vercel-billed.
- MIT licensed, no per-MAU pricing, and organizations / 2FA / RBAC are free
  plugins rather than paid tiers.

It also does not violate the AGENTS.md rule that OpenAI is the only third-party
API, because it makes no third-party calls.

**Decision gate.** If "Vercel managed" is a hard procurement requirement for
auth specifically — not merely "must not add an unmanaged external service" —
then Clerk is the only option, and the cost is the two CSP assertions above
plus a `connect-src` exception. Resolve this before Stage 2. Everything else in
this plan is unaffected by the choice.

### 2.2 Package names

Most published material is stale. Current names:

| Purpose | Package |
| --- | --- |
| Core | `better-auth` |
| Drizzle adapter | `@better-auth/drizzle-adapter` |
| Passkeys | `@better-auth/passkey` |
| Schema CLI | `npx auth@latest generate` |

`auth migrate` only works with the built-in Kysely adapter. With Drizzle, run
`generate` to emit schema, then apply with `drizzle-kit`. Pin exact versions:
the library shipped 27 releases in 90 days with a median 3 days between stable
releases.

---

## 3. Data model

Better Auth's CLI generates `user`, `session`, `account`, `verification`, and
(with the plugin) `passkey` into our own Neon database. Application tables
foreign-key to `user.id` in the same database and the same transaction.

### 3.1 Application tables

```
thread
  id              text primary key      -- client-generatable, see §7.2
  user_id         text not null references user(id) on delete cascade
  title           text not null
  created_at      timestamptz not null
  updated_at      timestamptz not null
  last_message_at timestamptz not null
  archived_at     timestamptz
  deleted_at      timestamptz           -- soft delete, purged by job

message
  id           text primary key
  thread_id    text not null references thread(id) on delete cascade
  seq          integer not null
  role         text not null            -- 'user' | 'assistant'
  content      text not null default ''
  status       text not null            -- 'complete' | 'incomplete' | 'error'
  created_at   timestamptz not null
  unique (thread_id, seq)

message_image
  id            text primary key
  message_id    text not null references message(id) on delete cascade
  kind          text not null           -- 'attachment' | 'generated'
  blob_pathname text not null           -- private Blob key
  mime          text not null
  bytes         integer not null
  width         integer
  height        integer
  position      integer not null

message_reasoning                       -- CACHE, not source of truth
  message_id  text primary key references message(id) on delete cascade
  items       jsonb not null            -- encrypted reasoning + compaction items
  bytes       integer not null
  expires_at  timestamptz not null
```

Indexes: `thread (user_id, last_message_at desc) where deleted_at is null` for
the thread list, and the `(thread_id, seq)` unique constraint covers message
reads.

### 3.2 Three sizing facts that drive this shape

Derived from the limits already in the codebase:

| Data | Bound | Source |
| --- | --- | --- |
| Conversation text | ~100 KB per thread | `MAX_TOTAL_INPUT_LENGTH = 100_000` |
| Encrypted reasoning | ~960 KB per assistant message | 8 items x 120,000 chars |
| Images | 16 MiB per message | 4 images x `MAX_IMAGE_BYTES` |

The transcript is negligible; the blobs supporting it are two to three orders
of magnitude larger. Hence: text inline in `message`, reasoning in a separate
TTL'd cache table so rendering a thread never reads it, and image bytes in Blob
with only metadata in Postgres.

### 3.3 Reasoning items are a cache, permanently

`message_reasoning` rows may be absent, expired, or rejected by the API after a
model upgrade. Every read path must work without them, falling back to
replaying message text alone. `sanitizeReasoningItems` in
`lib/cleo/reasoning-items.ts` already drops malformed items, so the degradation
path is half-built. A rejected reasoning item must never break a thread.

Cap total reasoning bytes per thread and set a TTL (30 days proposed). Purge
with the same job that hard-deletes soft-deleted threads.

### 3.4 What we deliberately do not store

Location coordinates. They are per-turn private instruction context today and
are never written to visible messages. Writing precise coordinates into a
durable, queryable chat log is a materially different privacy commitment than
what the Preferences toggle currently asks for. `lib/cleo/location.ts` keeps
validating them per request; nothing persists them.

---

## 4. Request flow

### 4.1 Contract change on `POST /api/responses`

Today the client sends the entire conversation. With server-side threads the
server becomes the source of truth, and the client sends only `threadId` plus
the new user message. This removes up to 100 KB of text and all reasoning
replay from the request body, and it stops the client from being able to forge
prior assistant turns.

Signed-out requests keep today's contract exactly — full conversation in the
body, nothing persisted. Both shapes must be accepted; the presence of a valid
session and a `threadId` selects the persistent path.

### 4.2 Per-turn sequence (signed in)

1. Resolve the session with `auth.api.getSession({ headers: await headers() })`.
2. Verify thread ownership, or create the thread. **Ownership check is the
   single most security-critical line in this plan** (see §8.2).
3. Insert the user message row at the next `seq`, before calling OpenAI, so the
   thread survives a failed or abandoned turn.
4. Load prior messages plus the reasoning cache, and build the API input with
   the existing `toApiInput`.
5. Stream from OpenAI exactly as today, accumulating assistant text, reasoning
   items, and generated image bytes in memory.
6. On finalize, schedule persistence with `after()` from `next/server`:
   the assistant message row, reasoning items, and Blob uploads for generated
   images. `after()` does not block the response and, per Vercel's docs, is not
   a Dynamic API — calling it does not make the route dynamic. The existing
   `maxDuration = 90` covers the callback.
7. On client disconnect — which the route already detects and uses to close the
   upstream stream — the accumulated partial is still persisted with status
   `incomplete`.

Step 7 is why this design fits: a partially-written assistant row is exactly
the state the existing soft `incomplete` status and Retry/Continue recovery in
`lib/cleo/stream.ts` were built to resume from.

### 4.3 Images

Attachments: the client uploads to **private** Vercel Blob before submitting
the turn, and the request to OpenAI keeps today's proven data-URL path
unchanged. Client uploads incur no data transfer charge, and the duplication
buys us a zero-risk change to the working OpenAI path.

Generated images: arrive server-side as base64 during the stream, are streamed
to the client as data URLs for instant display exactly as today, and are
uploaded to Blob in the `after()` callback. On reload the client renders the
persisted copy instead.

Rendering persisted images goes through a same-origin route,
`/api/thread-image/[id]`, which authorizes the caller and streams from private
Blob with a long immutable cache header. **This keeps `img-src 'self' data:
blob:` unchanged**, so `lib/security/headers.test.ts` needs no edit, and it
keeps user attachments non-public. The cost is Fast Origin Transfer on cache
miss, which the immutable cache header minimises.

The existing curated topic photos are unaffected — they are `/images/atlas|space/…`
path strings in Markdown, cheap to persist as ordinary text.

### 4.4 Generated-image replay

`toApiInput` carries the most recent generated images forward as `input_image`
because, as its comment notes, `image_generation_call` ids cannot be replayed
under `store: false`. Thread resumption must preserve this. Rehydrating from
Blob rather than from data URLs held in memory makes it cheaper, but the
behaviour must not change.

### 4.5 Context growth

Persistent threads grow without bound, and every turn re-bills the whole
history. Add `context_management` with a `compact_threshold` to the create
params. Server-side compaction is explicitly ZDR-friendly when `store: false`
is set, so it fits our posture rather than fighting it. The emitted compaction
item is persisted alongside reasoning items and replayed the same way. Keep
`truncation: "auto"` as a backstop.

Without this, a heavily used thread gets monotonically more expensive. It is
not optional polish.

---

## 5. Auth design

### 5.1 Methods

Passkeys as the primary method, via `@better-auth/passkey`. `signIn.passkey()`
resolves the user from the credential, so there is no password and no email in
the happy path. Set `registration.requireSession: false` with a `resolveUser`
callback to allow passkey-first onboarding.

GitHub OAuth as a second method and recovery path. Notably GitHub is not on the
AGENTS.md do-not-reintroduce list, unlike Google.

WebAuthn is invisible to CSP — `navigator.credentials` is a native API, not a
fetch. The relevant gate is Permissions-Policy `publickey-credentials-get`,
which is permitted for same-origin top-level documents and only matters inside
cross-origin iframes, which `frame-ancestors 'none'` already forbids.

### 5.2 The non-nullable email column

Better Auth's core `user.email` is not nullable, and `resolveUser` returns no
email field. Supply a synthetic address unique to the user id, document the
format, and never surface it in the UI.

**Use a reserved TLD, not `.com`.** Better Auth's anonymous plugin defaults to
`temp@{id}.com`, but its domain is configurable precisely so you can choose
something safer. A user id is a valid domain label, so `temp@{uuid}.com` sits
in a namespace someone can actually register. Nothing sends mail today, so the
impact is currently nil — but if email is ever added, or any third-party tool
attempts delivery or a DNS lookup, those addresses resolve to a stranger.
RFC 2606 reserves `.invalid` for exactly this and guarantees it can never be
registered. Choosing it costs nothing now; changing it later is a data
migration across every user row.

Tie the "is this synthetic?" predicate to the actual id shape rather than to
any address at the synthetic domain, so a real address that happens to share
the prefix is never misclassified.

### 5.3 No email provider

This is deliberate and keeps Resend off the dependency list. Passkeys and
GitHub OAuth both need zero email sending. Email/password would technically
work without a sender but silently loses password reset, so we do not offer it.
Magic links and email OTP genuinely require a sender and are out of scope.

**The tradeoff, stated plainly:** there is no self-service account recovery. A
user who loses every passkey and has no linked GitHub account cannot recover
unaided. Mitigations to build into the sign-up flow: prompt to register a
second passkey, offer GitHub linking, and treat passkey sync through iCloud
Keychain / Google Password Manager as the primary safety net. If self-service
recovery later becomes a requirement, that is the point at which a transactional
email vendor stops being avoidable, and it needs its own product decision.

### 5.4 Configuration specifics

- `trustedOrigins` must include the production origin and Vercel preview URLs.
  Preview deployments have dynamic hostnames; derive from
  `VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_BRANCH_URL` rather than
  hardcoding, and never leave `localhost` in a production list.
- **IP resolution is a real footgun on Vercel.** Better Auth defaults to
  trusting `X-Forwarded-For` and deliberately does not trust comma-separated
  chains, which is what Vercel's proxy produces. Set `ipAddressHeaders` to
  `x-vercel-forwarded-for`, or feed it from `ipAddress()` in
  `@vercel/functions`. Left unset, rate limiting keys off a spoofable value.
- Better Auth's own rate limiting is off in development and is bypassed
  entirely by server-side `auth.api` calls, so Server Action flows are not
  covered by it. The WAF rule in §8.3 is the real floor.
- Sessions stay database-backed (the default) so revocation is real. Consider
  `session.cookieCache` in `compact` mode later to cut DB reads, accepting that
  revoked sessions linger on other devices until the cache expires.
- `nextCookies()` must be **last** in the plugins array.
- Password hashing defaults to scrypt at roughly 32 MiB per hash; irrelevant
  while we ship passkeys only, but note it if email/password is ever enabled.

### 5.5 Proxy

`proxy.ts` is not touched. Better Auth's own documentation is blunt that
cookie-only checks in middleware are insecure — "anyone can manually create a
cookie to bypass it" — and recommends real validation in each page or handler.
Our proxy keeps doing only its existing job of rewriting unknown blog and
newsletter slugs to 404.

Do not copy Better Auth's Next.js 15.2 proxy example: it sets
`runtime: "nodejs"`, and Next 16 throws if `runtime` is set in a proxy file.

---

## 6. Rendering and the prerender contract

Under `cacheComponents: true`, calling `headers()` outside a `<Suspense>`
boundary prevents a route from being prerendered, and `auth.api.getSession()`
requires `await headers()`. Left unmanaged, adding auth converts a statically
prerendered site into a dynamic one.

Stage 0 measured all of this (§6.1, §6.2). The settled architecture is a
**hybrid**, not one uniform approach:

| Surface | Session read | Build classification |
| --- | --- | --- |
| Content routes (`/`, `/blog`, `/gallery`, `/topics`, `/explore/*`, `/space/*`) | none | ○ |
| Global dock chrome | client `useSession()`, gated by hint cookie | unchanged (○) |
| `/cleo`, `/cleo/[threadId]` | RSC `getSession()` in `<Suspense>` | ◐ |

Rules:

- No Server Component in a content route reads the session. Those routes stay
  session-free, stay ○, and keep `instant = true` where it is set.
- Global auth chrome (dock avatar, sign-in entry) is a Client Component. It
  must not mount `useSession()` unless the hint cookie is present — see §6.2.
- `/cleo` and `/cleo/[threadId]` may read the session in an RSC behind
  `<Suspense>`. ◐ is the correct outcome there: it is already an interactive
  app page, and a server-rendered thread list beats a client-fetched one on
  first paint. Measured in follow-up A: this leaves every content route ○.
- On `/cleo`, pass the server-resolved session down rather than letting the
  dock re-fetch it.
- Nothing server-side may read the hint cookie. A server read would make the
  reading route dynamic and defeat the entire mechanism.
- Dynamic routes whose params cannot be enumerated — `/cleo/[threadId]` — opt
  out of static shell validation with `export const instant = false`, following
  the precedent in `app/(site)/confirm/[token]/page.tsx`. Do **not** satisfy the
  validator with a placeholder `generateStaticParams` entry: that prerenders a
  real, publicly reachable junk URL, and it buys nothing. Verified on the
  Stage 1 branch — both approaches produce an identical ◐ classification.
- Server Components cannot set cookies, so the session cookie cache never
  refreshes from an RSC render. Refresh happens in Server Actions and route
  handlers.

The `/cleo?q=…` handoff changes meaning: instead of being consumed and stripped,
it creates a new thread for signed-in users. For signed-out users it behaves
exactly as today.

### 6.1 Measured result (Stage 0, 2026-08-01)

The spike mounted a Suspense-wrapped `auth.api.getSession()` in
`app/_components/site-document.tsx` and measured `next build` classification
against `main`:

| Placement | Result |
| --- | --- |
| RSC `getSession` in `SiteDocument` | every ○ route becomes ◐ |
| Client-only `useSession()` | identical to `main`; only `ƒ /api/auth/[...all]` added |

Three conclusions, in order of importance.

**◐ is not a failure state.** Next's own Cache Components guide presents ◐ as
the intended outcome of Suspense-wrapping dynamic content — "the prerendered
part is served instantly from a CDN node close to the user" — and the `instant`
route config names `<Suspense>` as one of its two prescribed fixes. `instant`
is a dev-time navigation-feel assertion, not a rendering mode, so it is
compatible with ◐. The original Stage 0 acceptance criterion ("same
classification as `main`") was written too strictly; the real failure state is
○ → ƒ, which did not occur.

**The rule in §6 still holds, for a cost reason rather than a correctness
one.** ◐ means request-time server work on every content page view, on a site
whose traffic is overwhelmingly anonymous readers of static pages. Paying a
function invocation on `/explore/[slug]` to render a sign-in avatar is a poor
trade. Content routes stay session-free and ○.

**The blast radius was a placement artifact.** `SiteDocument` is the root shell
for every route, so a probe there necessarily converts everything.

Follow-up A measured the scoped alternative. RSC `getSession()` on `/cleo`
only:

| Route | `main` | Scoped RSC |
| --- | --- | --- |
| `/`, `/blog`, `/gallery`, `/topics`, `/explore`, `/space` | ○ | ○ |
| concrete `/explore/*`, `/space/*`, `/blog/*` | ○ | ○ |
| `/cleo` | ○ | ◐ |
| `/api/auth/[...all]` | — | ƒ (new) |

No route became ƒ. This is the arrangement §6 adopts.

### 6.2 The session hint cookie

Client-only session reads move a cost rather than removing it. The session
cookie is `httpOnly`, so the client cannot know whether a session exists
without asking the server, and Better Auth's `useSession()` fetches on mount
unconditionally.

Follow-up B confirmed both halves: signed-out visitors did fire
`GET /api/auth/get-session` on every page load, and gating fixed it. A
non-`httpOnly` `cleo.session-hint` cookie, read client-side before deciding
whether to mount `useSession()` at all, eliminates the request for visitors
with no hint. Conditional mounting is required — checking inside the hook is
too late.

Prototype: `lib/auth-session-hint.ts` and the gated `DockAuthSessionClient` in
PR #105.

Correctness rules for Stage 2, none of which the prototype implements yet:

- **Set** on sign-in, **clear** on sign-out.
- **Clear whenever a `get-session` call resolves to null.** Otherwise a user
  whose session expired or was revoked pays the round trip on every page load
  indefinitely.
- `Max-Age` tracks session expiry (Better Auth defaults to 7 days, sliding) so
  a stale hint self-expires.
- `Path=/`, `SameSite=Lax`, `Secure` in production. Never `httpOnly` — that is
  the point. Never authoritative for anything: it decides whether to make a
  request, never what the user may do.
- Handle the inverse state too. A missing hint alongside a live session (cookie
  cleared by privacy tooling, or a session predating the mechanism) leaves the
  user looking signed out. The `/cleo` RSC read from §6.1 is authoritative, so
  landing there repairs the hint — the two measurements compose.

**Avoid the hydration flicker using the existing prepaint convention.** Reading
the hint in `useEffect` means first paint always renders the signed-out state,
so a signed-in avatar pops in after hydration. `lib/security/inline-scripts.ts`
already runs a pre-paint inline script that sets `data-visited`, `data-locale`
and the theme class before first paint; extend it to read the hint cookie and
set a `data-session-hint` attribute. The CSP already permits this script, so
there is no policy change.

---

## 7. Thread lifecycle

### 7.1 Titles

Derive from the first user message, truncated on a word boundary, with inline
rename. No model call — it would add cost and latency to every new thread for
a string the user can edit in one click.

### 7.2 Anonymous to signed-in migration

Stage 1 stores threads in IndexedDB with **client-generated ids**. Those same
ids become the primary key in Postgres, so adopting local threads on first
sign-in is an insert, not a remap. Designing this in from the start is what
makes the later merge trivial rather than painful; retrofitting it is the
classic source of pain in this feature.

On first sign-in, offer to adopt local threads, then clear local copies on
success. Never silently discard them.

Stage 1 shipped byte caps with oldest-first thread eviction. Until Stage 2
lands there is no server copy, so that eviction is **irreversible data loss**,
and the caps are reachable sooner than they look: a single message can carry
16 MiB of images against a 32 MiB per-thread cap. Surface storage use in the
History dialog and warn before dropping a thread. Once threads sync to
Postgres, the same eviction becomes ordinary cache behaviour and the warning
can soften.

### 7.3 Deletion and export

Soft-delete sets `deleted_at` and hides the thread immediately. A purge job
hard-deletes rows past a grace window and calls Blob `del()` for the associated
objects, which is free. Export is a Server Action producing JSON of the calling
user's threads and messages. Both are ours to implement precisely because we
kept message bodies in our own database — see §9.

---

## 8. Security

### 8.1 CSP stays byte-identical

No third-party origin is introduced. Better Auth is same-origin, Blob is
proxied same-origin, WebAuthn is a native API. `lib/security/headers.test.ts`
should pass unchanged, and we add assertions that the policy still contains no
`'unsafe-eval'` and no blob storage origin — turning the current implicit
guarantee into an explicit regression test.

One thing to watch: Better Auth stores an `image` URL on `user` populated from
OAuth provider avatars, which point at provider CDNs and would be blocked by
`img-src`. Either do not use it, or copy the avatar into Blob on first login.

Features that would force CSP relaxation and are therefore out of scope: Google
One Tap, and any client-rendered captcha widget.

### 8.2 Authorization

Every thread and message read or write must be scoped by `user_id` from the
server-resolved session, never from a client-supplied value. This is the one
place where a bug is a data breach rather than a glitch. It gets dedicated
tests asserting that user A cannot read, rename, delete, or append to user B's
thread, and that an unauthenticated caller gets 401 rather than an empty list.

### 8.3 Abuse and cost

Four layers, in order of how cheaply they can be added:

1. **Vercel WAF rate limit** on `/api/responses` and `/api/auth/*`, IP or JA4
   keyed, fixed window, started in Log mode to calibrate. Dashboard config, no
   code, no dependency. Note that counters are per-region, so a distributed
   caller can exceed the configured limit in aggregate.
2. **Spend Management** with an alert and a pause action. This is the actual
   circuit breaker.
3. **Per-user daily turn quota** in Postgres for signed-in users, enforced
   server-side. Only possible once there is identity, and it is the fair way to
   keep the signed-out tier free.
4. **Edge Config kill switch** so `/api/responses` can return 503 instantly
   without a redeploy.

### 8.4 CSRF becomes real

Today `/api/responses` carries no ambient credential, so cross-site POSTs
achieve nothing. With session cookies, a malicious page could spend a signed-in
user's quota. Better Auth brings origin validation, `SameSite=Lax`, and Fetch
Metadata checks for its own endpoints, but `/api/responses` is ours. Restore
origin and `Sec-Fetch-Site` screening there; the guard reverted in `c120dc3`
(`lib/security/api-guard.ts`, added in `f76ac5e`) is a working starting point
and can be recovered from git history.

### 8.5 Secrets and connections

`BETTER_AUTH_SECRET` is a Sensitive Vercel environment variable, rotatable via
Better Auth's versioned secrets. Database access uses the Neon connection
string injected by the Marketplace integration. If a `pg` Pool is used, call
`attachDatabasePool` so idle clients are released before functions suspend
under Fluid Compute. Initialise the client lazily — a top-level `neon()` call
throws during `next build` before env vars exist — and do not wrap it in a
`Proxy`, which breaks adapters that introspect it.

---

## 9. Privacy posture

We keep `store: false` and we keep message bodies in our own Neon database.

The alternative considered and rejected: OpenAI's Conversations API would
persist conversation items durably with no 30-day TTL and would remove the
reasoning-item storage problem entirely. It was rejected because it means
abandoning `store: false`, placing user conversation content at OpenAI
indefinitely, and giving up direct control of export and deletion — while still
requiring our own table to list threads per user, and while saving nothing on
tokens, since prior input is billed on every turn regardless.

Reconsider only if the reasoning-cache maintenance burden proves worse in
practice than the data-residency cost.

---

## 10. Rollout

### Stage 0 — Prove the prerender assumption

Throwaway spike. Wire Better Auth into a branch, put one Suspense-wrapped
session read in the dock, and confirm from the build output that `/`,
`/gallery`, and `/explore/[slug]` are still prerendered and `/cleo` still has a
static shell on Next.js `16.3.0-preview.9`.

Acceptance (as originally written): build output shows the same static/dynamic
classification as `main` for every existing route. **Everything else is gated
on this.** If it fails, the fallback is a fully client-side auth surface with
no RSC session reads at all.

**Done — 2026-08-01.** Measured in PR #105; tables in
`docs/stage0-prerender-findings.md`. Result and corrected reading in §6.1: no
route became ƒ, so nothing is blocked. Content routes stay client-only for cost
reasons, and the acceptance bar above should be read as "no route becomes ƒ,"
not "no route becomes ◐."

Both follow-ups are now also measured. Scoped RSC reads on `/cleo` leave every
content route ○ (§6.1), and the hint cookie removes the signed-out
`get-session` request (§6.2). Stage 0 is closed; §6 records the resulting
hybrid architecture.

Spike-only artifact, not a Stage 2 risk: `node:sqlite` with `auth migrate`
failed (`stmt.columns is not a function`), worked with `better-sqlite3`. Stage 2
uses Neon Postgres through the Drizzle adapter and never touches this path.

### Stage 1 — Local threads, zero infrastructure

IndexedDB persistence under the existing client state, `/cleo/[threadId]`,
client-generated ids, thread list, rename, delete, resume. No auth, no
database, no vendor, no privacy change.

Acceptance: threads survive reload and browser restart on one device; existing
`/cleo?q=…` handoff still works; no new environment variable.

This ships most of the perceived value and tells us whether users revisit
threads at all before we take on a database.

### Stage 2 — Accounts and sync

Split in two. Stage 2 as a single unit touches provisioning, auth, schema, UI,
the `/api/responses` contract, and a data migration at once, which is more than
one reviewable change. 2a de-risks 2b: sign-in either works or it does not,
before any thread data depends on it.

#### Stage 2a — Accounts only

`vercel install neon`. Better Auth with passkeys and GitHub OAuth, its schema
generated into the Neon database, and sign-in / sign-out UI built entirely from
our own components and tokens. The session hint cookie from §6.2, implemented
with its full lifecycle. Dock chrome becomes auth-aware.

Nothing else changes: no thread tables, no `/api/responses` edits, no RSC
session read on `/cleo`. Cleo behaves exactly as it does today for signed-in
and signed-out visitors alike, and Stage 1 local threads keep working
untouched.

Acceptance: sign up with a passkey, sign out, sign back in on a second device;
a signed-out visitor to `/` issues zero auth requests; no content route changes
classification; `pnpm test:security` passes unmodified.

#### Stage 2b — Thread sync

Thread, message, image-metadata and reasoning-cache tables. The
`/api/responses` contract change from §4.1, server-side persistence via
`after()` per §4.2, the RSC session read on `/cleo` per §6, and adoption of
Stage 1 local threads on first sign-in per §7.2.

Acceptance: a thread started on one device appears on a second; ownership tests
pass; a mid-stream disconnect leaves a resumable `incomplete` row; the legacy
signed-out request shape still works and persists nothing.

### Stage 3 — Image persistence

Private Blob, client upload for attachments, `after()` upload for generated
images, same-origin `/api/thread-image/[id]` with authorization and immutable
caching.

Acceptance: a thread with attachments and a generated image renders correctly
after reload on another device; `img-src` unchanged; deleting a thread removes
its Blob objects.

### Stage 4 — Durability and economics

Compaction via `context_management`, per-user quotas, WAF rules published,
Spend Management configured, Edge Config kill switch, and history search using
`pg_trgm` or `tsvector` in the existing database.

Acceptance: a synthetic 100-turn thread stays within a bounded per-turn token
cost; quota enforcement returns a clear error; search returns the right thread.

---

## 11. Environment variables

| Variable | Source | Stage |
| --- | --- | --- |
| `OPENAI_API_KEY` | existing | — |
| `PUBLIC_SITE_URL` / `SITE_URL` | existing | — |
| `DATABASE_URL` | Neon Marketplace, auto-injected | 2 |
| `BETTER_AUTH_SECRET` | manual, Sensitive | 2 |
| `BETTER_AUTH_URL` | derive from Vercel system vars | 2 |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | manual | 2 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob, auto-injected | 3 |
| `EDGE_CONFIG` | Edge Config, auto-injected | 4 |

`scripts/ensure-preview-env.mjs` must stub the new variables during `prebuild`
so preview builds do not fail, following the precedent already set there for
site URLs. Commit `9ddad4c` exists because a previous stack failed preview
builds without a live database; do not repeat it.

---

## 12. Testing

Existing gates that must stay green: `pnpm typecheck`, `pnpm test:unit`,
`pnpm test:security`, `pnpm validate:atlas`, `pnpm validate:space`, and the
`verify:*` scripts.

New coverage, in rough priority order:

1. **Authorization** — user A cannot read, append to, rename, or delete user
   B's thread; unauthenticated callers get 401.
2. **Prerender regression** — a test over the build route manifest asserting
   the static/dynamic classification of every existing route is unchanged.
3. **CSP regression** — extend `lib/security/headers.test.ts` to assert no blob
   origin and no auth vendor origin were added.
4. **Reasoning cache miss** — a thread with no, expired, or rejected reasoning
   items still renders and still continues coherently.
5. **Disconnect persistence** — closing the stream mid-turn persists a partial
   assistant message with status `incomplete`, and Retry/Continue resumes it.
6. **Sequence integrity** — concurrent turns in one thread cannot produce
   duplicate or gapped `seq` values.
7. **Signed-out parity** — the legacy full-conversation request shape still
   works and persists nothing.
8. **Lifecycle** — soft delete hides immediately; purge removes rows and Blob
   objects; export contains only the calling user's data.

Manual verification: passkey sign-up and cross-device sign-in on desktop and
mobile, light and dark, per the existing UI rule in AGENTS.md.

---

## 13. Documentation to update

- `AGENTS.md` — several statements become false: "Conversation state clears on
  reload", "There is no authentication, database, media library", the
  `/cleo?q=…` consume-and-strip description, and the third-party API policy.
- `docs/handoff.md` — product summary and architecture.
- `README.md` — setup, new environment variables, migration commands.
- `.env.example` — new variables with comments.
- A short ADR recording the Better Auth versus Clerk decision and the
  `store: false` versus Conversations API decision, since both reverse or
  qualify prior product decisions.

### 13.1 Editing the legacy URL contract

`content/legacy-url-manifest.json` is the cutover contract with the outside
world — old inbound links and search engines. `pnpm verify:legacy-urls`
validates the app **against the manifest**, so deleting a rule together with
its probes leaves the check green while the external contract silently breaks.
The probe count is the tell: it should never fall.

Rules when a stage wants a path the manifest already owns:

- Never delete an entry. Retarget its `destination` instead.
- When a redirected path becomes a real page, narrow the rule to `:path+`
  (one or more segments) rather than removing it, so the page serves at the
  bare path while sub-paths still redirect instead of 404ing.
- Keep at least one probe per surviving rule.

Stage 2a hit this exactly: reclaiming `/sign-in` removed `/sign-in/:path*`
outright, which turned `/sign-in/legacy` from a 308 into a 404 while
`verify:legacy-urls` still passed. Restoring the rule as `/sign-in/:path+ →
/sign-in` fixes it with no effect on the new page.

---

## 14. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| ~~`cacheComponents` + session reads break prerendering~~ | Resolved | Measured in Stage 0; no route became ƒ. See §6.1 |
| ~~Client-only session fetch on every anonymous page view~~ | Resolved | Hint cookie removes it; measured in Stage 0. See §6.2 |
| Stale or missing session hint | Low | Clear on null session; `/cleo` RSC read repairs it. See §6.2 |
| Next `16.3.0-preview.9` ahead of Better Auth's tested versions | Low | `better-auth@1.6.25` wired cleanly in Stage 0; pin exact versions |
| Thread ownership bug leaks another user's history | High | Dedicated tests before any UI work |
| No self-service account recovery | Medium | Second passkey + GitHub at sign-up |
| Neon outage takes auth down with it | Medium | Accepted; DB sessions are the point |
| Better Auth's 3-day release cadence | Low | Exact version pins, deliberate upgrades |
| Preview URLs vs `trustedOrigins` and OAuth redirects | Medium | Derive from Vercel system env vars |
| `/api/responses` contract change desyncs client and server | Medium | Accept both shapes through Stage 2 |
| Reasoning cache growth | Low | TTL, per-thread byte cap, purge job |

Unrelated to this plan but worth noting while touching storage: `.git` is
already 666 MB against 485 MB of tracked images in `public/`. Blob solves
future image growth for user content only; it does not address the existing
history.

---

## 15. Open questions

1. Is "Vercel managed" a hard requirement for auth specifically? See §2.1.
2. Should signed-out Cleo keep working indefinitely, or become a limited trial
   once accounts exist? This plan assumes indefinitely.
3. Thread retention policy for inactive accounts — indefinite, or expiring?
4. Is a per-user daily turn quota acceptable product behaviour, and at what
   number?
