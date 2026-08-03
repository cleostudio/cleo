# Rivers

Rivers pages at `/rivers` and `/rivers/[slug]`. Catalog in `lib/rivers.ts`:
Africa, Asia, and Europe, Americas & Oceania — about, course features,
basin, hydrology, climate role, sources, and curated photographs (twenty-six
rivers). Topics catalog lists Rivers alongside Countries, Space, Civilizations,
Cities, and Oceans (`lib/topics.ts`).

## Map

| Piece | Path |
| --- | --- |
| Subject definitions | `lib/rivers.ts` |
| Photo manifest | `content/rivers-photos.json` |
| Photo sources | `scripts/rivers/rivers-photo-sources.json` |
| Public JPEGs | `public/images/rivers/{slug}/` |
| Gallery unification | `lib/gallery.ts` |

## Photo pipeline

Three curated Wikimedia Commons images per guide.

```bash
pnpm import:rivers-photos
pnpm validate:rivers
```

After rivers (or atlas/space/civilizations/cities/oceans) imports change caption
or rendition metadata:

```bash
pnpm generate:cleo-topic-photo-zoom
```

## Serving rules

Same as other topic shelves: static JPEGs, browser `srcset`, no runtime image
CDN or `/_next/image` re-encode. Gallery shows the editor-selected featured
photo; topic pages and Cleo retain all three views. Credit links point at Wikimedia
Commons (licenses vary: PD, CC0, CC BY, CC BY-SA).

Fact-plate Explore names deep-link to `/explore/[slug]` via exact country
catalog names along the course.

## Verify

```bash
pnpm validate:rivers
```
