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
  maps: {
    title: 'Maps',
    description:
      'A realistic interactive map of Earth — NASA Blue Marble imagery, accurate country borders, and deep links into Explore field guides.',
  },
  space: {
    title: 'Space',
    description:
      'Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, and facts.',
  },
  cleo: {
    title: 'Cleo',
    description:
      'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link field guides, read images, and generate them.',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
