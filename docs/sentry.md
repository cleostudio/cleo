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
4. Optional: `SENTRY_ENVIRONMENT=development` and
   `NEXT_PUBLIC_SENTRY_ENVIRONMENT=development` so cloud runs do not look like
   production

Also set the same three (DSN + auth token) on Vercel Production / Preview for
deployed capture and source maps.

## Local verify

```bash
# with DSN in .env.local
pnpm dev
curl -s "http://localhost:3000/api/sentry-test?marker=Sentry%20test%20error%20local"
```

Then confirm the issue in Sentry Issues for `sentry-cleo`. Remove
`app/api/sentry-test/route.ts` after verification if you do not want a
dev-only endpoint in the tree.

## Privacy

- Session Replay masks all text and blocks media by default.
- OpenAI prompt/completion bodies are not sent (`recordInputs` /
  `recordOutputs: false`).
- Never put `SENTRY_AUTH_TOKEN` in `NEXT_PUBLIC_*`.
