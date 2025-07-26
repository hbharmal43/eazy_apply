# 🧠 Jobsyte – LinkedIn Easy Apply Chrome Extension

> Automate your job hunt with precision, personalization, and performance.

**Jobsyte** is a productivity-first Chrome extension that automates the "Easy Apply" process on LinkedIn. It intelligently fills out job applications, handles resumes, waits between submissions, and helps users track applications — all while maintaining a clean, modern UI and robust DevOps-friendly architecture.

🔗 **Live Demo**: [https://website-omega-olive-64.vercel.app/](https://website-omega-olive-64.vercel.app/)

---

## 🧩 Why This Project?

This project was built to showcase:
- End-to-end UI development using **React**, **TypeScript**, and **Tailwind CSS**
- Integration of browser-level automation using **Chrome Extension APIs**
- Secure authentication and cloud storage with **Supabase**
- CI/CD-ready structure, with optimized builds and environment configurations

It reflects real-world production standards, especially relevant for roles requiring React.js + TypeScript + Tailwind expertise.

---

## 🚀 Features

- ✅ One-Click LinkedIn Easy Apply Automation
- 📁 Upload and Inject Custom Resumes
- ⏱ Smart Delay Between Job Submissions
- 👤 Live Editable User Profile
- 🔐 Secure Auth with Supabase
- 📦 Local & Cloud Storage Integration
- 🧠 State-Aware Automation Control
- 🖼 Tab-Based Popup UI (Automation, Profile, Settings)

---

## 🛠️ Tech Stack & Architecture

### 🧱 Front-End

| Feature                      | Details                                  |
|-----------------------------|------------------------------------------|
| **Framework**               | React.js + TypeScript                    |
| **Styling**                 | Tailwind CSS, Emotion (CSS-in-JS)        |
| **UI Composition**          | Functional components + React Hooks      |
| **State Handling**          | useState, useEffect (Zustand planned)    |
| **Routing**                 | None (Popup-based Chrome architecture)   |

### 🔧 Chrome Extension Core

- Uses `manifest.json` to configure permissions, background scripts, and content injection.
- Inter-process messaging between popup, contentScript, and background.
- Persistent automation state tracked with `chrome.storage.local`.

### 🔒 Authentication & Data

- Supabase for:
  - User session management (`getCurrentUser`, `signOut`)
  - Cloud resume storage
  - Profile fields like skills, bio, goals

### 🧪 Testing & CI/CD

- **Testing**: Jest + React Testing Library (planned)
- **CI/CD**: GitHub Actions-friendly, clean `npm run build`
- **Deployment**: Vercel for demo site, manual zip for Chrome Store

---

## 📂 Project Structure

- `components/` – Reusable UI components (ProfileTab, SignIn, etc.)
- `lib/` – Supabase client and API wrappers
- `pages/` – Main Popup UI (entry point)
- `public/` – Static assets like icons
- `types/` – TypeScript interfaces and shared types
- `manifest.json` – Chrome extension config
- `background.ts` – Background listener for automation state
- `contentScript.ts` – Injected autofill logic for LinkedIn
- `utils.ts` – Helper functions

---

## 🧪 How to Use (Developer Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobsyte.git
   cd jobsyte
Here’s that entire setup section rewritten cleanly in Markdown format with proper code blocks and headings — ready for GitHub:

````markdown
## 🧪 Getting Started (Developer Setup)

### 1. Install dependencies

```bash
npm install
````

### 2. Set up environment variables

Create a `.env` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Build the extension

```bash
npm run build
```

### 4. Load into Chrome

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `/dist` folder in your project directory

```

Let me know if you also want an animated GIF walkthrough or visual guide added!
```
