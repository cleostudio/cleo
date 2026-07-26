import Link from 'next/link'

import { AtlasImage } from '~/components/atlas-image'
import type { AtlasEntry } from '~/lib/atlas'

export function HomeHighlightedPlaces({ entries }: { entries: AtlasEntry[] }) {
  return (
    <ul className="home-highlights">
      {entries.map((entry) => (
        <li key={entry.slug}>
          <Link
            href={`/explore/${entry.slug}`}
            className="group block outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="photo-frame relative overflow-hidden">
              <AtlasImage
                photo={entry.photo}
                width={640}
                alt={entry.photo.alt}
                className="aspect-[3/2] w-full object-cover"
                sizes="(max-width: 40rem) 50vw, 11rem"
                loading="lazy"
              />
              <span className="calibration-corners" aria-hidden />
            </div>
            <div className="mt-2 space-y-0.5 px-0.5">
              <p className="text-sm font-medium text-foreground">{entry.photo.placeName}</p>
              <p className="text-xs text-muted-foreground">{entry.name}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
