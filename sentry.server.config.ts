import * as Sentry from '@sentry/nextjs'

const isDev = process.env.NODE_ENV === 'development'

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.SENTRY_ENVIRONMENT ??
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV,

  tracesSampleRate: isDev ? 1.0 : 0.1,

  // Local variable values on server stack frames (dev + staging debugging).
  includeLocalVariables: true,

  enableLogs: true,

  // Cleo uses the OpenAI SDK on the server. Keep spans/token metrics, but do
  // not send prompt/completion bodies (chat content) to Sentry by default.
  integrations: [
    Sentry.openAIIntegration({
      recordInputs: false,
      recordOutputs: false,
    }),
  ],
})
