/** Previous / next siblings in a linear guide list (region or category). */
export function guideNeighbors<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): { previous: T | undefined; next: T | undefined } {
  const index = items.findIndex((item) => item.slug === slug)
  if (index === -1) {
    return { previous: undefined, next: undefined }
  }

  return {
    previous: items[index - 1],
    next: items[index + 1],
  }
}
