import { HomeIntroReplay } from '~/components/home-intro-replay'
import { SitePreviewCard } from '~/components/preview-card-timing'
import { highlightedAtlasEntries } from '~/lib/atlas'
import { countries } from '~/lib/countries'
import { T } from '~/lib/i18n'
import { spaceSubjects } from '~/lib/space'
import { staticRendition } from '~/lib/static-photo'

function CraftMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      className="home-design-mark"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.82315 4.31111C5.82682 4.63284 8.45211 5.06784 11.179 4.32111C10.8668 2.85207 9.5621 1.75 8 1.75C6.44144 1.75 5.13912 2.84707 4.82315 4.31111Z"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="none"
        />
        <path
          className="home-design-laptop"
          d="M14.925 16.25H8.75L10.618 12.047C10.698 11.866 10.877 11.75 11.075 11.75H16.481C16.843 11.75 17.085 12.122 16.938 12.453L15.382 15.953C15.302 16.134 15.123 16.25 14.925 16.25Z"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="none"
        />
        <path d="M8 8.25C9.79493 8.25 11.25 6.79493 11.25 5C11.25 3.20507 9.79493 1.75 8 1.75C6.20507 1.75 4.75 3.20507 4.75 5C4.75 6.79493 6.20507 8.25 8 8.25Z" />
        <path d="M11.179 4.32401C10.166 4.60201 9.1 4.75001 8 4.75001C6.117 4.75001 4.336 4.31601 2.75 3.54401" />
        <path d="M1.953 14C3.251 12.042 5.475 10.75 8 10.75" />
        <path
          className="home-design-laptop"
          d="M14.925 16.25H8.75L10.618 12.047C10.698 11.866 10.877 11.75 11.075 11.75H16.481C16.843 11.75 17.085 12.122 16.938 12.453L15.382 15.953C15.302 16.134 15.123 16.25 14.925 16.25Z"
        />
        <path className="home-design-laptop" d="M8.75 16.25H5.75" />
      </g>
      <path
        className="home-design-sparkle home-design-sparkle-a"
        d="M3.49301 8.51903L2.54701 8.20403L2.23101 7.25703C2.12901 6.95103 1.62201 6.95103 1.52001 7.25703L1.20401 8.20403L0.258007 8.51903C0.105007 8.57003 0.00100708 8.71303 0.00100708 8.87503C0.00100708 9.03703 0.105007 9.18003 0.258007 9.23103L1.20401 9.54603L1.52001 10.493C1.57101 10.646 1.71401 10.749 1.87501 10.749C2.03601 10.749 2.18001 10.645 2.23001 10.493L2.54601 9.54603L3.49201 9.23103C3.64501 9.18003 3.74901 9.03703 3.74901 8.87503C3.74901 8.71303 3.64601 8.57003 3.49301 8.51903Z"
        fill="currentColor"
      />
      <path
        className="home-design-sparkle home-design-sparkle-b"
        d="M17.658 6.52601L16.395 6.10501L15.974 4.84201C15.837 4.43401 15.162 4.43401 15.025 4.84201L14.604 6.10501L13.341 6.52601C13.137 6.59401 12.999 6.78501 12.999 7.00001C12.999 7.21501 13.137 7.40601 13.341 7.47401L14.604 7.89501L15.025 9.15801C15.093 9.36201 15.285 9.50001 15.5 9.50001C15.715 9.50001 15.906 9.36201 15.975 9.15801L16.396 7.89501L17.659 7.47401C17.863 7.40601 18.001 7.21501 18.001 7.00001C18.001 6.78501 17.862 6.59401 17.658 6.52601Z"
        fill="currentColor"
      />
      <path
        className="home-design-sparkle home-design-sparkle-dot"
        d="M14.25 3C14.6642 3 15 2.66421 15 2.25C15 1.83579 14.6642 1.5 14.25 1.5C13.8358 1.5 13.5 1.83579 13.5 2.25C13.5 2.66421 13.8358 3 14.25 3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function HopMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      className="home-details-mark"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <ellipse
          cx="9"
          cy="9"
          rx="7.4439"
          ry="4.7786"
          transform="translate(-3.7279 9) rotate(-45)"
          fill="currentColor"
          opacity="0.3"
          strokeWidth="0"
        />
        <path
          d="m14.659,12.9899-1.263-.421-.421-1.2629c-.137-.408-.812-.408-.949,0l-.421,1.2629-1.263.421c-.204.068-.342.259-.342.474s.138.406.342.474l1.263.421.421,1.263c.068.204.26.342.475.342s.406-.138.475-.342l.421-1.263,1.263-.421c.204-.068.342-.259.342-.474s-.139-.406-.343-.474Z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path d="m5.5,2.25.671,2.579,2.579.671-2.579.671-.671,2.579-.671-2.579-2.579-.671,2.579-.671.671-2.579Z" fill="currentColor" />
        <path d="m8.1994,14.9708c-1.7641.5243-3.419.3232-4.4562-.714-.9464-.9464-1.1967-2.4072-.8349-3.9959" />
        <path d="m10.261,2.9083c1.5887-.3618,3.0494-.1114,3.9958.8349,1.2963,1.2963,1.2866,3.5575.187,5.7907" />
        <path
          d="m9.75,10c.4142,0,.75-.3358.75-.75s-.3358-.75-.75-.75-.75.3358-.75.75.3358.75.75.75Z"
          strokeWidth="0"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

function PhotoMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      className="home-photo-mark"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path d="M6.25 4.75h5.5l1 1.5H15a1.25 1.25 0 0 1 1.25 1.25v6.5A1.25 1.25 0 0 1 15 15.25H3A1.25 1.25 0 0 1 1.75 14V7.5A1.25 1.25 0 0 1 3 6.25h2.25l1-1.5Z" />
        <circle
          className="home-photo-lens-ring"
          cx="9"
          cy="10.25"
          r="2.75"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="none"
        />
        <circle className="home-photo-lens" cx="9" cy="10.25" r="2.75" />
        <circle
          className="home-photo-lens-core"
          cx="9"
          cy="10.25"
          r="1.1"
          fill="currentColor"
          stroke="none"
        />
        <path className="home-photo-flash" d="M12.75 7.75h1.75" />
      </g>
    </svg>
  )
}

function SearchMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      className="home-search-mark"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <circle
          className="home-search-glass"
          cx="7.75"
          cy="7.75"
          r="4.5"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <circle className="home-search-glass" cx="7.75" cy="7.75" r="4.5" />
        <path className="home-search-handle" d="M11.1 11.1 15.25 15.25" />
      </g>
    </svg>
  )
}

/** Rainbow label + craft mark (hover / tap). */
function CraftPhrase({ children }: { children: React.ReactNode }) {
  return (
    <HomeIntroReplay>
      <span className="home-design-label">{children}</span>
      <CraftMark />
    </HomeIntroReplay>
  )
}

/** Orbital mark + hopping units (hover / tap). */
function HopPhrase({ children }: { children: React.ReactNode }) {
  return (
    <HomeIntroReplay>
      <HopMark />
      {children}
    </HomeIntroReplay>
  )
}

/** Camera mark with shutter blink (hover / tap). */
function PhotoPhrase({ children }: { children: React.ReactNode }) {
  return (
    <HomeIntroReplay>
      <span className="home-photo-label">{children}</span>
      <PhotoMark />
    </HomeIntroReplay>
  )
}

/** Magnifier mark that tips on hover / tap. */
function SearchPhrase({ children }: { children: React.ReactNode }) {
  return (
    <HomeIntroReplay>
      <span className="home-search-label">{children}</span>
      <SearchMark />
    </HomeIntroReplay>
  )
}

/** cali.so ExternalLink-with-image pattern — photo leads, no description. */
function GalleryPreviewCard({ children }: { children: React.ReactNode }) {
  const sample = highlightedAtlasEntries(1)[0]
  const image = sample ? staticRendition(sample.photo, 640) : null

  return (
    <SitePreviewCard
      href="/gallery"
      triggerClassName="home-contact-link"
      closeDelay={100}
      side="top"
      popupClassName={`link-card home-intro-gallery-card${image ? ' link-card-with-image' : ''}`}
      popup={
        <>
          {image && (
            <span className="link-card-image-frame home-intro-gallery-frame" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="link-card-image home-intro-gallery-image"
                src={image.src}
                alt=""
                width={236}
                height={133}
                loading="eager"
              />
              <span className="calibration-corners home-intro-gallery-corners" />
            </span>
          )}
          <span className="link-card-site">
            <T zh="图库" en="Gallery" />
          </span>
          <span className="link-card-title">
            {sample ? (
              <T zh={sample.photo.placeName} en={sample.photo.placeName} />
            ) : (
              <T zh="精选照片" en="Curated photographs" />
            )}
          </span>
        </>
      }
    >
      {children}
    </SitePreviewCard>
  )
}

/** cali.so GitHub-card spirit — content animates inside the plate. */
function CatalogPreviewCard({ children }: { children: React.ReactNode }) {
  const rows = highlightedAtlasEntries(3).map((entry) => entry.name)

  return (
    <SitePreviewCard
      href="#home-site-search"
      triggerClassName="home-contact-link"
      closeDelay={100}
      side="top"
      popupClassName="link-card home-intro-search-card"
      popup={
        <span className="home-intro-search-body" aria-hidden>
          <span className="home-intro-search-field">
            <T zh="搜索…" en="Search…" />
          </span>
          <span className="home-intro-search-rows">
            {rows.map((name, index) => (
              <span
                key={name}
                className="home-intro-search-row"
                style={{ '--i': index } as React.CSSProperties}
              >
                {name}
              </span>
            ))}
          </span>
        </span>
      }
    >
      {children}
    </SitePreviewCard>
  )
}

/** cali.so service-card identity layout. */
function TopicsPreviewCard({ children }: { children: React.ReactNode }) {
  return (
    <SitePreviewCard
      href="/topics"
      triggerClassName="home-contact-link"
      closeDelay={100}
      side="top"
      popupClassName="link-card service-card home-intro-topics-card"
      popup={
        <>
          <span className="service-card-head">
            <span className="service-card-avatar service-card-monogram" aria-hidden>
              T
            </span>
            <span className="service-card-names">
              <span className="service-card-name">
                <T zh="主题" en="Topics" />
              </span>
              <span className="service-card-sub">
                <T zh="目录" en="catalog" />
              </span>
            </span>
          </span>
          <span className="service-card-bio">
            <T zh="先从现有合集读起，之后还会继续加。" en="Start with the collections on hand; more will follow." />
          </span>
          <span className="service-card-stat">
            <span>
              <b>{countries.length}</b> <T zh="国家" en="countries" />
            </span>
            <span aria-hidden>·</span>
            <span>
              <b>{spaceSubjects.length}</b> <T zh="太空" en="space" />
            </span>
          </span>
        </>
      }
    >
      {children}
    </SitePreviewCard>
  )
}

/** cali.so / NavCards travel-folio object card. */
function ExplorePreviewCard({ children }: { children: React.ReactNode }) {
  return (
    <SitePreviewCard
      href="/explore"
      triggerClassName="home-contact-link"
      closeDelay={100}
      side="top"
      popupClassName="link-card home-intro-folio-card"
      popup={
        <span className="home-intro-folio" aria-hidden>
          <span className="home-intro-folio-stamp">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <circle
                cx="16"
                cy="16"
                r="13.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeDasharray="2.2 1.6"
              />
              <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
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
          <span className="home-intro-folio-itinerary" />
          <span className="home-intro-folio-map" />
          <span className="home-intro-folio-label">
            <T zh="探索" en="Explore" />
            <span>
              <T zh={`${countries.length} 个国家`} en={`${countries.length} countries`} />
            </span>
          </span>
        </span>
      }
    >
      {children}
    </SitePreviewCard>
  )
}

/** cali.so EmailCard physical-object pattern — a mailed note to Cleo. */
function AskCleoPreviewCard({ children }: { children: React.ReactNode }) {
  return (
    <SitePreviewCard
      href="/cleo"
      triggerClassName="home-contact-link"
      closeDelay={120}
      side="top"
      popupClassName="link-card email-envelope-card"
      popup={
        <span className="email-envelope" aria-hidden>
          <span className="email-envelope-flap" />
          <span className="email-envelope-letter">
            <span className="email-envelope-letter-line" />
            <span className="email-envelope-letter-line" />
            <span className="email-envelope-letter-line" />
          </span>
          <span className="email-envelope-return">
            <span>FROM</span>
            YOU
            <br />
            HERE
          </span>
          <span className="email-envelope-stamps">
            <span className="email-envelope-stamp email-envelope-stamp-monogram">
              <span className="email-envelope-stamp-letter" aria-hidden>
                C
              </span>
              <span>CLEO · 20</span>
            </span>
            <span className="email-envelope-stamp email-envelope-stamp-mark">
              <span className="email-envelope-stamp-star">✦</span>
              <span>ASK · 26</span>
            </span>
          </span>
          <span className="email-envelope-postmark" />
          <span className="email-envelope-address">
            <span>
              <T zh="收" en="TO" />
            </span>
            Ask Cleo
          </span>
        </span>
      }
    >
      {children}
    </SitePreviewCard>
  )
}

export function HomeIntroduction() {
  return (
    <div className="home-introduction">
      <p className="text-sm leading-relaxed text-muted-foreground">
        <T
          zh={
            <>
              Cleo 是一座
              <CraftPhrase>知识门户</CraftPhrase>
              。眼下先落在
              <HopPhrase>
                <span className="home-detail-units home-detail-words">
                  <span className="home-detail-unit">国家</span>{' '}
                  <span className="home-detail-unit">和</span>{' '}
                  <span className="home-detail-unit">太空</span>
                </span>
              </HopPhrase>
              ，之后会一点点往外扩。
            </>
          }
          en={
            <>
              Cleo is a <CraftPhrase>knowledge portal</CraftPhrase> for everyday curiosity. It begins with{' '}
              <HopPhrase>
                <span className="home-detail-units home-detail-words">
                  <span className="home-detail-unit">countries</span>{' '}
                  <span className="home-detail-unit">and</span>{' '}
                  <span className="home-detail-unit">space</span>
                </span>
              </HopPhrase>
              , with more subjects joining the collection over time.
            </>
          }
        />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <T
          zh={
            <>
              想先有个印象，就翻翻
              <GalleryPreviewCard>
                <PhotoPhrase>照片</PhotoPhrase>
              </GalleryPreviewCard>
              ；已经知道名字的话，直接搜
              <CatalogPreviewCard>
                <SearchPhrase>目录</SearchPhrase>
              </CatalogPreviewCard>
              就行。
            </>
          }
          en={
            <>
              Browse{' '}
              <GalleryPreviewCard>
                <PhotoPhrase>photographs</PhotoPhrase>
              </GalleryPreviewCard>{' '}
              to get a feel for a place, or search the{' '}
              <CatalogPreviewCard>
                <SearchPhrase>catalog</SearchPhrase>
              </CatalogPreviewCard>{' '}
              when you know just what you&apos;re after.
            </>
          }
        />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <T
          zh={
            <>
              打开 <TopicsPreviewCard>主题</TopicsPreviewCard>、
              <ExplorePreviewCard>探索</ExplorePreviewCard>
              {' '}或 <AskCleoPreviewCard>询问 Cleo</AskCleoPreviewCard>。
            </>
          }
          en={
            <>
              Start with <TopicsPreviewCard>Topics</TopicsPreviewCard>, take a closer look in{' '}
              <ExplorePreviewCard>Explore</ExplorePreviewCard>, or bring a question to{' '}
              <AskCleoPreviewCard>Ask Cleo</AskCleoPreviewCard>.
            </>
          }
        />
      </p>
    </div>
  )
}
