# Cleo

Cleo is a general-purpose AI agent with a warm, candid, quietly playful voice.
She streams clear answers, occasionally uses emoji when the tone fits, and
searches the web when current or verifiable information is needed.

- Multi-turn conversations with streamed Markdown answers
- Agent-directed web search with live activity
- Syntax-highlighted code and a stop control
- Responsive glass UI with system-aware light and dark themes

Conversation history lives in browser memory and clears on refresh. Cleo has no
accounts or application database.

## Run locally

Requires Node.js 20.9+, pnpm, and an OpenAI API key with access to
`gpt-5.6-terra`.

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

- `components/ask-form.tsx` manages the active conversation and consumes the
  response stream.
- `app/api/responses/route.ts` calls the OpenAI Responses API with
  `gpt-5.6-terra`, hosted web search, streaming, and `store: false`.
- `lib/cleo-instructions.ts` defines Cleo's behavior.
- `lib/stream.ts` defines the client-facing NDJSON protocol.

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
