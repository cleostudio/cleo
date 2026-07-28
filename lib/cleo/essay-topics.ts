/**
 * Related Explore/Space subjects for Writing essays.
 * Essay Ask prompts often name no catalog country/body — this map lets
 * topic-photo grounding still attach curated photographs.
 */

export type EssayRelatedTopic = {
  collection: 'explore' | 'space'
  slug: string
}

export type EssayTopicGrounding = {
  title: string
  topics: readonly EssayRelatedTopic[]
}

/** Every published essay slug → title + related catalog subjects. */
export const ESSAY_TOPIC_GROUNDING: Record<string, EssayTopicGrounding> = {
  'pale-blue-marble': {
    title: 'Pale Blue Marble',
    topics: [{ collection: 'space', slug: 'earth' }],
  },
  'letters-from-low-earth-orbit': {
    title: 'Letters from Low Earth Orbit',
    topics: [
      { collection: 'space', slug: 'iss' },
      { collection: 'space', slug: 'earth' },
    ],
  },
  'the-long-night-of-enceladus': {
    title: 'The Long Night of Enceladus',
    topics: [{ collection: 'space', slug: 'enceladus' }],
  },
  'silence-between-galaxies': {
    title: 'Silence Between Galaxies',
    topics: [
      { collection: 'space', slug: 'milky-way' },
      { collection: 'space', slug: 'andromeda' },
    ],
  },
  'when-the-sahara-was-green': {
    title: 'When the Sahara Was Green',
    topics: [
      { collection: 'explore', slug: 'algeria' },
      { collection: 'explore', slug: 'egypt' },
    ],
  },
  'what-the-equator-remembers': {
    title: 'What the Equator Remembers',
    topics: [
      { collection: 'explore', slug: 'ecuador' },
      { collection: 'explore', slug: 'kenya' },
    ],
  },
  'how-rivers-draw-nations': {
    title: 'How Rivers Draw Nations',
    topics: [
      { collection: 'explore', slug: 'egypt' },
      { collection: 'explore', slug: 'brazil' },
    ],
  },
  'a-brief-history-of-dawn': {
    title: 'A Brief History of Dawn',
    topics: [
      { collection: 'space', slug: 'sun' },
      { collection: 'space', slug: 'earth' },
    ],
  },
  'the-atlas-of-vanishing-things': {
    title: 'The Atlas of Vanishing Things',
    topics: [
      { collection: 'explore', slug: 'iceland' },
      { collection: 'space', slug: 'milky-way' },
    ],
  },
}

export function essayRelatedTopics(
  slug: string,
): readonly EssayRelatedTopic[] {
  return ESSAY_TOPIC_GROUNDING[slug.trim().toLowerCase()]?.topics ?? []
}

export function essayTitleForSlug(slug: string): string | undefined {
  return ESSAY_TOPIC_GROUNDING[slug.trim().toLowerCase()]?.title
}
