/**
 * About prose for a topic page.
 *
 * Country entries are written as several paragraphs (newline separated in
 * `content/atlas.json`); other topics may be one or more blocks. All render
 * the same way so guide types stay typographically identical.
 */
export function GuideAbout({ about }: { about: string }) {
  const paragraphs = about
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className="page-section-body flex flex-col gap-3">
      {paragraphs.map((paragraph, index) => (
        <p
          className="text-sm leading-relaxed text-foreground/90 text-pretty"
          // Static prose that never reorders.
          key={index}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}
