# Training Tracker

A personal mobile-first health and training tracker. Covers strength circuits (two alternating full-body routines, each with 10 stations plus a core finisher), walking sessions, and a medical log with trends — all stored privately on your own device.

No build tools required on your end — this is a pre-built, self-contained app (a single `index.html`) that runs directly in any browser, and can be packaged into an installable Android app.

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
- **Home screen** — three sections: Fitness (workouts, cardio, activities), Health, and Day Planner
- **Hardware back button** — the Android back button steps back through the app (detail → list → home) instead of closing it
- **Screenshot scanning (OCR)** — upload a Samsung Health screenshot and it attempts to auto-detect duration, calories, heart rate, steps, and VO2max. Every detected value is shown in an editable form for you to check and correct before saving — nothing saves automatically
- **Family members** — records and appointments are kept per person, so you can track family alongside yourself. Add people, then filter every medical view by person or see everyone at once
- **Upcoming medical** — schedule appointments, tests that are due, and medicine reminders, each with a date, optional time, location, notes and a repeat rule. Reminders arrive the day before and on the day, and each item exports to your calendar
- **Medical section** — log vitals, test results, medications, appointments, symptoms and notes
- **Lab report import (PDF or image)** — upload a PDF or photo of a lab report, or paste its text. Text-based PDFs are read directly from the embedded text layer (accurate, no OCR); scanned PDFs and photos fall back to OCR page by page. Around 67 recognised markers across nine panels — heart & inflammation (hs-CRP, homocysteine, Lp(a), ApoB/ApoA1, NT-proBNP, troponin, ESR), lipids, blood sugar, CBC, kidney & electrolytes (incl. uric acid, eGFR), liver, vitamins & minerals (B12, D, folate, ferritin), thyroid, and tumour markers (AFP, beta-hCG, LDH, PSA) plus the report date are extracted, and every value is shown for review and correction before saving. Markers you haven't tracked before are flagged as new
- **Charted trends everywhere** — workout heart rate, session duration, total load and per-exercise weight progression; walking VO2max, heart rate and steps-per-minute; and any medical marker with two or more readings. All charts are labelled with month and year
- **Manage medical parameters** — choose which markers appear in your trends, hide ones you don't want charted (readings are kept), or remove a marker and all its readings entirely
- **Edit logged workout sessions** — change the date, duration, rounds, RPE and the weight used on each exercise after the fact, and add or correct the Samsung Health data attached to that session
- **Edit a whole record's date** — each date card has an Edit date action that moves every value in that report to a new date at once
- **Edit any medical record** — change the value, unit, category, date or notes of an entry in place, alongside delete. Changing the date moves the record into the right date group
- **Records collapse by date** — each test date is a collapsible card showing the value count and which panels it covers, with expand-all / collapse-all
- **Trends grouped by panel** — markers are organised into collapsible panels (heart & inflammation, lipids, blood sugar, CBC, kidney, liver, vitamins, thyroid, tumour markers) with expand-all / collapse-all
- **Fitness** — one section with three tabs: Workout (the PHA circuit), Cardio (walking, running, jogging, cycling, stairs, swimming and any type you add), and Activities (gardening, housework, yoga and your own types). Cardio and activity logs are editable, carry their own date and type, and can take Samsung Health data at any time via the screenshot scanner or manual entry
- **Medical records grouped by date** — the log lists one card per test date with every value from that report bundled together, so a lab report reads as a single record rather than scattered rows
- **Add missed parameters** — after a scan you can add any value the scanner didn't pick up, with an editable name, value and unit, before saving
- **Task lifecycle** — every task can be completed, postponed (with quick +1 day / +3 days / +1 week or a custom date), or cancelled with a mandatory reason. Anything closed can be undone and reopened, and each task keeps a full history of what happened and when
- **Filter and review** — tap the Overdue / Due today / Open counters to filter, switch between Open, Postponed, Completed, Cancelled and All, and filter by person to see that individual's overdue, open, postponed, completed and cancelled counts
- **Two years of history** — completed and cancelled tasks are kept for a rolling two years, then pruned automatically. Anything still open is never pruned
- **Create a task from a message** — paste a WhatsApp (or any) message and it extracts the task, sender, date and time. Once installed to your home screen, the app also registers as a share target, so you can share a message straight from WhatsApp into a prefilled task
- **Day Planner** — tasks grouped by target date (overdue first, then today, tomorrow, this week, this month, later), with details, optional time and duration, location, a contact from your phone's contact picker, and repeat rules (daily/weekly/monthly/yearly, every *n* units). Tasks with a time become proper timed calendar events; without one they're all-day. Guests can be invited by email — Google Calendar sends them the invite and blocks their calendar once accepted. Exports to Google Calendar or .ics with reminders the day before and on the day, plus one-tap WhatsApp and email to guests
- **Trend detail everywhere** — tap any workout or walking trend for the same dedicated chart-and-history view as medical markers
- **Medical detail view** — tap any marker for a dedicated page with a full gridded chart plotted against real elapsed time, first/average/lowest/highest stats, total change since the first reading, and the complete reading history with change-since-last on each
- **Delete** — remove any workout session, walk, or medical entry, with a confirmation step
- **Samsung Health import** — after a session (or anytime for a walk), enter the key numbers from your Samsung Health screenshot (duration, calories, avg/max heart rate, steps, VO2max) to attach real physiological data to your training log
- **Session RPE** — rate how hard each session felt (1-10) right after finishing
- **Body log** — track bodyweight and resting heart rate over time
- **Insights tab** — weekly training minutes/calories, VO2max and heart-rate trends, and general-population reference comparisons (with clear caveats — see Notes below)
- **Rounds** — adjustable from 1 to 4 per session

## Tech

React 19 + Tailwind. React itself, ReactDOM, and all app code are precompiled and inlined directly into `index.html` — nothing is loaded from unpkg or any JS CDN at runtime, and the file has zero dependency on any sibling file to render. Styling is fully self-contained: `build-css.py` scans the source for the utility classes actually used and generates a small static stylesheet that is inlined into `index.html`, so there is no Tailwind CDN dependency at runtime. There are no remote assets at all: typography uses system font stacks (Roboto on Android, SF on iOS, Segoe on Windows) rather than web fonts, so nothing is downloaded and rendering is identical offline. Data is stored in the browser's `localStorage`, so it stays on your device and isn't sent anywhere.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire app — React, ReactDOM, and all app code inlined into one file |
| `manifest.json` | PWA manifest (name, icons, theme color) — needed for installing as an app |
| `sw.js` | Service worker — **required for notifications on Android**, which forbids the `Notification` constructor and only permits notifications shown from a service worker |
| `icon-192.png` / `icon-512.png` | App icons |

## Running it

**Just want to use it in a browser?**
Open `index.html` directly, or host the folder anywhere static files can be served (GitHub Pages, Netlify, Vercel, etc.).

**Want it as an installable Android app?**

1. **Host these 5 files on GitHub Pages:**
   - Create a public GitHub repo
   - Upload `index.html`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`
   - Go to **Settings → Pages**, set source to your main branch / root, save
   - GitHub gives you a live URL like `https://yourusername.github.io/training-tracker/`

2. **Convert the URL to an APK with [PWABuilder](https://www.pwabuilder.com):**
   - Paste your GitHub Pages URL, tap Start
   - Go to **Package for Stores → Android**
   - Choose "Generate new signing key" for signing
   - Download the package — it contains your `.apk`

3. **Install:**
   - Open the downloaded `.apk` on your phone
   - Allow install from that source when prompted
   - Install — you'll get a real home-screen icon with no browser bar

## Code structure

`pha-tracker.jsx` is the single source; `index.html` is the built, self-contained output. The source is organised into labelled sections — theme, workout data, formatting helpers, muscle diagrams, day-planner logic, shared UI primitives, charts, medical parsing, screens, and the app root.

Shared UI primitives (`Card`, `Field`, `TextInput`, `SelectInput`, `TabSwitcher`, `StatTiles`, `EmptyState`, `InfoNote`) exist so card and input styling isn't repeated inline across the file. One `SeriesDetailScreen` serves medical markers and workout/walking metrics alike, and `goodDirectionFor()` is the single source of truth for whether a rising value is good, neutral or bad.

## Reminders

The Day Planner can show a daily summary at a time you choose (default 08:00) and an alert one hour before any task that has a time set. The summary reports progress rather than just what's left (e.g. "3/4 tasks done today — 1 left") and includes medical items due today and tomorrow. Scheduled medical items also get their own reminder the day before and on the day. These fire while the app is open and catch up when you next open it.

Notifications are delivered through `sw.js` (the service worker), because Android Chrome refuses the plain `Notification` constructor. This means reminders **only work over HTTPS** — GitHub Pages is fine, but opening `index.html` as a local file will not show notifications. There's a "Send a test notification" button in the Reminders panel to check it end to end.

A static web app cannot wake itself once closed — there is no reliable scheduled-notification API without a push server — so for alerts that always arrive, use the calendar buttons. Each task exports with an alarm a day before and an hour before, and there is a one-tap link to add a recurring daily summary reminder to Google Calendar.

## Tuning the look

Two lines in `index.html` control the overall feel:

- `html{font-size:15px}` — spacing utilities are rem-based while some text sizes are px-based, so this controls how tight the UI feels. 16px is roomier, 14px tighter.
- The `body{font-family:...}` stack and `FONTS` in `pha-tracker.jsx` — system fonts by design; adding a web font here reintroduces a network dependency.

## Muscle-level analysis (Fitness → Workout → Trends)

- **Muscle impact map** — a front/back figure shaded yellow→red by how much work each muscle has taken over the last 7 days, derived from logged sessions. It reflects training load, not measured soreness.
- **Weight progression by muscle** — the heaviest load logged for each muscle group over time, tappable for a full chart.
- **Load balance** — compares each muscle's best load against the proportion usually seen relative to a hinge lift (deadlift/RDL), and flags anything materially behind. Muscles without a comparison say *why*: either they're only trained in the workout you haven't done recently, or they're trained by a bodyweight movement whose estimated load isn't on the same scale as barbell work. Bodyweight loads are estimated from your bodyweight and marked with an asterisk; a real logged weight always takes precedence over an estimate. The primary mover of an exercise is credited in full and assisting muscles at half, so a 60 kg deadlift isn't counted as a 60 kg biceps lift — but muscles that are never the primary mover (triceps, glutes, forearms in this plan) still register.
- **Effort estimate from heart rate** — where Samsung Health avg/max HR is attached to a session, an RPE estimate is derived from heart-rate reserve (Karvonen), anchored on age-predicted HRmax.

These are relative comparisons between your own lifts, deliberately **not** load prescriptions from population tables. What weight is appropriate for you depends on your cardiologist's guidance and how the session actually feels.

## Per-session insight

Expanding a session in the workout log shows:
- **Estimated effort** — a composite 1–10 figure from heart rate (weighted heaviest), calorie burn rate converted to METs, and duration, each shown separately so you can see what drove it. It compares against your own RPE rating and says so when the signals disagree.
- **Muscles worked this session** — the heat map scoped to that single session rather than the 7-day window.

## Marker explanations

Opening any health marker's detail view shows a plain-language panel covering what the marker measures, what commonly moves it, and the factors usually discussed in managing it — for around 25 of the most relevant markers. This is general educational content to help you follow your own results and ask better questions, explicitly not advice about your situation.

## Health reference ranges

Trend charts and detail views show a shaded band for general adult reference intervals. Readings are colour-coded by how far they sit from that band — green inside, then a yellow-to-red gradient scaled to the distance outside — on the chart line, each data point, and the status label. Laboratories differ and ranges vary by age, sex and method — **the range printed on your own report is the one that counts**, and interpretation belongs with your doctor.

## Notes

- All workout data lives in your browser's local storage. Clearing your browser data or switching browsers/devices will reset your history — there's no cloud sync.
- Screenshot OCR uses Tesseract.js, which downloads its recognition engine from a CDN the first time you use it — so the first scan needs a working internet connection. Accuracy on stylized dark-mode screenshots is imperfect by nature, which is why every detected value is always shown for review and correction before saving. If OCR fails or you're offline, the form simply opens empty for manual entry.
- Nothing is ever uploaded anywhere. OCR on arbitrary screenshots is unreliable, and misreading a heart-rate number is a real risk for health data. It also means nothing is ever uploaded anywhere; you're just typing in numbers you can already see.
- The Walking section's "how this compares" area uses general-population reference values (VO2max norms, MET-based calorie estimates, the 220-minus-age max-HR formula) for educational context only. These are not clinical assessments, and wearable-estimated VO2max/calories carry real margins of error. If you have a cardiac history, your cardiologist's guidance from your actual stress test is the authoritative source for your personal safe heart rate ranges — not any generic formula in this app.
- Keep the signing key PWABuilder generates somewhere safe if you plan to rebuild or update the APK later; you'll need the same key for updates to install cleanly over the old version.
- The Medical section is a personal record-keeping and trend-tracking tool to help you notice patterns and bring better information to your appointments. It does not interpret results or offer diagnoses — that's your doctor's role.
- This app and the underlying training plan are not a substitute for medical advice. Consult your doctor before starting or changing an exercise program, especially if you have a cardiac history.
