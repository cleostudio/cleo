# Cities

Cities pages at `/cities` and `/cities/[slug]`. Catalog in `lib/cities.ts`:
capitals and route cities across Mediterranean & Europe, Asia, and Africa &
Americas — about, signature sites, facts, sources, and curated
photographs (twenty-six cities). Topics catalog lists Cities alongside Countries,
Space, Civilizations, Oceans, and Rivers (`lib/topics.ts`).

## Map

| Piece | Path |
| --- | --- |
| Guide definitions | `lib/cities.ts` |
| Photo manifest | `content/cities-photos.json` |
| Photo sources | `scripts/cities/cities-photo-sources.json` |
| Public JPEGs | `public/images/cities/{slug}/` |
| Gallery unification | `lib/gallery.ts` |

## Photo pipeline

Three curated Wikimedia Commons images per guide.

```bash
pnpm import:cities-photos
pnpm validate:cities
```

After cities (or atlas/space/civilizations) imports change caption or rendition
metadata:

```bash
pnpm generate:cleo-topic-photo-zoom
```

## Serving rules

Same as atlas/space/civilizations: static JPEGs, browser `srcset`, no runtime
image CDN or `/_next/image` re-encode. Gallery shows the editor-selected
featured photo; guides and Cleo retain all three views. Credit links point at
Wikimedia Commons (licenses vary: PD, CC0, CC BY, CC BY-SA).

Fact-plate Explore names deep-link to `/explore/[slug]` via exact country
catalog names.

## Verify

```bash
pnpm validate:cities
```
