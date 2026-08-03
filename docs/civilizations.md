# Civilizations

Civilizations pages at `/civilizations` and `/civilizations/[slug]`. Catalog in
`lib/civilizations.ts`: historical civilizations across Africa & Near East,
Mediterranean, Asia, the Americas, and Oceania — about, signature sites,
facts, sources, and curated photographs (thirty-two subjects). Explore fact-plate
names deep-link to `/explore/[slug]`. Topics catalog lists Civilizations
alongside Countries and Space (`lib/topics.ts`).

## Map

| Piece | Path |
| --- | --- |
| Subject definitions | `lib/civilizations.ts` |
| Photo manifest | `content/civilizations-photos.json` |
| Photo sources | `scripts/civilizations/civilizations-photo-sources.json` |
| Public JPEGs | `public/images/civilizations/{slug}/` |
| Gallery unification | `lib/gallery.ts` |

## Photo pipeline

Three curated Wikimedia Commons images per guide.

```bash
pnpm import:civilizations-photos
pnpm validate:civilizations
```

After civilizations (or atlas/space) imports change caption or rendition
metadata:

```bash
pnpm generate:cleo-topic-photo-zoom
```

## Serving rules

Same as atlas/space: static JPEGs, browser `srcset`, no runtime image CDN or
`/_next/image` re-encode. Gallery shows the editor-selected featured photo;
topic pages and Cleo retain all three views. Credit links point at Wikimedia Commons
(licenses vary: PD, CC0, CC BY, CC BY-SA).

## Verify

```bash
pnpm validate:civilizations
```
