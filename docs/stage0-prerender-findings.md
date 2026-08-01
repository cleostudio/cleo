# Stage 0 findings — Better Auth vs prerender under `cacheComponents`

Status: complete. Findings only (this file). The throwaway spike product code
must not ship — measurements and the rendering contract in §6 of the plan are
what matter.

Question: under `cacheComponents: true` on Next.js `16.3.0-preview.9`, does
adding Better Auth session reads keep existing routes classified the same as
`main`?

## Verdict

**NO-GO for Suspense-wrapped RSC session reads in `SiteDocument` (site-wide
shell).** That turns every content route ○ → ◐.

**GO for `/cleo`-scoped RSC `getSession` under Suspense** when ◐ is acceptable
for `/cleo` only. Content routes stay ○. ○ → ƒ was not observed.

**GO for client-only chrome (`useSession`)**, with a **non-httpOnly session
hint cookie** so signed-out visitors skip `/api/auth/get-session`.

## What was wired

- `better-auth@1.6.25` (pinned)
- Throwaway local SQLite via `better-sqlite3@12.5.0` (no Neon)
- `app/api/auth/[...all]/route.ts` with `toNextJsHandler`
- `lib/auth.ts` / `lib/auth-client.ts`
- `components/dock-auth-session-rsc.tsx` — Suspense RSC `getSession` probe
- `components/dock-auth-session-client.tsx` — `useSession` probe
- `proxy.ts` untouched (no auth checks, no `runtime`)

## Baseline (`main`)

```
Route (app)                                Revalidate  Expire
┌ ○ /                                              1d      1d
├ ○ /_not-found
├ ƒ /api/responses
├ ○ /apple-icon
├ ○ /blog                                          1d      1d
├   /blog/[slug]                                   1d      1d
│ ├ ◐ /blog/[slug]                                 1d      1d
│ ├ ○ /blog/the-atlas-of-vanishing-things          1d      1d
│ ├ ○ /blog/what-the-equator-remembers             1d      1d
│ └ ◐ [+7 more paths]
├ ○ /cleo                                          1d      1d
├   /confirm/[token]                               1d      1d
│ └ ◐ /confirm/[token]                             1d      1d
├ ƒ /content/[...path]
├ ○ /explore                                       1d      1d
├   /explore/[slug]                                1d      1d
│ ├ ◐ /explore/[slug]                              1d      1d
│ ├ ○ /explore/afghanistan                         1d      1d
│ ├ ○ /explore/albania                             1d      1d
│ └ ◐ [+193 more paths]
├ ○ /gallery                                       1d      1d
├ ○ /icon
├ ƒ /link-media/[kind]
├   /newsletters/[id]                              1d      1d
│ ├ ◐ /newsletters/[id]                            1d      1d
│ └ ○ /newsletters/1                               1d      1d
├ ƒ /og
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ○ /space                                         1d      1d
├   /space/[slug]                                  1d      1d
│ ├ ◐ /space/[slug]                                1d      1d
│ ├ ○ /space/sun                                   1d      1d
│ ├ ○ /space/mercury                               1d      1d
│ └ ◐ [+21 more paths]
└ ○ /topics                                        1d      1d
```

## After Suspense-wrapped RSC `getSession` (+ client `useSession`)

```
Route (app)                                Revalidate  Expire
┌ ◐ /                                              1d      1d
├ ○ /_not-found
├ ƒ /api/auth/[...all]
├ ƒ /api/responses
├ ○ /apple-icon
├ ◐ /blog                                          1d      1d
├   /blog/[slug]                                   1d      1d
│ ├ ◐ /blog/[slug]                                 1d      1d
│ ├ ◐ /blog/the-atlas-of-vanishing-things          1d      1d
│ ├ ◐ /blog/what-the-equator-remembers             1d      1d
│ └ ◐ [+7 more paths]
├ ◐ /cleo                                          1d      1d
├   /confirm/[token]                               1d      1d
│ └ ◐ /confirm/[token]                             1d      1d
├ ƒ /content/[...path]
├ ◐ /explore                                       1d      1d
├   /explore/[slug]                                1d      1d
│ ├ ◐ /explore/[slug]                              1d      1d
│ ├ ◐ /explore/afghanistan                         1d      1d
│ ├ ◐ /explore/albania                             1d      1d
│ └ ◐ [+193 more paths]
├ ◐ /gallery                                       1d      1d
├ ○ /icon
├ ƒ /link-media/[kind]
├   /newsletters/[id]                              1d      1d
│ ├ ◐ /newsletters/[id]                            1d      1d
│ └ ◐ /newsletters/1                               1d      1d
├ ƒ /og
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ◐ /space                                         1d      1d
├   /space/[slug]                                  1d      1d
│ ├ ◐ /space/[slug]                                1d      1d
│ ├ ◐ /space/sun                                   1d      1d
│ ├ ◐ /space/mercury                               1d      1d
│ └ ◐ [+21 more paths]
└ ◐ /topics                                        1d      1d
```

Acceptance routes `/`, `/gallery`, `/blog`, `/topics`, `/cleo`, and concrete
`/explore/*` + `/space/*` pages all changed ○ → ◐. `/cleo` retained a
prerendered shell (◐), but not the same mark as `main`.

## After client-only `useSession` (RSC probe unmounted)

Classification matches `main` for every pre-existing route. Only addition:

```
├ ƒ /api/auth/[...all]
```

## Next.js 16.3 / Better Auth incompatibilities hit

1. **`node:sqlite` + `npx auth@1.6.25 migrate`** failed with
   `TypeError: stmt.columns is not a function` in
   `@better-auth/kysely-adapter`’s node-sqlite dialect. Spike substituted
   `better-sqlite3@12.5.0`, which migrated successfully.
2. **Do not set `runtime` in `proxy.ts`** — already true here; Better Auth’s
   older Next 15.2 middleware examples are unsafe to copy on this stack.
3. No Clerk / CSP changes were required; `/api/auth/*` is same-origin.

## Follow-up A — RSC `getSession` on `/cleo` only

Moved the Suspense RSC probe out of `SiteDocument` and into
`app/(site)/cleo/page.tsx` only.

| Route | `main` | `/cleo`-only RSC | Notes |
| --- | --- | --- | --- |
| `/`, `/blog`, `/gallery`, `/topics`, `/explore`, `/space` | ○ | ○ | unchanged |
| concrete `/explore/*`, `/space/*`, `/blog/*` | ○ | ○ | unchanged |
| `/cleo` | ○ | ◐ | only classification change among pages |
| `/api/auth/[...all]` | — | ƒ | new |

No ○ → ƒ. Content routes stay ○ as expected. ◐ on `/cleo` is acceptable.

## Follow-up B — does signed-out `useSession` hit get-session?

Client-only probe mounted site-wide. `pnpm build` + `pnpm start`, then load `/`
with no cookies (Chrome via measurement script).

**Yes.** Better Auth’s session atom always `$fetch("/get-session")` on mount:

```json
{
  "probeState": "signed-out",
  "cookiesAfter": [],
  "authRequests": [
    {
      "method": "GET",
      "url": "http://localhost:3000/api/auth/get-session",
      "resourceType": "fetch"
    }
  ],
  "getSessionRequested": true
}
```

### Hint-cookie gate prototype

`cleo.session-hint` (non-httpOnly). `DockAuthSessionClient` reads it before
mounting the `useSession` subtree — without the hint, `useSession` is never
mounted, so no fetch.

| Load `/` | Hint cookie | `get-session`? | Probe state |
| --- | --- | --- | --- |
| signed-out | absent | **no** | `signed-out-no-hint` |
| signed-out | `cleo.session-hint=1` | **yes** | `signed-out` |

Gate works. Real session tokens remain httpOnly; the hint is only a
“maybe signed in” signal for skipping the round-trip.

Re-run: `node scripts/stage0-measure-get-session.mjs` (needs `puppeteer-core`
+ Chrome; not a product dependency).

## Recommendation for Stage 2

- **Dock / site chrome:** client `useSession`, gated on a non-httpOnly hint
  cookie (`lib/auth-session-hint.ts` prototype). Set the hint on sign-in;
  clear it on sign-out.
- **`/cleo` only:** Suspense RSC `getSession` is fine if ◐ is acceptable there.
- **Never** put RSC session reads in `SiteDocument` / shared static shells.
- Route Handlers / Server Actions may call `auth.api.getSession` freely.
