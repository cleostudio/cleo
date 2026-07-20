<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- `cleo` is a single Next.js 16 app (App Router). Package manager is **pnpm**; standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`, `typecheck`, `format`).
- Run the dev server with `pnpm dev` (serves on http://localhost:3000). This is the only service.
- The core feature is the "Ask anything" bar, which POSTs to `/api/responses`. That route calls the OpenAI Responses API with model `gpt-5.6-terra` and reads `OPENAI_API_KEY` from the environment. In Cloud the key is injected as an env secret, so the full ask→answer flow works without a local `.env.local`. If `OPENAI_API_KEY` is missing the route returns HTTP 503 ("The AI service is not configured.") and the UI renders that error — the page still loads fine for UI-only work.
