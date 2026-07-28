/**
 * Lead paragraphs for a reference article.
 *
 * Country entries are written as several newline-separated paragraphs;
 * space entries are a single block. Both use the same reading treatment.
 */
export function ArticleLead({ about }: { about: string }) {
  const paragraphs = about
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className="article-lead">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
