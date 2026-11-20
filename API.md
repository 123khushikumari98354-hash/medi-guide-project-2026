# MediGuide REST API

Base URL: `http://localhost:5000/api` · JSON in / JSON out · errors: `{ "error": "message" }`

## Public
| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | server + database status |
| GET | `/departments` | departments with OPD hours, room, live queue |
| GET | `/rooms` | every room on the map (departments + facilities) |
| GET | `/doctors?dept=car&q=name` | doctor directory (with working weekdays 0=Sun…6=Sat) |
| GET | `/doctors/:id/slots?date=YYYY-MM-DD` | 20-minute slots and availability |
| POST | `/symptoms/analyze` | `{ text }` → `{ red, mind, empty, results:[{slug,score,hits}] }` |
| POST | `/appointments` | `{ doctorId, date, time:"HH:MM", name, phone, age }` → 201 `{ ref, … }` (409 if slot taken) |
| DELETE | `/appointments/:ref?phone=` | cancel your own appointment |
| GET | `/queues` | live queue for each department |
| POST | `/tokens` | `{ departmentSlug, name? }` → walk-in token `{ label, tokenNo, ahead, waitMinutes }` |
| POST | `/feedback` | `{ rating 1-5, category, comment? }` |
| POST | `/auth/login` | `{ role: "staff"|"admin", pin }` → `{ token, role }` |

## Staff / Admin (header `Authorization: Bearer <token>`)
| Method | Path | Role |
|---|---|---|
| GET | `/admin/summary` | staff, admin |
| GET | `/admin/appointments` | staff, admin |
| DELETE | `/admin/appointments/:ref` | staff, admin |
| PATCH | `/admin/departments/:slug` `{ isPaused?, morningStart?, morningEnd?, eveningOn? }` | staff, admin |
| POST | `/admin/queues/:slug/call-next` | staff, admin |
| PATCH | `/admin/doctors/:id/days` `{ days:[1,2,3] }` | staff, admin |
| POST | `/admin/doctors` `{ departmentSlug, name, qualification, experienceYears, days }` | admin |
| DELETE | `/admin/doctors/:id` | admin |
| GET | `/admin/feedback` | admin |
| POST | `/admin/queues/reset` | admin |

## Database tables
`departments`, `facilities`, `symptom_keywords`, `doctors`, `doctor_days`, `appointments`,
`queue_state`, `tokens`, `feedback`, `users` – see `server/db/schema.sql`.
