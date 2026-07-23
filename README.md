# Cleo

Cleo is a general-purpose AI agent for clear, useful answers. It keeps the
active conversation in context, streams responses as they are generated, and
can search the web when a question needs current or verifiable information.

## Features

- Multi-turn conversations with streamed responses
- Agent-directed web search with live activity updates
- Markdown answers with syntax-highlighted code
- Stop control for in-progress responses
- Responsive glass UI with system-aware light and dark themes
- Stateless server integration with no application database

Conversations live in browser memory and are cleared on refresh. Cleo sends the
current message history to OpenAI for each response and sets `store: false` on
Responses API requests.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4, shadcn/ui, and Base UI
- OpenAI JavaScript SDK and the Responses API
- Streamdown for streamed Markdown rendering

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- [pnpm](https://pnpm.io/)
- An OpenAI API key with access to `gpt-5.6-terra`

### Install and run

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Replace the placeholder in `.env.local`:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

`OPENAI_API_KEY` is read only by the server-side route handler. Never expose it
through a `NEXT_PUBLIC_` variable or commit `.env.local`.

## How it works

1. `components/ask-form.tsx` keeps the current conversation in memory and posts
   its messages to `POST /api/responses`.
2. `app/api/responses/route.ts` validates the messages and calls the OpenAI
   Responses API with Cleo's instructions, `gpt-5.6-terra`, and the hosted
   `web_search` tool.
3. The route converts OpenAI stream events into newline-delimited JSON for
   text, web-search activity, and errors.
4. The client renders activity as it happens and progressively displays the
   Markdown answer.

Cleo's behavior and tool-use policy live in `lib/cleo-instructions.ts`. The
shared stream protocol and event types live in `lib/stream.ts`.

## API

`POST /api/responses` accepts a JSON message history:

```json
{
  "messages": [{ "role": "user", "content": "What happened today?" }]
}
```

The final message must have the `user` role. A request may contain up to 50
messages, 10,000 characters per message, and 100,000 characters in total.
Successful requests return `application/x-ndjson` with these event shapes:

```json
{"type":"text","delta":"Cleo's next text chunk"}
{"type":"activity","activity":{"id":"search-id","kind":"web_search","status":"searching"}}
{"type":"error","error":"The request could not be completed."}
```

This endpoint is intended for Cleo's own browser client and does not currently
provide authentication or application-level rate limiting.

## Commands

| Command          | Purpose                                       |
| ---------------- | --------------------------------------------- |
| `pnpm dev`       | Start the local development server            |
| `pnpm build`     | Create a production build                     |
| `pnpm start`     | Serve the production build                    |
| `pnpm lint`      | Run ESLint                                    |
| `pnpm typecheck` | Run TypeScript without emitting files         |
| `pnpm format`    | Format TypeScript and TSX files with Prettier |

Before submitting a change, run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Repository-specific architecture, coding, and verification guidance is in
[`AGENTS.md`](./AGENTS.md).
