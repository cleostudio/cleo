# Stage 0 findings — Better Auth vs prerender under `cacheComponents`

Status: complete. Spike branch only — do not merge as product.

Question: under `cacheComponents: true` on Next.js `16.3.0-preview.9`, does
adding Better Auth session reads keep existing routes classified the same as
`main`?

## Verdict

**NO-GO for Suspense-wrapped RSC session reads in the site shell.**

**GO for Stage 2 if auth-aware chrome is fully client-side (`useSession`) with
no RSC `getSession` / `headers()` in `SiteDocument` or other static shells.**

Suspense wrapping does **not** preserve ○ classification. It converts those
routes to ◐ (Partial Prerender). They still get a static shell, but that fails
the Stage 0 acceptance bar of “same classification as `main`”.

The documented fallback — client-only auth surface — restores every existing
route to the same ○ / ◐ / ƒ marks as `main` (plus a new `ƒ /api/auth/[...all]`).

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

## Recommendation for Stage 2

Proceed with Better Auth, but treat the plan’s “Suspense RSC or client
`useSession`” choice as settled: **client `useSession` for dock / chrome**.
Keep Server Component shells session-free. Resolve sessions with
`auth.api.getSession({ headers })` only inside Route Handlers / Server Actions
(where dynamic is expected), never in `SiteDocument` or static page shells.
