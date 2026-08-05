# Sentry

Error monitoring, tracing, session replay, logs, and OpenAI AI spans for the
Next.js app. Org: **cleo-studio**. Project: **sentry-cleo**
(`https://cleo-studio.sentry.io`).

## What is wired

| Signal | Where |
| --- | --- |
| Errors | Client (`instrumentation-client.ts`), Node (`sentry.server.config.ts`), Edge (`sentry.edge.config.ts`), `onRequestError`, `app/global-error.tsx`, `app/(site)/error.tsx` |
| Tracing | `tracesSampleRate` on all three runtimes; App Router navigations via `onRouterTransitionStart` |
| Session Replay | Client only (`replayIntegration`, text/media masked) |
| Logs | `enableLogs: true` on all three runtimes |
| AI / OpenAI | Server `openAIIntegration` + `Sentry.instrumentOpenAiClient` in `app/api/responses/route.ts` (prompt/completion bodies **not** recorded) |
| Source maps | `withSentryConfig` in `next.config.ts` (`widenClientFileUpload`, needs `SENTRY_AUTH_TOKEN`) |
| Ad-blocker tunnel | `tunnelRoute: '/monitoring'` (same-origin; CSP `connect-src 'self'` stays valid) |

## Environment variables

| Variable | Runtime | Required | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | Client (+ server fallback) | Yes for browser capture | Public DSN from project client keys |
| `SENTRY_DSN` | Server / Edge | Recommended | Same DSN; falls back to `NEXT_PUBLIC_SENTRY_DSN` |
| `SENTRY_AUTH_TOKEN` | Build | For readable prod stacks | Auth token with release/source-map scopes |
| `SENTRY_URL` | Build | Yes for this org | `https://us.sentry.io` (US-region org) |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Client | Optional | Defaults to `NODE_ENV` |
| `SENTRY_ENVIRONMENT` | Server / Edge | Optional | Defaults to `VERCEL_ENV` then `NODE_ENV` |

Copy placeholders from [`.env.example`](../.env.example).

### Cursor Cloud environment

Add to the Cleo cloud-agent environment secrets (dashboard → Cloud Agents →
Environments → Cleo):

1. `NEXT_PUBLIC_SENTRY_DSN` — project DSN
2. `SENTRY_DSN` — same DSN
3. `SENTRY_AUTH_TOKEN` — for `pnpm build` source map upload (optional for local
   UI work; required for symbolicated production traces)
4. `SENTRY_URL=https://us.sentry.io` — US-region API host for uploads
5. Optional: set `SENTRY_ENVIRONMENT` and `NEXT_PUBLIC_SENTRY_ENVIRONMENT`
   to a non-production label (for example the Node `NODE_ENV` for local work)
   so cloud runs do not look like production

Also set the same vars (DSN + auth token + `SENTRY_URL`) on Vercel Production /
Preview for deployed capture and source maps.

## Local verify

With DSN in `.env.local`, run `pnpm dev` and trigger a real error path (for
example a temporary `throw` in a route handler). Confirm the issue appears
under `sentry-cleo`, then remove the temporary throw.

## Privacy

- Session Replay masks all text and blocks media by default.
- OpenAI prompt/completion bodies are not sent (`recordInputs` /
  `recordOutputs: false`).
- Server `includeLocalVariables` stays off so chat/request locals are not
  attached to events.
- Never put `SENTRY_AUTH_TOKEN` in `NEXT_PUBLIC_*`.
