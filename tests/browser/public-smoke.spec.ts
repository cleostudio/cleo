import { expect, test } from '@playwright/test'

import {
  browserArticleFixture,
  expectHealthyPublicDocument,
  prepareBrowserPage,
  watchBrowserErrors,
} from './support'

const profiles = [
  {
    name: 'Home on light desktop',
    path: '/',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light' as const,
    reducedMotion: 'no-preference' as const,
  },
  {
    name: 'Projects on dark desktop',
    path: '/projects',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark' as const,
    reducedMotion: 'no-preference' as const,
  },
  {
    name: 'Writing on mobile',
    path: '/blog',
    viewport: { width: 390, height: 844 },
    colorScheme: 'light' as const,
    reducedMotion: 'no-preference' as const,
  },
  {
    name: 'Photos on reduced-motion mobile',
    path: '/photos',
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark' as const,
    reducedMotion: 'reduce' as const,
  },
  {
    name: 'Explore on desktop',
    path: '/explore',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light' as const,
    reducedMotion: 'no-preference' as const,
  },
  {
    name: 'Article on desktop',
    path: browserArticleFixture.path,
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light' as const,
    reducedMotion: 'no-preference' as const,
  },
]

for (const profile of profiles) {
  test(`@smoke @hosted ${profile.name} renders as a healthy public document`, async ({
    page,
  }) => {
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)
    await page.setViewportSize(profile.viewport)
    await page.emulateMedia({
      colorScheme: profile.colorScheme,
      reducedMotion: profile.reducedMotion,
    })

    await expectHealthyPublicDocument(page, profile.path)

    await expect(page).toHaveTitle(/Cleo/)
    expect(browserErrors).toEqual([])
  })
}
