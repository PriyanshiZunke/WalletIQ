# WalletIQ

WalletIQ is a personal finance dashboard for tracking income and expenses, managing budgets, reviewing spending trends, and generating AI-assisted financial insights.

## Features

- User registration and JWT-based authentication
- Dashboard summary, category breakdown, and monthly trends
- Income and expense transaction management
- Custom categories with icons and colors
- Monthly and weekly budgets
- Budget analysis and transaction analysis
- AI-generated monthly insights, budget alerts, and savings tips with Gemini
- Demo data seeding for local development

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Recharts, Axios
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcryptjs
- **AI:** Google Gemini via `@google/genai`

## Project Structure

```text
WalletIQ/
├── backend/
│   ├── controllers/       Request handlers
│   ├── middleware/        Authentication middleware
│   ├── routes/            Express API routes
│   ├── scripts/           Database migration and seed scripts
│   ├── sql/               PostgreSQL schema
│   ├── db.js              PostgreSQL connection pool
│   └── server.js          API server entry point
├── frontend/
│   ├── src/components/    Reusable UI components
│   ├── src/context/       React context providers
│   ├── src/pages/         Application pages
│   └── src/main.jsx       Frontend entry point
└── README.md
```

## Prerequisites

- Node.js 20 or newer recommended
- npm
- A PostgreSQL database
- A Gemini API key for AI features

## Configuration

Create `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=your-gemini-api-key
PORT=8000
```

`PORT` defaults to `8000` when omitted. `GEMINI_API_KEY` is required for AI-powered features, but the API can start without it; those features will not work until it is configured.

The frontend defaults to `http://localhost:8000/api`. To use another API URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

## Installation

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database Setup

Run the schema migration from the `backend` directory:

```bash
npm run migrate
```

To drop and recreate all WalletIQ tables, use:

```bash
npm run migrate:reset
```

To create the demo user, categories, budgets, and 12 months of transactions:

```bash
npm run seed
```

The seed script removes and recreates the existing demo user before inserting data.

## Running Locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:8000` by default. For a production-style backend process, use `npm start` instead.

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Vite prints the local frontend URL, usually `http://localhost:5173`.

## Demo Login

After running the seed command:

```text
Email: alex@timetoprogram.com
Password: Test@1234
```

## API Overview

All endpoints except registration, login, and the health check require a bearer token:

```http
Authorization: Bearer <token>
```

The API base path is `/api`.

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/` | API health check | No |
| `POST` | `/auth/register` | Register a user | No |
| `POST` | `/auth/login` | Log in and receive a JWT | No |
| `GET` | `/auth/me` | Get the authenticated user | Yes |
| `GET` | `/categories` | List categories | Yes |
| `POST` | `/categories` | Create a category | Yes |
| `PUT` | `/categories/:id` | Update a category | Yes |
| `DELETE` | `/categories/:id` | Delete a category | Yes |
| `GET` | `/transactions` | List transactions with filters | Yes |
| `POST` | `/transactions` | Create a transaction | Yes |
| `GET` | `/transactions/:id` | Get one transaction | Yes |
| `PUT` | `/transactions/:id` | Update a transaction | Yes |
| `DELETE` | `/transactions/:id` | Delete a transaction | Yes |
| `POST` | `/transactions/analyze` | Analyze selected transactions | Yes |
| `GET` | `/budgets` | List budgets with spending totals | Yes |
| `POST` | `/budgets` | Create a budget | Yes |
| `PUT` | `/budgets/:id` | Update a budget | Yes |
| `DELETE` | `/budgets/:id` | Delete a budget | Yes |
| `POST` | `/budgets/analyze` | Analyze budgets | Yes |
| `GET` | `/dashboard/summary` | Get dashboard totals | Yes |
| `GET` | `/dashboard/category-breakdown` | Get spending by category | Yes |
| `GET` | `/dashboard/monthly-trend` | Get monthly income and expense trends | Yes |
| `GET` | `/insights` | List saved insights | Yes |
| `POST` | `/insights/generate` | Generate an AI insight | Yes |

Analysis endpoints use `POST`, not `GET`. For example:

```http
POST http://localhost:8000/api/transactions/analyze
Content-Type: application/json
Authorization: Bearer <token>

{
  "transactionIds": [2]
}
```

## Useful Commands

### Backend

```bash
npm run dev          # Start with nodemon
npm start            # Start normally
npm run migrate      # Apply the schema
npm run migrate:reset
npm run seed
```

### Frontend

```bash
npm run dev          # Start Vite development server
npm run build        # Create a production build
npm run preview      # Preview the production build
npm run lint         # Run ESLint
```

## Notes

- The backend uses `DATABASE_URL` for PostgreSQL connectivity and enables SSL with certificate verification disabled for hosted database compatibility.
- New users receive the default categories during registration.
- The seed script is intended for development and demo environments. Do not run it against production data.
