import Link from 'next/link'

import { AtlasImage } from '~/components/atlas-image'
import type { HomeHighlight } from '~/lib/home-highlights'

export function HomeHighlightedPlaces({
  entries,
}: {
  entries: HomeHighlight[]
}) {
  return (
    <ul className="home-highlights">
      {entries.map((entry, index) => {
        const prioritize = index < 2

        return (
          <li key={entry.id}>
            <Link
              href={entry.href}
              className="group block outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="photo-frame relative overflow-hidden">
                <AtlasImage
                  photo={entry.photo}
                  width={640}
                  alt={entry.photo.alt}
                  className="aspect-[3/2] w-full object-cover"
                  sizes="(max-width: 40rem) 50vw, 11rem"
                  loading={prioritize ? 'eager' : 'lazy'}
                  fetchPriority={prioritize ? 'high' : 'auto'}
                />
                <span className="calibration-corners" aria-hidden />
              </div>
              <div className="mt-2 space-y-0.5 px-0.5">
                <p className="text-sm font-medium text-foreground">{entry.title}</p>
                <p className="text-xs text-muted-foreground">{entry.subtitle}</p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
