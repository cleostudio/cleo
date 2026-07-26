# Asset sources

Source record for promotional taste-shelf artwork and curated knowledge-portal
photographs.

## Country place photographs

One curated photograph per Explore country, matched to the featured place in
`scripts/atlas/country-facts.json`. Sources are curated from Wikimedia Commons
(`pnpm curate:atlas-photos` → `scripts/atlas/atlas-photo-sources.json`, with
manual fixes in `atlas-photo-overrides.json`) and imported locally with
`pnpm import:atlas-photos`. Runtime serves JPEGs under
`public/images/atlas/{slug}/`. Keep on-page photographer credit, license, and
source link (typically CC BY / CC BY-SA / public domain).

## Space photographs

One curated NASA image per Space guide. Import-time only via
`pnpm import:space-photos` (sources in `scripts/space/space-photo-sources.json`);
runtime serves local JPEGs under `public/images/space/{slug}/`. Originals stay
in `.space-originals/` (gitignored). NASA material is used under NASA’s media
guidelines as public-domain U.S. government work unless a specific credit notes
otherwise — keep the on-page credit and source link.

| Slug | NASA id | Feature |
| --- | --- | --- |
| `sun` | GSFC_20171208_Archive_e002035 | Full-disk Sun (SDO) |
| `mercury` | PIA13823 | Mercury in color |
| `venus` | PIA00159 | Venus hemisphere |
| `earth` | GSFC_20171208_Archive_e001386 | Blue Marble |
| `moon` | as11-44-6667 | Full Moon (Apollo 11) |
| `mars` | PIA00407 | Global color view |
| `jupiter` | PIA21775 | Great Red Spot |
| `saturn` | PIA17172 | The Day the Earth Smiled |
| `uranus` | PIA18182 | Uranus from Voyager 2 |
| `neptune` | PIA01492 | Neptune full disk |
| `pluto` | PIA19937 | Pluto in true color |
| `asteroid-belt` | PIA20348 | Ceres from Dawn |
| `milky-way` | PIA03653 | Galactic center |
| `andromeda` | GSFC_20171208_Archive_e000839 | Andromeda panorama |
| `io` | PIA00583 | Global view of Io |
| `europa` | PIA19048 | Europa's icy surface |
| `ganymede` | PIA00716 | Ganymede in color |
| `titan` | PIA14913 | Titan's orange and blue hazes |
| `enceladus` | PIA17202 | Approaching Enceladus |
| `iss` | iss01-389-023 | ISS flyaround |
| `orion-nebula` | PIA01322 | Heart of the Orion Nebula |
| `crab-nebula` | PIA03606 | Crab Nebula |
| `carina-nebula` | GSFC_20171208_Archive_e002076 | Carina Nebula landscape |

## Oceans photographs

One curated NASA image per Oceans guide. Import-time only via
`pnpm import:ocean-photos` (sources in `scripts/oceans/ocean-photo-sources.json`);
runtime serves local JPEGs under `public/images/oceans/{slug}/`. Originals stay
in `.ocean-originals/` (gitignored). Same NASA media guidelines as Space.

| Slug | NASA id | Feature |
| --- | --- | --- |
| `world-ocean` | PIA00152 | Global ocean from deep space |
| `pacific` | PIA18033 | Pacific Ocean chlorophyll mosaic |
| `atlantic` | PIA02455 | Atlantic surface winds |
| `indian` | GSFC_20171208_Archive_e001414 | Kerguelen in the southern Indian Ocean |
| `southern` | iss065e214231 | Southern Ocean ice edge |
| `arctic` | PIA18034 | Warm rivers meeting Arctic sea ice |
| `mediterranean` | s66-45749 | Strait of Gibraltar and the Mediterranean |
| `caribbean` | iss013e27590 | Caribbean Sea from orbit |
| `red-sea` | 41g-120-180 | Sinai Peninsula and the Red Sea |
| `baltic` | iss066e116300 | Baltic Sea winter ice |
| `bering` | GSFC_20171208_Archive_e000948 | Turbulent Bering Sea |
| `south-china-sea` | s07-05-245 | Internal waves, South China Sea |
| `gulf-of-mexico` | as07-05-1635 | Gulf of Mexico and Yucatán coast |
| `coral-sea` | S32-520-014 | Western Coral Sea and Great Barrier Reef |

## Taste shelf

Source record for the album and book assets added in July 2026. Cover images
are promotional artwork from Apple Music, publishers, authors, or retailers.

## Product marks

| File | Source |
| --- | --- |
| `public/images/codex.svg` | User-supplied Codex product mark |
| `public/images/products/ats.svg` | User-supplied ZATS product source mark |
| `public/images/products/control.svg` | User-supplied Control product source mark |
| `public/images/products/dex.svg` | User-supplied Dex brand source mark |
| `public/images/products/slack.svg` | Slack’s official site-navigation [standalone SVG](https://a.slack-edge.com/38f0e7c/marketing/img/nav/logo.svg) |
| `public/images/products/app-store.svg` | [SVG Logos](https://github.com/gilbarbara/logos) CC0 vector for the App Store mark |

### External mark review

_First-party sources reviewed 2026-07-22. These are sourcing decisions, not a
general license to reuse the marks._

The Slack mark keeps the colors and geometry from Slack’s own navigation asset.
See the [Slack media kit](https://slack.com/media-kit) and
[brand terms](https://slack.com/terms-of-service/slack-brand) for usage rules.

Apple does not provide a general-purpose inline App Store SVG. The vector used
here comes from the CC0 SVG Logos collection and is used as a small editorial
reference, not as Apple marketing artwork. Apple retains its trademark rights;
see the [App Store identity guidelines](https://developer.apple.com/app-store/marketing/guidelines/)
and [Apple trademark guidelines](https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html).

## Album covers

| File | Source |
| --- | --- |
| `public/images/records/trench.jpg` | [Apple Music](https://music.apple.com/us/album/trench/1422828208) |
| `public/images/records/clancy.jpg` | [Apple Music](https://music.apple.com/us/album/clancy/1733370881) |
| `public/images/records/tim.jpg` | [Apple Music](https://music.apple.com/us/album/tim/1462628887) |
| `public/images/records/the-fall-off.jpg` | [Apple Music](https://music.apple.com/us/album/the-fall-off/1875080726) |
| `public/images/records/hope.jpg` | [Apple Music](https://music.apple.com/us/album/hope/1670412644) |
| `public/images/records/breach.jpg` | [Apple Music](https://music.apple.com/us/album/breach/1827507396) |
| `public/images/records/melodie.jpg` | [Apple Music](https://music.apple.com/us/album/melodie/1806154705) |
| `public/images/records/after-hours.jpg` | [Apple Music](https://music.apple.com/us/album/after-hours/1499378108) |
| `public/images/records/2001.jpg` | [Apple Music](https://music.apple.com/us/album/2001/1440782221) |
| `public/images/records/death-of-slim-shady.jpg` | [Apple Music](https://music.apple.com/us/album/the-death-of-slim-shady-coup-de-gr%C3%A2ce/1755022177) |
| `public/images/records/starboy.jpg` | [Apple Music](https://music.apple.com/us/album/starboy/1440870373) |
| `public/images/records/random-access-memories.jpg` | [Apple Music](https://music.apple.com/us/album/random-access-memories/617154241) |
| `public/images/records/hurry-up-tomorrow.jpg` | [Apple Music](https://music.apple.com/us/album/hurry-up-tomorrow/1793702595) |
| `public/images/records/urban-flora.jpg` | [Apple Music](https://music.apple.com/us/album/urban-flora/982629045) |

## Book covers

| Book | Cover source |
| --- | --- |
| The Creative Act | [Penguin Random House](https://images4.penguinrandomhouse.com/cover/9780593652886) |
| Rework | [Basecamp](https://basecamp.com/assets/images/books/rework.png) |
| Grid Systems in Graphic Design | [Niggli](https://niggli.ch/en/products/rastersysteme-fur-die-visuelle-gestaltung) |
| Make Something Wonderful: Steve Jobs in His Own Words | [Steve Jobs Archive](https://book.stevejobsarchive.com/) |
| How to American | [Hachette](https://www.hachettebookgroup.com/titles/jimmy-o-yang/how-to-american/9780306903502/) |
| The Great CEO Within | [Amazon](https://www.amazon.com/Great-CEO-Within-Tactical-Building/dp/0578599287) |
| Just Enough Design | [Chronicle Books](https://www.chroniclebooks.com/products/just-enough-design-pb) |
| Refactoring UI | [Refactoring UI](https://refactoringui.com/) |
| The Subtle Art of Not Giving a F*ck | [HarperCollins](https://www.harpercollins.com/products/the-subtle-art-of-not-giving-a-fck-mark-manson) |
| Hustle Harder, Hustle Smarter | [HarperCollins](https://www.harpercollins.com/products/hustle-harder-hustle-smarter-curtis-50-cent-jackson) |
| Build | [HarperCollins](https://www.harpercollins.com/products/build-tony-fadell) |
| Sword of Destiny | [Orbit / Hachette](https://www.hachettebookgroup.com/titles/andrzej-sapkowski/sword-of-destiny/9780316389716/) |
| Universal Principles of UX | [Quarto](https://www.quarto.com/books/9780760378045/universal-principles-of-ux) |
| Steal Like an Artist | [Workman / Hachette](https://workman.com/titles/austin-kleon/steal-like-an-artist/9780761169253/) |
| Show Your Work! | [Workman / Hachette](https://workman.com/titles/austin-kleon/show-your-work/9780761178972/) |
