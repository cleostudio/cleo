# Explore / atlas (countries)

Country pages at `/explore/[slug]`. One record per slug in
`content/atlas.json`. About prose is curated, not generated at build or
request time — the site never calls a model to render a page.

## Map

| Piece | Path |
| --- | --- |
| Manifest | `content/atlas.json` |
| About prose corpus | `scripts/atlas/atlas-about.json` |
| Prose uniqueness bar | `lib/atlas/prose.test.ts` |
| Atlas lib | `lib/atlas/*`, `lib/countries.ts` |
| Public JPEGs | `public/images/atlas/{slug}/` |
| Originals (gitignored) | `.atlas-originals/` |
| Handpicked search gaps | `scripts/atlas/gallery-handpicks/` |
| Review contact sheets | `tsx scripts/atlas/contact-sheet.mjs --collection=places` |

## Prose

Written once with `pnpm write:atlas-about` (needs `OPENAI_API_KEY`). Every draft
is checked for length, recycled phrasing, and volatile claims before it is
kept. `lib/atlas/prose.test.ts` enforces: no sentence of six or more words may
appear in two countries.

## Photo pipeline

Three distinct, accurate Wikimedia Commons place photos per country.

```bash
pnpm generate:atlas-content    # assemble manifest
pnpm curate:atlas-photos       # Commons curation (relevance-first + assessments)
pnpm apply:atlas-handpicks     # reviewed gaps when scoring still misses
pnpm import:atlas-photos       # optimized local JPEG renditions
pnpm validate:atlas            # required before deploying image/manifest changes
```

After atlas (or space) imports change caption or rendition metadata:

```bash
pnpm generate:cleo-topic-photo-zoom
```

## Serving rules

- Renditions up to 640 / 1280 / 2048px, never falsely upscaled
- Browser `srcset` from static files — no account, CDN, or `/_next/image`
  re-encode at runtime
- Gallery shows the editor-selected featured photograph; guides and Cleo keep
  all three curated views

## Verify

```bash
pnpm validate:atlas
pnpm test:unit   # includes lib/atlas/*.test.ts and prose uniqueness
```
