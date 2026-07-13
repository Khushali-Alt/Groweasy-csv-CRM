# GrowEasy AI CSV Importer

AI-powered CSV importer that maps any CSV layout into the GrowEasy CRM
schema using Gemini, with batching, retries, and a validation layer
that never trusts the AI blindly.

- **`client/`** — Next.js/TypeScript frontend. Upload → preview → confirm → results. See `client/README.md`.
- **`server/`** — Express backend. Batches records, calls Gemini, validates, merges. See `server/README.md`.

## Quickest way to try it

Both sides run in **mock mode** with no API key — the server uses a
heuristic mapper instead of Gemini, so you can see the full flow work
end to end before wiring up a real key.

```bash
# terminal 1
cd server && npm install && cp .env.example .env && npm run dev

# terminal 2
cd client && npm install && cp .env.local.example .env.local && npm run dev
```

Open http://localhost:3000, drop in a CSV, confirm import.

## Switching to real Gemini

Add a key from https://aistudio.google.com/apikey to `server/.env`:

```
GEMINI_API_KEY=your-key-here
```

Restart the server. `GET /api/health` reports which mode is active.

## Docker

```bash
GEMINI_API_KEY=your-key-here docker compose up --build
```
