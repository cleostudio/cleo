import Link from 'next/link'

import { skyHotspotHref, skyHotspots } from '~/lib/sky'

/**
 * Paper-style all-sky plate with hotspots into Space guides.
 * Decorative star field is aria-hidden; each target is a real link.
 */
export function SkyAtlasPlate() {
  return (
    <div className="sky-atlas enter mt-8">
      <svg
        className="sky-atlas-chart"
        viewBox="0 0 100 100"
        role="img"
        aria-label="Sky atlas chart with links to Space field guides"
      >
        <defs>
          <radialGradient id="sky-glow" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="var(--surface-1)"
          stroke="var(--border)"
          strokeWidth="0.35"
        />
        <rect x="0" y="0" width="100" height="100" fill="url(#sky-glow)" aria-hidden />

        {/* Meridian / parallel hairlines */}
        <g stroke="var(--border)" strokeWidth="0.15" aria-hidden>
          <line x1="50" y1="4" x2="50" y2="96" />
          <line x1="4" y1="50" x2="96" y2="50" />
          <ellipse cx="50" cy="50" rx="38" ry="38" fill="none" />
          <ellipse cx="50" cy="50" rx="26" ry="26" fill="none" opacity="0.7" />
        </g>

        {/* Decorative star field */}
        <g fill="var(--foreground)" aria-hidden>
          {[
            [12, 18, 0.35],
            [20, 40, 0.25],
            [28, 22, 0.3],
            [33, 70, 0.22],
            [41, 14, 0.28],
            [58, 18, 0.32],
            [64, 44, 0.2],
            [70, 72, 0.26],
            [78, 20, 0.3],
            [86, 40, 0.22],
            [90, 76, 0.28],
            [16, 82, 0.24],
            [46, 86, 0.2],
            [8, 55, 0.18],
            [94, 12, 0.22],
          ].map(([cx, cy, r], index) => (
            <circle key={index} cx={cx} cy={cy} r={r} opacity={0.45} />
          ))}
          {/* Soft Milky Way band */}
          <path
            d="M8 70 C 28 58, 40 54, 55 52 S 78 48, 94 38"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="2.8"
            opacity="0.04"
            strokeLinecap="round"
          />
        </g>

        {skyHotspots.map((hotspot) => (
          <g key={hotspot.id} className="sky-atlas-hotspot">
            <circle
              cx={hotspot.x}
              cy={hotspot.y}
              r="2.2"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="0.35"
              opacity="0.55"
              aria-hidden
            />
            <circle
              cx={hotspot.x}
              cy={hotspot.y}
              r="0.7"
              fill="var(--signal)"
              aria-hidden
            />
          </g>
        ))}
      </svg>

      <ul className="sky-atlas-legend mt-6 flex flex-col">
        {skyHotspots.map((hotspot, index) => (
          <li
            key={hotspot.id}
            className="enter hairline-top"
            style={
              {
                '--enter-delay': `${90 + index * 40}ms`,
              } as React.CSSProperties
            }
          >
            <Link
              href={skyHotspotHref(hotspot)}
              className="group flex items-baseline justify-between gap-4 py-3 text-sm"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium text-foreground group-hover:underline underline-offset-2">
                  {hotspot.label}
                </span>
                <span className="text-muted-foreground">{hotspot.blurb}</span>
              </span>
              <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                /space/{hotspot.spaceSlug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
