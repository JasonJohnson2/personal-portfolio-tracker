# Portfolio Tracker — Cloudflare Pages + Workers (GitHub Ready)

- **Frontend**: React (Vite) on Cloudflare Pages
- **API**: Pages Functions
- **DB**: D1
- **Trading**: Alpaca paper endpoints
- **Screener**: basic price band

<!-- trigger pages -->

## Quick start (local)
```bash
npm i -g wrangler
wrangler d1 create portfolio_tracker_db
wrangler d1 execute portfolio_tracker_db --local --file=./db/schema.sql
wrangler d1 execute portfolio_tracker_db --local --file=./db/seed.sql
wrangler pages dev ./frontend --d1=PORTFOLIO_DB=portfolio_tracker_db
```

## Deploy via Cloudflare Pages (GitHub Action)
1) Create a **Pages project** in Cloudflare (empty is fine). Choose a name, e.g., `portfolio-tracker-cloudflare`.
2) In your GitHub repo **Secrets** add:
   - `CF_API_TOKEN` (Pages:Edit, Workers Scripts:Edit)
   - `CF_ACCOUNT_ID`
   - `CF_PAGES_PROJECT` (e.g., `portfolio-tracker-cloudflare`)
3) Push to **main** → Action builds `frontend` and publishes `frontend/dist` + Functions.

## Environment variables (Pages → Settings → Variables)
- `ALPACA_KEY_ID` (Secret)
- `ALPACA_SECRET_KEY` (Secret)
