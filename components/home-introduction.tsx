import Link from 'next/link'

import { T } from '~/lib/i18n'

export function HomeIntroduction() {
  return (
    <div className="home-introduction">
      <p className="text-sm leading-relaxed text-muted-foreground">
        <T
          zh="Cleo 是一座知识门户。从国家与太空起步，再逐步延展到更多主题。"
          en="Cleo is a knowledge portal. Countries and space first; more topics as the catalog grows."
        />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <T
          zh="实地导览、精选照片，以及可检索的主题目录。不写签证、安全提示或价格这类易变建议。"
          en="Field guides, curated photographs, and a searchable topic catalog. No visas, safety bulletins, or prices — advice that expires stays out."
        />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <T
          zh={
            <>
              从{' '}
              <Link href="/topics" className="home-contact-link text-foreground underline-offset-2 hover:underline">
                主题
              </Link>
              、
              <Link href="/explore" className="home-contact-link text-foreground underline-offset-2 hover:underline">
                探索
              </Link>
              {' '}或{' '}
              <Link href="/cleo" className="home-contact-link text-foreground underline-offset-2 hover:underline">
                询问 Cleo
              </Link>
              {' '}开始。
            </>
          }
          en={
            <>
              Start with{' '}
              <Link href="/topics" className="home-contact-link text-foreground underline-offset-2 hover:underline">
                Topics
              </Link>
              ,{' '}
              <Link href="/explore" className="home-contact-link text-foreground underline-offset-2 hover:underline">
                Explore
              </Link>
              , or{' '}
              <Link href="/cleo" className="home-contact-link text-foreground underline-offset-2 hover:underline">
                Ask Cleo
              </Link>
              .
            </>
          }
        />
      </p>
    </div>
  )
}
