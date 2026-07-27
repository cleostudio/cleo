export type PostTransitionElement = 'cover' | 'title'

function postTransitionId(slug: string) {
  switch (slug) {
    case 'a-library-written-in-ice':
      return 'p01'
    case 'cities-waiting-for-the-tide':
      return 'p02'
    case 'dust-that-feeds-a-forest':
      return 'p03'
    case 'islands-that-arrive-overnight':
      return 'p04'
    case 'listening-for-black-holes':
      return 'p05'
    case 'the-invisible-border-wallace-drew':
      return 'p06'
    case 'the-moon-that-steals-our-days':
      return 'p07'
    case 'the-passport-of-a-raindrop':
      return 'p08'
    case 'the-thin-blue-shell':
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
