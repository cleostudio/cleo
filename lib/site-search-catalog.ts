/**
 * Assembles the lean homepage search catalog from Explore, Space, Topics, and
 * portal surfaces. Import from Server Components only.
 */

import { countries } from '~/lib/countries'
import { placeGuides, placeHref } from '~/lib/places'
import type { SiteSearchHit } from '~/lib/site-search'
import { spaceSubjects } from '~/lib/space'
import { allTopics } from '~/lib/topics'

const PORTAL_SURFACES: Omit<SiteSearchHit, 'id' | 'searchText'>[] = [
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

function placeHits(): SiteSearchHit[] {
  return placeGuides.map((place) => ({
    id: `place:${place.slug}`,
    kind: 'place',
    title: place.name,
    subtitle: `${place.code} · ${place.kind}`,
    href: placeHref(place),
    searchText: haystack(
      place.name,
      place.code,
      place.kind,
      place.facts.country,
      place.facts.region,
      place.subtitle,
      ...place.matchNames,
      'city',
      'state',
      'island',
      'place',
      'explore',
    ),
  }))
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
    searchText: haystack(surface.title, surface.subtitle, surface.kind),
  }))
}

/** Full static catalog for the homepage search typeahead. */
export function buildSiteSearchHits(): SiteSearchHit[] {
  return [
    ...topicHits(),
    ...exploreHits(),
    ...placeHits(),
    ...spaceHits(),
    ...surfaceHits(),
  ]
}
