# AgriSahayak

AgriSahayak is an open-access, multilingual agricultural assistance web
application. It does not require user accounts or authentication. The deployed
application uses Vercel for the frontend and Render (or another Node.js host)
for the backend.

## What the application provides

- Crop advisory based on district, season, and soil type
- Farm planning with browser-local task and plan storage
- Plant disease detection through a server-side Hugging Face Inference API
- Weather data and agricultural tips through OpenWeatherMap
- Market-price reference information
- Agricultural news and alerts from a configurable RSS feed
- Price calculation tools
- English, Hindi, Marathi, Bengali, Gujarati, Assamese, Odia, and Punjabi UI
- Offline-friendly browser settings and local storage

> **Data transparency:** Market prices currently come from a static national
> reference table and are not a live mandi feed. Weather and disease detection
> require their respective backend API keys. News is fetched from a live RSS
> source and reports an unavailable state if that source cannot be reached.

## Repository structure

```text
AgriSahayak/
├── frontend/       # React + TypeScript + Vite + Tailwind CSS PWA
├── backend/        # Express + TypeScript API
├── README.md
```

## Local development

### Prerequisites

- Node.js 20 or newer
- npm
- Backend API keys only for the integrations you want to use

### Start the backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

The backend listens on `http://localhost:3001` by default.

### Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

The frontend runs on `http://localhost:5173` by default. The example frontend
configuration points to the local backend.

### Build, lint, and unit tests

```powershell
cd frontend
npm run build
npm run lint

cd ..\backend
npm run build
```

Run the unit tests separately for each package:

```powershell
cd frontend
npm test

cd ..\backend
npm test
```

The tests use Vitest. They exercise backend services and frontend API/local
storage behavior with controlled test data and mocked external services, so
they do not require backend API keys or live network services. They are
separate from normal development and production commands.

Use `npm run test:watch` while developing tests, or
`npm run test:coverage` to generate a coverage report.

## Environment variables

### Backend: `backend/.env`

| Variable            | Required              | Description                                                                    |
| ------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `PORT`            | No                    | HTTP port; defaults to `3001`                                                |
| `NODE_ENV`        | No                    | Runtime mode, for example `production`                                       |
| `FRONTEND_URL`    | Recommended           | Comma-separated allowed frontend origins                                       |
| `HF_API_KEY`      | For disease detection | Hugging Face access token                                                      |
| `HF_MODEL_ID`     | No                    | Hugging Face model; defaults to `nateraw/vit-base-patch16-224-plant-disease` |
| `OPENWEATHER_KEY` | For live weather      | OpenWeatherMap API key                                                         |
| `NEWS_RSS_URL`    | No                    | RSS feed URL; defaults to Indian agriculture news                              |

No backend secret should be placed in frontend `VITE_*` variables. The disease
and weather keys are read by the backend and are not sent to browsers.

### Frontend: `frontend/.env.local`

| Variable         | Required    | Description                                         |
| ---------------- | ----------- | --------------------------------------------------- |
| `VITE_API_URL` | Recommended | Backend base URL, such as `http://localhost:3001` |

If `VITE_API_URL` is omitted, the frontend defaults to
`http://localhost:3001`.

## API endpoints

| Method | Endpoint                    | Purpose                       |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/api/health`             | Backend health check          |
| POST   | `/api/advisory/recommend` | Crop recommendations          |
| POST   | `/api/disease/detect`     | Plant image disease detection |
| GET    | `/api/weather?lat=&lon=`  | Weather and agricultural tips |
| GET    | `/api/market-prices`      | Reference market-price data   |
| GET    | `/api/news`               | Live RSS news                 |
| GET    | `/api/crops`              | Crop knowledge data           |
| GET    | `/api/diseases`           | Disease knowledge data        |

All public endpoints are rate-limited. CORS is restricted to the origins
configured in `FRONTEND_URL`.

## Deployment

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Set `VITE_API_URL` to the deployed backend URL.
4. Deploy using Vercel's detected Vite settings.

The `frontend/vercel.json` rewrite keeps client-side routes working on refresh.

### Backend on Render

1. Create a Render Web Service from the repository.
2. Set **Root Directory** to `backend`.
3. Use `npm install && npm run build` as the build command.
4. Use `npm start` as the start command.
5. Add the backend variables from the table above.
6. Set `FRONTEND_URL` to the exact Vercel origin, without a trailing path.
7. Verify `https://<backend-host>/api/health` after deployment.

The backend does not use Prisma or a database in its current implementation.
Its crop, disease, advisory, and market reference data are served from source
files, while farm plans and settings remain in the user's browser.

## Privacy and limitations

- No account, login, or server-side personal profile is required.
- Farm plans and settings are stored locally in the user's browser.
- Uploaded disease images are processed by the backend and forwarded to the
  configured Hugging Face service; configure retention and provider policies
  according to the deployment requirements.
- Market prices should not be presented as current exchange or mandi prices
  until a verified live market provider is integrated.
- External integrations can become unavailable, and the UI displays an
  explicit unavailable or offline state.
