export type PostTransitionElement = 'cover' | 'title'

function postTransitionId(slug: string) {
  switch (slug) {
    case 'a-brief-history-of-dawn':
      return 'p01'
    case 'how-rivers-draw-nations':
      return 'p02'
    case 'letters-from-low-earth-orbit':
      return 'p03'
    case 'pale-blue-marble':
      return 'p04'
    case 'silence-between-galaxies':
      return 'p05'
    case 'the-atlas-of-vanishing-things':
      return 'p06'
    case 'the-long-night-of-enceladus':
      return 'p07'
    case 'what-the-equator-remembers':
      return 'p08'
    case 'when-the-sahara-was-green':
      return 'p09'
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
