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
    description:
      'Curated photographs from Explore places and Space guides — searchable contact prints with source credit.',
  },
  topics: {
    title: 'Topics',
    description:
      'Knowledge collections on Cleo — start with Countries and Space, then open field guides and the gallery.',
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
      'Evergreen country field guides — orientation, places, and facts for nations around the world.',
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
