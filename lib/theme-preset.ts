/**
 * The Cleo theme preset.
 *
 * Cleo is a fork of cali.so and inherits its visual system wholesale. This
 * module is the machine-checkable half of `docs/theme-preset.md`: it names the
 * tokens the UI is allowed to depend on and pins the values that define the
 * look. `lib/theme-preset.test.ts` holds `app/globals.css` to it, so the
 * preset stays a contract rather than a description that drifts.
 *
 * Add a token here before using it in a component. Change a pinned value only
 * as a deliberate design decision, and record it under `presetDeviations`.
 */

export const THEME_PRESET_UPSTREAM = 'https://github.com/CaliCastle/cali.so'

/**
 * Semantic colors every surface resolves through. Each one maps onto the gray
 * ramp rather than carrying its own value, which is what lets dark mode invert
 * the ramp instead of restating twenty colors. Never use a raw hex.
 */
export const semanticColorTokens = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--border',
  '--input',
  '--ring',
  '--focus-ring',
] as const

/**
 * The only chromatic semantics. `--destructive` stays off the ramp because a
 * warning has to read as a warning, and `--signal` is the single accent the
 * print vocabulary is allowed to spend.
 */
export const chromaticTokens = ['--destructive', '--signal'] as const

/**
 * Warm paper gray ramp. 1 is the page, 12 is the ink; both themes define the
 * full ramp and dark flips it rather than recolouring semantics one by one.
 */
export const paletteRamp = Array.from(
  { length: 12 },
  (_, index) => `--gray-${index + 1}` as const,
)

/** Bespoke tokens the print-shop vocabulary depends on. */
export const editorialTokens = [
  '--ghost-ink',
  '--selection-highlight',
  '--paper',
  '--paper-ink',
] as const

/** Eight-step elevation ladder, consumed through `lib/surface-classes.ts`. */
export const surfaceLadder = Array.from(
  { length: 8 },
  (_, index) => `--surface-${index + 1}` as const,
)

/**
 * Two motion families: `swift` for UI chrome, `spring` for anything that
 * should read as a physical object. Pinned because an eased curve is the most
 * recognisable part of the system and the easiest to nudge by accident.
 */
export const motionTokens = {
  '--ease-swift': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  '--ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  '--duration-route-morph': '320ms',
  '--duration-post-meta': '250ms',
  '--delay-post-body': '520ms',
} as const

/** Geist ships three weights. Anything heavier is off-preset. */
export const typeWeightTokens = {
  '--font-weight-normal': '400',
  '--font-weight-medium': '500',
  '--font-weight-semibold': '600',
} as const

/**
 * Page geometry. Read through `max-w-content` / `max-w-content-narrow` or
 * `var(--content-column)`; a literal width in a component desynchronises the
 * shell from the ambient guides.
 */
export const layoutTokens = {
  '--content-column': '42rem',
  '--content-column-narrow': '38.5rem',
  '--radius': '0.625rem',
  '--border-hairline': '1px',
} as const

/** Fixed stacking order. Chrome, then floating cards, then transient notices. */
export const layerTokens = {
  '--z-nav': '100',
  '--z-card': '200',
  '--z-toast': '300',
} as const

/**
 * Where Cleo intentionally departs from cali.so. Everything not listed here
 * should match upstream, and the test suite enforces that for the pinned
 * tokens above.
 */
export const presetDeviations = [
  {
    reason: 'Cleo is English-only, so the CJK fallback face is not loaded.',
    token: '--font-sans',
    upstream: 'Geist followed by Frex Sans GB for CJK coverage',
  },
  {
    reason:
      'The drafting guide borders came off, so the column can open wider without reading as a boxed frame.',
    token: '--content-column',
    upstream: '37.5rem',
  },
  {
    reason:
      '/world is an orbital black stage for the 3D Earth; it uses local --world-* tokens instead of the paper ramp.',
    token: '--world-space',
    upstream: 'warm paper gray ramp on every public surface',
  },
] as const
