# Lombard

Apartment hub for poker stats and WiFi at 548 Lombard.

## Setup

```bash
npm install
cp .env.example .env
```

Google Sheets is public-read via CSV by default. To use the Sheets API instead, create an API key, restrict it to Google Sheets, and set:

```
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

Local mock data (no network):

```
VITE_USE_MOCK=true
```

Update `SHEET_ID` in `src/services/store/PokerStore.ts` if the sheet changes. The sheet must be viewable by anyone with the link.

## Scripts

- `npm run dev` — Vite at http://localhost:5173/lombard-party/
- `npm run build` — typecheck + production build to `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — oxlint

Deploys to GitHub Pages from `main` via Actions.

## Stack

Vite, React 19, TypeScript, TanStack Query, semantic CSS + Tailwind 4 tokens. Poker numbers come from Google Sheets through a store → service → hook path.
