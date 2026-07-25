export const publicPageMetadata = {
  home: {
    title: 'Cali Castle',
    description: 'Design Engineer. Agent Orchestrator. Creative Director.',
    ogDescription: 'Design Engineer. Agent Orchestrator. Creative Director.',
  },
  blog: {
    title: 'Writing',
    description:
      'Essays by Cali about design, engineering, products, and the people and ideas that matter along the way.',
  },
  photos: {
    title: 'Photos',
    description: 'Moments Cali has kept from work, life, and everywhere in between.',
  },
  projects: {
    title: 'Projects',
    description:
      'Products, open-source tools, and small experiments I have made over the years. Some useful, some playful, all made with care.',
  },
  ama: {
    title: 'AMA',
    description:
      'A one-to-one conversation about AI-native work, product strategy, engineering, startups, career moves, and building products.',
  },
  cleo: {
    title: 'Cleo',
    description:
      'Cali’s general-purpose AI agent — chat, search the web, read images, and generate them.',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
