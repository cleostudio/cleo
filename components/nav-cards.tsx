import Link from 'next/link'

import { T } from '~/lib/i18n'
import type { getHomepagePhotoPreview } from '~/lib/media/photo-selection/repository'
import { localePath, type Locale } from '~/lib/locale-route'

// The three doorways, greeting visitors who never look at the dock:
// paper-artifact vignettes — manuscript pages for writing, a polaroid
// fan for photos, a travel folio (stamp / itinerary / map) for Explore.
// Pattern: docs/design-language.md § Paper-artifact doorway vignettes.
export function NavCards({
  postCount,
  exploreCount,
  photoCard,
  locale = 'en',
}: {
  postCount: number
  exploreCount: number
  photoCard: React.ReactNode
  locale?: Locale
}) {
  return (
    <div className="nav-cards">
      <Link
        href={localePath(locale, '/blog')}
        className="nav-card enter-swing"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
      >
        <span className="nc-vignette nc-sheets" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="nc-label">
          <T zh="写作" en="Writing" />
        </span>
        <span className="nc-sub">
          <T zh={`${postCount} 篇文章`} en={`${postCount} posts`} />
        </span>
      </Link>

      {photoCard}

      <Link
        href={localePath(locale, '/explore')}
        className="nav-card enter-swing"
        style={{ '--enter-delay': '240ms' } as React.CSSProperties}
      >
        <span className="nc-vignette nc-folio" aria-hidden>
          <span className="nc-folio-stamp">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <circle
                cx="16"
                cy="16"
                r="13.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeDasharray="2.2 1.6"
              />
              <circle
                cx="16"
                cy="16"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="10"
                y="13"
                width="12"
                height="6"
                rx="0.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                transform="rotate(-18 16 16)"
              />
            </svg>
          </span>
          <span className="nc-folio-itinerary" />
          <span className="nc-folio-map" />
        </span>
        <span className="nc-label">
          <T zh="探索" en="Explore" />
        </span>
        <span className="nc-sub">
          <T zh={`${exploreCount} 个国家`} en={`${exploreCount} countries`} />
        </span>
      </Link>
    </div>
  )
}

export function PhotoNavCard({
  photoPreview,
  locale = 'en',
  pending = false,
}: {
  photoPreview: ReturnType<typeof getHomepagePhotoPreview>
  locale?: Locale
  pending?: boolean
}) {
  return (
    <Link
      href={localePath(locale, '/photos')}
      className="nav-card enter-swing"
      style={{ '--enter-delay': '190ms' } as React.CSSProperties}
      aria-busy={pending || undefined}
    >
      <span className="nc-vignette nc-polaroids" aria-hidden>
        {pending
          ? Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                className="nc-polaroid nc-polaroid-placeholder"
                style={{ '--i': i } as React.CSSProperties}
              />
            ))
          : photoPreview?.items.map((photo, i) => {
              const rendition = photo.renditions[0]!
              const focalPoint = photo.focalPoint ?? { x: 0.5, y: 0.5 }
              return (
                <span
                  key={photo.id}
                  className="nc-polaroid"
                  style={{ '--i': i } as React.CSSProperties}
                >
                  {/* Bunny is the public binary cache layer for Renditions. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rendition.src}
                    alt=""
                    width={64}
                    height={56}
                    style={{
                      objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
                    }}
                  />
                </span>
              )
            })}
      </span>
      <span className="nc-label">
        <T zh="照片" en="Photos" />
      </span>
      <span className="nc-sub">
        {pending ? (
          <span aria-hidden>…</span>
        ) : (
          <T
            zh={`${photoPreview?.count ?? 0} 张照片`}
            en={`${photoPreview?.count ?? 0} photos`}
          />
        )}
      </span>
    </Link>
  )
}
