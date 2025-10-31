import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,

  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',

  tracesSampleRate: 0.1,

  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Event:', event, hint)
      return null
    }
    return event
  },

  integrations: [Sentry.browserTracingIntegration()],

  ignoreErrors: ['ResizeObserver loop limit exceeded', 'Non-Error promise rejection captured'],
})
