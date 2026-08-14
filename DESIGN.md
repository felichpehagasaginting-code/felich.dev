# 🏛️ FELICH.DEV — MASTER DESIGN & ANIMATION BLUEPRINT
**Ultra-Premium "Billion-Dollar" Apple-Class Motion & Spatial UI Specification**

---

## 🌟 Executive Vision & Aesthetic Manifesto

`felich.dev` is engineered to transcend conventional web portfolios and deliver a **billion-dollar, hyper-crafted digital experience** comparable to Apple flagship product reveals and luxury interactive showcases (e.g., dyslove, linear.app, stripe.com, apple.com/vision-pro). 

### Core Tenets:
1. **Zero "AI-Slop" Authenticity**: Every animation curve, spatial interaction, lighting layer, and sound event is hand-calibrated with deterministic mathematical precision. No generic templates, no cookie-cutter layouts.
2. **Apple-Class Motion Choreography**: Fluid, unified 60/120 FPS timeline orchestrations combining **GSAP 3**, **Lenis Smooth Scroll**, **React Three Fiber / WebGL 3D**, and **Framer Motion spring physics**.
3. **Spatial Depth & Glassmorphism 3.0**: Real-time cursor-following ambient lighting, multi-layer backdrop blurs, chromatic edge reflections, and 3D gyroscope/pointer tilt matrices.
4. **Editorial Typography & Visual Hierarchy**: Mathematical typographic scale paired with kinetic split-text decoders, 3D perspective rotations, and real-time font variable weight transitions.
5. **Deterministic Performance & Absolute Accessibility**: Full WCAG AAA compliance, deterministic seeded PRNG for WebGL stability, and instant zero-latency fallbacks when `prefers-reduced-motion: reduce` is detected.

---

## 🎨 1. Design System & Theme Foundations

The design architecture operates on a **3-Theme Real-Time Token System** synchronized across CSS variables, Tailwind classes, dynamic WebGL shaders, and browser meta/OG tags.

### 1.1 Color Palettes & Physical Light Tokens

| Token Variable | Noir Silver (Default Dark) | Vanilla Matcha (Pastel Daylight) | Lavender Violet (Soft Daylight) |
| :--- | :--- | :--- | :--- |
| `--bg-base` | `#202025` (Deep Titanium Obsidian) | `#EAF4CE` (Cream Matcha Frost) | `#EFEBFA` (Silky Lavender Day) |
| `--bg-surface` | `#2B2B31` (Frosted Slate) | `#FAFFEB` (Pure Matcha Foam) | `#F7F5FF` (Lilac Velvet) |
| `--bg-muted` | `#38383F` (Graphite Shadow) | `#DBE8B5` (Muted Sprout) | `#E3DDF5` (Soft Amethyst) |
| `--text-primary` | `#F5F5F6` (Pure Crisp White) | `#1A1A16` (Deep Charcoal Ink) | `#232327` (Rich Plum Noir) |
| `--text-muted` | `#A6A6AC` (Silver Mist) | `#55554E` (Olive Ash) | `#5F5F66` (Smoky Lilac) |
| `--brand` | `#CDCDD6` (Luminescent Silver) | `#6B881F` (Matcha Forest) | `#7C6FC4` (Electric Violet) |
| `--brand-strong` | `#E4E4EA` | `#556B14` | `#6B5BB5` |
| `--border-default`| `rgba(212, 212, 220, 0.16)` | `rgba(107, 136, 31, 0.28)` | `rgba(139, 122, 207, 0.28)` |
| `--glass-bg` | `rgba(43, 43, 49, 0.75)` | `rgba(250, 255, 235, 0.78)` | `rgba(247, 245, 255, 0.78)` |
| `--glass-border` | `rgba(212, 212, 220, 0.16)` | `rgba(196, 214, 150, 0.65)` | `rgba(139, 122, 207, 0.35)` |
| `--scrim` | `rgba(12, 12, 15, 0.60)` | `rgba(18, 20, 16, 0.45)` | `rgba(36, 31, 61, 0.45)` |

### 1.2 Surface Lighting & Glassmorphism 3.0
- **Refraction Borders**: 1px subtle gradients using `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 100%)`.
- **Specular Mouse Spotlight**: Radial luminescence `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(var(--brand-rgb), 0.12), transparent 40%)` dynamic over all bento cards.
- **Micro-Grain Texture**: Ultra-fine SVG noise overlay at 3% opacity to eliminate digital banding and provide tactile physical depth.

---

## 🎬 2. The Unified Apple-Class Motion Engine

### 2.1 Multi-Layered Motion Stack
The site utilizes a synchronized 4-layer motion pipeline:
1. **Global Smooth Momentum**: `Lenis` (duration `1.2s`, exponential easing `t => Math.min(1, 1.001 - Math.pow(2, -10 * t))`) providing buttery liquid scrolling.
2. **Deterministic Timeline Choreography**: `GSAP 3` (`gsap`, `@gsap/react`, `ScrollTrigger`) managing complex multi-stage keyframes, pinned sections, and kinetic text cascades.
3. **Interactive Spring & Micro-Gestures**: `Framer Motion` for magnetic button attraction, modal layout FLIP morphs, and springy toggle transitions.
4. **Spatial 3D Canvas Rendering**: `Three.js` / `@react-three/fiber` with custom shaders, dynamic vertex distortion, particle clouds, and interactive orbit rings.

```
┌─────────────────────────────────────────────────────────────┐
│                    LENIS SMOOTH SCROLL                      │
│      (Velocity, Inertial Physics, Delta Synchronization)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│       GSAP 3 & SCROLLTRIGGER │        │   FRAMER MOTION SPRINGS      │
│  - Multi-stage Pinning       │        │  - Magnetic Buttons          │
│  - Text Scramble & Rotations │        │  - Fluid Page Transitions    │
│  - Staggered Entrances       │        │  - FLIP Layout Morphs        │
│  - Path Drawing & Liquid SVG │        │  - Micro-Interaction Haptics │
└──────────────┬───────────────┘        └──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│             THREE.JS / REACT THREE FIBER (3D)               │
│  - MeshDistortMaterial Glass Icosahedron                    │
│  - Dual Precessing Torus Orbit Rings                        │
│  - Seeded 1500-Point Particle Swarm (Mulberry32 PRNG)       │
│  - Gyroscope & Mouse Pointer Gravitational Tracking         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📐 3. Page-By-Page Cinematic Choreography

### 3.1 Global Elements

#### A. Cinematic Intro Overture (`IntroAnimation.tsx`)
- **Visuals**: Fullscreen curtain overlay with liquid SVG path morphing (`d: M... to M...`).
- **Kinetic Matrix**: Dynamic counter counting `00 → 100` with cubic bezier acceleration, accompanied by alternating multi-lingual greetings (*HELLO → HALO → 你好 → GUTEN TAG*).
- **Sound Design**: Synchronized synthesized tick pulses (`introAudio.playTick()`) climbing in pitch, culminating in a resonant glass chime completion chord.
- **Scroll Sync**: Full Lenis scroll lock until the curtain seamlessly folds upward with `ease: 'expo.inOut'`.

#### B. Global Navigation & Sidebar (`Sidebar.tsx`, `MobileNav.tsx`)
- **Dock Expansion**: Smooth horizontal width transition with Framer Motion spring physics (`damping: 25, stiffness: 200`).
- **Magnetic Nav Links**: Magnetic spring hover with cursor attraction (`quickTo` displacement) and active glowing indicator pill.
- **Live Status Indicator**: Double-ring animated ping indicator displaying real-time local time (*WIB, UTC+7*), Spotify track player, and system signature badge.

#### C. Ambient Cursor & Aura Orb (`CursorGlow.tsx`, `AuraOrb.tsx`)
- **Spring-Damped Follower**: Smooth dual-lag cursor follower (Outer aura lag `0.18s`, inner pinhead lag `0.02s`).
- **Interactive Morphing**: Aura expands from `32px` to `80px` and changes blending mode to `mix-blend-mode: difference` over clickable links and interactive cards.

---

### 3.2 Homepage (`/`)

#### A. Hero Spatial Theater (`components/home/Hero.tsx` + `Hero3D.tsx`)
- **Kinetic 3D Scramble Title**: "Felich" glyph matrix scramble effect (*35ms cadence, 25 frames*) combined with 3D perspective lines (`rotateX: 45deg, transformOrigin: '0% 50% -50'`).
- **Typing Animation**: Multi-role typewriter with blinking cursor and dynamic status badges.
- **3D Spatial Geometry Canvas**:
  - **Core Glass Icosahedron**: Custom `MeshDistortMaterial` with real-time roughness and transmission based on active theme.
  - **Double Orbit Rings**: Counter-rotating gold/silver toruses with sine-wave oscillating precession.
  - **Starfield Swarm**: 1,500 additive-blended particles floating with pointer parallax and deterministic mulberry32 seeding.

#### B. Proof & Performance Band (`components/home/StatsBand.tsx`)
- **Animated Number Counter**: GSAP integer rolling counter with ease-out cubic deceleration from `0` to target metrics (`3.89`, `8+`, `12+`, `100%`).
- **Glass Bento Containers**: Hover spotlight reflections and delicate glowing borders.

#### C. Flagship Work Bento Deck (`components/home/FeaturedProjects.tsx`)
- **3D Tilt Perspective**: `TiltCard` matrix applying `rotateX` / `rotateY` (`max: 12deg`) with smooth spring return.
- **Tech Stack Badges**: Interactive pill tags with glowing hover states.
- **Live Demo & Source Triggers**: Magnetic action icons with micro-audio feedback on hover.

#### D. Interactive Virtual File System Terminal (`components/Terminal.tsx`)
- **VFS Terminal Simulation**: Realistic command-line interface with autocomplete (`Tab`), history navigation (`ArrowUp/Down`), and executable commands (`help`, `cat`, `projects`, `skills`, `theme`, `clear`).
- **Scanline & CRT Glow**: Retro modern glass terminal shell with authentic green/amber phosphor accents and subtle glowing blur.

#### E. Skills Radar & Technology Ecosystem (`components/home/SkillsSection.tsx`, `SkillsGrid.tsx`)
- **Dynamic Category Tabs**: Smooth layout animations when switching between *Languages, Frontend, Backend, AI/ML, Cloud & DevOps, Network*.
- **Icon Hover Illumination**: Custom brand color glows (React Cyan, Python Yellow, Next.js Monochrome, etc.) on hover.

#### F. Blog Insights Teaser (`components/home/BlogTeaser.tsx`)
- **Editorial Cards**: Reading time badges, publication dates, and animated arrow link expansions.

---

### 3.3 About & Career Odyssey (`/about`)
- **Interactive Career Timeline (`CareerTimeline.tsx`)**: Vertical glowing timeline beam with scroll-triggered node activation.
- **Competency Matrix**: 5-pillar architectural capability cards with proficiency badges (*Advanced, Production Ready, Enterprise Grade*).
- **Engineering Principles Bento**: Interactive philosophy cards detailing deterministic CI, sub-second latency, and AI-augmented engineering.
- **Verified System Signature**: Authentic cryptographic-style verification seal with animated auth badge.

---

### 3.4 Projects Catalog & Deep Case Studies (`/projects`, `/projects/[slug]`)
- **Interactive Filter Engine (`ProjectsClient.tsx`)**: Instant category and technology filtering with zero-layout-shift FLIP animations.
- **Search Matrix**: Real-time fuzzy query highlighting and project count counter.
- **Project Case Study Pages**:
  - MDX-rendered deep dives with code syntax highlighting, copy buttons, and zoomable architecture diagrams.
  - Interactive live metrics banner and GitHub repo sync indicators.

---

### 3.5 Blog & Engineering Insights (`/blog`, `/blog/[slug]`)
- **Scroll Progress Indicator**: Top fixed glowing progress bar with gradient brand fill.
- **Reading Time & Dynamic View Counter**: Real-time Firebase-backed view tracking and interactive like counter with floating heart particles.
- **Sticky Table of Contents**: Active heading tracking using IntersectionObserver with smooth scroll navigation.

---

### 3.6 Achievements & Accreditations (`/achievements`)
- **Trophy & Certificate Showcase**: Bento grid featuring OSN Computer Science medals, IBM Data Science certifications, and Google Cloud credentials.
- **Interactive Verification**: Direct credential verification modal with high-res badges and issuance dates.

---

### 3.7 Contact & Live Guestbook (`/contact`, `/guestbook`)
- **Interactive Contact Terminal**: Real-time form with Firestore sync, field validation animations, and success toast notifications.
- **Visitor Guestbook**: Real-time message stream with avatar initials, reaction emojis, and instantaneous live updates.

---

### 3.8 Real-Time Systems Dashboard (`/dashboard`)
- **Live Metrics Monitor**: Live active visitors (RTDB), total page views, uptime counter, and GitHub contribution graphs.
- **System Health Diagnostics**: Memory footprint, render frame rate indicator (FPS), and bundle size metrics.

---

### 3.9 Developer Setup & Gear (`/uses`)
- **Interactive Tech Stack Specs**: Detailed breakdowns of workstation hardware, Linux virtual machines, peripherals, and code editor themes.

---

## 🎵 4. Sound Design & Audio-Haptic Feedback

A refined, non-intrusive sound design system powered by the Web Audio API (`introAudio.ts`):
- **Tick Sound**: Synthesized high-frequency click (800Hz - 1200Hz) with 15ms exponential decay for button hover and character scrambles.
- **Success Chime**: Harmonic tri-tone chord (C5 - E5 - G5) with gentle reverb for successful form submissions and intro completion.
- **Mute Toggle**: Global audio control with persistent user preference in `localStorage`.

---

## ⚡ 5. Verification, Accessibility & Performance Integrity

### 5.1 Verification Checklist
All modifications must comply with the strict verification sequence specified in `AGENTS.md`:
1. `npm run lint` (ESLint Next core web vitals check)
2. `npm run type-check` (`tsc --noEmit` strict type checking)
3. `npm run test:unit` (Vitest unit tests)
4. `npm run test:e2e` (Playwright end-to-end and visual regression suite)

### 5.2 Accessibility & Reduced Motion Matrix
- When `prefers-reduced-motion: reduce` is active:
  - GSAP animations immediately resolve to final values (`gsap.set(..., { opacity: 1, y: 0 })`).
  - WebGL `Hero3D` switches to `frameloop: 'never'` with static deterministic orientation.
  - Text scramble effects instantly display final plain text strings.
  - Page transitions occur instantly without layout displacement.
- High-contrast text ratios compliant with WCAG 2.1 Level AAA.
- Full keyboard navigability with `.skip-nav` link and focus-visible outlines.
