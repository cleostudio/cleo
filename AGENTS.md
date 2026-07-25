<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cleo

Cleo is a general-purpose AI agent, not a starter template.

### Product

- The "Ask anything" UI streams Markdown answers plus reasoning, web-search,
  and image-generation activity. The collapsed activity row tracks the current
  concrete step.
- Users can attach PNG, JPEG, WEBP, or GIF images for vision; Cleo can also
  generate images with the Responses API `image_generation` tool.
- Stopping before any answer text or generated image abandons that turn so it
  does not linger in the conversation sent on the next request.
- Conversation state is browser-only and clears on reload.
- There is no authentication, database, or separate backend service.
- The shell borrows cali.so's warm working-paper design language (palette,
  paper grain, drafting guides, liquid-glass dock, signal pixel stamp). Do not
  pull in cali.so's Clerk auth, Neon/AMA/media backends, bilingual content, or
  personal assets. Keep attribution current in `NOTICE.md`.
- Refer to Cleo as an AI agent and keep product copy aligned with the app.
- Cleo's voice is candid, conversational, and quietly playful. She uses one
  fitting emoji for personal wins and often in light social exchanges, but none
  for serious, high-stakes, factual, research, or technical responses.
- Cleo addresses every explicit constraint, adapts depth to the task, checks
  assumptions before answering, and favors primary, official, recent sources
  when web evidence is needed.

### Architecture

- `components/ask-form.tsx` owns messages, image attachments, cancellation, and
  NDJSON stream consumption.
- `components/ambient-background.tsx` and `components/pixel-cluster.tsx` own the
  paper-shell ambience and masthead stamp; `app/layout.tsx` applies the
  `public-site` class that activates the warm paper tokens.
- `app/api/responses/route.ts` validates messages (including image data URLs)
  and calls the OpenAI Responses API with `gpt-5.6-terra`, `web_search`,
  `image_generation`, reasoning summaries, streaming, and `store: false`.
- `lib/cleo-instructions.ts` defines agent behavior.
- `lib/stream.ts` defines the `text`, `activity`, `image`, and `error` events.
  Activity items cover `reasoning`, `web_search`, and `image_generation`.
  Update the route and client together when this protocol changes.
- `lib/images.ts` shared image limits and data-URL validation.
- `components/markdown.tsx` renders model output; `app/globals.css` defines the
  visual system (including cali.so-adapted paper tokens and dock grammar).

`POST /api/responses` accepts at most 50 messages, 10,000 characters each and
100,000 total, with a final `user` message. User and assistant messages may
include up to 4 image data URLs each (PNG, JPEG, WEBP, GIF).

### Development rules

- Use `pnpm` only. Available scripts are `dev`, `build`, `start`, `lint`,
  `typecheck`, and `format`; there is no `test` script.
- Before changing framework code, read the relevant Next.js 16 guide in
  `node_modules/next/dist/docs/`.
- Use App Router conventions and Server Components by default. Keep OpenAI
  calls and `OPENAI_API_KEY` on the server.
- Use the OpenAI developer docs MCP server for API, SDK, model, tool, or prompt
  work. Prefer its search and fetch tools over memory.
- Keep model configuration in the route and behavior in
  `lib/cleo-instructions.ts`.
- Keep strict TypeScript, the `@/*` alias, and `.prettierrc` style. Reuse `cn`
  and `components/ui/*`.
- Preserve the accessible, responsive paper shell and glass prompt dock.
  Render model output through Streamdown, never raw HTML.
- Update `README.md`, `NOTICE.md`, and this file when setup or design-system
  attribution changes.

### Verification

- Code: `pnpm lint && pnpm typecheck && pnpm build`.
- UI: manually verify the changed flow on desktop/mobile and light/dark.
- Agent/API: verify multi-turn chat, reasoning activity, web search, image
  attach/vision, image generation, streaming, cancellation, and relevant
  errors.
- Docs: `pnpm exec prettier --check README.md AGENTS.md` and compare claims
  against the source.

### Cursor Cloud

- `pnpm dev` starts the only service at `http://localhost:3000`.
- `OPENAI_API_KEY` is injected. Without it, the API returns HTTP 503 while the
  page remains available for UI work.
