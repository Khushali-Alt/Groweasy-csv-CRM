# GrowEasy — Frontend (Phase 1)

Next.js + TypeScript + Tailwind implementation of the upload → preview →
import → results flow from the project README, built so it runs and
demos on its own before the Express/AI backend exists.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How AI mapping is stubbed for now

`services/api.ts` batches rows in groups of 100 and posts each batch to
`POST {NEXT_PUBLIC_API_BASE_URL}/api/import`. If `NEXT_PUBLIC_API_BASE_URL`
is **not** set (see `.env.local.example`), it instead runs
`utils/mockAiMapper.ts` — a heuristic column-name mapper that fakes what
the Gemini/OpenAI batch call will eventually return, with the same
artificial per-batch delay so the progress bar behaves realistically.
Swap in the real backend later by just setting the env var; no component
changes needed.

`utils/validators.ts` mirrors the backend's validation layer (email/phone
presence, allowed `crm_status` values, date sanity) so mock-mode results
match the real API contract described in the project README.

## Structure

```
app/
  layout.tsx        root layout, fonts, metadata
  page.tsx           orchestrates the 4 stages
  globals.css
components/
  Navbar.tsx
  UploadBox.tsx      drag & drop + file picker, validates type/size/empty
  PreviewTable.tsx   sticky header, scroll, search — no AI/network calls
  ProgressBar.tsx
  Loader.tsx
  ResultTable.tsx    imported/skipped tabs, stamp badges, JSON download
hooks/
  useCsvImport.ts    state machine: idle → parsing → preview → importing → done
services/
  api.ts             batching, retry-per-batch, backend/mock switch
utils/
  validators.ts
  mockAiMapper.ts
types/
  index.ts
```

## What's implemented vs. still needed

Done: drag & drop upload, CSV/size/empty validation, on-device parsing
(PapaParse, no network call until confirm), searchable sticky-header
preview table, batch progress UI, results screen with imported/skipped
tabs and JSON export, offline demo mode.

Still needed (Phase 2+, per the project README): the actual Express
backend (`server/`), the real Gemini/OpenAI prompt call, dark mode
toggle, virtualized table for very large files, streaming import.
