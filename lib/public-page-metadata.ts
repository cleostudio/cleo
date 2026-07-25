export const publicPageMetadata = {
  home: {
    title: 'Cleo',
    description: 'A neutral knowledge portal — countries first, more topics next.',
    ogDescription: 'A neutral knowledge portal — countries first, more topics next.',
  },
  blog: {
    title: 'Writing',
    description:
      'Essays by Cleo about design, engineering, products, and the people and ideas that matter along the way.',
  },
  photos: {
    title: 'Photos',
    description:
      'Country atlas — one curated place photograph for every country, filterable by region.',
  },
  topics: {
    title: 'Topics',
    description:
      'General-knowledge collections — starting with countries, growing into more topics over time.',
  },
  /** Retained for preserved Projects UI / future portfolio surfaces. */
  projects: {
    title: 'Projects',
    description:
      'Products, open-source tools, and small experiments I have made over the years. Some useful, some playful, all made with care.',
  },
  explore: {
    title: 'Explore',
    description:
      'Evergreen field guides for every country — orientation, three places, facts, and a photograph.',
  },
  cleo: {
    title: 'Cleo',
    description:
      'A general-purpose AI agent — chat, search the web, read images, and generate them.',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
