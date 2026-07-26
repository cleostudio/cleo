# Theme preset

Cleo's UI/UX theme is inherited from **[cali.so](https://github.com/CaliCastle/cali.so)**.
Cleo is a fork of that repository, and its visual system — the warm paper gray
ramp, the two motion families, the eight-step surface ladder, the print-shop
vocabulary — comes from there rather than being designed independently.

Treat cali.so as upstream for anything visual. When a question is not answered
by [`design-language.md`](./design-language.md), the answer is whatever cali.so
does. When you want to depart from it, that is a design decision: record it
under [Intentional deviations](#intentional-deviations) rather than letting the
two drift apart quietly.

Three files carry the preset:

| File | Role |
| --- | --- |
| `lib/theme-preset.ts` | The contract. Names every token the UI may depend on and pins the values that define the look. |
| `lib/theme-preset.test.ts` | The enforcement. Holds `app/globals.css` to the contract and fails the build when something drifts. |
| [`design-language.md`](./design-language.md) | The prose spec. How the tokens compose into components and choreography. |

`app/globals.css` is the implementation. It is the only place raw values
belong.

## Token cascade

Four layers, in order. Later layers win.

1. **Pre-hydration fallback** — `:root` and `.dark` carry the neutral shadcn
   ramp so the page is legible before the theme class lands.
2. **Working palette** — `.public-site` and `.dark.public-site` carry the warm
   paper ramp the site actually renders. Every semantic color resolves through
   `--gray-1` … `--gray-12` here.
3. **Design-language tokens** — `:root` carries motion, elevation, weight,
   layout, and layer tokens that do not change between themes.
4. **Component scope** — a handful of components narrow tokens locally
   (`.quiet-selection` softens hover, `.room-shelf` adds wood).

Dark mode inverts the ramp. It does not restate twenty semantic colors, and new
work should not make it start.

## Rules

**Color.** Use a semantic token (`--foreground`, `--muted-foreground`,
`--border`, `--surface-3`). Never a hex, and never a raw `--gray-N` in a
component — the ramp is the palette's private implementation. `--signal` is the
single accent the design spends; using it twice on one screen spends it twice.

**Motion.** Two families and nothing else. `--ease-swift` at 150–200ms for
chrome, `--ease-spring` at 300–350ms for anything meant to read as a physical
object. No ad-hoc cubic-beziers. Animate `transform` and `opacity`. Every
motion needs a `prefers-reduced-motion` branch.

**Type.** Geist for text, Geist Mono for anything machine-set — labels, spec
plates, counts, stamps. Three weights: 400, 500, 600. Chrome sits at 14px with
`-0.011em`. Anything that counts gets `tabular-nums`.

**Layout.** The page column is `--content-column`, reached through
`max-w-content` (or `max-w-content-narrow` for the inner measure). A literal
width in a component desynchronises the shell from the ambient guides, so the
test suite rejects one.

**Radius.** Everything scales from `--radius`. Print-register corners are a flat
`2px`; pills are `999px`. Nothing in between.

**Elevation.** Go through `lib/surface-classes.ts`. Card edges prefer
`box-shadow: 0 0 0 1px` over a border so they stay crisp at any density.

## Pinned values

`lib/theme-preset.ts` is the source; these are the ones a change would be most
visible in.

```css
--ease-swift: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-route-morph: 320ms;
--radius: 0.625rem;
--border-hairline: 1px;      /* 0.5px above 192dpi */
--content-column: 42rem;
--content-column-narrow: 38.5rem;
--z-nav: 100;  --z-card: 200;  --z-toast: 300;
```

## Intentional deviations

Everything else should match cali.so.

| Token | Upstream | Cleo | Why |
| --- | --- | --- | --- |
| `--font-sans` | Geist, then Frex Sans GB for CJK | Geist only | Cleo is English-only, so the CJK face is dead weight. |
| `--content-column` | `37.5rem` | `42rem` | The drafting guide borders came off, so the column can open wider without reading as a boxed frame. |
| `--maps-space` | warm paper ramp on every public surface | orbital black stage tokens | `/maps` is a full-bleed 3D Earth view; paper gray would flatten the globe. |

## Changing the preset

1. Edit the pinned value in `lib/theme-preset.ts`.
2. Edit `app/globals.css` to match.
3. Run `pnpm test:unit`. The preset test fails on any token it can no longer
   find or that no longer matches.
4. If the change departs from cali.so, add a row to the deviations table above
   and to `presetDeviations` in `lib/theme-preset.ts`.
