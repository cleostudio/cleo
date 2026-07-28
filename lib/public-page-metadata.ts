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
    description: 'Reference articles on countries, space, and more.',
  },
  /** Retained for preserved Projects UI / future portfolio surfaces. */
  projects: {
    title: 'Projects',
    description:
      'Products, open-source tools, and small experiments I have made over the years. Some useful, some playful, all made with care.',
  },
  explore: {
    title: 'Countries',
    description: 'Reference articles on every country, organized by region.',
  },
  space: {
    title: 'Space',
    description:
      'Reference articles on the Solar System, major moons, and nearby deep space, with key facts and sources.',
  },
  cleo: {
    title: 'Cleo',
    description:
      'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, link related articles, read images, and generate them.',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
