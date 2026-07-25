import { expect, test } from '@playwright/test'

import { prepareBrowserPage, watchBrowserErrors } from './support'

test('@hosted English metadata keeps its canonical locale contract', async ({
  page,
}) => {
  await prepareBrowserPage(page)
  const browserErrors = watchBrowserErrors(page)
  await page.goto('/topics')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://cali.so/topics',
  )
  await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveCount(0)
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://cali.so/topics',
  )
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    'content',
    'en_US',
  )

  const socialImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content')
  expect(socialImage).not.toBeNull()
  const socialImageUrl = new URL(socialImage!)
  expect(socialImageUrl.origin).toBe('https://cali.so')
  expect(socialImageUrl.pathname).toBe('/og')
  expect(socialImageUrl.searchParams.get('locale')).toBe('en')
  expect(socialImageUrl.searchParams.get('path')).toBe('/topics')
  expect(browserErrors).toEqual([])
})

test('@hosted feed and social images return their public media contracts', async ({
  request,
}) => {
  const feed = await request.get('/feed.xml')
  const englishFeedRedirect = await request.get('/feed.en.xml', {
    maxRedirects: 0,
  })
  const socialImage = await request.get('/og?locale=en&path=%2Ftopics')

  expect(feed.status()).toBe(200)
  expect(feed.headers()['content-type']).toContain('xml')
  expect(await feed.text()).toContain('https://cali.so/blog/')
  expect(await feed.text()).not.toContain('https://cali.so/en/blog/')

  expect([301, 308]).toContain(englishFeedRedirect.status())
  expect(englishFeedRedirect.headers()['location']).toMatch(/\/feed\.xml$/)

  expect(socialImage.status()).toBe(200)
  expect(socialImage.headers()['content-type']).toContain('image/png')
  expect((await socialImage.body()).byteLength).toBeGreaterThan(10_000)
})
