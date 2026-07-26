# Domain Docs

How the engineering skills should consume this repo's domain documentation when
exploring the codebase.

## Layout

Start from `CONTEXT-MAP.md` at the repo root, then `docs/handoff.md` for
current site status. System-wide decisions live in `docs/adr/`. Per-context
`CONTEXT.md` files are optional and created lazily when domain modeling needs
them — do not scaffold them upfront.

## Before exploring, read these

- **`CONTEXT-MAP.md`** — active / removed / retained contexts
- **`docs/handoff.md`** — product and architecture snapshot
- **`docs/concepts.md`** — candidate topic shelves and portal surfaces
- **`docs/adr/`** — system-wide decisions
- **`docs/design-language.md`** — visual and interaction contract
- **`AGENTS.md`** — Cleo agent surface and verification

If a listed file doesn't exist, **proceed silently**. Don't flag its absence;
don't suggest creating context docs upfront.

## Use the glossary's vocabulary

When a `CONTEXT.md` defines a term, use that term in issue titles, refactors,
hypotheses, and tests. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't defined yet, either reconsider invented language
or note the gap for later domain modeling.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than
silently overriding:

> _Contradicts ADR-0006 (motion is information) — but worth reopening because…_
