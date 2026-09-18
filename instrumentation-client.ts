import * as Sentry from '@sentry/nextjs';

// Tanpa NEXT_PUBLIC_SENTRY_DSN, init menjadi no-op — aman untuk dev/CI tanpa kredensial.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
