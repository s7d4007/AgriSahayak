# AgriSahayak 🌱

A farmer-friendly, open-access agricultural assistance platform. No login required.

**Frontend** → React + TypeScript + Vite + Tailwind CSS + PWA  
**Backend** → Node.js + Express + TypeScript + Prisma + PostgreSQL

---

## Project Structure

```
AgriSahayak/
├── frontend/          # React PWA (deploy to Vercel)
├── backend/           # Express API (deploy to Render)
└── README.md
```

---

## Quick Start (Local Development)

### 1. Clone & enter the project

```bash
git clone <your-repo-url>
cd AgriSahayak
```

### 2. Set up backend

```bash
cd backend
npm install

# Create .env from the example
copy .env.example .env   # Windows
# Fill in DATABASE_URL, HF_API_KEY, OPENWEATHER_KEY

# Push schema to PostgreSQL and seed
npx prisma db push
npm run db:seed

# Start dev server (port 3001)
npm run dev
```

### 3. Set up frontend

```bash
cd frontend
npm install

# Create .env.local
echo VITE_API_URL=http://localhost:3001 > .env.local

# Start dev server (port 5173)
npm run dev
```

Open http://localhost:5173 – the app works without signing in.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Required | Description                                           |
| ----------------- | -------- | ----------------------------------------------------- |
| `DATABASE_URL`    | ✅       | PostgreSQL connection string                          |
| `HF_API_KEY`      | ✅       | Hugging Face API token (disease detection)            |
| `OPENWEATHER_KEY` | ✅       | OpenWeatherMap API key                                |
| `FRONTEND_URL`    | ✅       | Allowed CORS origin(s), comma-separated               |
| `PORT`            | ❌       | Default `3001`                                        |
| `HF_MODEL_ID`     | ❌       | Default: `nateraw/vit-base-patch16-224-plant-disease` |

### Frontend (`frontend/.env.local`)

| Variable       | Required | Description                                                |
| -------------- | -------- | ---------------------------------------------------------- |
| `VITE_API_URL` | ✅       | Backend base URL (e.g. `https://agrisahayak.onrender.com`) |

---

## API Endpoints

| Method | Endpoint                  | Description                         |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/api/health`             | Health check                        |
| POST   | `/api/advisory/recommend` | Crop recommendations by season/soil |
| POST   | `/api/disease/detect`     | Plant disease detection (multipart) |
| GET    | `/api/weather?lat=&lon=`  | Weather + agricultural tips         |
| GET    | `/api/market-prices`      | Market price data                   |
| GET    | `/api/news`               | Agricultural news                   |
| GET    | `/api/crops`              | Crop knowledge base                 |
| GET    | `/api/diseases`           | Disease knowledge base              |

---

## Deployment

### Frontend → Vercel

1. Import the `AgriSahayak` repo in Vercel
2. Set **Root Directory** to `frontend`
3. Add env var: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy (Vercel auto-detects Vite)

### Backend → Render

1. Create a new **Web Service** on Render
2. Set **Root Directory** to `backend`
3. **Build command**: `npm install && npm run build && npx prisma generate`
4. **Start command**: `node dist/server.js`
5. Add all env vars from the table above
6. Set `FRONTEND_URL` to your Vercel URL

### Database → Managed PostgreSQL

- Render, Railway, Supabase, or Neon all work.
- Copy the connection string as `DATABASE_URL`.
- Run `npx prisma migrate deploy` from the backend after the first deploy (or use `db push` for quick setup).

---

## Features

| Feature                 | Data Storage                                        |
| ----------------------- | --------------------------------------------------- |
| Crop Advisory           | PostgreSQL (recommendations), browser (preferences) |
| Plant Disease Detection | Hugging Face AI (server-side)                       |
| Weather                 | OpenWeatherMap (server-side proxy)                  |
| Market Prices           | Static + extensible                                 |
| Agricultural News       | RSS proxy (server-side)                             |
| Farm Planner / Tasks    | IndexedDB (offline, no account needed)              |
| Settings / Language     | localStorage                                        |

---

## Farmer Privacy

No accounts, no sign-up, no personal data stored on the server.  
Farm plans and tasks live only in the farmer's own browser.
