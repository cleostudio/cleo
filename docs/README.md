# Documentation

Canonical deep docs for humans and agents. Root [`AGENTS.md`](../AGENTS.md)
is the always-loaded operating brief; it **links here** instead of duplicating
these runbooks.

| Doc | Read when… |
| --- | --- |
| [`handoff.md`](./handoff.md) | Picking up the repo; need current product/status |
| [`cleo.md`](./cleo.md) | Changing `/cleo`, `/api/responses`, or `lib/cleo/*` |
| [`homepage-search.md`](./homepage-search.md) | Changing portal search or the Ask Cleo handoff |
| [`atlas.md`](./atlas.md) | Changing country guides, prose, or Explore photos |
| [`space.md`](./space.md) | Changing Space guides or NASA photo imports |
| [`theme-preset.md`](./theme-preset.md) | Adding/changing a color, motion, radius, or width token |
| [`design-language.md`](./design-language.md) | Implementing or reviewing UI/UX composition |

## Roles

| Surface | Audience | Load | Purpose |
| --- | --- | --- | --- |
| [`README.md`](../README.md) | Humans | On demand | Clone, install, run, contribute |
| [`AGENTS.md`](../AGENTS.md) | Agents (+ humans skimming) | Always (in this tree) | Map, invariants, verification, pointers |
| `docs/*` | Both | On demand | Canonical procedures and design contracts |

## Writing rules for these docs

- One source of truth: put the long explanation here; root files link, don’t copy.
- Prefer actionable bullets (“do X”, “never Y”) over narrative.
- Name real paths, scripts, and tokens; avoid vague “clean code” advice.
- Keep procedures next to the subsystem they describe.
- When behavior or setup changes, update the matching doc **and** any root
  pointer that would otherwise go stale.
