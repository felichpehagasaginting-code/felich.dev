# 🌐 felich.dev — Next.js 16 Portfolio & Interactive AI Sandbox

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Ffelich-dev.vercel.app%2F&style=flat-square&label=felich.dev&color=00f2fe)](https://felich-dev.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.12-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.5-8e44ad?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)
[![Lighthouse Target](https://img.shields.io/badge/Lighthouse-95%2B-success?style=flat-square&logo=lighthouse)](https://felich-dev.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A state-of-the-art, high-performance developer portfolio and interactive showcase website engineered with **Next.js 16** (App Router), **React 19**, **TypeScript**, **TailwindCSS**, and **Firebase**. 

Featuring an embedded **Gemini-powered AI Assistant**, **WebGL 3D Interactive Canvas**, **Realtime Online Visitor Tracking**, **Live Spotify Track Sync**, **Multi-Language Localization (i18n)**, **3 Custom Dynamic Themes**, **MDX Blog & Project Engine**, **Installable PWA**, and a fully verified **CI/CD Quality Pipeline**.

👉 **Live Demo**: [felich-dev.vercel.app](https://felich-dev.vercel.app/)

---

## ✨ Key Features & Highlights

### 🤖 1. Gemini AI Assistant ("Felich AI")
- **AI-Powered Chat Interface**: Built-in virtual assistant integrated via `/api/chat` with Google's Gemini API.
- **Voice Recognition Input**: Integrated Web Speech API (`Mic` & `MicOff`) allowing users to speak their questions directly.
- **Quick Suggestion Chips**: One-tap pre-formulated prompts for quick interactive queries about experience, tech stack, and background.
- **Streaming & Typing Animations**: Real-time response streaming with interactive code blocks and markdown rendering.

### 📦 2. Interactive 3D WebGL Canvas (`Hero3D`)
- **React Three Fiber & Drei**: High-performance WebGL 3D scene built with Three.js.
- **Dynamic Particle Swarm**: 1,500 interactive 3D particles generated using a deterministic Mulberry32 PRNG seed.
- **12+ Interactive Tech Geometries**: Custom 3D shapes representing React, TypeScript, Next.js, Python, Svelte, Docker, Redis, Node.js, Prisma, Tailwind, Vite, and Git.
- **Mouse & Gyro Tracking**: Smooth lerped rotation tracking user cursor and touch gestures with fallback loading states.

### 🎨 3. Multi-Theme Dynamic Design System
- **3 Color Themes**: 
  - `noir` *(Dark, Default)* — Obsidian graphite with silver brand accents (`#CDCDD6`).
  - `vanilla` *(Light)* — Clean, high-contrast matcha olive palette (`#6B881F`).
  - `violet` *(Light)* — Soft lavender purple aesthetics (`#7C6FC4`).
- **Zustand State Persistence**: Theme preferences persist across sessions in `localStorage` (Store v2).
- **Native Synchronization**: `ThemeMetaSync` updates `<meta name="theme-color">` and browser chrome UI dynamically.

### 🌐 4. Realtime Visitor Tracking & Firebase Integration
- **Realtime Database Presence**: Live online visitor counter powered by Firebase Realtime DB (`/presence/`).
- **Firestore Page Counters**: Realtime view counters and like buttons for blog posts and showcase projects.
- **Server-Side Rate Limiting**: `/api/counters` route protected by `rate-limiter-flexible` and Firebase Admin SDK.

### 🎧 5. Live Spotify Integration (`SpotifyWidget`)
- **Live Now Playing Sync**: Polled endpoint `/api/spotify/now-playing` displaying real-time song title, artist, and album art.
- **Spinning Vinyl Record**: 360° rotating vinyl animation active whenever music is playing.
- **Animated Waveform Equalizer**: Smooth sound bar equalizer micro-animations (`Framer Motion`).

### ⌨️ 6. Command Palette (`Cmd + K`) & Interactive Terminal
- **Global Command Palette**: Instant modal trigger (`Cmd+K` or `Ctrl+K`) for keyboard navigation, theme toggling, language switching, and social links.
- **Simulated Unix Terminal**: Terminal section on the home page executing custom commands (`help`, `about`, `skills`, `projects`, `contact`, `clear`, `matrix`).

### 🌅 7. Time-Based Adaptive Backgrounds
- **Ambient Gradient Orbs**: Dynamic background gradient blurring shifting based on the user's local timezone (morning, day, evening, night).

### 🌍 8. Full i18n Localization
- **4 Languages Supported**: English (`en`), Bahasa Indonesia (`id`), Chinese (`zh`), Deutsch (`de`).
- **Instant Switcher**: Seamless language toggle via sidebar, navigation, or command palette without page reloads.

### 📰 9. MDX Blog & Project Engine
- **Static & Dynamic MDX**: Blog posts (`content/blog/*.mdx`) and projects (`content/projects/*.mdx`) parsed with `next-mdx-remote`.
- **Rich Metadata**: Reading time calculation, category tags, interactive like button, and real-time view counts.

---

## ⚡ Web Performance & Core Web Vitals (>95 Lighthouse Benchmark)

Engineered and optimized against **DebugBear** & **Google Lighthouse** performance auditing:

| Metric | Baseline Benchmark | Optimized Target | Technical Strategy |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | 3.17 s | **< 1.4 s** | **Instant SSR Hero Header**: Removed `opacity: 0` initial state from `Hero.tsx` `<h1>` to allow immediate browser LCP registration on SSR. |
| **TBT (Total Blocking Time)** | 466 ms | **< 120 ms** | **Deferred Three.js Engine**: Deferred WebGL canvas mounting (`Hero3DWrapper`) using `requestIdleCallback` to unblock initial React hydration. |
| **Visually Complete** | 9.14 s | **< 2.5 s** | **Idle Staggering**: Re-scheduled `AIChatbot` and secondary floating elements (`PulseSync`, `EngineeringGrid`) to early idle windows without visual shifts. |
| **Best Practices** | 73 / 100 | **95 - 100** | **HTTP Security Headers**: Added HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy in `next.config.mjs`. |

---

## 📁 Repository Folder Structure

```
felich.dev/
├── app/                        # Next.js App Router Pages & API Routes
│   ├── about/                  # About Me page
│   ├── achievements/           # Honors & Certifications
│   ├── api/                    # Serverless API Routes
│   │   ├── blog/[slug]/        # Blog detail API
│   │   ├── chat/               # Gemini AI Assistant API
│   │   ├── contact/            # Contact form submission API
│   │   ├── counters/           # Firebase Admin counter increment API
│   │   ├── github-contributions/# GitHub contribution graph API
│   │   ├── github-repos/       # GitHub repository data API
│   │   ├── og/                 # Dynamic Edge OpenGraph image API
│   │   └── spotify/now-playing/# Spotify Live API endpoint
│   ├── blog/                   # Blog index & dynamic post detail [slug]
│   ├── contact/                # Contact page with form & socials
│   ├── dashboard/              # Metrics & activity analytics dashboard
│   ├── guestbook/              # Realtime guestbook message board
│   ├── links/                  # Social links bio page
│   ├── projects/               # Portfolio showcase projects
│   ├── uses/                   # Developer setup, gear, & software
│   ├── globals.css             # Core CSS variables, Tailwind, & design tokens
│   ├── i18n.ts                 # Translation dictionary (en, id, zh, de)
│   ├── layout.tsx              # Root layout with Theme & Providers
│   └── page.tsx                # Homepage featuring Hero, Stats, & Projects
├── components/                 # 50+ Modular React Client & Server Components
│   ├── home/                   # Hero, StatsBand, FeaturedProjects, SkillsSection
│   ├── AIChatbot.tsx           # Gemini AI Assistant UI with voice input
│   ├── CommandPalette.tsx      # Global Cmd+K modal dialog
│   ├── DynamicClientComponents.tsx # Deferred idle component loader
│   ├── Hero3D.tsx              # WebGL Three.js 3D scene & geometries
│   ├── Hero3DWrapper.tsx       # Idle wrapper for WebGL engine
│   ├── LiveVisitorBadge.tsx    # Firebase RTDB live presence badge
│   ├── Sidebar.tsx             # Main desktop navigation sidebar
│   ├── SpotifyWidget.tsx       # Spotify live now playing widget
│   └── Terminal.tsx            # Interactive CLI shell component
├── content/                    # MDX Source Files
│   ├── blog/                   # MDX articles with frontmatter
│   └── projects/               # MDX project case studies
├── data/                       # Static JSON datasets (contacts, etc.)
├── lib/                        # Custom Hooks, Helpers, & State Stores
│   ├── firebase.ts             # Client-side Firebase SDK loader
│   ├── firebase-admin.ts       # Server-side Firebase Admin SDK
│   ├── seo.ts                  # Metadata & OpenGraph helper utilities
│   ├── store.ts                # Zustand layout & theme state store
│   ├── useBlogLikes.ts         # Hook for blog post likes
│   ├── useFirestoreCounter.ts  # Generic Firestore counter hook
│   └── useVisitorTracking.ts   # Realtime visitor tracking hook
└── tests/                      # Comprehensive Test Suite
    ├── api/                    # Vitest API route tests
    ├── components/             # Vitest component unit tests
    ├── e2e/                    # Playwright E2E & visual regression tests
    └── lib/                    # Vitest hook & utility tests
```

---

## 🛠️ Technology Stack

| Category | Technology | Usage / Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2.4** | App Router, Server Components, Webpack bundler |
| **Language** | **TypeScript 6.0** | Strict mode (`tsc --noEmit`) |
| **UI & Styling** | **TailwindCSS 3.4** | CSS Variables, HSL dynamic themes, Glassmorphism |
| **Animations** | **Framer Motion 12** | Entrance animations, page transitions, gestures |
| **3D Rendering** | **Three.js & R3F** | `@react-three/fiber`, `@react-three/drei` |
| **State Management** | **Zustand 5.0** | Persistent layout state & theme store |
| **Database & Auth** | **Firebase 12** | Firestore, Realtime Database, Admin SDK |
| **AI Integration** | **Google Gemini API** | Natural language responses via `@/app/api/chat` |
| **CMS Content** | **MDX (`next-mdx-remote`)**| Static file posts with frontmatter parsing |
| **i18n** | **`react-i18next`** | Multi-language translation engine |
| **Testing** | **Vitest & Playwright** | Unit tests + E2E visual regression across 3 browsers |
| **PWA** | **`@ducanh2912/next-pwa`** | Offline service worker caching |

---

## ⚙️ Environment Variables Reference

Create a `.env` file in the root directory based on `.env.example`:

```env
# Server Configuration
PORT=3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# AI Assistant
GEMINI_API_KEY=your-gemini-api-key

# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK (Server-Only, for API Routes)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@email.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

---

## 📖 Command Reference

### Local Development

```bash
# Start Next.js development server on http://localhost:3000
npm run dev

# Start Next.js dev server alongside backend watcher
npm run dev:all
```

### Production Build & Execution

```bash
# Compile optimized Webpack production build
npm run build

# Start production server locally
npm run start
```

### Quality Assurance & Verification Pipeline

Run commands in CI order before committing code (`lint → type-check → test:unit → test:e2e`):

```bash
# 1. ESLint check over app, components, lib
npm run lint

# 2. Strict TypeScript type check (tsc --noEmit)
npm run type-check

# 3. Execute Vitest unit test suite
npm run test:unit

# 4. Execute Playwright E2E tests (Chromium, Firefox, WebKit)
npm run test:e2e

# Playwright interactive UI runner
npx playwright test --ui
```

---

## 🚢 Deployment

The project is optimized for deployment on **Vercel**:

1. Import the repository on [Vercel](https://vercel.com).
2. Configure Environment Variables (`NEXT_PUBLIC_FIREBASE_*`, `GEMINI_API_KEY`, etc.).
3. Vercel will automatically run `npm run build` (`next build --webpack`).

---

## 📄 License

This repository is open source under the **MIT License**.

Designed & Developed with ❤️ by **[Felich Pehagasa Ginting](https://github.com/felichpehagasaginting-code)**.
