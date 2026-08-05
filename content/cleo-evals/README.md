# Cleo eval cases (Phase A)

Offline golden cases for deterministic graders. Live Responses generation is
optional later; these fixtures grade **frozen** assistant Markdown so
`pnpm test:cleo-eval` stays network-free.

Canonical design: [`docs/cleo-self-improving.md`](../../docs/cleo-self-improving.md).

## Layout

| Path | Role |
| --- | --- |
| `cases.json` | Golden cases (train + holdout) |
| `lib/cleo/evals/*` | Taxonomy, loaders, suite |
| `lib/cleo/graders/*` | Deterministic graders (ASI diagnostics) |

## Add a case from a production failure

1. **Open-code** what went wrong in one sentence.
2. Map it to an axial code in `lib/cleo/evals/taxonomy.ts`
   (`invented_guide_link`, `invented_curated_image`, `missing_catalog_link`,
   `stock_phrase`, `wrong_shelf`, `refusal_or_casual`). Add a new code only
   when an existing one does not fit.
3. Append an object to `cases.json`:
   - `id` — stable kebab-case, unique
   - `split` — `train` for optimize loops; `holdout` for promotion checks
   - `failureModes` — one or more taxonomy codes
   - `prompt` — user text that triggered (or would trigger) the failure
   - `assistant` — frozen Markdown to grade (redact secrets; keep portal paths)
   - `expect` — grader flags (see below)
4. Run `pnpm test:cleo-eval`. Fix the fixture or grader until green.
5. Prefer a **passing grounded example** *and* a **negative detector fixture**
   when you are documenting a new failure mode.

### `expect` flags

| Flag | Meaning |
| --- | --- |
| `catalogHrefs` | These hrefs must appear |
| `missingCatalogHrefs` | Negative: these hrefs must be absent |
| `noInventedPaths` | No invented guide/image paths |
| `hasInventedPaths` | Negative: invented paths must be present |
| `guardrailNoop` | `sanitizePortalMarkdown` must be a no-op |
| `noStockPhrases` | No banned stock assistant phrases |
| `hasStockPhrases` | Negative: stock phrases must be present |

## Train vs holdout

Promote instruction/harness changes only when scores improve on **train and
holdout**. Do not move a case from holdout to train just to make an optimize
loop look better.
