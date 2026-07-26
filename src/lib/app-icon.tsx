import { ImageResponse } from 'next/og'

import {
  HOME_MASTHEAD_VARIANT,
  type PixelClusterCell,
  pixelClusterCells,
} from '~/components/pixel-cluster'

// sRGB stand-ins for the public-site dark theme (satori has no oklch /
// color-mix). Signal and ink alphas match `.pixel-cluster` in globals.css;
// the tile uses the dark sheet so the stamp reads on browser chrome.
const COLORS = {
  paper: '#0f0d0a',
  signal: '#f0772d',
  inkA: 'rgba(236, 235, 231, 0.26)',
  inkB: 'rgba(236, 235, 231, 0.11)',
} as const

function cellColor(cell: PixelClusterCell): string | null {
  if (cell === 's') return COLORS.signal
  if (cell === 'a') return COLORS.inkA
  if (cell === 'b') return COLORS.inkB
  return null
}

/** App / favicon mark: the homepage PixelCluster, scaled to fill the tile. */
export function createAppIconResponse(size: number) {
  const cells = pixelClusterCells(HOME_MASTHEAD_VARIANT)
  // Match the on-page 5px cell / 1px seam ratio, with margin so the stamp
  // reads as a mark rather than edge-to-edge chrome.
  const gap = Math.max(1, Math.round(size * 0.04))
  const cell = Math.round((size * 0.52 - gap) / 2)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.paper,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
          }}
        >
          {[0, 1].map((row) => (
            <div key={row} style={{ display: 'flex', flexDirection: 'row', gap }}>
              {[0, 1].map((col) => {
                const color = cellColor(cells[row * 2 + col] ?? '')
                return (
                  <div
                    key={col}
                    style={{
                      width: cell,
                      height: cell,
                      backgroundColor: color ?? 'transparent',
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: size, height: size },
  )
}
