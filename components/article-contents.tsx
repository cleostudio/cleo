export interface ArticleContentsItem {
  id: string
  label: string
}

/**
 * Compact in-page navigation for reference articles.
 *
 * These links deliberately stay static: the article remains fully readable
 * without JavaScript, while the outline makes its evidence and structure
 * scannable before a reader starts.
 */
export function ArticleContents({ items }: { items: readonly ArticleContentsItem[] }) {
  return (
    <nav className="article-contents" aria-label="Article contents">
      <p className="article-contents-label">Contents</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
