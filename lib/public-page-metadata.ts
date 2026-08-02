export const publicPageMetadata = {
  home: {
    title: 'Cleo',
    description: '',
    ogDescription: '',
  },
  blog: {
    title: 'Writing',
    description:
      'Creative essays about Earth, the ocean, deep time, and the wider universe — place, scale, and what endures.',
  },
  gallery: {
    title: 'Gallery',
    description: '',
  },
  topics: {
    title: 'Topics',
    description: '',
  },
  /** Retained for preserved Projects UI / future portfolio surfaces. */
  projects: {
    title: 'Projects',
    description:
      'Products, open-source tools, and small experiments I have made over the years. Some useful, some playful, all made with care.',
  },
  explore: {
    title: 'Explore',
    description: '',
  },
  space: {
    title: 'Space',
    description:
      'Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, and facts.',
  },
  civilizations: {
    title: 'Civilizations',
    description:
      'Evergreen field guides for historical civilizations — orientation, signature sites, facts, and sources.',
  },
  cities: {
    title: 'Cities',
    description:
      'Evergreen field guides for capitals and route cities — orientation, signature sites, facts, and sources.',
  },
  oceans: {
    title: 'Oceans',
    description:
      'Evergreen field guides for world ocean basins, major seas, and polar seas — orientation, features, circulation, and sources.',
  },
  rivers: {
    title: 'Rivers',
    description:
      'Evergreen field guides for major rivers — orientation, course, basin, hydrology, and sources.',
  },
  cleo: {
    title: 'Cleo',
    description:
      'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link field guides, read images, and generate them.',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
