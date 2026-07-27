import { CleoPageView } from '../../_views/cleo-page'
import { parseCleoAskSearchParams } from '~/lib/cleo/ask-links'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

export default async function EnglishCleoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const initialAsk = parseCleoAskSearchParams(await searchParams)

  return <CleoPageView initialAsk={initialAsk} />
}
