# AgriSahayak

AgriSahayak is an open-access, multilingual agricultural assistance web
application for farmers. It does not require user accounts or authentication.
The frontend is a React, TypeScript, Vite, Tailwind CSS progressive web app
(PWA), and the backend is an Express and TypeScript API.

## Features

- **Weather dashboard:** Uses browser geolocation to show temperature,
  humidity, wind, conditions, and agricultural tips through OpenWeatherMap.
  If location permission is unavailable, the app uses a Mumbai fallback
  coordinate; if the backend is unavailable, it displays an offline weather
  state.
- **Crop advisory:** Select an Indian state, district, season, and soil type to
  receive crop recommendations with expected yield, profitability,
  sustainability, MSP reference, and crop details.
- **Farm planner:** Estimate crop yield, water, seed, fertilizer, pesticide,
  labour, machinery, irrigation, transport, and other costs. Compare Rice,
  Wheat, Maize, Cotton, and Pulses, save planner inputs locally, and export a
  printable PDF report from the browser.
- **Disease detector:** Upload or capture a plant image, send it to the
  configured Kindwise Crop.health integration, view predictions and treatment
  or prevention guidance, reset the analysis, and share or print the results.
  Images are limited to 10 MB by the backend.
- **Market prices:** View reference commodity prices, MSP and market-price
  context, price outlook, and negotiation guidance.
- **Price calculator:** Estimate yield, revenue, costs, profit, break-even
  point, and the effect of season, weather, soil fertility, irrigation,
  pesticides, and market price.
- **News and alerts:** Read agricultural news from a configurable RSS feed
  with weather, government-scheme, and market-update guidance.
- **Settings and local data:** Change language, inspect browser storage usage,
  download locally stored diagnostics and price data as JSON, clear IndexedDB
  and service-worker caches, and save feedback locally for later use.
- **Offline-first behavior:** The service worker, IndexedDB storage, local
  settings, and explicit offline fallbacks allow core local features to keep
  rendering when network services are unavailable.
- **Voice navigation:** Use the microphone button inside the app to open
  pages or dictate short text into the active form field. Speech recognition
  uses English (`en-IN`) or Hindi (`hi-IN`) based on the selected language and
  requires HTTPS or localhost plus browser speech-recognition support.
- **Multilingual UI:** English, Hindi, Marathi, Bengali, Gujarati, Assamese,
  Odia, and Punjabi are available from Settings. The compact header toggle
  provides quick access to English and Hindi.
- **PWA branding:** The app includes a manifest, service worker, and
  `favicon.svg` for the browser favicon and application logo.

### Data and integration limitations

- Market prices are currently a static national reference table, not a live
  mandi feed.
- Weather requires `OPENWEATHER_KEY`.
- Disease detection requires `KINDWISE_API_KEY`; without it, the UI reports
  that detection is unavailable.
- News is fetched from the configured RSS source and reports an unavailable
  state if that source cannot be reached.
- Farm plans, settings, feedback, diagnostics, and cached data are stored in
  the user's browser, not in a server-side account.

## How to navigate the website

1. Open `/` to view the public landing page. Use **Launch App** or
   **Start Farming** to enter `/app`.
2. From the app header on desktop, use the navigation links. On smaller screens,
   open the hamburger menu.
3. Use the app logo at any time to return to the dashboard.
4. Use the microphone button to try voice navigation, or use the language
   controls to change the interface language.

### Application routes

| Page | URL | How to use it |
| --- | --- | --- |
| Landing page | `/` | Review the product overview and select **Launch App**. |
| Dashboard | `/app` | View the welcome panel, local weather, agricultural tips, and links to key tools. Allow location access for local weather. |
| Crop Advisory | `/app/crop-advisory` | Choose state, district, season, and soil type, then request recommendations. |
| Market Prices | `/app/prices` | Review reference prices and market context; refresh the data when needed. |
| Price Calculator | `/app/price-calculator` | Enter crop, area, investment, labour, season, price, weather, soil, irrigation, and pesticide inputs, then calculate the estimate. |
| Disease Detector | `/app/disease-detector` | Upload or capture a plant image, run detection, review guidance, and use the share/print result action. |
| Farm Planner | `/app/farm-planner` | Enter land and crop details, review resource and profitability estimates, compare crops, and export the plan as PDF. |
| News and Alerts | `/app/news` | Refresh and open agricultural news items from the configured RSS feed. |
| Settings | `/app/settings` | Change language, manage local data and caches, download data, and submit offline feedback. |
| Privacy Policy | `/app/privacy` | Read the application's privacy information. |
| Terms of Service | `/app/terms` | Read the application's terms of service. |

## Repository structure

```text
AgriSahayak/
├── frontend/       # React + TypeScript + Vite + Tailwind CSS PWA
│   ├── public/     # Manifest, service worker, favicon, and public assets
│   └── src/        # Pages, components, services, translations, and utilities
├── backend/        # Express + TypeScript API and source data
├── favicon.svg     # Source favicon/logo asset
└── README.md
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

The frontend runs on `http://localhost:5173` by default. The example
configuration points to the local backend.

### Build, lint, and test

Run frontend checks:

```powershell
cd frontend
npm run build
npm run lint
npm test
```

Run backend checks:

```powershell
cd ..\backend
npm run build
npm test
```

Additional test commands are available in both packages:

```powershell
npm run test:watch
npm run test:coverage
```

Tests use Vitest and mock external services where required, so they do not
need live backend API keys or network integrations.

## Environment variables

### Backend: `backend/.env`

Copy `backend/.env.example` to `backend/.env`.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | HTTP port; defaults to `3001`. |
| `NODE_ENV` | No | Runtime mode, such as `development` or `production`. |
| `FRONTEND_URL` | Recommended | Comma-separated frontend origins allowed by CORS. |
| `KINDWISE_API_KEY` | For disease detection | Kindwise Crop.health API key. |
| `OPENWEATHER_KEY` | For live weather | OpenWeatherMap API key. |
| `NEWS_RSS_URL` | No | RSS feed URL; the backend uses its default agriculture feed when omitted. |
| `HF_API_KEY` | No | Retained temporarily for provider migration; not used by current disease detection. |
| `HF_MODEL_ID` | No | Retained model setting; defaults to `nateraw/vit-base-patch16-224-plant-disease`. |

Never put backend secrets in frontend `VITE_*` variables. Disease and weather
keys are read by the backend and are not sent to browsers.

### Frontend: `frontend/.env.local`

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Recommended | Backend base URL, such as `http://localhost:3001`. Defaults to that URL when omitted. |
| `VITE_DEBUG` | No | Optional frontend debug flag retained in the example configuration. |

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Backend health check |
| POST | `/api/advisory/recommend` | Crop recommendations |
| POST | `/api/disease/detect` | Plant image disease detection |
| GET | `/api/weather?lat=&lon=` | Weather and agricultural tips |
| GET | `/api/market-prices` | Reference market-price data |
| GET | `/api/news` | RSS news |
| GET | `/api/crops` | Crop knowledge data |
| GET | `/api/diseases` | Disease knowledge data |

Public endpoints are rate-limited. CORS is restricted to the origins listed in
`FRONTEND_URL`.

## Deployment

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Set `VITE_API_URL` to the deployed backend URL.
4. Deploy with Vercel's detected Vite settings.

The frontend rewrite configuration keeps client-side routes working after a
browser refresh.

### Backend on Render

1. Create a Render Web Service from the repository.
2. Set **Root Directory** to `backend`.
3. Use `npm install && npm run build` as the build command.
4. Use `npm start` as the start command.
5. Add the backend variables listed above, including `KINDWISE_API_KEY` and
   `OPENWEATHER_KEY` when those integrations are enabled.
6. Set `FRONTEND_URL` to a comma-separated list of every allowed frontend
   origin, without trailing paths. For example:
   `https://your-production-frontend.example,http://localhost:5173`.
7. Verify `https://<backend-host>/api/health` after deployment.

The backend does not use Prisma or a database in the current implementation.
Crop, disease, advisory, and market reference data are served from source
files, while farm plans and settings remain in the user's browser.

## Privacy and limitations

- No account, login, or server-side personal profile is required.
- Farm plans, settings, feedback, diagnostics, and cached data are stored
  locally in the browser.
- Uploaded disease images are processed by the backend and forwarded to the
  configured Kindwise service; configure retention and provider policies for
  your deployment.
- Market prices should not be treated as current exchange or mandi prices
  until a verified live market provider is integrated.
- External integrations can become unavailable, and the UI displays an
  explicit unavailable or offline state.
- Review [Privacy Policy](/app/privacy) and [Terms of Service](/app/terms) in
  the application before production deployment.

## License

No license file is currently included in this repository. Add a license before
distributing or reusing the project publicly.
