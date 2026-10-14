# WalletIQ

WalletIQ is a personal finance dashboard for tracking income and expenses, setting budgets, exploring spending trends, and generating AI-assisted financial insights.

## Features

- Register and sign in with JWT-based authentication
- Track income and expenses
- Organize transactions with custom categories
- Create weekly and monthly budgets
- Review dashboard summaries, category breakdowns, and monthly trends
- Generate AI-assisted spending insights and budget suggestions with Google Gemini
- Seed a local development database with demo data

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Recharts, Axios
- **Backend:** Node.js, Express 5
- **Database:** PostgreSQL
- **Authentication:** JWT and bcryptjs
- **AI integration:** Google Gemini via `@google/genai`

## Application structure

```text
WalletIQ/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   ├── sql/
│   ├── db.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database
- A Google Gemini API key for AI-generated insights

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/PriyanshiZunke/WalletIQ.git
cd WalletIQ
```

### 2. Configure the backend

Create `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=your-gemini-api-key
PORT=8000
```

Use your own PostgreSQL connection string and a long, random JWT secret. Keep real credentials out of Git.

### 3. Install dependencies

In a terminal:

```bash
cd backend
npm install
```

In a second terminal, from the repository root:

```bash
cd frontend
npm install
```

### 4. Create the database schema

From `backend/`:

```bash
npm run migrate
```

To populate the local database with sample data:

```bash
npm run seed
```

**Important:** `npm run migrate:reset` drops the existing WalletIQ tables before recreating them. Use it only with a disposable development database; it deletes data in those tables.

### 5. Start the backend and frontend

Backend terminal:

```bash
cd backend
npm run dev
```

Frontend terminal:

```bash
cd frontend
npm run dev
```

The backend defaults to `http://localhost:8000`. Vite prints the frontend URL in the terminal. The frontend uses `http://localhost:8000/api` as its default API base URL; if you need a different URL, configure `VITE_API_URL` in the frontend environment.

## API overview

The API is mounted under `/api`.

| Area | Base path | Purpose |
| --- | --- | --- |
| Authentication | `/api/auth` | Registration, login, current-user information |
| Categories | `/api/categories` | Manage transaction categories |
| Transactions | `/api/transactions` | Create, list, update, delete and analyze transactions |
| Budgets | `/api/budgets` | Manage budgets and budget analysis |
| Dashboard | `/api/dashboard` | Summary totals and spending trends |
| Insights | `/api/insights` | Retrieve and generate AI-assisted insights |

Most application endpoints require a bearer token. Registration, login, and the root health response are public.

## Useful commands

Run these from the appropriate directory.

**Backend** (`backend/`):

```bash
npm run dev
npm start
npm run migrate
npm run seed
```

**Frontend** (`frontend/`):

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Security and development notes

- Use a local or disposable development database for seed and reset commands.
- Never commit `.env` files, database URLs, API keys, or JWT secrets.
- AI-generated insights are informational and should not be treated as professional financial advice.
- Verify environment settings and database configuration before deploying to production.

## Repository

[PriyanshiZunke/WalletIQ](https://github.com/PriyanshiZunke/WalletIQ)
