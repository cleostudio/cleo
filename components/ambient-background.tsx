import { ArcRulers } from '~/components/arc-rulers'

// Paper grain + bent rulers per the design language: the page reads as a
// sheet of working paper, not a void. Layers are inert and tuned to be
// noticed on the second visit, not the first. Column-edge guide borders
// were removed so the content column can breathe. Cleo hides the rulers
// with CSS (`html[data-cleo-route]`) so the chat surface stays open.
export function AmbientBackground() {
  return (
    <>
      <div aria-hidden className="paper-grain" />
      {/* rulers ride above the edge fades — the instrument stays crisp */}
      <div aria-hidden className="column-rulers">
        <ArcRulers />
      </div>
      <div aria-hidden className="viewport-edge-fade viewport-edge-fade-top" />
      <div aria-hidden className="viewport-edge-fade viewport-edge-fade-bottom" />
    </>
  )
}
