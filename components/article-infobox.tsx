import type { ReactNode } from 'react'

export interface ArticleInfoboxFact {
  label: string
  value: ReactNode
  isPrimary?: boolean
}

/**
 * Structured facts placed alongside an article's lead image.
 */
export function ArticleInfobox({
  id,
  facts,
}: {
  id: string
  facts: readonly ArticleInfoboxFact[]
}) {
  return (
    <aside className="article-infobox" aria-labelledby={id}>
      <h2 id={id}>At a glance</h2>
      <dl>
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>
              {fact.isPrimary ? <span className="spec-signal" aria-hidden /> : null}
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
