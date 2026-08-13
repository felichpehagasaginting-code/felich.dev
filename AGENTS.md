# AGENTS.md — felich.dev

Next.js 16 (App Router) portfolio with Firebase, TypeScript, Tailwind, PWA, i18n, and MDX content. No monorepo.

## Quick commands

```bash
npm run dev          # next dev --webpack
npm run build        # next build --webpack
npm run lint         # eslint app components lib
npm run type-check   # tsc --noEmit (separate from build)
npm run test:unit    # vitest run
npm run test:e2e     # playwright test
npm run dev:all      # concurrently "npm run dev" "npm run backend:dev"
```

## Verification order

CI runs: `lint → type-check → test:unit → test:e2e`. Run in this order before committing.

## Key quirks

- `--webpack` flag passed to both `dev` and `build` — not default in Next 16 (uses Turbopack by default). Keep it.
- `.npmrc` sets `legacy-peer-deps=true` — use `npm install`, not `npm ci`, to respect it.
- Path alias `@/*` → project root (e.g. `@/components/Button`, `@/lib/firebase`).
- Type checking: `npm run type-check` (`tsc --noEmit`) is the CI gate, not Next's built-in type check.
- ESLint config uses `eslint-config-next/core-web-vitals` with React 19 hook rules turned off.
- TS `target: ES2022`, `lib: [ES2022, dom, dom.iterable]` — overrides the framework default (ES2017/es6) to reduce polyfill wrappers.
- Vitest uses jsdom; E2E tests in `tests/e2e/` are excluded from Vitest via config.

## Architecture

- `app/` — Next.js App Router pages, API routes, layout, i18n config
- `components/` — 50 React components (client by default, some `dynamic()` imported)
- `lib/` — Firebase, SEO helpers, Zustand store, custom hooks, Sanity client
- `content/blog/` and `content/projects/` — MDX files rendered via `next-mdx-remote`
- `tests/` — Vitest unit tests mirror `components/` and `lib/`; `tests/e2e/` via Playwright
- `data/contacts.json` — static contact data

## UI / State

- Zustand store (`lib/store.ts`) persisted to localStorage key `felich-portfolio-layout` (partial: `language`, `isSidebar`).
- 3 themes: `noir`, `vanilla`, `violet` (noir = default, dark; vanilla & violet "Lavender" = light). Persisted as `theme` (store version 2) via `ThemeProvider`; `ThemeMetaSync` syncs meta/OG colors.
- Tailwind `darkMode: 'class'` (noir is `dark`); theme via CSS vars in `app/globals.css` (`--brand`, `--surface-*`, `--text-*`, `--danger-*`, ...); Tailwind aliases `primary`, `brand.*`, `surface.*` in `tailwind.config.ts`.
- i18n: `react-i18next` with 4 languages (en, id, zh, de). Translations live in `app/i18n.ts` (not separate files).
- Smooth scroll via Lenis (`SmoothScroll` component wraps main content).
- PWA via `@ducanh2912/next-pwa`, disabled in dev.

## Firebase

- Guestbook (Firestore), Contact form (Firestore), Visitor tracking (RTDB), Analytics (counters).
- Firebase is lazy-loaded on the client (`lib/firebase.ts`), not imported server-side.
- Firestore rules at `firestore.rules`.
- `firebase.json` references `firestore.rules` and `firestore.indexes.json` (both tracked).
- `@vercel/speed-insights`, `howler`, `express`, `cors`, `helmet`, `body-parser`, `nodemailer` — removed from deps; those were legacy/unused.

## Testing

- `tests/test-utils.tsx` provides custom `render()` with mocked `framer-motion`, `next/navigation`, `next/image`, `next/link`, `react-i18next`.
- Use dynamic imports (`await import(...)`) in test files for components that import mocked dependencies.
- Firebase tests mock the underlying SDK packages (`firebase/app`, `firebase/firestore`, etc.), not `@/lib/firebase`.
- `tests/components/ThemeProvider.test.tsx` and `tests/components/ClientOnly.test.tsx` are entry points for component coverage.
- Playwright uses 3 projects (chromium, firefox, webkit); webServer runs `npm run build && npm run start` (NOT dev — `next dev --webpack` is memory-hungry on Windows and dies mid-suite). ~120 tests (~40 per browser).
- `tests/e2e/visual.spec.ts` snapshot determinism relies on: `page.clock.install()` (replaces rAF — freeze after load is useless), `emulateMedia({reducedMotion:'reduce'})` (production code guards: `Hero3D` frameloop `'never'` + seeded `mulberry32(42)` PRNG, `TypingAnimation` static, `Sidebar` status interval, `not-found` glitch), CSS kill via `addStyleTag` (hide FAB/BackToTop/PulseSync overlay), ~5.5s wait for one-shot WAAPI entrances before pausing animations, `mountLazy` param (scroll-height poll only for homepage), and `clock.pauseAt()` at the end.
- Use `page.locator('#main-content h1')` in specs — sidebar logo is also an `<h1>` (strict-mode violations with bare `locator('h1')`); 404 page has 3 "404" text nodes (glitch layers) — use `getByRole('heading', { name: '404' })`.
- `.skip-nav` is offscreen via `transform: translateY(-200%)` (NOT `top: -100%` — WebKit skips out-of-viewport elements in tab order).

## Conventions

- `next/font/google` for Inter, Outfit, JetBrains Mono via CSS variables.
- Tailwind `darkMode: 'class'` — dark classes added/removed by `ThemeProvider`.
- Animation via framer-motion; `LazySection` wraps heavy code-split components.
- OG images via Edge API at `app/api/og/`.
- Dynamic sitemap via `app/sitemap.ts`.
- `loading.tsx` exists for root and `blog/[slug]` — add for any new dynamic route.
