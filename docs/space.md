# Space

Space pages at `/space` and `/space/[slug]`. Catalog in `lib/space.ts`:
Solar System, Moons, Deep Space (planets, major moons, ISS, galaxies, nebulae;
thirty-three subjects). Topics catalog lists Space alongside Countries
(`lib/topics.ts`).

## Map

| Piece | Path |
| --- | --- |
| Guide definitions | `lib/space.ts` |
| Photo manifest | `content/space-photos.json` |
| Public JPEGs | `public/images/space/{slug}/` |
| Gallery unification | `lib/gallery.ts` |
| Review contact sheets | `tsx scripts/atlas/contact-sheet.mjs --collection=space` |

## Photo pipeline

Three curated NASA images per subject.

```bash
pnpm curate:space-photos
pnpm import:space-photos
pnpm validate:space
```

After space (or atlas) imports change caption or rendition metadata:

```bash
pnpm generate:cleo-topic-photo-zoom
```

## Serving rules

Same as atlas: static JPEGs, browser `srcset`, no runtime image CDN or
`/_next/image` re-encode. Gallery shows the editor-selected featured photo;
guides and Cleo retain all three views.

## Verify

```bash
pnpm validate:space
```
