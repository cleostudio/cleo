# Theme preset

Cleo inherits its UI/UX theme from **[cali.so](https://github.com/CaliCastle/cali.so)**.
Treat cali.so as upstream for anything visual. When
[`design-language.md`](./design-language.md) does not answer a question, do what
cali.so does. Departures are design decisions: record them under
[Intentional deviations](#intentional-deviations) — do not let the fork drift
quietly.

## Files

| File | Role |
| --- | --- |
| `lib/theme-preset.ts` | Contract: every token the UI may depend on + pinned look values |
| `lib/theme-preset.test.ts` | Enforcement against `app/globals.css` |
| [`design-language.md`](./design-language.md) | How tokens compose into components and choreography |
| `app/globals.css` | Implementation — the only place raw values belong |

## Agent rules (short)

- Before adding a color, duration, radius, or width: **find the token**.
- Semantic colors only — never a hex, never a raw `--gray-N` in a component.
- Two easings only: `--ease-swift`, `--ease-spring`.
- Page column: `max-w-content` / `max-w-content-narrow` — never a literal width.
- Departing from cali.so → update the deviations table **and** `presetDeviations`.

## Token cascade

Four layers, later wins:

1. **Pre-hydration fallback** — `:root` / `.dark` neutral shadcn ramp
2. **Working palette** — `.public-site` / `.dark.public-site` warm paper ramp
   (`--gray-1` … `--gray-12`)
3. **Design-language tokens** — motion, elevation, weight, layout, layers
4. **Component scope** — rare local narrowing (e.g. `.quiet-selection`,
   `.room-shelf`)

Dark mode inverts the ramp. Do not restate twenty semantic colors.

## Rules

**Color.** Use semantic tokens (`--foreground`, `--muted-foreground`,
`--border`, `--surface-3`). The ramp is private. `--signal` is the single
accent — using it twice on one screen spends it twice.

**Motion.** `--ease-swift` at 150–200ms for chrome; `--ease-spring` at
300–350ms for physical objects. No ad-hoc cubic-beziers. Animate `transform`
and `opacity`. Every motion needs `prefers-reduced-motion`.

**Type.** Geist for text, Geist Mono for machine-set (labels, plates, counts,
stamps). Weights 400 / 500 / 600. Chrome at 14px with `-0.011em`. Counts use
`tabular-nums`.

**Layout.** Column via `--content-column` → `max-w-content` (or
`max-w-content-narrow`). Literal widths desync the shell from ambient guides;
the test suite rejects them.

**Radius.** Scale from `--radius`. Print-register corners are flat `2px`; pills
are `999px`. Nothing in between.

**Elevation.** Through `lib/surface-classes.ts`. Prefer
`box-shadow: 0 0 0 1px` over borders for card edges.

## Pinned values

Source of truth: `lib/theme-preset.ts`.

```css
--ease-swift: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-route-morph: 320ms;
--radius: 0.625rem;
--border-hairline: 1px;      /* 0.5px above 192dpi */
--content-column: 46rem;
--content-column-narrow: 42.5rem;
--z-nav: 100;  --z-card: 200;  --z-toast: 300;
```

## Intentional deviations

Everything else should match cali.so.

| Token | Upstream | Cleo | Why |
| --- | --- | --- | --- |
| `--font-sans` | Geist, then Frex Sans GB for CJK | Geist only | CJK face is unused |
| `--content-column` | `37.5rem` | `46rem` | Guide borders removed; wider column without a boxed frame |

## Changing the preset

1. Edit the pinned value in `lib/theme-preset.ts`.
2. Match it in `app/globals.css`.
3. Run `pnpm test:unit` (preset test fails on missing/mismatched tokens).
4. If departing from cali.so, add a row above and to `presetDeviations`.
