# RouwKompas

A warm, empathetic **lead-generation intake platform for grief coaching**. RouwKompas is not a generic website — it is a calm, conversion-focused funnel that guides people through loss toward booking a free, no-obligation conversation with a certified grief coach.

> Grief coaching is supportive, **non-medical** care. RouwKompas makes no medical claims, uses no pressure selling, and contains no dark patterns. Emotional safety and GDPR-compliant data handling come first.

---

## Why this stack

The suggested stack was Next.js + Supabase + Resend + Calendly. This implementation delivers the same product as a **single, zero-dependency Node.js application** (built only on Node's standard library). That choice means:

- **It runs anywhere with Node 20+, with no `npm install` step** — important in restricted/offline environments.
- The architecture is cleanly layered so it maps directly onto the suggested stack: the storage layer (`src/db.js`) swaps to Supabase, email already calls the **Resend** HTTP API when a key is present, and booking embeds **Calendly** when a URL is configured.

Everything below works out of the box with safe local defaults (file-based storage, an email "outbox", and an internal booking form), and upgrades to live services purely through environment variables.

---

## Features

| Area | What it does |
|------|--------------|
| **Landing page** (`/`) | Hero "Find support after loss", explanation, primary CTA "Start the short check-in", secondary CTA "Book a free conversation". |
| **Intake quiz** (`/quiz`) | A gentle, one-question-at-a-time questionnaire (loss recency, type, distress 1–10, struggles, prior support, current support) with progress bar and auto-advance. **This is the main conversion engine.** |
| **Lead capture** | Name, email, optional phone — collected with explicit GDPR consent **before** the result is shown. |
| **Personalized result** (`/result/:id`) | A warm, non-clinical reflection generated from the answers, ending in "Book a free 30-minute conversation". |
| **Booking** (`/booking`) | Embeds **Calendly** when configured; otherwise a calm internal "request a time" form that records the request against the lead. |
| **Trust section** (`/about`) | The real coach, their human approach, and "what to expect in a session". |
| **Privacy** (`/privacy`) | Plain-language GDPR statement (lawful basis, retention, rights, erasure). |
| **Email automation** | **Email 1** (immediate welcome + booking link) and **Email 2** (48h follow-up, reassurance + benefits + reminder), plus an internal coach notification. |
| **Lead routing** | All leads route to a single coach now; every lead stores `assignedCoachId` so multi-coach routing is a data change, not a rewrite. |
| **Admin dashboard** (`/admin`) | Password-protected. Stats, all leads, what each person shared, email/booking status, status updates, email outbox, and GDPR delete. |

---

## Quick start

```bash
# Node 20+ required. No dependencies to install.
node server.js
# or: npm start
```

Then open:

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (default login `admin` / `change-me-please`)

Optionally seed demo leads for the dashboard:

```bash
npm run seed
```

Run the end-to-end test suite (starts the server in-process and drives the full funnel):

```bash
node scripts/e2e.mjs
```

---

## Configuration

Copy `.env.example` to `.env` and fill in what you need. **The app runs fully without any of these set.**

| Variable | Purpose | Default behaviour when empty |
|----------|---------|------------------------------|
| `PORT`, `PUBLIC_BASE_URL` | Server binding & links in emails | `3000` / `http://localhost:3000` |
| `COACH_NAME`, `SUPPORT_EMAIL` | Branding | Demo coach |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Dashboard login | `admin` / `change-me-please` (**change in production**) |
| `CALENDLY_URL` | Booking | Internal request form is shown instead |
| `RESEND_API_KEY`, `EMAIL_FROM` | Live email via Resend | Emails written to `data/outbox.json` and logged |
| `COACH_NOTIFICATION_EMAIL` | Notify coach of new leads | Disabled if empty |
| `FOLLOWUP_DELAY_HOURS` | Timing of Email 2 | `48` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Future DB migration | File storage in `data/leads.json` |

---

## Project structure

```
rouwkompas/
├── server.js                 # HTTP server + router + scheduler boot
├── src/
│   ├── config.js             # Env loading + typed config
│   ├── http.js               # Request/response helpers, static serving, sessions
│   ├── db.js                 # JSON document store (atomic writes, swappable)
│   ├── util.js               # ids, escaping, validation, constant-time compare
│   ├── leads.js              # Lead model + service (multi-coach ready)
│   ├── quiz.js               # Questionnaire definition + result generation
│   ├── email.js              # Templates + Resend/outbox delivery
│   ├── automation.js         # Welcome + 48h follow-up orchestration & scheduler
│   ├── api.js                # /api/lead, /api/booking-request
│   ├── adminController.js    # Auth + dashboard actions
│   └── views/                # Server-rendered HTML (layout, pages, booking, result, admin)
├── public/                   # styles.css, quiz.js, booking.js (client)
├── scripts/                  # seed.js, e2e.mjs
└── data/                     # Runtime storage (gitignored)
```

---

## How the funnel converts

1. **Landing** → "Start the short check-in".
2. **Quiz** → six gentle questions, one at a time, with a progress bar.
3. **Lead capture** → name + email (+ optional phone) with GDPR consent, *before* results.
4. **Result** → a personalised, non-clinical reflection with a single clear CTA.
5. **Booking** → Calendly or internal request; the lead is marked `booked`.
6. **Automation** → immediate welcome email + a 48h follow-up; the coach is notified and sees everything in `/admin`.

---

## Data protection (GDPR)

- Consent is collected explicitly and is the lawful basis for processing.
- Only necessary data is stored; no third-party marketing.
- People can request access or erasure; the dashboard supports one-click delete.
- Runtime data (`data/*.json`) is gitignored so real lead data is never committed.
- A crisis-line notice appears site-wide and in every email; RouwKompas is clearly **not** a medical or emergency service.

---

## Migrating to the suggested cloud stack

- **Database → Supabase/Postgres:** implement the same `read()/update()` contract in a new adapter and point `src/leads.js` at it.
- **Email → Resend:** already wired — set `RESEND_API_KEY`.
- **Booking → Calendly:** already wired — set `CALENDLY_URL`.
- **Hosting:** runs as a standard Node web service (Render, Fly, Railway, a container, etc.). The 48h follow-up loop can move to a cron/queue in serverless deployments.

## License

MIT
