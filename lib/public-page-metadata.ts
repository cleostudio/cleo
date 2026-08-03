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
      'Planets, moons, and deep-sky neighbors — structure, motion, and the view across the Solar System and beyond.',
  },
  civilizations: {
    title: 'Civilizations',
    description:
      'Cultures that shaped regions across millennia — signature sites, durable facts, and what remains.',
  },
  cities: {
    title: 'Cities',
    description:
      'Capitals and corridor cities where routes meet — harbors, plazas, walls, and urban layers.',
  },
  oceans: {
    title: 'Oceans',
    description:
      'World basins, major seas, and polar waters — currents, trenches, climate roles, and open blue.',
  },
  rivers: {
    title: 'Rivers',
    description:
      'Major courses that cut continents — sources, floodplains, basins, and the paths water draws.',
  },
  cleo: {
    title: 'Cleo',
    description:
      'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link topic pages, read images, and generate them.',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
