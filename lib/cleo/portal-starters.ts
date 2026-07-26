/**
 * Empty-state Ask Cleo prompts — a rotating, topic-diverse set so the portal
 * surface (Explore, Space, Gallery, Topics) stays discoverable.
 */

export type PortalStarterTopic =
  | 'explore'
  | 'space'
  | 'gallery'
  | 'topics'
  | 'compare'
  | 'next-read'
  | 'photo'

export type PortalStarter = {
  topic: PortalStarterTopic
  label: string
  prompt: string
}

/** Full prompt pool. The empty state shows a daily slice via selectPortalStarters. */
export const CLEO_PORTAL_STARTER_POOL: readonly PortalStarter[] = [
  {
    topic: 'explore',
    label: 'Orient me to Japan',
    prompt:
      'Give me a quick orientation to Japan. Deep-link its field guide when you mention the country, and point me at its curated Gallery photograph.',
  },
  {
    topic: 'explore',
    label: 'What defines Iceland?',
    prompt:
      'What defines Iceland’s landscape and settlement pattern? Deep-link the Explore guide and its Gallery photograph.',
  },
  {
    topic: 'explore',
    label: 'Orient me to Peru',
    prompt:
      'Give me a sharp orientation to Peru. Deep-link the field guide and mention the curated place photograph in the Gallery.',
  },
  {
    topic: 'space',
    label: 'Why is Europa interesting?',
    prompt:
      'Why is Europa interesting as an ocean world? Deep-link the Space guide and its Gallery photograph when you name it.',
  },
  {
    topic: 'space',
    label: 'What’s special about Titan?',
    prompt:
      'What’s special about Titan among the moons? Deep-link the Space guide and point to its curated Gallery photograph.',
  },
  {
    topic: 'space',
    label: 'Orient me to the Orion Nebula',
    prompt:
      'Give me a compact orientation to the Orion Nebula. Deep-link the Space guide and its Gallery photograph.',
  },
  {
    topic: 'compare',
    label: 'Compare Mars and Earth',
    prompt:
      'Compare Mars and Earth in a few sharp points. Deep-link each Space guide and mention each curated Gallery photograph once.',
  },
  {
    topic: 'compare',
    label: 'Compare Japan and Iceland',
    prompt:
      'Compare Japan and Iceland as places to understand, not itineraries. Deep-link both Explore guides and their Gallery photographs.',
  },
  {
    topic: 'compare',
    label: 'Io vs Europa',
    prompt:
      'Contrast Io and Europa in a short table. Deep-link each Space guide and link each moon’s Gallery photograph.',
  },
  {
    topic: 'gallery',
    label: 'Pick a photograph for me',
    prompt:
      'Help me pick a place or space photograph to sit with. Suggest a few from the Gallery with deep links (`/gallery?q=…`) and their field guides.',
  },
  {
    topic: 'gallery',
    label: 'Show me Solar System photos',
    prompt:
      'Point me at a few Solar System photographs in the Gallery (use `/gallery?filter=Solar%20System` or subject searches) and deep-link each Space guide.',
  },
  {
    topic: 'photo',
    label: 'What does Mars look like here?',
    prompt:
      'What does the curated Mars photograph on this site show? Deep-link the Gallery search for Mars and the Space guide.',
  },
  {
    topic: 'photo',
    label: 'Describe Japan’s place photo',
    prompt:
      'Describe the curated Japan place photograph on this site without inventing details. Link the Gallery search and the Explore guide.',
  },
  {
    topic: 'topics',
    label: 'What’s on Topics?',
    prompt:
      'What knowledge collections are on Topics right now, and where should I start? Deep-link [Topics](/topics), Explore, and Space.',
  },
  {
    topic: 'topics',
    label: 'Countries or Space first?',
    prompt:
      'I have ten minutes. Should I start with Countries or Space on this portal, and why? Deep-link [Topics](/topics) and your recommended doorway.',
  },
  {
    topic: 'next-read',
    label: 'What should I read next?',
    prompt:
      'I just finished the Japan Explore guide. What should I read next on this site? Suggest two guides with deep links and their Gallery photographs.',
  },
  {
    topic: 'next-read',
    label: 'A path through Space',
    prompt:
      'Give me a three-stop reading path through the Space guides (starter → stretch → deep space). Deep-link each guide and its Gallery photograph.',
  },
] as const

const TOPIC_ROTATION: readonly PortalStarterTopic[] = [
  'explore',
  'space',
  'compare',
  'gallery',
  'photo',
  'topics',
  'next-read',
]

/** UTC day number used so SSR/client agree on the empty-state set. */
export function portalStarterDayKey(date = new Date()): number {
  return (
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
    86_400_000
  )
}

function startersForTopic(topic: PortalStarterTopic): PortalStarter[] {
  return CLEO_PORTAL_STARTER_POOL.filter((starter) => starter.topic === topic)
}

/**
 * Pick `count` starters from different topics, rotating which topics and
 * which prompt within each topic by the day key.
 */
export function selectPortalStarters(
  dayKey = portalStarterDayKey(),
  count = 3,
): PortalStarter[] {
  const safeCount = Math.max(1, Math.min(count, TOPIC_ROTATION.length))
  const topicOffset = ((dayKey % TOPIC_ROTATION.length) + TOPIC_ROTATION.length) %
    TOPIC_ROTATION.length
  const selected: PortalStarter[] = []

  for (let i = 0; i < safeCount; i += 1) {
    const topic = TOPIC_ROTATION[(topicOffset + i) % TOPIC_ROTATION.length]!
    const pool = startersForTopic(topic)
    if (pool.length === 0) continue
    const pick = pool[((dayKey + i) % pool.length + pool.length) % pool.length]!
    selected.push(pick)
  }

  return selected
}

/** Compatibility slice used by older imports; prefer selectPortalStarters. */
export const CLEO_PORTAL_STARTERS = selectPortalStarters(0, 3)
