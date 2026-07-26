# Patches

pnpm `patchedDependencies` live here (see `pnpm-workspace.yaml`).

## `typegpu@0.11.9`

Transitive via `shaders`. Under a strict CSP without `'unsafe-eval'`,
`getCompiledWriter` falls back correctly but warns on every call. This patch
makes that warning once-only.

Tracked upstream:
https://github.com/software-mansion/TypeGPU/issues/2758

Remove this patch (and `lib/security/typegpu-csp-fallback.test.ts`) when a
`typegpu` release — pulled in by our `shaders` pin — includes the warn-once
behavior (or stops using `eval` / `new Function` for writers).
