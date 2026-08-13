# 🚀 Felich Portfolio

Modern, high-performance personal portfolio built with **Next.js 16** (App Router), **TypeScript**, and **Firebase** — featuring three color themes, realtime interactions, MDX content, PWA support, and a fully verified CI pipeline.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router, webpack), React 19, TypeScript, TailwindCSS 3
- **Animations**: Framer Motion, Three.js (React Three Fiber / Drei)
- **Content**: MDX via `next-mdx-remote` (`content/blog`, `content/projects`)
- **Backend/Data**: Firebase (Firestore & Realtime Database), Sanity client
- **State**: Zustand (persisted to localStorage)
- **i18n**: `react-i18next` — English, Bahasa Indonesia, 中文, Deutsch
- **Testing**: Vitest (unit), Playwright (E2E, 3 browsers)
- **PWA**: `@ducanh2912/next-pwa` (offline support, disabled in dev)
- **CI/CD**: GitHub Actions

---

## 🎨 Themes

Three themes powered by CSS variables (`--brand`, `--surface-*`, `--text-*`, ...):

| Theme | Mode | Notes |
|:---|:---|:---|
| `noir` | Dark (default) | Signature look, `--brand: #FFFFFF` |
| `vanilla` | Light | Clean, high-contrast |
| `violet` | Dark | Purple accents |

The active theme persists to localStorage (store version 2) via `ThemeProvider`; `ThemeMetaSync` keeps `<meta>` and OG colors in sync.

---

## 🏁 Quick Start

### Prerequisites

- Node.js 20+
- npm (the repo uses `legacy-peer-deps` via `.npmrc` — prefer `npm install` over `npm ci`)

### Installation

```bash
git clone https://github.com/felichpehagasaginting-code/felich.dev.git
cd felich.dev
npm install
```

### Environment Setup

Copy the example environment file and fill in your **Firebase** and **Gemini API** credentials:

```bash
cp .env.example .env
```

---

## 📖 Command Reference

### Development

| Command | Description |
|:---|:---|
| `npm run dev` | Start the Next.js dev server on `localhost:3000` (webpack) |
| `npm run dev:all` | Run the dev server alongside the legacy backend watcher |

### Production

| Command | Description |
|:---|:---|
| `npm run build` | Build for production (webpack) |
| `npm run start` | Serve the production build |

### Quality

| Command | Description |
|:---|:---|
| `npm run lint` | ESLint over `app`, `components`, `lib` |
| `npm run type-check` | `tsc --noEmit` (CI type gate) |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E across chromium, firefox, webkit |
| `npx playwright test --ui` | Playwright interactive UI for debugging E2E tests |

> [!NOTE]
> E2E serves a **production build** (`npm run build && npm run start`) because `next dev --webpack` is memory-hungry on Windows and dies mid-suite.

---

## 🔥 Firebase Features

- **Guestbook**: Realtime messaging via Firestore
- **Contact Form**: Messages stored in Firestore
- **Live Visitor Tracking**: Realtime presence via RTDB
- **Analytics**: Project likes and blog view counters

Firestore rules live in `firestore.rules` (indexes in `firestore.indexes.json`).

---

## 📈 SEO & Social Sharing

- **Dynamic OG Images**: Edge API at `/api/og` generates previews for blog posts and projects
- **Structured Data**: JSON-LD (Person & WebSite) for Google Rich Results
- **Dynamic Sitemap**: Auto-updating `sitemap.xml`

---

## 🎡 CI/CD Pipeline

GitHub Actions runs, in order: **lint → type-check → unit tests → E2E tests**.

---

## 📄 License

MIT © [Felich](https://github.com/felichpehagasaginting-code)
