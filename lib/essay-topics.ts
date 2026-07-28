import { getCountry } from '~/lib/countries'
import { getSpaceSubject } from '~/lib/space'

/** Related Explore/Space subjects for a Writing essay. */
export type EssayRelatedTopic = {
  collection: 'explore' | 'space'
  slug: string
}

type EssayTopicEntry = {
  topics: readonly EssayRelatedTopic[]
}

/**
 * Portal-owned map from essay slug → related field guides.
 * Keep in sync with published `content/blog/*` slugs.
 */
export const ESSAY_RELATED_TOPICS: Record<string, EssayTopicEntry> = {
  'pale-blue-marble': {
    topics: [{ collection: 'space', slug: 'earth' }],
  },
  'letters-from-low-earth-orbit': {
    topics: [
      { collection: 'space', slug: 'iss' },
      { collection: 'space', slug: 'earth' },
    ],
  },
  'the-long-night-of-enceladus': {
    topics: [{ collection: 'space', slug: 'enceladus' }],
  },
  'silence-between-galaxies': {
    topics: [
      { collection: 'space', slug: 'milky-way' },
      { collection: 'space', slug: 'andromeda' },
    ],
  },
  'when-the-sahara-was-green': {
    topics: [
      { collection: 'explore', slug: 'algeria' },
      { collection: 'explore', slug: 'egypt' },
    ],
  },
  'what-the-equator-remembers': {
    topics: [
      { collection: 'explore', slug: 'ecuador' },
      { collection: 'explore', slug: 'kenya' },
    ],
  },
  'how-rivers-draw-nations': {
    topics: [
      { collection: 'explore', slug: 'egypt' },
      { collection: 'explore', slug: 'brazil' },
    ],
  },
  'a-brief-history-of-dawn': {
    topics: [
      { collection: 'space', slug: 'sun' },
      { collection: 'space', slug: 'earth' },
    ],
  },
  'the-atlas-of-vanishing-things': {
    topics: [
      { collection: 'explore', slug: 'iceland' },
      { collection: 'space', slug: 'milky-way' },
    ],
  },
}

export type EssayFieldGuideLink = {
  collection: 'explore' | 'space'
  slug: string
  name: string
  href: string
  kind: string
}

export function essayRelatedTopics(
  slug: string,
): readonly EssayRelatedTopic[] {
  return ESSAY_RELATED_TOPICS[slug.trim().toLowerCase()]?.topics ?? []
}

/** Resolve related topics to live catalog links (drops unknown slugs). */
export function essayFieldGuideLinks(slug: string): EssayFieldGuideLink[] {
  const links: EssayFieldGuideLink[] = []

  for (const topic of essayRelatedTopics(slug)) {
    if (topic.collection === 'explore') {
      const country = getCountry(topic.slug)
      if (!country) continue
      links.push({
        collection: 'explore',
        slug: country.slug,
        name: country.name,
        href: `/explore/${country.slug}`,
        kind: 'Explore',
      })
      continue
    }

    const subject = getSpaceSubject(topic.slug)
    if (!subject) continue
    links.push({
      collection: 'space',
      slug: subject.slug,
      name: subject.name,
      href: `/space/${subject.slug}`,
      kind: 'Space',
    })
  }

  return links
}
