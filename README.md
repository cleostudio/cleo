# Cleo

Cleo is a general-purpose AI agent with a candid, conversational, quietly
playful voice. She uses emoji in upbeat social exchanges, stays restrained when
the topic is serious or technical, and searches the web when current or
verifiable information is needed. Answers adapt their depth to the task and
prioritize complete, well-supported conclusions over generic background.

- Multi-turn conversations with streamed Markdown answers
- Image attachments for vision, plus agent-directed image generation
- Live reasoning, web-search, and image-generation activity
- Syntax-highlighted code and a stop control
- Responsive glass UI with system-aware light and dark themes

Conversation history lives in browser memory and clears on refresh. Cleo has no
accounts or application database.

## Run locally

Requires Node.js 20.9+, pnpm, and an OpenAI API key with access to
`gpt-5.6-terra` (and image generation if you want that tool to succeed).

```bash
pnpm install
cp .env.example .env.local
# Set OPENAI_API_KEY in .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The API key stays in the
server-side route; never expose it through `NEXT_PUBLIC_` or commit
`.env.local`.

## Architecture

- `components/ask-form.tsx` manages the active conversation, image attachments,
  and the response stream.
- `app/api/responses/route.ts` calls the OpenAI Responses API with
  `gpt-5.6-terra`, hosted web search, image generation, reasoning summaries,
  streaming, and `store: false`.
- `lib/cleo-instructions.ts` defines Cleo's behavior.
- `lib/stream.ts` defines the client-facing NDJSON protocol, including
  reasoning, web-search, and image-generation activity plus streamed images.
- `lib/images.ts` validates image data URLs shared by the client and API.

## Commands

| Command          | Purpose                 |
| ---------------- | ----------------------- |
| `pnpm dev`       | Start development       |
| `pnpm build`     | Build for production    |
| `pnpm start`     | Serve the build         |
| `pnpm lint`      | Run ESLint              |
| `pnpm typecheck` | Run TypeScript checks   |
| `pnpm format`    | Format TypeScript files |

Built with Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Base UI,
the OpenAI JavaScript SDK, and Streamdown. Contributor and AI-agent guidance is
in [`AGENTS.md`](./AGENTS.md).
