// Paper grain + drafting guides + edge fades, adapted from cali.so's
// AmbientBackground. The page reads as a sheet of working paper, not a void.
// Layers are inert and tuned to be noticed on the second visit, not the first.

export function AmbientBackground() {
  return (
    <>
      <div aria-hidden className="paper-grain" />
      <div aria-hidden className="column-guides">
        <div className="column-guide-v" />
        <div className="column-guide-v" />
      </div>
      <div aria-hidden className="viewport-edge-fade viewport-edge-fade-top" />
      <div
        aria-hidden
        className="viewport-edge-fade viewport-edge-fade-bottom"
      />
    </>
  )
}
