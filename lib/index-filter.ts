/** Case-insensitive substring match used by Explore / Space / Writing indexes. */
export function matchesIndexQuery(searchText: string, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return searchText.toLowerCase().includes(normalized)
}
