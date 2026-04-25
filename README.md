# 🚀 Felich Portfolio (v2.0)

Modern, high-performance portfolio built with **Next.js 14**, **TypeScript**, and **Firebase**. Featuring realtime interactions, dynamic SEO, and a robust CI/CD pipeline.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Animations**: Framer Motion, Three.js (Fiber/Drei)
- **Backend/Database**: Firebase (Firestore & Realtime Database)
- **Testing**: Vitest (Unit), Playwright (E2E)
- **CI/CD**: GitHub Actions
- **PWA**: Integrated for offline support

---

## 🏁 Quick Start

### 1. Prerequisites
- Node.js 20+ 
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/felichpehagasaginting-code/felich.dev.git
cd felich.dev
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your **Firebase** and **Gemini API** credentials:
```bash
cp .env.example .env
```

---

## 📖 Command Reference

### 💻 Development
| Command | Description |
|:---|:---|
| `npm run dev` | Start Next.js development server on `localhost:3000` |
| `npm run type-check` | Run TypeScript compiler check (no output) |

### 🏗️ Production
| Command | Description |
|:---|:---|
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |

### 🧪 Testing & Quality
| Command | Description |
|:---|:---|
| `npm run lint` | Run ESLint check for code quality |
| `npm run test:unit` | Run unit tests using **Vitest** |
| `npm run test:e2e` | Run end-to-end tests using **Playwright** |
| `npx playwright test --ui` | Open Playwright's interactive UI for debugging E2E tests |

### 🗄️ Legacy Backend (Optional)
| Command | Description |
|:---|:---|
| `npm run backend` | Start the legacy Node.js/Express server (obsolete after Firebase migration) |

---

## 🔥 Firebase Features
The project is fully integrated with Firebase for:
- **Guestbook**: Realtime messaging via Firestore.
- **Contact Form**: Direct message storage in Firestore.
- **Live Visitor Tracking**: Realtime presence via Firebase RTDB.
- **Analytics**: Project likes and blog view counters.

> [!IMPORTANT]
> Untuk setup Firebase Console (Firestore Rules, RTDB Rules), silakan cek file [firebase_setup_guide.md](./firebase_setup_guide.md).

---

## 📈 SEO & Social Sharing
- **Dynamic OG Images**: Setiap blog post dan project punya gambar preview otomatis via Edge API (`/api/og`).
- **Structured Data**: JSON-LD (Person & WebSite) terintegrasi buat Google Rich Results.
- **Dynamic Sitemap**: Sitemap otomatis nge-update setiap ada artikel baru.

---

## 🎡 CI/CD Pipeline
GitHub Actions otomatis nge-check:
1. **Linter**
2. **Type Check**
3. **Unit Tests**
4. **E2E Tests**

---

## 📄 License
MIT © [Felich](https://github.com/felichpehagasaginting-code)
