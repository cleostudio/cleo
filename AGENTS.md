<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cleo repository guide

### Product contract

- Cleo is a general-purpose AI agent, not a starter template or a generic
  component demo.
- The primary experience is the "Ask anything" conversation. Cleo streams
  Markdown answers and decides when to use hosted web search for current or
  hard-to-verify information.
- The browser sends the non-empty conversation history with each turn.
  Conversation state is in memory only; a reload starts a new conversation.
- Web-search activity is visible while a response runs. Users can stop an
  in-progress response.
- There is no authentication, database, server-side conversation persistence,
  or separate backend service.
- Keep product copy, documentation, and code aligned with this contract. Refer
  to Cleo as an AI agent.

### Stack and commands

- This is one Next.js 16 App Router application using React 19, strict
  TypeScript, Tailwind CSS 4, shadcn/ui, Base UI, and the OpenAI JavaScript SDK.
- Node.js 20.9 or newer is required by this Next.js version.
- Use `pnpm` exclusively. Do not use `npm`, `yarn`, or `npx`; use `pnpm exec`
  for installed binaries and `pnpm dlx` for one-off packages.
- Install dependencies with `pnpm install`.
- `pnpm dev` starts the only service at `http://localhost:3000`.
- `pnpm build` creates a production build; `pnpm start` serves it.
- `pnpm lint`, `pnpm typecheck`, and `pnpm format` run the repository's lint,
  type-check, and TypeScript/TSX formatting tasks.
- There is currently no automated `test` script. Do not document or invoke one
  unless the repository adds it.

### Architecture and data flow

- `app/page.tsx` is the page shell. Keep the main interaction in
  `components/ask-form.tsx`.
- `components/ask-form.tsx` owns in-memory messages, request cancellation,
  NDJSON stream consumption, and progressive rendering.
- `components/activity-panel.tsx` renders web-search progress and details.
- `components/markdown.tsx` renders streamed output with Streamdown and Shiki.
- `components/theme-provider.tsx` follows the system theme and supports the
  `d` light/dark shortcut when focus is outside a form control.
- `app/api/responses/route.ts` is the server boundary for OpenAI. It validates
  input, creates the Responses API stream, and maps OpenAI events to Cleo's
  client stream.
- `lib/cleo-instructions.ts` is the single source of truth for Cleo's identity,
  behavior, search policy, citation policy, and output style.
- `lib/stream.ts` defines the client-facing NDJSON event union and its parser.
  Update the producer and consumer together whenever this protocol changes.
- `app/globals.css` contains the visual system and shared component classes.
  Reuse established tokens and utilities instead of duplicating styles.

The request path is:

1. The client posts `{ messages: [{ role, content }] }` to
   `POST /api/responses`.
2. The route validates at most 50 messages, 10,000 characters per message,
   100,000 characters in total, and a final `user` message.
3. The route calls `gpt-5.6-terra` with Cleo's instructions, medium reasoning,
   medium text verbosity, `web_search`, streaming enabled, and `store: false`.
4. The route returns `application/x-ndjson` events of type `text`, `activity`,
   or `error`.
5. The client renders search activity and Markdown deltas as they arrive.

### OpenAI integration

- Read `OPENAI_API_KEY` only in server-side code. Never expose it through a
  `NEXT_PUBLIC_` variable, log it, or commit it.
- Use the official `openai` package and the Responses API. Preserve request
  cancellation from the browser request through the SDK stream.
- `store: false` means responses are not stored for later retrieval through
  the Responses API; do not describe this as a broader data-retention
  guarantee.
- Keep model configuration in `app/api/responses/route.ts` and agent behavior
  in `lib/cleo-instructions.ts`. Update both documentation files when the
  model, tools, limits, environment variables, or stream protocol changes.
- Preserve user-safe API errors. Missing configuration returns HTTP 503;
  upstream rate limits return HTTP 429; other upstream failures return HTTP
  502 or an NDJSON `error` event after streaming begins.
- Always use the OpenAI developer documentation MCP server for work involving
  the OpenAI API, SDK, models, tools, or prompting. Prefer
  `search_openai_docs`, `list_openai_docs`, `fetch_openai_doc`,
  `list_api_endpoints`, and `get_openapi_spec` over memory or third-party
  summaries.

### Next.js and React conventions

- Before changing framework code, read the relevant Next.js 16 guide under
  `node_modules/next/dist/docs/`. Do not rely on conventions from older
  Next.js versions.
- Use App Router conventions and Route Handlers. Do not add Pages Router files.
- Keep Server Components as the default. Add `"use client"` only where browser
  APIs, event handlers, or client state require it.
- Keep secrets and OpenAI SDK calls on the server. Client components should
  call the internal route, not OpenAI directly.
- Use the `@/*` path alias for cross-directory imports.
- Maintain the existing accessibility contract: labeled controls, keyboard
  operation, visible focus, live response announcements, and motion/theme
  behavior that does not block use.

### Code and UI conventions

- Follow `.prettierrc`: two spaces, double quotes, no semicolons, trailing
  commas where valid, and an 80-column target. Let the Tailwind Prettier plugin
  order utility classes.
- Keep TypeScript strict. Prefer narrow unions and validation at network
  boundaries over casts or `any`.
- Reuse `cn` for conditional classes and `components/ui/*` for shared UI
  primitives.
- Preserve Cleo's restrained glass visual language, responsive single-column
  layout, system-aware theme, and streamed states. Avoid template-style
  showcase content.
- Render model output through `components/markdown.tsx`; do not inject model
  output as raw HTML.
- Add dependencies only when needed, using the latest compatible version with
  `pnpm`.

### Verification

- For every code change, run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- For UI changes, also run `pnpm dev` and manually verify the affected flow at
  desktop and mobile widths in light and dark themes.
- For agent or API changes, exercise a successful multi-turn ask, a prompt that
  triggers web search, streamed output, and cancellation. Test relevant
  validation or upstream-error paths.
- For UI-only work without an API key, verify that the page loads and that the
  missing-key HTTP 503 is rendered as "The AI service is not configured."
- For documentation-only changes, run
  `pnpm exec prettier --check README.md AGENTS.md` and verify every documented
  command, path, environment variable, limit, and capability against the
  repository.
- Do not treat compilation alone as sufficient evidence for behavioral
  changes.

### Documentation upkeep

- `README.md` is the user and contributor entry point: product purpose,
  features, local setup, architecture, API contract, and commands.
- `AGENTS.md` contains repository-specific implementation and verification
  rules. Keep guidance concrete and tied to the current codebase.
- Remove stale template language instead of preserving generic scaffold
  instructions.

### Cursor Cloud specific instructions

- In Cursor Cloud, `OPENAI_API_KEY` is injected as an environment secret, so
  the full ask-to-answer flow works without `.env.local`.
- If the key is absent, `/api/responses` returns HTTP 503 while the page remains
  available for UI-only work.
- Before running checks, honor the environment setup status described by the
  Cloud runtime. Never interrupt an active setup process.
