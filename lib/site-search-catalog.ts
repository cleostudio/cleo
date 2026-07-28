/**
 * Assembles the lean homepage search catalog from Explore, Space, Topics, and
 * portal surfaces. Import from Server Components only.
 */

import { getAtlasEntry } from '~/lib/atlas'
import { getAllPosts } from '~/lib/content'
import { countries } from '~/lib/countries'
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
  return countries.map((country) => {
    const entry = getAtlasEntry(country.slug)
    const placeNames = entry?.places.map((place) => place.name) ?? []
    const photoPlace = entry?.photo.placeName ?? ''

    return {
      id: `explore:${country.slug}`,
      kind: 'explore' as const,
      title: country.name,
      subtitle: `${country.code} · ${country.region}`,
      href: `/explore/${country.slug}`,
      searchText: haystack(
        country.name,
        country.code,
        country.region,
        country.subregion,
        photoPlace,
        ...placeNames,
        'country',
        'explore',
      ),
    }
  })
}

function spaceHits(): SiteSearchHit[] {
  return spaceSubjects.map((subject) => {
    const featureNames = subject.features.map((feature) => feature.name)

    return {
      id: `space:${subject.slug}`,
      kind: 'space' as const,
      title: subject.name,
      subtitle: `${subject.code} · ${subject.category}`,
      href: `/space/${subject.slug}`,
      searchText: haystack(
        subject.name,
        subject.code,
        subject.category,
        subject.facts.kind,
        subject.subtitle,
        subject.photo.featureName,
        ...featureNames,
        'space',
      ),
    }
  })
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

function writingHits(): SiteSearchHit[] {
  return getAllPosts().map((post) => ({
    id: `writing:${post.slug}`,
    kind: 'writing' as const,
    title: post.titleEn,
    subtitle: 'Writing',
    href: `/blog/${post.slug}`,
    searchText: haystack(
      post.titleEn,
      post.title,
      post.descriptionEn,
      post.description ?? '',
      'writing',
      'essay',
      'blog',
    ),
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
    ...spaceHits(),
    ...writingHits(),
    ...surfaceHits(),
  ]
}
