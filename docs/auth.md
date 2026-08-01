# Auth (Better Auth + Neon)

Self-hosted **Better Auth** on **Neon Postgres** (Vercel Marketplace). Better
Auth is a library install — it is **not** a Vercel Marketplace auth product
(Clerk / Auth0 / Descope). Neon supplies the database.

Email/password is enabled. Portal pages stay public; auth routes are
noindex and do not gate Explore / Space / Cleo.

## Surfaces

| Path | Role |
| --- | --- |
| `POST/GET /api/auth/*` | Better Auth handler (`toNextJsHandler`) |
| `/sign-in`, `/sign-up` | Email/password forms (print-register service UI) |
| `/account` | Session nameplate + sign out |
| Dock → Preferences → **Sign in** / **Account** | Discoverable entry in the Preferences panel |

UI composition: same service-page register as Explore / Topics — `page-eyebrow`
+ `PixelCluster`, shared `Input` / `Button`, signed-in details in
`.spec-nameplate`. See [Account in design-language.md](./design-language.md#account-sign-in--sign-up--account).

Preferences keeps `authClient.useSession()` subscribed on the dock (outside
the popover portal) so opening the panel does not remount a pending session
fetch. While session is unresolved, the row stays **Sign in** — never flash
**Account** → **Sign in** for guests.

Without `DATABASE_URL` + `BETTER_AUTH_SECRET` (≥32 chars), `/api/auth/*`
returns **HTTP 503**; the rest of the site keeps working (same pattern as
missing `OPENAI_API_KEY` for `/api/responses`).

## Key files

| Path | Purpose |
| --- | --- |
| `lib/db/index.ts` | Lazy Neon HTTP + Drizzle client |
| `lib/db/auth-schema.ts` | Better Auth tables (`user`, `session`, `account`, `verification`) |
| `lib/auth.ts` | Server `betterAuth` + `getSession` |
| `lib/auth-client.ts` | React `createAuthClient` |
| `app/api/auth/[...all]/route.ts` | Next.js route handler |
| `drizzle.config.ts` | Migrations / push |
| `app/_views/auth-pages.tsx` | Sign-in / sign-up / account UI |

## Provision Neon (Marketplace)

From a linked Vercel project:

```bash
vercel link
vercel integration guide neon
vercel integration add neon
# wait 1–3 minutes for provisioning
vercel env pull .env.local --yes
```

Or install **Neon** from the Vercel Marketplace UI on the project, then pull
env. Prefer `DATABASE_URL` (pooled). Use `DATABASE_URL_UNPOOLED` /
`POSTGRES_URL_NON_POOLING` for drizzle-kit when the pooled URL rejects DDL.

## Local env

```bash
cp .env.example .env.local
# After Marketplace pull, .env.local should include DATABASE_URL.
# Generate a secret (≥32 chars), never commit it:
# node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Required for auth:

| Variable | Source |
| --- | --- |
| `DATABASE_URL` | Neon Marketplace (or `POSTGRES_URL`) |
| `BETTER_AUTH_SECRET` | You — random ≥32 characters |
| `BETTER_AUTH_URL` | **Production only** — live origin. Leave unset for Preview/Development. Preview trusts `*.vercel.app` via dynamic `baseURL.allowedHosts` (avoids “Invalid origin”). |

## Schema migrate

```bash
pnpm db:push          # uses `pnpm exec drizzle-kit` (reliable PATH)
# or: pnpm db:generate && pnpm db:migrate
```

Re-generate the Drizzle schema from Better Auth when plugins change:

```bash
pnpm dlx auth@latest generate --config lib/auth.ts --adapter drizzle
```

(Only works when auth env is present; the checked-in `lib/db/auth-schema.ts`
matches the default email/password tables.)

## Verification

```bash
pnpm typecheck
pnpm test:unit        # includes lib/auth.test.ts
pnpm build
```

Manual: open `/sign-up`, create a user, land on `/account`, sign out, sign
in again. Confirm `/api/auth/ok` (or any auth path) returns 503 when Neon
env is stripped.

## Boundaries

- Do **not** put `BETTER_AUTH_SECRET` or database URLs in `NEXT_PUBLIC_*`.
- Do **not** restore Clerk for this stack unless product explicitly switches.
- OpenAI remains the only **model** third-party API; Neon is infrastructure.
- Neon **Managed Better Auth** (`@neondatabase/auth`) is a different product —
  this repo uses self-hosted `better-auth` + Drizzle.
