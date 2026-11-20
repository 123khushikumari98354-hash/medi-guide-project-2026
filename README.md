# MediGuide – Smart Hospital Department Guidance System

K.R. Mangalam University · Second Year project
Team: Laksh (2501060089), Kangna (2501060041), Khushi (2501060027), Khushi Kumari (2501060075), Ayush (2501060021)

Helps patients – especially first-time visitors and elderly people – find the right hospital
department from their symptoms, then book an appointment or token and walk there using an
interactive map. English + Hindi, accessibility mode, staff and admin panels.

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Vite |
| Backend | Node.js + Express.js (REST API, JWT auth, zod validation) |
| Database | MySQL (mysql2) |
| Guidance | Rule-based symptom → department matcher (English / Hindi / Hinglish keywords stored in MySQL) |
| Map | Interactive SVG floor plan with animated route |

```
MediGuide/
├── client/                 React app
│   └── src/
│       ├── pages/          Guide, Directory, MapPage, Book, Queue, Emergency, Feedback, Admin, About
│       ├── components/     Layout (header, nav, footer), FloorMap (SVG), Icons
│       ├── context/        AppContext (language, accessibility, toast), DataContext (departments, rooms)
│       ├── lib/ hooks/     map geometry, time helpers, speech, polling, localStorage
│       └── api.js          every call to the Express server
├── server/                 Express API
│   ├── db/                 schema.sql, seed.sql, data.js (source data), init.js, generate-seed.js
│   └── src/
│       ├── index.js        app setup (helmet, CORS, rate limit, static client in production)
│       ├── routes/         catalog.js, patient.js, auth.js, admin.js
│       ├── services/       symptomMatcher.js, slots.js
│       └── middleware/     auth.js (JWT roles)
└── docs/                   API.md, MediGuide.postman_collection.json
```

## Requirements
- Node.js 18 or newer
- MySQL 8 (or MariaDB 10.5+) running locally – e.g. installed with MySQL Workbench

## Setup (first time)

```bash
# 1. install everything
npm install                 # root helper (concurrently)
npm run install:all         # server + client dependencies

# 2. configure the database connection
cd server
cp .env.example .env        # Windows: copy .env.example .env
#   open .env and set DB_USER / DB_PASSWORD (and JWT_SECRET)

# 3. create the database + demo data (departments, 24 doctors, keywords, demo users)
npm run db:init
cd ..
```

## Run in development
```bash
npm run dev
```
- React app: http://localhost:5173  (Vite proxies `/api` to the server)
- Express API: http://localhost:5000/api/health

Or run them separately: `npm run dev:server` and `npm run dev:client`.

The client has a demo mode that needs no backend: set `VITE_USE_MOCK=true` in `client/.env` (it is `false` here so the app talks to Express).

## Run as one server (production style)
```bash
npm run build      # builds client/dist
npm start          # Express serves the API and the built React app on http://localhost:5000
```

## Demo logins (Staff / Admin page, footer link)
| Role | PIN | Can do |
|---|---|---|
| Staff | 1111 | queue control, OPD timings, doctor working days, appointments |
| Admin | 1234 | everything staff can + add/remove doctors, feedback, reset queues, stats |

Change the PINs before any real use (edit `generate-seed.js`, then `npm run db:generate` in `server`).

## What is real and what is demo
- Real: MySQL storage, double-booking protection (unique slot key), token counters in a
  transaction, JWT login with hashed PINs, input validation, rate limiting.
- Demo: the hospital, doctors and floor plan are sample data. `DEMO_QUEUE_TICK=true` in `.env`
  moves the queue automatically so the live board looks alive – set it to `false` for real use.
- The symptom matcher is keyword-based and only suggests a department; it is **not** a medical
  diagnosis. `server/src/services/symptomMatcher.js` is the single place to swap in a real NLP model.
- First-aid text is general guidance and should be reviewed by a clinician before real use.

## Changing the data
Departments, doctors and symptom keywords live in `server/db/data.js`.
After editing: `cd server && npm run db:generate && npm run db:init` (this resets the database).
The map layout (two floors, 12 slots each) is defined by `slot_row` / `slot_index` in the same file.

## API
See `docs/API.md`. Import `docs/MediGuide.postman_collection.json` into Postman to try every endpoint.
