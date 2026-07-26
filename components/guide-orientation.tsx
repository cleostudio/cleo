/**
 * Orientation prose for a field guide.
 *
 * Country entries are written as several paragraphs (newline separated in
 * `content/atlas.json`); space entries are a single block. Both render the
 * same way so the two guide types stay typographically identical.
 */
export function GuideOrientation({ about }: { about: string }) {
  const paragraphs = about
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p
          className="mt-3 text-sm leading-relaxed text-foreground/90 text-pretty"
          // Static prose that never reorders.
          key={index}
        >
          {paragraph}
        </p>
      ))}
    </>
  )
}
