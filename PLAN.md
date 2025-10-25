# 🗂️ Project Plan — Speech-to-Text Translation PWA

This document tracks the roadmap, tasks, progress, and implementation notes for the **Next.js + next-pwa + LibreTranslate** PWA.

---

## 🧭 Overview

**Goal:**  
Build a lightweight Progressive Web App (PWA) that:
1. Captures speech in English,  
2. Converts it to text (speech-to-text),  
3. Translates it into Mandarin using LibreTranslate, and  
4. Displays translated text instantly.

---

## ✅ Project Phases

| Phase | Description | Status | Notes |
|-------|--------------|--------|-------|
| **1. Setup & Initialization** | Initialize Next.js, configure PWA, set up repo | ✅ Done | Base scaffold created, using `next-pwa` |
| **2. Speech Capture** | Implement microphone recording using `MediaRecorder API` | ⏳ In Progress | Basic recording works; UI integration next |
| **3. Speech-to-Text (STT)** | Integrate Whisper or Web Speech API | ⏳ In Progress | Testing browser SpeechRecognition for free tier |
| **4. Translation API** | Integrate LibreTranslate for EN → ZH | ✅ Done | API working with simple fetch wrapper |
| **5. UI Components** | Create mic button, translation box, and status display | ⏳ In Progress | Basic layout ready, needs styling and animation |
| **6. PWA Setup** | Configure `next-pwa`, Workbox caching, icons, manifest | 🟩 Planned | Waiting until translation flow stable |
| **7. Offline Cache** | Cache static assets + recent translations | 🟩 Planned | To be done after Workbox integration |
| **8. Deployment** | Export static site and deploy to GitHub Pages | 🟩 Planned | Add GitHub Actions pipeline |
| **9. Optional Supabase** | Add optional auth and history storage | 🚫 Skipped for MVP | May revisit later |
| **10. Testing & Optimization** | Optimize audio handling, API calls, and UI responsiveness | 🟩 Planned | Manual + Lighthouse audits |

---

## 🧱 Task Breakdown

### Phase 1 — Project Setup
- [x] Initialize Next.js app (`create-next-app`)
- [x] Install dependencies: `next-pwa`, `workbox-window`, `typescript`
- [x] Add ESLint + Prettier config
- [x] Add GitHub repo and `.gitignore`

**Notes:**  
Keep PWA build separate from dev mode to avoid unnecessary caching during local testing.

---

### Phase 2 — Speech Capture
- [x] Implement `MediaRecorder` wrapper
- [ ] Add UI mic button (`MicButton.tsx`)
- [ ] Stream recorded audio to STT module
- [ ] Handle permission errors gracefully

**Notes:**  
Test across browsers — Safari requires user gesture before mic access.

---

### Phase 3 — Speech-to-Text (STT)
- [ ] Implement Web Speech API fallback
- [ ] Add Whisper (local or API) integration
- [ ] Handle transcription streaming for longer speech

**Notes:**  
- Web Speech API: good for demos  
- Whisper: best accuracy; can host via Supabase Edge later

---

### Phase 4 — Translation (LibreTranslate)
- [x] Create `lib/translator.ts` utility
- [x] Fetch POST to `https://libretranslate.com/translate`
- [x] Display translated text in `TranslationBox`
- [ ] Handle API failure & language detection

**Notes:**  
LibreTranslate is free — no API key required for demo use.

---

### Phase 5 — UI Components
- [x] Build minimal responsive layout
- [ ] Add animations for recording state
- [ ] Add loader while translating
- [ ] Dark mode toggle

**Notes:**  
Consider TailwindCSS for speed and easy theming.

---

### Phase 6 — PWA Setup
- [ ] Configure `next-pwa` and Workbox
- [ ] Add `manifest.json` and icons
- [ ] Test installability (Chrome, Android)

**Notes:**  
Check Lighthouse “PWA installable” criteria.

---

### Phase 7 — Offline Support
- [ ] Cache translations in localStorage
- [ ] Enable Workbox caching for API + static assets
- [ ] Add offline notification UI

**Notes:**  
Use `StaleWhileRevalidate` for `/api/translate` caching strategy.

---

### Phase 8 — Deployment
- [ ] Run `next export`
- [ ] Push `/out` to `gh-pages` branch
- [ ] Configure GitHub Pages → main site
- [ ] Test PWA install and mic permissions

**Notes:**  
Verify HTTPS (required for mic + PWA install).

---

## 🧩 Dependencies

| Package | Purpose |
|----------|----------|
| `next` | Core framework |
| `react`, `react-dom` | Frontend UI |
| `next-pwa` | PWA service worker wrapper |
| `workbox-window` | Advanced caching control |
| `typescript` | Type safety |
| (optional) `faster-whisper` | Local STT |
| (optional) `supabase-js` | Backend if needed later |

---

## 🧠 Next Steps
1. Complete **speech capture → text pipeline**  
2. Integrate **translation + UI feedback**  
3. Add **Workbox service worker**  
4. Deploy first MVP to GitHub Pages  

---

## 🗓️ Progress Summary

| Date | Milestone | Status |
|------|------------|--------|
| Oct 22 | Project initialized | ✅ |
| Oct 23 | Translation working | ✅ |
| Oct 24 | Speech recording prototype | ⏳ In progress |
| Oct 26 | Add Whisper or Speech API | 🟩 Planned |
| Oct 28 | PWA + caching | 🟩 Planned |
| Oct 30 | First GitHub Pages deploy | 🟩 Planned |

---

**Owner:** You  
**Repo:** `speech-translate-pwa`  
**Version:** 0.1.0 (MVP target)
