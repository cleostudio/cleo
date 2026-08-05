import * as Sentry from '@sentry/nextjs'

const isDev = process.env.NODE_ENV === 'development'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,

  tracesSampleRate: isDev ? 1.0 : 0.1,

  // Session Replay: sample some sessions; always capture around errors.
  replaysSessionSampleRate: isDev ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
