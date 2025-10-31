import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,

  environment: process.env.VERCEL_ENV || 'development',

  tracesSampleRate: 0.1,

  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Event:', event, hint)
      return null
    }
    return event
  },

  integrations: [Sentry.httpIntegration()],
})
