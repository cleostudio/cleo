import { cacheLife } from 'next/cache'
import Link from 'next/link'

import { FooterClock } from '~/components/footer-clock'
import { brailleText } from '~/lib/braille'
import { T } from '~/lib/i18n'
import { localePath, type Locale } from '~/lib/locale-route'
import { allTopics } from '~/lib/topics'

function Tree({
  zh,
  en,
  children,
}: {
  zh: string
  en: string
  children: React.ReactNode
}) {
  return (
    <div className="footer-tree">
      <h2 className="footer-label">
        <T zh={zh} en={en} />
      </h2>
      <ul>{children}</ul>
    </div>
  )
}

async function CopyrightYear() {
  'use cache'
  cacheLife({ stale: 86_400, revalidate: 86_400, expire: 86_400 })

  return new Date().getFullYear()
}

// Swiss editorial footer, set as folder trees: each column is a directory
// listing with box-drawing connectors.
export function SiteFooter({ locale = 'en' }: { locale?: Locale }) {
  const topics = allTopics()

  return (
    <footer className="mx-auto mt-24 w-full max-w-content px-6 pb-24 text-sm text-muted-foreground sm:pb-12">
      <div className="hairline-top grid grid-cols-2 gap-x-6 gap-y-8 pt-8 sm:grid-cols-3">
        <Tree zh="主题" en="topics">
          <li>
            <Link href={localePath(locale, '/topics')} className="footer-tree-link">
              <T zh="全部主题" en="All topics" />
            </Link>
          </li>
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link href={localePath(locale, topic.href)} className="footer-tree-link">
                {topic.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href={localePath(locale, '/gallery')} className="footer-tree-link">
              <T zh="图库" en="Gallery" />
            </Link>
          </li>
        </Tree>
        <Tree zh="索引" en="index">
          <li>
            <Link href={localePath(locale, '/')} className="footer-tree-link">
              <T zh="首页" en="Home" />
            </Link>
          </li>
          <li>
            <Link href={localePath(locale, '/explore')} className="footer-tree-link">
              <T zh="探索" en="Explore" />
            </Link>
          </li>
          <li>
            <Link href={localePath(locale, '/blog')} className="footer-tree-link">
              <T zh="写作" en="Writing" />
            </Link>
          </li>
          <li>
            <Link href={localePath(locale, '/cleo')} className="footer-tree-link">
              <T zh="询问" en="Ask" />
            </Link>
          </li>
          <li>
            <a href="/feed.xml" className="footer-tree-link">
              RSS
            </a>
          </li>
        </Tree>
        <div className="footer-colophon col-span-2 sm:order-first sm:col-span-1">
          <div>
            <p>
              © <CopyrightYear /> Cleo
            </p>
            {/* the name echoed in braille — a printer's mark on the sheet */}
            <p className="footer-braille" aria-hidden>
              {brailleText('cleo')}
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <FooterClock />
            {/* geo stamp: the colophon's location line, a decorative twin of the clock */}
            <div className="footer-geo" aria-hidden>
              <svg className="footer-geo-globe" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" />
                <ellipse cx="10" cy="10" rx="4" ry="9" />
                <path d="M1 10h18M1.9 6h16.2M1.9 14h16.2" />
              </svg>
              <span className="footer-geo-lines">
                <span>22.4820° N</span>
                <span>113.9247° E</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
