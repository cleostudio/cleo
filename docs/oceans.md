# Oceans

Oceans pages at `/oceans` and `/oceans/[slug]`. Catalog in `lib/oceans.ts`:
world ocean basins, major seas, and polar seas — about, features,
circulation, bathymetry, climate role, sources, and curated photographs
(twenty subjects). Topics catalog lists Oceans alongside Countries, Space,
Civilizations, Cities, and Rivers (`lib/topics.ts`).

## Map

| Piece | Path |
| --- | --- |
| Guide definitions | `lib/oceans.ts` |
| Photo manifest | `content/oceans-photos.json` |
| Photo sources | `scripts/oceans/oceans-photo-sources.json` |
| Public JPEGs | `public/images/oceans/{slug}/` |
| Gallery unification | `lib/gallery.ts` |

## Photo pipeline

Three curated Wikimedia Commons images per guide.

```bash
pnpm import:oceans-photos
pnpm validate:oceans
```

After oceans (or atlas/space/civilizations/cities) imports change caption or
rendition metadata:

```bash
pnpm generate:cleo-topic-photo-zoom
```

## Serving rules

Same as atlas/space/civilizations/cities: static JPEGs, browser `srcset`, no
runtime image CDN or `/_next/image` re-encode. Gallery shows the
editor-selected featured photo; guides and Cleo retain all three views. Credit
links point at Wikimedia Commons (licenses vary: PD, CC0, CC BY, CC BY-SA).

Fact-plate Explore names deep-link to `/explore/[slug]` via exact country
catalog names on the basin rim.

## Verify

```bash
pnpm validate:oceans
```
