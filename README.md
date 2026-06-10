# ⚔ Life Quest

A gamified productivity app where you earn points by completing tasks and spend them on rewards.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |

## Features

- **Tasks** — Create tasks with custom point values, mark them complete to earn points
- **Rewards** — Define rewards with a point cost, redeem them when you have enough points
- **Point History** — Full log of every point earned and spent
- **EN / KO** — Language toggle persisted in localStorage
- **Animations** — Staggered card entrance, flash effect on complete/redeem, floating +/−P label, toast notifications

## Project Structure

```
life-quest/
├── backend/
│   ├── server.js
│   ├── db/
│   │   ├── index.js          # SQLite connection
│   │   └── schema.js         # Table definitions
│   ├── routes/
│   │   ├── tasks.js
│   │   ├── rewards.js
│   │   └── points.js
│   └── controllers/
│       ├── tasksController.js
│       ├── rewardsController.js
│       └── pointsController.js
└── frontend/
    ├── vite.config.js        # Proxies /api → localhost:3000
    └── src/
        ├── api/index.js      # Fetch helpers
        ├── context/
        │   ├── LanguageContext.jsx
        │   └── ToastContext.jsx
        ├── i18n/index.js     # EN / KO strings
        ├── components/
        │   └── Navbar.jsx
        └── pages/
            ├── Tasks.jsx
            ├── Rewards.jsx
            └── History.jsx
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run dev       # starts on http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Reference

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task `{ title, description?, points? }` |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/:id/complete` | Complete a task and earn points |

### Rewards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rewards` | List all rewards |
| POST | `/api/rewards` | Create a reward `{ title, description?, points_required }` |
| PUT | `/api/rewards/:id` | Update a reward |
| DELETE | `/api/rewards/:id` | Delete a reward |
| POST | `/api/rewards/:id/redeem` | Redeem a reward with points |

### Points

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/points` | Get current total points |
| GET | `/api/points/history` | Get full point history |

## Branch History

| Branch | Description |
|--------|-------------|
| `main` | Production-ready merged code |
| `feature/backend` | Backend API setup |
| `feature/frontend` | Frontend UI setup |
