import type { Metadata } from 'next'

import { HomePageView } from '../_views/home-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { seo } from '~/lib/seo'

// Knowledge portal homepage — prefetched for instant dock navigation.
export const instant = true

export const metadata: Metadata = {
  ...localeMetadata({
    locale: 'en',
    path: '/',
    title: seo.title,
    description: seo.description,
  }),
  title: { absolute: seo.title },
}

export default function EnglishHomePage() {
  return <HomePageView locale="en" />
}
