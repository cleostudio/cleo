# Self-improving Cleo

Read this when designing feedback, evals, memory, or prompt-evolution loops
for `/cleo`. Runtime chat behavior remains in [`cleo.md`](./cleo.md).

## Goal

Make Cleo improve over time **without** retraining a model and **without**
letting a live turn rewrite production behavior. Improvement means better
instructions, grounded portal answers, and (optionally) per-account
preferences — driven by measurable feedback and human-gated promotion.

This follows the OpenAI [self-evolving agents cookbook](https://developers.openai.com/cookbook/examples/partners/self_evolving_agents/autonomous_agent_retraining):
baseline agent → feedback / graders → eval score → revised prompt → new
baseline. Adapt that loop to Cleo’s invariants; do not port the healthcare
summarizer example literally.

## Non-goals

- Model fine-tuning or weight updates.
- Letting the live `/api/responses` turn mutate `CLEO_INSTRUCTIONS` or catalog
  data.
- Calling a model to author Explore / Space / Civilizations / Cities / Oceans /
  Rivers page prose (still curated; see AGENTS invariants).
- Enabling OpenAI `store: true` without an explicit privacy decision (today:
  `store: false`, browser-held transcript + encrypted reasoning).
- Restoring Upstash, Clerk, admin AMA, or other removed stack without a
  product decision. Prefer **Neon** (already in product) for any durable
  signals.
- Migrating the chat stack to Eve / Agents SDK unless product asks for a
  rewrite. Self-improvement is a **loop around** the existing Responses API
  agent.

## What already helps

| Capability | Where | Role in a self-improving loop |
| --- | --- | --- |
| Strong base instructions | `lib/cleo/instructions.ts` | Baseline “program” to evolve offline |
| Portal catalog grounding | `lib/cleo/portal-catalog.ts` | Deterministic truth for deep links |
| Invented-path / image strip | `lib/cleo/guardrails.ts` | Free deterministic grader signal |
| Topic photo allowlist | `lib/cleo/topic-photos.ts`, `portal-links.ts` | Grounded media checks |
| Adaptive reasoning | `lib/cleo/reasoning-effort.ts` | Cost/quality knob; keep out of auto-prompt soup |
| Signed-in name context | `lib/cleo/user-profile.ts` | Pattern for private per-turn instruction blocks |
| Unit tests | `lib/cleo/*.test.ts` | Regression harness for guardrails & helpers |
| Neon + Better Auth | `docs/auth.md` | Durable store for opt-in signals / prefs |

Live chat is still one-shot generation + stream + post-hoc guardrails. There
is no thumbs feedback, no eval suite, and no durable memory beyond Location
and account name.

## Architecture (three loops)

Use three loops with different trust and latency budgets. Only the offline
loop may change the shared agent.

```mermaid
flowchart LR
  subgraph online [Online turn - low latency]
    U[User turn] --> R["POST /api/responses"]
    R --> G[Guardrails]
    G --> UI[Streamdown UI]
    UI --> S[Signals]
  end

  subgraph personal [Per-account - opt-in]
    S --> M[(Neon memory / prefs)]
    M --> R
  end

  subgraph offline [Offline improvement - human gated]
    S --> D[Eval dataset]
    D --> E[Graders + LLM-as-judge]
    E --> P[Candidate instructions]
    P --> H[Human review + PR]
    H --> I[lib/cleo/instructions.ts]
    I --> R
  end
```

### 1. Offline self-evolving loop (shared agent)

**Purpose:** Raise baseline quality for everyone.

**Pipeline**

1. **Baseline** — current `CLEO_INSTRUCTIONS` + catalog + tools
   (`web_search`, `image_generation`) as used by `app/api/responses/route.ts`.
2. **Dataset** — curated JSON/CSV of portal-shaped prompts (countries, space
   bodies, civilizations, cities, oceans, rivers, vision, refusal, casual
   chat). Seed from real failure modes (guardrail hits, Retry/Continue,
   invented links), not only happy paths.
3. **Generate** — run the same Responses path in a scripted harness
   (`scripts/cleo/eval-run.mjs` or similar), OpenAI-only, no page rendering.
4. **Grade** — mix deterministic and model graders (see § Graders).
5. **Aggregate** — weighted score; stop when above threshold or `max_retry`.
6. **Reflect / revise** — meta-prompt (or later GEPA-style search) proposes a
   **diff** to instructions; never silent overwrite of `main`.
7. **Promote** — human reviews; land via PR. Update `docs/cleo.md` if
   behavior boundaries change.

**Promotion rule:** Candidate instructions ship only through git review.
Automation may open a draft PR; it must not hot-patch production env vars
with a new system prompt.

Suggested package layout (when implementing):

| Path | Role |
| --- | --- |
| `content/cleo-evals/` or `scripts/cleo/evals/` | Golden cases + expected signals |
| `scripts/cleo/eval-run.mjs` | Batch generate + grade |
| `scripts/cleo/optimize-instructions.mjs` | Offline revise loop (dev/CI only) |
| `lib/cleo/graders/*` | Deterministic graders shared by tests + eval |
| Optional OpenAI Evals UI | Early exploration with thumbs + Optimize |

Start with OpenAI Platform Evals for a small hand-labeled set, then move the
same graders into a repo script so CI can fail regressions.

### 2. Online signals (instrumentation)

**Purpose:** Feed the offline dataset and catch drift. Do **not** auto-rewrite
instructions from a single bad turn.

Collect, with explicit privacy bounds:

| Signal | Source | Why |
| --- | --- | --- |
| Explicit feedback | Optional 👍/👎 + short comment on assistant turns | Human preference text for Optimize / meta-prompt |
| Guardrail strip | Server after sanitize | Invented guide/image paths |
| Incomplete / Retry / Continue | Existing stream `status` + UI actions | Soft failures |
| Cancellation | Client abort | Latency / overlong turns |
| Tool churn | `max_tool_calls` / activity events | Search/image misuse |

**Storage:** Neon tables scoped by `userId` when signed in; for guests either
omit durable storage or store only coarse anonymous aggregates (no raw chat
bodies without consent). Keep raw transcripts out of analytics by default —
store case ids, hashes, grader flags, and short feedback text.

**API sketch:** `POST /api/cleo/feedback` (session-aware), rate-limited like
chat turns. Fail open if Neon is unset (same pattern as auth / Cleo 503
degradation for the rest of the site).

### 3. Per-account memory (personalization, not global learning)

**Purpose:** Remember *this user’s* durable preferences across sessions.

Follow the existing ephemeral-instruction pattern
(`buildUserProfileInstructions` → `<cleo_user_profile>`):

- Opt-in “Remember this” / preference notes for signed-in users only.
- Neon row(s) owned by `user.id`; user-visible and deletable on `/account`.
- Inject a bounded `<cleo_user_memory>` developer block per turn (size-capped).
- Instructions must forbid inventing memories beyond that block (same voice
  rules as name personalization).
- Guests stay browser-only; no cross-device memory.

This is **not** the self-evolving loop. One user’s corrections must not become
everyone’s system prompt without the offline + human path.

## Graders (Cleo-specific)

Prefer cheap deterministic checks before LLM-as-judge.

| Grader | Type | Pass idea |
| --- | --- | --- |
| Guide link validity | Python/TS | Every `/explore|space|civilizations|cities|oceans|rivers/...` link resolves via existing getters |
| No invented curated images | TS | Images match `isCuratedTopicImageSrc` / topic-photo sets when subject matched |
| Guardrail noop | TS | Sanitize did not strip (or strips only on negative cases) |
| Catalog mention | TS | When the gold case expects a deep link, reply contains the canonical path |
| Voice / usefulness | `score_model` | Rubric: lead with answer, no stock phrases, correct register |
| Grounding when searched | `score_model` | Claims that needed `web_search` cite Markdown links |
| Safety / overclaim | `score_model` | No fake personal experience; uncertainty when warranted |

Reuse production helpers (`guardrails.ts`, portal getters) inside graders so
eval truth matches runtime truth.

## Within-turn reflection (optional, capped)

A generate → critique → revise loop **inside** one HTTP request is possible
but expensive under `maxDuration = 90` and streaming UX.

Recommended default:

- Keep **deterministic** post-processing (guardrails) on every turn.
- Add at most **one** silent repair pass when a high-severity grader fails
  (e.g. all guide links invented) **before** finalizing the assistant
  message — only if latency budget allows; otherwise surface Retry/Continue.
- Do not run multi-iteration GEPA-style search on interactive chat.

## Privacy and product boundaries

- `OPENAI_API_KEY` stays server-side; never `NEXT_PUBLIC_`.
- Feedback and memory are server-owned; do not accept client-supplied
  “system prompt overrides”.
- Eval scripts may use the key locally/CI; do not log full prod transcripts
  into third-party eval UIs without redaction.
- Self-improvement must not weaken guardrails to chase a higher judge score.
- Portal pages remain statically authored; the agent improves *answers about*
  the portal, not the portal CMS.

## Implementation phases

### Phase A — Eval harness (ship first)

1. Golden cases for catalog grounding + voice smoke tests.
2. Deterministic graders wrapping `guardrails` + catalog getters.
3. `pnpm test:cleo-eval` (or vitest) runnable without network for
   deterministic cases; optional live job behind `OPENAI_API_KEY`.
4. Document how to add a case when a production failure is found.

### Phase B — Feedback UI + Neon signals

1. Lightweight turn feedback in `components/cleo/*` (design-language: no card
   clutter; one clear control).
2. Neon schema + `POST /api/cleo/feedback`.
3. Export script: signals → eval case candidates (human triage).

### Phase C — Offline optimize → PR

1. Scripted meta-prompt revise of `CLEO_INSTRUCTIONS` against failing cases.
2. Score must beat baseline on train **and** held-out cases.
3. Open draft PR with score report; engineer merges.

### Phase D — Opt-in account memory

1. Schema + account UI to view/clear notes.
2. `<cleo_user_memory>` injection + instruction updates in `instructions.ts`
   / `user-profile.ts` pattern.
3. Tests for cap, redaction, and guest isolation.

## Verification bar

| Change | Check |
| --- | --- |
| Graders / harness | Deterministic eval suite green; live eval optional |
| Feedback API | Unit + security tests; rate limit; no secret leakage |
| Memory | Account isolation tests; instruction block size cap |
| Instruction PR from optimize | `pnpm typecheck`, Cleo manual smoke, eval score report attached |
| UI | Desktop/mobile, light/dark; feedback does not block streaming |

## Decision log (defaults)

| Decision | Default |
| --- | --- |
| Where shared learning lands | Git-reviewed `lib/cleo/instructions.ts` |
| Where personal learning lands | Neon, signed-in, opt-in |
| Online auto-prompt update | **No** |
| New infra | Neon only unless product adds another store |
| OpenAI `store` | Stay `false` until privacy review |
| Framework migration | Stay on Responses API route |

When a product decision changes a row above, update this file and the
relevant runbook (`cleo.md` / `auth.md`).
