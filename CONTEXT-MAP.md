# Context Map

Cleo (v3) contexts. System-wide ADRs live in `docs/adr/`. Site status:
`docs/handoff.md`.

## Active contexts

- **Portal** — Homepage country search, highlighted places, topic discovery
- **Content** — MDX Writing under `content/blog/` (future encyclopedia layer);
  archived newsletters under `content/newsletters/`
- **Explore / Gallery** — Country field guides and place photographs from
  `content/atlas.json` + `public/images/atlas/`; Gallery also includes Space
  and Oceans photographs via `lib/gallery.ts`
- **Topics** — Catalog of countries, space, and oceans (`/topics`;
  `/projects` redirects here)
- **Space** — Solar System, Moons, and Deep Space field guides (`/space`,
  `/space/[slug]`) with NASA photos in `content/space-photos.json` +
  `public/images/space/`; Sky atlas companion at `/sky`
- **Oceans** — World Ocean, basins, and seas field guides (`/oceans`,
  `/oceans/[slug]`) with NASA photos in `content/ocean-photos.json` +
  `public/images/oceans/`
- **Cleo agent** — OpenAI Responses API at `/cleo` and `/api/responses`
  (`lib/cleo/`, `components/cleo/`)

## Design

The UI/UX theme is inherited from
[cali.so](https://github.com/CaliCastle/cali.so), which Cleo forks.
`docs/theme-preset.md` is the enforced token contract, `lib/theme-preset.ts`
holds it as data, and `docs/design-language.md` is the full visual spec.

## Removed contexts

AMA Booking, Media Library, owner admin (Clerk), Neon/Postgres, rate-limit
backends, and related ADRs/docs were deleted. Do not restore them without an
explicit product decision. OpenAI is the only third-party API.

## Retained for reuse

Projects UI, vinyl/bookshelf, and social card components remain in the repo
but are not mounted in the public chrome.
