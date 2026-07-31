# Homepage search

One field searches the whole portal and can hand the question to Cleo.

## Map

| Piece | Path | Notes |
| --- | --- | --- |
| Catalog | `lib/site-search-catalog.ts` | Server Components only |
| Engine | `lib/site-search.ts` | Client-safe, pure |
| UI | `components/home-site-search.tsx` | Grouped ARIA combobox |
| Ask handoff | `lib/cleo/ask-link.ts` | Builds `/cleo?q=…` |
| Photo tile ids | `lib/gallery.ts` → `galleryItemDomId` | Deep-link target |
| Tile ring | `components/place-gallery-target.tsx` | App Router hash push workaround |
| Visual contract | [`design-language.md`](./design-language.md) § Homepage search | Plate, groups, selective focus |

## Catalog

Indexes topic collections, every country guide, every Space guide, the
editor-selected photograph per subject, every Writing post, and portal surfaces.

Keep hits thin:

- `keywords` holds only terms the title and subtitle miss
- Kind vocabulary ("photograph", "essay") is indexed on the client

## Engine

`lib/site-search.ts`:

- Folds accents; drops function words
- Scores each query token against titles / initialisms / keywords
- Tolerates one typo in words of five letters or more
- Gates the tail on coverage and minimum relevance
- Returns matched title ranges for UI emphasis
- Exports `looksLikeCleoRequest` for question-shaped queries

## UI behavior

- Keyboard navigation; `/` and Cmd/Ctrl-K focus
- Ask Cleo row: last for a lookup, first for a question
- Return opens the highlighted row
- Cmd/Ctrl-Return always asks Cleo
- Photo results deep-link to their gallery tile via `galleryItemDomId`
  (`components/place-gallery.tsx` renders the id). Browsers do not recompute
  `:target` for App Router hash pushes — `place-gallery-target.tsx` rings the
  arriving tile (CSS alone only marks cold loads).

## Handoff

`AskForm` reads `q` from `location` on mount, asks once, strips the parameter.
See [`cleo.md`](./cleo.md) § `/cleo?q=…` handoff.

## Verify

- `lib/site-search.test.ts`
- `components/home-site-search.test.tsx`
- `lib/cleo/ask-link.test.ts`
- Manual: typing, arrow keys, Ask Cleo row, Cmd/Ctrl-Return, photo → gallery ring
