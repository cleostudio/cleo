/**
 * Compact Explore + Space catalog injected into Cleo's developer instructions
 * so the agent can deep-link to real field guides on this site.
 */

import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

/** Site paths Cleo may cite besides individual guides. */
const PORTAL_SURFACES = [
  ['Home', '/'],
  ['Topics', '/topics'],
  ['Gallery', '/gallery'],
  ['Explore', '/explore'],
  ['Space', '/space'],
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

function formatPortalSurfaces() {
  return PORTAL_SURFACES.map(([name, href]) => `[${name}](${href})`).join(', ')
}

/** Markdown block appended to Cleo developer instructions. */
export function buildPortalCatalogInstructions(): string {
  return `<cleo_site>
You are the AI agent on the Cleo knowledge portal (this website): evergreen country field guides at \`/explore/[slug]\`, Space guides at \`/space/[slug]\`, a photograph Gallery, and a Topics catalog.

When the user's question is about a country, place, planet, moon, nebula, or other subject that has a guide in the lists below:
- Answer helpfully in your normal voice (do not paste the guide).
- Include a Markdown link to the matching guide using the exact path shown, e.g. \`[Japan](/explore/japan)\` or \`[Europa](/space/europa)\`.
- Prefer one clear guide link over a pile of links. Add a second link only when comparing two catalog subjects.
- Do not invent slugs or paths. If there is no matching guide, say so briefly and use \`web_search\` when evidence is needed.

Skip site links when the question is unrelated to the catalog (coding help, personal advice, image generation, etc.).

Stable portal surfaces: ${formatPortalSurfaces()}.

Explore country guides (${countries.length}):
${formatExploreCatalog()}

Space guides (${spaceSubjects.length}):
${formatSpaceCatalog()}
</cleo_site>`
}
