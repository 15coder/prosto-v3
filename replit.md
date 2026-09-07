# PROSTO Restaurant

A bilingual (Arabic/English) restaurant website for PROSTO, a restaurant located in Deir ez-Zor, Syria. Built as a pnpm monorepo with a React/Vite frontend and an Express API server.

## Stack

- **Frontend** (`artifacts/prosto`): React 19 + Vite 7 + Tailwind CSS 4 + shadcn/ui + Framer Motion + Wouter (routing) + TanStack Query
- **API Server** (`artifacts/api-server`): Express 5 + Pino logging, built with esbuild
- **Database** (`lib/db`): Drizzle ORM + PostgreSQL (Replit built-in)
- **Shared libs**: `api-zod` (Zod schemas), `api-client-react` (React Query hooks), `api-spec` (OpenAPI spec + Orval codegen)

## How to run

Both services start automatically via their configured workflows:

- **Frontend**: `pnpm --filter @workspace/prosto run dev` → serves on `$PORT`
- **API Server**: `pnpm --filter @workspace/api-server run dev` → builds with esbuild, then starts on `$PORT`

To install dependencies: `pnpm install`

## Database

Uses Replit's built-in PostgreSQL. Connection is via `DATABASE_URL` (auto-provided). Schema is managed with Drizzle Kit:

```bash
pnpm --filter @workspace/db run push
```

## User preferences
