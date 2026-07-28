/**
 * Assembles the lean homepage search catalog from Explore, Space, Topics, Maps,
 * Writing, and portal surfaces. Import from Server Components only.
 */

import { getAllPosts } from '~/lib/content'
import { countries } from '~/lib/countries'
import {
  MAP_REGION_IDS,
  mapCapitalHref,
  mapCountryHref,
  mapRegionHref,
} from '~/lib/maps'
import { loadMapCountryIndex } from '~/lib/maps-index'
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
  const index = loadMapCountryIndex()
  const capitalByCode = new Map(
    index.countries
      .filter((entry) => entry.capitalName)
      .map((entry) => [entry.code, entry.capitalName!] as const),
  )

  return countries.map((country) => {
    const capital = capitalByCode.get(country.code) ?? ''
    return {
      id: `explore:${country.slug}`,
      kind: 'explore' as const,
      title: country.name,
      subtitle: capital
        ? `${country.code} · ${country.region} · ${capital}`
        : `${country.code} · ${country.region}`,
      href: `/explore/${country.slug}`,
      searchText: haystack(
        country.name,
        country.code,
        country.region,
        country.subregion,
        capital,
        'country',
        'explore',
        'capital',
      ),
    }
  })
}

function writingHits(): SiteSearchHit[] {
  return getAllPosts().map((post) => ({
    id: `writing:${post.slug}`,
    kind: 'writing' as const,
    title: post.titleEn || post.title,
    subtitle: 'Writing',
    href: `/blog/${post.slug}`,
    searchText: haystack(
      post.title,
      post.titleEn,
      post.slug,
      post.descriptionEn ?? post.description ?? '',
      'writing',
      'essay',
      'blog',
    ),
  }))
}

/** Country / region / territory deep links into Maps — ranked below Explore guides. */
function mapsHits(): SiteSearchHit[] {
  const index = loadMapCountryIndex()
  const byCode = new Map(
    index.countries.map((entry) => [entry.code, entry] as const),
  )

  const countryHits = countries.map((country) => {
    const entry = byCode.get(country.code)
    const capitalName = entry?.capitalName
    return {
      id: `maps:country:${country.slug}`,
      kind: 'maps' as const,
      title: country.name,
      subtitle: capitalName
        ? `On the map · ${country.code} · ${capitalName}`
        : `On the map · ${country.code}`,
      href: mapCountryHref(country.slug),
      searchText: haystack(
        country.name,
        country.code,
        country.region,
        country.subregion,
        capitalName ?? '',
        'on the map',
      ),
      ...(entry && capitalName
        ? {
            capitalName,
            capitalHref: mapCapitalHref(country.slug, entry),
          }
        : {}),
    }
  })

  const territoryHits = index.countries
    .filter((entry) => !entry.slug)
    .map((entry) => ({
      id: `maps:territory:${entry.code.toLowerCase()}`,
      kind: 'maps' as const,
      title: entry.name,
      subtitle: entry.capitalName
        ? `On the map · ${entry.code} · ${entry.capitalName}`
        : `On the map · ${entry.code}`,
      href: mapCountryHref(entry.code),
      searchText: haystack(
        entry.name,
        entry.code,
        entry.region ?? '',
        entry.capitalName ?? '',
        'on the map',
        'territory',
      ),
      ...(entry.capitalName
        ? {
            capitalName: entry.capitalName,
            capitalHref: mapCapitalHref(entry.code, entry),
          }
        : {}),
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

  return [...regionHits, ...countryHits, ...territoryHits]
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
    ...spaceHits(),
    ...writingHits(),
    ...mapsHits(),
    ...surfaceHits(),
  ]
}
