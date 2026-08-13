# 🚀 felich.dev — Web Performance & Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.12-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Lighthouse Target](https://img.shields.io/badge/Lighthouse-95%2B-success?style=flat-square&logo=lighthouse)](https://felich-dev.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

State-of-the-art, high-performance personal portfolio built with **Next.js 16** (App Router), **TypeScript**, **TailwindCSS**, and **Firebase** — featuring 3 custom CSS theme modes, WebGL 3D interactive hero, realtime presence tracking, MDX blog & project publishing, PWA capabilities, and a fully green CI/CD pipeline.

---

## ⚡ Performance & Core Web Vitals (>95 Score Architecture)

Optimized based on **DebugBear** & **Lighthouse** web performance benchmarks:

| Core Metric | Initial Benchmark | Optimized Target | Key Optimization Strategy |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | 3.17 s | **< 1.4 s** | **Instant SSR Hero Paint**: Removed `opacity: 0` initial Framer Motion state on main `<h1>` title to allow instant browser paint on initial load. |
| **TBT (Total Blocking Time)** | 466 ms | **< 120 ms** | **Deferred Three.js Engine**: Deferred WebGL canvas mounting (`Hero3D`) via `requestIdleCallback` to free the main thread during hydration. |
| **Visually Complete** | 9.14 s | **< 2.5 s** | **Idle Layout Staggering**: Re-scheduled `AIChatbot` and secondary floating widgets (`PulseSync`, `EngineeringGrid`) to early idle windows without visual shifts. |
| **Best Practices** | 73 / 100 | **95 - 100** | **HTTP Security Headers**: Implemented HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy in `next.config.mjs`. |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router, Webpack bundling), React 19, TypeScript
- **Styling & Design System**: TailwindCSS 3, HSL-based CSS variables, Glassmorphism UI
- **Interactive 3D & Animations**: Three.js, React Three Fiber, `@react-three/drei`, Framer Motion
- **State Management**: Zustand (persisted store with versioned migrations)
- **Data & Realtime**: Firebase (Firestore for comments/likes & Realtime Database for online visitor presence)
- **Content Engine**: MDX via `next-mdx-remote` (`content/blog`, `content/projects`)
- **i18n Localization**: `react-i18next` supporting 4 languages (**English**, **Bahasa Indonesia**, **中文**, **Deutsch**)
- **Progressive Web App**: `@ducanh2912/next-pwa` (service worker caching, disabled in dev)
- **Testing & Verification**: Vitest (Unit tests), Playwright (End-to-End & Visual Regression across Chromium, Firefox, WebKit)

---

## 🎨 Design System & Themes

Driven dynamically via CSS root variables (`--brand`, `--bg-base`, `--surface-*`, `--text-*`):

| Theme Key | Theme Name | Mode | Brand Color Accent |
| :--- | :--- | :--- | :--- |
| `noir` | Noir (Default) | Dark | `#CDCDD6` (Silver / Slate Graphite) |
| `vanilla` | Vanilla | Light | `#6B881F` (Olive Matcha) |
| `violet` | Violet | Light | `#7C6FC4` (Lavender Purple) |

*Theme choice persists to `localStorage` (Store v2) via `ThemeProvider`, with real-time `<meta name="theme-color">` syncing via `ThemeMetaSync`.*

---

## 🏁 Quick Start

### Prerequisites
- Node.js 20+
- npm (`legacy-peer-deps=true` enabled in `.npmrc`)

### Installation & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/felichpehagasaginting-code/felich.dev.git
cd felich.dev

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Launch local development server
npm run dev
```

---

## 📖 Command Reference & Verification Pipeline

CI Pipeline Order: `lint → type-check → test:unit → test:e2e`

```bash
npm run dev          # Launch Next.js dev server on localhost:3000
npm run build        # Production Webpack build
npm run start        # Serve production build locally
npm run lint         # ESLint over app, components, lib
npm run type-check   # TypeScript strict type checking (tsc --noEmit)
npm run test:unit    # Vitest unit test suite
npm run test:e2e     # Playwright E2E across Chromium, Firefox, and WebKit
```

---

## 🔥 Firebase Integration

- **Guestbook**: Realtime messaging & comments stored in Firestore.
- **Contact Form**: Secure form submissions saved in Firestore.
- **Live Visitor Badge**: Active online sessions calculated via Firebase Realtime DB presence (`/presence/`).
- **Counters API**: Server-side rate-limited route (`/api/counters`) backed by Firebase Admin SDK.

---

## 📄 License

MIT © [Felich](https://github.com/felichpehagasaginting-code)
