/**
 * Assembles the lean homepage search catalog from Explore, Space, Topics, Maps,
 * and portal surfaces. Import from Server Components only.
 */

import { countries } from '~/lib/countries'
import { MAP_REGION_IDS, mapCountryHref, mapRegionHref } from '~/lib/maps'
import type { SiteSearchHit } from '~/lib/site-search'
import { spaceSubjects } from '~/lib/space'
import { allTopics } from '~/lib/topics'

const MAP_REGION_TITLES: Record<(typeof MAP_REGION_IDS)[number], string> = {
  africa: 'Africa',
  americas: 'Americas',
  asia: 'Asia',
  europe: 'Europe',
  oceania: 'Oceania',
}

const PORTAL_SURFACES: Omit<SiteSearchHit, 'id' | 'searchText'>[] = [
  {
    kind: 'surface',
    title: 'Maps',
    subtitle: 'Earth map',
    href: '/maps',
  },
  {
    kind: 'surface',
    title: 'Gallery',
    subtitle: 'Photographs',
    href: '/gallery',
  },
  {
    kind: 'surface',
    title: 'Ask Cleo',
    subtitle: 'AI agent',
    href: '/cleo',
  },
  {
    kind: 'surface',
    title: 'Writing',
    subtitle: 'Essays',
    href: '/blog',
  },
]

function haystack(...parts: string[]): string {
  return parts
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .join(' ')
}

function exploreHits(): SiteSearchHit[] {
  return countries.map((country) => ({
    id: `explore:${country.slug}`,
    kind: 'explore',
    title: country.name,
    subtitle: `${country.code} · ${country.region}`,
    href: `/explore/${country.slug}`,
    searchText: haystack(
      country.name,
      country.code,
      country.region,
      country.subregion,
      'country',
      'explore',
    ),
  }))
}

/** Country / region deep links into Maps — ranked below Explore guides. */
function mapsHits(): SiteSearchHit[] {
  const countryHits = countries.map((country) => ({
    id: `maps:country:${country.slug}`,
    kind: 'maps' as const,
    title: country.name,
    subtitle: `On the map · ${country.code}`,
    href: mapCountryHref(country.slug),
    searchText: haystack(
      country.name,
      country.code,
      country.region,
      country.subregion,
      'on the map',
    ),
  }))

  const regionHits = MAP_REGION_IDS.map((id) => {
    const title = MAP_REGION_TITLES[id]
    return {
      id: `maps:region:${id}`,
      kind: 'maps' as const,
      title,
      subtitle: 'Maps · Region',
      href: mapRegionHref(id),
      searchText: haystack(title, id, 'maps', 'region', 'continent', 'earth'),
    }
  })

  return [...regionHits, ...countryHits]
}

function spaceHits(): SiteSearchHit[] {
  return spaceSubjects.map((subject) => ({
    id: `space:${subject.slug}`,
    kind: 'space',
    title: subject.name,
    subtitle: `${subject.code} · ${subject.category}`,
    href: `/space/${subject.slug}`,
    searchText: haystack(
      subject.name,
      subject.code,
      subject.category,
      subject.facts.kind,
      subject.subtitle,
      'space',
    ),
  }))
}

function topicHits(): SiteSearchHit[] {
  return allTopics().map((topic) => ({
    id: `topic:${topic.slug}`,
    kind: 'topic',
    title: topic.name,
    subtitle: topic.tally,
    href: topic.href,
    searchText: haystack(topic.name, topic.description, topic.tally, 'topic'),
  }))
}

function surfaceHits(): SiteSearchHit[] {
  return PORTAL_SURFACES.map((surface) => ({
    ...surface,
    id: `surface:${surface.href}`,
    searchText:
      surface.href === '/maps'
        ? haystack(
            surface.title,
            surface.subtitle,
            surface.kind,
            'earth',
            'globe',
            'atlas',
            'blue marble',
          )
        : haystack(surface.title, surface.subtitle, surface.kind),
  }))
}

/** Full static catalog for the homepage search typeahead. */
export function buildSiteSearchHits(): SiteSearchHit[] {
  return [
    ...topicHits(),
    ...exploreHits(),
    ...mapsHits(),
    ...spaceHits(),
    ...surfaceHits(),
  ]
}
