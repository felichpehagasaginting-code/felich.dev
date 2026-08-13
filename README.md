# 🌐 felich.dev — Next.js 16 WebGL Portfolio & AI Assistant Sandbox

[![Live Demo](https://img.shields.io/website?url=https%3A%2F%2Ffelich-dev.vercel.app%2F&style=flat-square&label=felich.dev&color=00f2fe)](https://felich-dev.vercel.app/)
[![Next.js Framework](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.12-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Google Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.5-8e44ad?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)
[![Lighthouse Score Target](https://img.shields.io/badge/Lighthouse-95%2B-success?style=flat-square&logo=lighthouse)](https://felich-dev.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

An enterprise-grade, high-performance personal portfolio, interactive sandbox, and AI assistant platform engineered with **Next.js 16** (App Router), **React 19**, **TypeScript**, **TailwindCSS**, and **Firebase**.

Designed with rich glassmorphic aesthetics, a WebGL 3D interactive hero, real-time presence telemetry, streaming AI voice assistant, multi-language localization, dynamic theme switching, MDX content publishing, installable PWA capabilities, and a fully green CI/CD testing pipeline.

👉 **Live Production URL**: [https://felich-dev.vercel.app/](https://felich-dev.vercel.app/)

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser & PWA)"]
        UI["React 19 App Router UI"]
        Theme["Zustand Theme Store (Noir / Vanilla / Violet)"]
        Three["Three.js / R3F 3D Canvas Engine"]
        Speech["Web Speech API (Voice Input)"]
        I18n["react-i18next (EN, ID, ZH, DE)"]
    end

    subgraph Server ["Next.js App Router (Server & Edge APIs)"]
        API_Chat["/api/chat (SSE Stream - Gemini 2.5)"]
        API_Counters["/api/counters (Rate-Limited Admin DB)"]
        API_Contact["/api/contact (Sanitized Firestore Store)"]
        API_Spotify["/api/spotify/now-playing (Polling API)"]
        API_GitHub["/api/github-repos & /api/github-contributions"]
        API_OG["/api/og (Edge Image Generation)"]
    end

    subgraph Cloud ["Cloud Infrastructure & External APIs"]
        Firestore[("Firebase Firestore (Likes, Views, Messages)")]
        RTDB[("Firebase Realtime DB (Live Presence)")]
        Gemini["Google Gemini 2.5 Flash API"]
        Spotify["Spotify Web API"]
        GitHub["GitHub GraphQL API"]
    end

    UI --> Theme
    UI --> Three
    UI --> Speech
    UI --> I18n
    UI -->|SSE Stream| API_Chat
    UI -->|POST Fetch| API_Counters
    UI -->|POST Fetch| API_Contact
    UI -->|GET Poll| API_Spotify
    UI -->|GET Fetch| API_GitHub

    API_Chat --> Gemini
    API_Counters --> Firestore
    API_Contact --> Firestore
    UI -->|Direct Presence| RTDB
    API_Spotify --> Spotify
    API_GitHub --> GitHub
```

---

## ✨ Comprehensive Features & Innovations

### 🤖 1. Felich AI Assistant (`AIChatbot.tsx`)
- **Google Gemini 2.5 SSE Engine**: Powered by `/api/chat` using Server-Sent Events (SSE) for zero-latency response streaming.
- **Voice Recognition (Web Speech API)**: Interactive microphone toggle (`Mic` / `MicOff`) enabling speech-to-text input directly into the chatbot.
- **Suggested Question Chips**: Pre-formulated prompt chips allowing visitors to query career history, tech stack, and background in one click.
- **Context-Aware Knowledge Base**: Pre-loaded system prompt containing verified biographical, technical, and project credentials.
- **Rate-Limited Security**: Memory rate-limiter guarding against API token exhaustion (max 20 requests/min per IP).

### 📦 2. Interactive 3D WebGL Canvas (`Hero3D.tsx`)
- **React Three Fiber & Drei**: High-performance WebGL 3D canvas featuring custom geometries and materials.
- **Deterministic Particle Swarm**: 1,500 3D particles generated via a custom Mulberry32 PRNG algorithm (ensuring 100% visual regression test stability).
- **12 Parametric Tech Geometries**: Custom 3D meshes for React, TypeScript, Next.js, Python, Svelte, Docker, Redis, Node.js, Prisma, Tailwind, Vite, and Git.
- **Interactive Cursor Lerping**: Camera and shapes dynamically tilt and rotate based on user cursor coordinates and touch gestures.
- **Accessibility & Reduced Motion**: Automatically pauses animation loops (`frameloop="never"`) when `prefers-reduced-motion` is detected.

### 🎨 3. Dynamic HSL Theme System (`ThemeProvider.tsx` & `store.ts`)
- **3 Curated Theme Modes**:
  - `noir` *(Dark, Default)* — Graphite obsidian base with silver accent (`#CDCDD6`).
  - `vanilla` *(Light)* — Clean matcha olive theme (`#6B881F`).
  - `violet` *(Light)* — Soft lavender purple theme (`#7C6FC4`).
- **CSS Variable Tokens**: Pure HSL tokens (`--brand`, `--bg-base`, `--surface-*`, `--text-*`) mapped to Tailwind utility classes.
- **Persistent State**: Theme choice saved to `localStorage` (Store Version 2) with automated legacy migration.
- **Native OS & Meta Sync**: `ThemeMetaSync` automatically updates browser status bar `<meta name="theme-color">` and PWA manifest colors.

### 🌐 4. Realtime Visitor Tracking & Telemetry
- **Firebase Realtime Database Presence**: Live online visitor badge (`LiveVisitorBadge.tsx`) calculating active sessions under `/presence/`.
- **Realtime Firestore Counters**: Dynamic view counters and like buttons for blog posts and showcase projects.
- **Server-Side Security**: All write counter increments route through `/api/counters` backed by `firebase-admin` and rate-limiting.

### 🎧 5. Live Spotify Integration (`SpotifyWidget.tsx`)
- **Realtime Audio Sync**: Polling endpoint `/api/spotify/now-playing` fetching currently playing or last played track data.
- **Vinyl Spin Micro-Animation**: 360° rotating vinyl disc animation active when music is playing.
- **Animated Equalizer Bars**: Multi-height dynamic waveform equalizer bars driven by Framer Motion.

### ⌨️ 6. Command Palette (`Cmd + K`) & Interactive Terminal Shell
- **Global Command Palette (`CommandPalette.tsx`)**: Keyboard shortcut modal (`Cmd+K` / `Ctrl+K`) for instant site search, theme switching, language selection, and page navigation.
- **Unix CLI Terminal (`Terminal.tsx`)**: Embedded interactive terminal shell supporting commands (`help`, `about`, `skills`, `projects`, `contact`, `clear`, `matrix`).

### 🌅 7. Time-Adaptive Ambient Engine (`AdaptiveBackground.tsx`)
- **Timezone-Aware Orbs**: Ambient blurred background gradients automatically adjusting to the user's local hour:
  - 🌅 **Morning** (05:00–10:00) — Soft warm glow overlay
  - ☀️ **Day** (10:00–16:00) — High contrast ambient orbs
  - 🌇 **Evening** (16:00–19:00) — Golden dusk accent gradients
  - 🌙 **Night** (19:00–05:00) — Deep space dark background with subtle star pattern

### 🌍 8. Full i18n Localization Engine (`app/i18n.ts`)
- **4 Locales**: English (`en`), Bahasa Indonesia (`id`), Chinese (`zh`), Deutsch (`de`).
- **Instant Switcher**: Seamless inline language toggling without route reloading or flash of unlocalized content.

### 📰 9. MDX Blog & Case Study Engine
- **Static & Dynamic MDX Parsing**: MDX content in `content/blog/` and `content/projects/` rendered via `next-mdx-remote`.
- **Rich Content Features**: Dynamic Reading Time calculation, category tags, view counters, like buttons, and social sharing links.

---

## ⚡ Performance Architecture (>95 Lighthouse Benchmark)

Audited and optimized based on **DebugBear** and **Google Lighthouse** performance standards:

| Core Metric | Initial Benchmark | Optimized Target | Technical Strategy |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | 3.17 s | **< 1.4 s** | **Instant SSR Hero Header**: Removed `opacity: 0` initial state from `Hero.tsx` `<h1>` to allow instant browser paint on SSR render. |
| **TBT (Total Blocking Time)** | 466 ms | **< 120 ms** | **Deferred Three.js Engine**: Wrapped Three.js WebGL canvas (`Hero3DWrapper`) with `requestIdleCallback` to free main thread during hydration. |
| **Visually Complete** | 9.14 s | **< 2.5 s** | **Idle Staggering**: Re-scheduled `AIChatbot` and secondary floating widgets (`PulseSync`, `EngineeringGrid`) to early idle windows without layout shifts. |
| **Best Practices** | 73 / 100 | **95 - 100** | **HTTP Security Headers**: Configured HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy in `next.config.mjs`. |

---

## 🗺️ Page Route Matrix

| Route Path | Page Title | Description & Key Components |
| :--- | :--- | :--- |
| `/` | **Home** | Hero 3D, Stats Band, Featured Projects, Terminal Shell, Skills Section, Blog Teaser |
| `/about` | **About Me** | Career Timeline, Education, Biography, Professional Values, Tech Stack Breakdown |
| `/projects` | **Projects** | Interactive Project Showcase filterable by category, search bar, tech badges, like buttons |
| `/blog` | **Blog** | MDX Article archive filterable by tags and search query |
| `/blog/[slug]` | **Blog Detail** | Full MDX rendered article, TOC, reading time, view counter, like button, social share |
| `/dashboard` | **Dashboard** | Live GitHub contribution graph, top repositories, visitor metrics, system status |
| `/guestbook` | **Guestbook** | Real-time public message board powered by Firestore authentication |
| `/contact` | **Contact** | Interactive contact form with validation, social media cards, email copy helper |
| `/achievements` | **Achievements** | Honors, awards, certifications, and competition achievements timeline |
| `/uses` | **Uses / Setup** | Workspace hardware, workstation specs, software applications, terminal configuration |
| `/links` | **Quick Links** | Bio link tree page optimized for mobile social profiles |

---

## 🧩 Key Component Directory

| Component File | Type | Purpose / Description |
| :--- | :--- | :--- |
| [`AIChatbot.tsx`](file:///f:/Projects/felich.dev/components/AIChatbot.tsx) | Client Widget | Floating Gemini AI chat dialog with voice input and streaming SSE response |
| [`Hero3D.tsx`](file:///f:/Projects/felich.dev/components/Hero3D.tsx) | Client 3D | Three.js WebGL scene with 1,500 particles and 12 custom tech shapes |
| [`Hero3DWrapper.tsx`](file:///f:/Projects/felich.dev/components/Hero3DWrapper.tsx) | Client Wrapper | Idle deferred loader for Three.js engine to eliminate initial TBT |
| [`CommandPalette.tsx`](file:///f:/Projects/felich.dev/components/CommandPalette.tsx) | Client Modal | Global `Cmd+K` navigation and action modal |
| [`LiveVisitorBadge.tsx`](file:///f:/Projects/felich.dev/components/LiveVisitorBadge.tsx) | Client Telemetry| Firebase Realtime Database live online visitor badge |
| [`SpotifyWidget.tsx`](file:///f:/Projects/felich.dev/components/SpotifyWidget.tsx) | Client Audio | Live Spotify track info with rotating vinyl & animated equalizer waveform |
| [`Terminal.tsx`](file:///f:/Projects/felich.dev/components/Terminal.tsx) | Client Shell | Interactive Unix CLI terminal component with custom commands |
| [`AdaptiveBackground.tsx`](file:///f:/Projects/felich.dev/components/AdaptiveBackground.tsx)| Client Overlay | Time-adaptive ambient gradient orb generator |
| [`DynamicClientComponents.tsx`](file:///f:/Projects/felich.dev/components/DynamicClientComponents.tsx)| Client Loader | Staggered idle loader for non-critical floating UI components |
| [`Sidebar.tsx`](file:///f:/Projects/felich.dev/components/Sidebar.tsx) | Client Layout | Main desktop navigation sidebar with theme and language toggles |
| [`MobileNav.tsx`](file:///f:/Projects/felich.dev/components/MobileNav.tsx) | Client Layout | Responsive mobile navigation bar and menu drawer |

---

## 🔌 API Endpoints Reference

### 1. `POST /api/chat`
- **Purpose**: Server-Sent Events (SSE) AI assistant endpoint using Google Gemini 2.5 Flash API.
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "What are Felich's main technical skills?" }
    ]
  }
  ```
- **Response**: `text/event-stream` returning data chunks: `data: {"text":"..."}\n\n`

### 2. `POST /api/counters`
- **Purpose**: Rate-limited server-side counter increment for Firestore (`blog_views`, `blog_likes`, `project_likes`, `page_views`).
- **Request Body**:
  ```json
  { "collection": "blog_likes", "slug": "felich-ai-2-0-siri-voice-interface" }
  ```
- **Response (200 OK)**: `{ "success": true }`

### 3. `POST /api/contact`
- **Purpose**: Submits contact form messages to Firestore.
- **Request Body**:
  ```json
  { "name": "John Doe", "email": "john@example.com", "message": "Hello Felich!" }
  ```
- **Response (200 OK)**: `{ "success": true, "id": "msg_12345" }`

### 4. `GET /api/spotify/now-playing`
- **Purpose**: Polls Spotify Web API for current track playback data.
- **Response (200 OK)**:
  ```json
  {
    "isPlaying": true,
    "title": "Starboy",
    "artist": "The Weeknd",
    "album": "Starboy",
    "songUrl": "https://open.spotify.com/track/...",
    "progressMs": 45000,
    "durationMs": 230000
  }
  ```

### 5. `GET /api/og?title=...&category=...`
- **Purpose**: Dynamic Edge OpenGraph image generation returning PNG images for social media cards.

---

## 🔒 Firebase Security Rules

### Firestore Security (`firestore.rules`)
- **Guestbook (`/guestbook/{messageId}`)**: Anyone can read; authenticated users can write messages (max 500 chars, timestamp verification).
- **Contact Messages (`/contact_messages/{messageId}`)**: Client SDK fallback validation for contact form submissions.
- **Counters (`/blog_views`, `/blog_likes`, `/project_likes`, `/page_views`)**: Public read-only for clients; all writes handled via `/api/counters` (Admin SDK + rate limiting).

### Realtime Database Security (`database.rules.json`)
- **Presence (`/presence/{path}/{sessionId}`)**: Public read-only; write allowed only for creation/deletion of connection sessions.

---

## ⚙️ Environment Variables Reference

Copy `.env.example` to `.env` and fill in credentials:

```env
# Server Runtime
PORT=3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Google Gemini AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Firebase Client SDK Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK Configuration (Server-Only)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@email.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

---

## 🏁 Installation & Development Workflow

### Prerequisites
- Node.js 20+
- npm (`legacy-peer-deps=true` set in `.npmrc`)

```bash
# 1. Clone the repository
git clone https://github.com/felichpehagasaginting-code/felich.dev.git
cd felich.dev

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Start local development server (Webpack)
npm run dev
```

---

## 🧪 Testing & CI Verification Pipeline

CI Pipeline Order: `lint → type-check → test:unit → test:e2e`

```bash
# 1. ESLint Static Code Analysis
npm run lint

# 2. TypeScript Strict Type Checking
npm run type-check

# 3. Vitest Unit Test Suite
npm run test:unit

# 4. Production Webpack Build Verification
npm run build

# 5. Playwright E2E & Visual Regression Tests across Chromium, Firefox, & WebKit
npm run test:e2e
```

> [!IMPORTANT]
> Playwright E2E tests run against a **production build** (`npm run build && npm run start`) to guarantee exact bundle behavior and memory efficiency.

---

## 🚢 Deployment

Deployed seamlessly on **Vercel**:

1. Connect repository on Vercel Dashboard.
2. Add Environment Variables (`NEXT_PUBLIC_FIREBASE_*`, `GEMINI_API_KEY`, `FIREBASE_PRIVATE_KEY`).
3. Build command runs `npm run build` (`next build --webpack`).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

Designed & Developed with ❤️ by **[Felich Pehagasa Ginting](https://github.com/felichpehagasaginting-code)**.
