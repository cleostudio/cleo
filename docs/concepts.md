# Product concepts

Candidate shelves and surfaces for Cleo beyond the shipped Countries / Space
portal. Current as of July 2026.

**Already in flight (do not reopen here):** interactive Earth Maps (`#50`,
`#51`); Writing portal essays (`#53`).

## Fit rubric

A concept earns a shelf when it can ship with the same contract as Explore and
Space:

| Constraint | Requirement |
| --- | --- |
| Form | Evergreen field guide: orientation prose, compact facts, three notable features, sources, one curated photograph |
| Prose | Hand-curated once (OpenAI drafting tools OK offline); never generated at build or request time; unique sentences across the corpus |
| Media | Import-time local JPEGs under `public/images/…` with on-page credit; no runtime CDN or third-party fetch |
| Runtime APIs | OpenAI only (Cleo). No auth, database, or new SaaS for the public site |
| Portal wiring | Topics row, Gallery unification when photos exist, Cleo catalog deep-links + topic-photo grounding |
| Tone | Neutral knowledge portal — not personal taste shelves, not news, not volatile rankings |

Score each idea **Fit / Leverage / Effort** (H/M/L). Prefer high fit + high
leverage before large catalogs.

## Recommended order

1. **Oceans** — next full topic shelf
2. **Sky atlas** — Space companion surface (not a third topic yet)
3. **Compare** — amplifies existing guides without new corpus
4. **Biomes** — Earth shelf that bridges Maps + Countries
5. **Elements** — first hard-science shelf once Oceans proves the template
6. **Capitals** — nested Explore depth, not a separate Topics peer at first
7. **Constellations** — after Sky atlas interaction lands

Parked below: animals mega-catalog, music/books remount, live weather, user
accounts.

---

## 1. Oceans — `/oceans/[slug]`

**Pitch.** Evergreen primers for the world ocean and major seas — the natural
third shelf after land (Countries) and sky (Space).

**Starter catalog (~12–16 guides).** World Ocean overview; Pacific, Atlantic,
Indian, Southern, Arctic; Mediterranean, Caribbean, South China Sea, Red Sea,
Baltic, Bering; optionally Gulf of Mexico, Coral Sea.

**Guide shape.** Reuse Space’s fact plate more than Explore’s:
`kind` (ocean / sea / gulf), `areaKm2`, `meanDepthM`, `maxDepthM`,
`bordering` (linkable country slugs), three features (currents, trenches,
basins), sources (NOAA, UNESCO, Britannica-class references).

**Media.** NOAA / NASA ocean-color and bathymetry stills; Wikimedia Commons
where license-clear. Pipeline mirrors Space:
`pnpm import:ocean-photos` → `content/ocean-photos.json` →
`public/images/oceans/{slug}/`.

**Portal hooks.** Topics row; Gallery filter; homepage topic discovery;
Cleo catalog + topic photos; Maps deep-link once Maps ships
(`/maps?ocean=` or coastal country focus).

| Fit | Leverage | Effort |
| --- | H | H | M |

**Why first.** Same field-guide machinery, bounded catalog, strong Cleo Q&A
(“why is the Mediterranean saltier?”), and a clean Maps round-trip without
inventing a new content genre.

---

## 2. Sky atlas — `/sky`

**Pitch.** An interactive companion to Earth Maps: constellations, bright
stars, and deep-sky objects already covered (or soon covered) by Space guides.

**v1 surface (not a full topic catalog).** Full-bleed night chart for a fixed
epoch or simple “tonight from lat/lon” with **no live weather API** — either
static star catalog JSON vendored on-origin, or a single precomputed all-sky
tile set under `public/images/sky/`. Clicking Orion / Andromeda / Crab opens
the matching Space guide when one exists.

**Later shelf.** `/sky/[slug]` constellation primers only after the chart
proves useful; keep nebulae/galaxies on Space.

| Fit | Leverage | Effort |
| --- | H | H | M–H |

**Why now-ish.** Reuses the Maps interaction lesson; tightens Space ↔ portal
without another 195-entry corpus.

---

## 3. Compare — `/compare?a=&b=`

**Pitch.** Side-by-side fact plates for any two catalog subjects (two
countries, two Space bodies, later ocean vs ocean).

**v1.** Server-rendered table from existing `atlas.json` / `space.ts` fields;
shareable query URLs; Cleo may emit `/compare?a=japan&b=mars` only when both
slugs exist. No new prose corpus.

**UI.** Warm-paper plate, not a dashboard: two columns, shared row labels,
deep links to each guide and (when Maps exists) “view both on map” for
country pairs.

| Fit | Leverage | Effort |
| --- | H | H | L |

**Why early.** Highest leverage per line of code — teaches the portal’s
cross-link habit and gives Cleo a concrete “show them together” affordance.

---

## 4. Biomes — `/biomes/[slug]`

**Pitch.** Earth systems layer between Countries and Oceans: tundra, boreal
forest, temperate forest, grassland, desert, savanna, tropical rainforest,
mediterranean shrubland, freshwater wetland, montane, coral reef, ice sheet.

**Guide shape.** Climate summary (Köppen family, not forecasts), canonical
range, exemplar places (link Explore), exemplar waters (link Oceans when
present), three features, one landscape photograph.

**Media.** Wikimedia Commons / USGS / NASA Earth Observatory stills.

| Fit | Leverage | Effort |
| --- | H | M | M |

**Why after Oceans.** Needs the multi-topic linking story (country ↔ biome ↔
ocean) to feel like a portal rather than a second orphan index.

---

## 5. Elements — `/elements/[slug]`

**Pitch.** First laboratory-science shelf: periodic-table primers with the
same calm field-guide voice.

**Starter catalog.** Begin with ~20 high-signal elements (H, C, N, O, Na, Mg,
Al, Si, P, S, Cl, K, Ca, Fe, Cu, Ag, Au, Hg, Pb, U) rather than all 118.

**Guide shape.** Atomic number / symbol / group / standard state; three
durable uses or natural occurrences; avoid price charts and newsy scarcity
claims. Photograph: mineral specimen, emission tube, or historic lab
apparatus (license-clear).

| Fit | Leverage | Effort |
| --- | H | M | M |

**Why later.** Proves the template can leave geography; keep the first cut
small so prose uniqueness tests stay honest.

---

## 6. Capitals — nested Explore depth

**Pitch.** One capital primer per country, reached from the country guide
(`/explore/japan/tokyo` or `/explore/japan#capital`), not as a peer Topics
card until coverage is real.

**v1 scope.** Top ~40 capitals by recognition / photo quality, each with
orientation, elevation/population band (evergreen ranges), three places, one
city photograph. Remaining countries keep a capital fact row only.

**Risk.** Easy to sprawl into a second 195-guide obligation. Cap the v1 set
and treat the rest as “fact only.”

| Fit | Leverage | Effort |
| --- | H | M | H |

---

## 7. Constellations — `/sky/[slug]` (after Sky atlas)

**Pitch.** Cultural + observational primers (Orion, Ursa Major, Crux, …)
that deep-link contained Space objects (Betelgeuse later; Orion Nebula now).

**Catalog.** ~24 common constellations. Star charts as static SVG/JPEG plates,
not a live planetarium SDK.

| Fit | Leverage | Effort |
| --- | H | M | M |

---

## Amplifiers (not new Topics)

Small surfaces that make the existing corpus feel larger:

| Idea | Notes |
| --- | --- |
| **Gallery collections** | Curated sets (“Volcanic arcs”, “Icy moons”) as query presets on `/gallery` |
| **Guide “Neighbors”** | Country land neighbors; Space system siblings; Oceans bordering seas |
| **Cleo starter packs** | Topic-scoped empty-state prompts when arriving from `/topics` or a guide |
| **Writing ↔ guides** | Subject essays already in flight should always deep-link the shelf entry |
| **Ascii / dither media** | Design-language future candidate — visual polish, not a topic |

---

## Parked / non-goals

| Idea | Why parked |
| --- | --- |
| Animals / species mega-catalog | Catalog size and photo licensing overwhelm the one-photo-per-guide bar |
| Remount vinyl / bookshelf | Retained components are personal taste, not knowledge-portal shelves |
| Live weather, flight tracking, finance | Volatile; invites new APIs; fights evergreen prose rules |
| User accounts, saved trips, comments | Explicitly removed; needs a product decision + ADR reopen |
| News / “this week in space” | Ephemeral; Writing subject essays cover durable angles instead |
| Full Wikipedia mirror | Writing is the encyclopedia-shaped layer; guides stay short primers |

---

## Suggested research spikes (before build)

When picking the next build, open a short spike issue (or agent run) for
exactly one of:

1. **Oceans v0** — 3 sample guides (Pacific, Mediterranean, Southern) + photo
   import script + Topics row behind a flag, to validate prose + media + Cleo
   wiring.
2. **Compare v0** — country–country and planet–planet tables only; no new
   content files.
3. **Sky atlas v0** — static all-sky plate with 6 hotspots linking Space
   guides; defer lat/lon “tonight” math.

Success for a spike: one path a visitor can complete, one Cleo deep-link, and
`pnpm typecheck` green — not a full catalog.
