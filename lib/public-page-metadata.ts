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
      'About the Solar System, major moons, and nearby deep space — overview, features, and facts.',
  },
  civilizations: {
    title: 'Civilizations',
    description:
      'About historical civilizations — overview, signature sites, facts, and sources.',
  },
  cities: {
    title: 'Cities',
    description:
      'About capitals and route cities — overview, signature sites, facts, and sources.',
  },
  oceans: {
    title: 'Oceans',
    description:
      'About world ocean basins, major seas, and polar seas — overview, features, circulation, and sources.',
  },
  rivers: {
    title: 'Rivers',
    description:
      'About major rivers — overview, course, basin, hydrology, and sources.',
  },
  cleo: {
    title: 'Cleo',
    description:
      'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link topic pages, read images, and generate them.',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
