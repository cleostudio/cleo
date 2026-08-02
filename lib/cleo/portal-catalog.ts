/**
 * Compact Explore + Space + Civilizations + Cities + Oceans catalog injected
 * into Cleo's developer instructions so the agent can deep-link to real field
 * guides.
 */

import { citySubjects } from '~/lib/cities'
import { civilizationSubjects } from '~/lib/civilizations'
import { countries } from '~/lib/countries'
import { oceanSubjects } from '~/lib/oceans'
import { spaceSubjects } from '~/lib/space'

/** Site paths Cleo may cite besides individual guides. */
const PORTAL_SURFACES = [
  ['Home', '/'],
  ['Topics', '/topics'],
  ['Gallery', '/gallery'],
  ['Explore', '/explore'],
  ['Space', '/space'],
  ['Civilizations', '/civilizations'],
  ['Cities', '/cities'],
  ['Oceans', '/oceans'],
] as const

function formatExploreCatalog() {
  return countries
    .map((country) => `${country.name} (/explore/${country.slug})`)
    .join('; ')
}

function formatSpaceCatalog() {
  return spaceSubjects
    .map((subject) => `${subject.name} (/space/${subject.slug})`)
    .join('; ')
}

function formatCivilizationsCatalog() {
  return civilizationSubjects
    .map((subject) => `${subject.name} (/civilizations/${subject.slug})`)
    .join('; ')
}

function formatCitiesCatalog() {
  return citySubjects
    .map((subject) => `${subject.name} (/cities/${subject.slug})`)
    .join('; ')
}

function formatOceansCatalog() {
  return oceanSubjects
    .map((subject) => `${subject.name} (/oceans/${subject.slug})`)
    .join('; ')
}

function formatPortalSurfaces() {
  return PORTAL_SURFACES.map(([name, href]) => `[${name}](${href})`).join(', ')
}

/** Markdown block appended to Cleo developer instructions. */
export function buildPortalCatalogInstructions(): string {
  return `<cleo_site>
You are the AI agent on the Cleo knowledge portal (this website): evergreen country field guides at \`/explore/[slug]\`, Space guides at \`/space/[slug]\`, Civilizations guides at \`/civilizations/[slug]\`, Cities guides at \`/cities/[slug]\`, Oceans guides at \`/oceans/[slug]\`, a photograph Gallery, and a Topics catalog.

When the user's question is about a country, place, planet, moon, nebula, civilization, city, ocean, or other subject that has a guide in the lists below:
- Answer helpfully in your normal voice (do not paste the guide).
- Weave one Markdown link into the answer using the exact path shown and a short subject-name label — e.g. link \`[Japan](/explore/japan)\`, \`[Europa](/space/europa)\`, \`[Ancient Egypt](/civilizations/ancient-egypt)\`, \`[Istanbul](/cities/istanbul)\`, or \`[Pacific Ocean](/oceans/pacific-ocean)\` on first mention. Do not use labels like "Explore guide", "Space field guide", "Civilizations field guide", "Cities field guide", or "Oceans field guide".
- Link each relevant guide at most once. Do not add a separate "see the guide", "fuller primer", or footer line that repeats the same link.
- When comparing two catalog subjects, link each name once in the body. Prefer prose or a compact list/table over a bare link dump.
- When a \`<cleo_topic_photos>\` block is present, you may include that subject's curated photograph as a Markdown image in the reply (see \`<images_and_vision>\`). Visual topic answers should often show the photo — not only link away.
- Do not invent slugs or paths. If there is no matching guide, say so briefly and use \`web_search\` when evidence is needed.

Skip site links when the question is unrelated to the catalog (coding help, personal advice, creative image generation with no catalog subject, etc.). Catalog topic answers may combine guide links with curated photos or \`image_generation\` as appropriate.

Stable portal surfaces: ${formatPortalSurfaces()}.

Explore country guides (${countries.length}):
${formatExploreCatalog()}

Space guides (${spaceSubjects.length}):
${formatSpaceCatalog()}

Civilizations guides (${civilizationSubjects.length}):
${formatCivilizationsCatalog()}

Cities guides (${citySubjects.length}):
${formatCitiesCatalog()}

Oceans guides (${oceanSubjects.length}):
${formatOceansCatalog()}
</cleo_site>`
}
