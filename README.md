# PHA Circuit Tracker

A mobile-first workout tracker for a Peripheral Heart Action (PHA) circuit training program — two alternating full-body routines (Workout A / Workout B), each with 10 stations plus a core finisher, built for training with a barbell, EZ bar, plates, dumbbells, and a flat bench.

No build tools required on your end — this is a pre-built, self-contained app (`index.html` + `bundle.js`) that runs directly in any browser, and can be packaged into an installable Android app.

## Features

- **Two alternating circuits** (Workout A / Workout B) covering every major muscle group, with a core finisher built into the flow instead of listed separately
- **Live session tracking** — one exercise at a time, with rest timers between stations (20s) and rounds (75s)
- **Back button** — step back to a previous station or round to review or correct an entry
- **End session early** — save partial progress instead of losing it if you need to stop mid-circuit
- **Weight required to advance** — Mark Complete is disabled until a weight is selected for that station
- **Weight picker** — scrollable list in 2.5 kg increments (0–100 kg), plus a "Bodyweight" option for bodyweight exercises
- **Form guidance** — step-by-step cues for every exercise, plus a link to search YouTube for a demonstration
- **Muscle diagrams** — simple front/back body silhouettes highlighting what each exercise targets
- **History** — every session is saved locally on your device (sessions this week, total sessions, per-exercise load history)
- **Rounds** — adjustable from 1 to 4 per session

## Tech

React 19 + Tailwind. React itself, ReactDOM, and all app code are precompiled and inlined directly into `index.html` — nothing is loaded from unpkg or any JS CDN at runtime, and the file has zero dependency on any sibling file to render. Only Tailwind's styling CDN and Google Fonts are loaded remotely, and both degrade gracefully (the app stays fully usable, just less styled, if those don't load). Data is stored in the browser's `localStorage`, so it stays on your device and isn't sent anywhere.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire app — React, ReactDOM, and all app code inlined into one file |
| `manifest.json` | PWA manifest (name, icons, theme color) — needed for installing as an app |
| `icon-192.png` / `icon-512.png` | App icons |

## Running it

**Just want to use it in a browser?**
Open `index.html` directly, or host the folder anywhere static files can be served (GitHub Pages, Netlify, Vercel, etc.).

**Want it as an installable Android app?**

1. **Host these 4 files on GitHub Pages:**
   - Create a public GitHub repo
   - Upload `index.html`, `manifest.json`, `icon-192.png`, `icon-512.png`
   - Go to **Settings → Pages**, set source to your main branch / root, save
   - GitHub gives you a live URL like `https://yourusername.github.io/pha-tracker/`

2. **Convert the URL to an APK with [PWABuilder](https://www.pwabuilder.com):**
   - Paste your GitHub Pages URL, tap Start
   - Go to **Package for Stores → Android**
   - Choose "Generate new signing key" for signing
   - Download the package — it contains your `.apk`

3. **Install:**
   - Open the downloaded `.apk` on your phone
   - Allow install from that source when prompted
   - Install — you'll get a real home-screen icon with no browser bar

## Notes

- All workout data lives in your browser's local storage. Clearing your browser data or switching browsers/devices will reset your history — there's no cloud sync.
- Keep the signing key PWABuilder generates somewhere safe if you plan to rebuild or update the APK later; you'll need the same key for updates to install cleanly over the old version.
- This app and the underlying training plan are not a substitute for medical advice. Consult your doctor before starting or changing an exercise program, especially if you have a cardiac history.
