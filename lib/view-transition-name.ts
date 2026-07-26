export type PostTransitionElement = 'cover' | 'title'

function postTransitionId(slug: string) {
  switch (slug) {
    case 'welcome-to-cleo':
      return 'p01'
    case 'country-field-guides':
      return 'p02'
    case 'space-field-guides':
      return 'p03'
    case 'places-and-sky':
      return 'p04'
    case 'ask-cleo':
      return 'p05'
    case 'curated-not-generated':
      return 'p06'
    case 'topics-first':
      return 'p07'
    case 'photos-stay-local':
      return 'p08'
    case 'writing-comes-next':
      return 'p09'
    case 'icy-moons-europa-enceladus':
      return 'p10'
    default:
      throw new Error('Unknown post view-transition slug')
  }
}

// View-transition names are CSS identifiers. Keep every stored content key
// behind an explicit allowlist before it reaches an inline style value.
export function postViewTransitionName(
  element: PostTransitionElement,
  slug: string,
) {
  return `${element}-${postTransitionId(slug)}`
}
