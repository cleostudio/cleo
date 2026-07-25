import { expect, test } from '@playwright/test'
import { instant } from '@next/playwright'

import { prepareBrowserPage, watchBrowserErrors } from './support'

test('@hosted prefetched dock navigation renders instantly and preserves history', async ({
  page,
}) => {
  await prepareBrowserPage(page)
  const browserErrors = watchBrowserErrors(page)
  const topicsPrefetch = page.waitForResponse((response) => {
    const headers = response.request().headers()

    return (
      new URL(response.url()).pathname === '/topics' &&
      (headers['next-router-prefetch'] === '1' ||
        headers['next-router-segment-prefetch'] !== undefined)
    )
  })
  await page.goto('/blog')
  await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Preferences' })).toBeEnabled()
  await topicsPrefetch

  const historyLength = await page.evaluate(() => window.history.length)
  await page.evaluate(() => {
    ;(window as Window & { __browserReleaseMarker?: string }).__browserReleaseMarker =
      'mounted'
  })

  await instant(page, async () => {
    await page.getByRole('link', { name: 'Topics, G then T' }).click()

    await expect(page).toHaveURL(/\/topics$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Topics' })).toBeVisible()
    await expect(page.locator('main [data-list-stage-row]')).not.toHaveCount(0)
    expect(
      await page.evaluate(
        () => (window as Window & { __browserReleaseMarker?: string }).__browserReleaseMarker,
      ),
    ).toBe('mounted')
    expect(await page.evaluate(() => window.history.length)).toBe(historyLength + 1)
  })

  await expect(page.locator('main a[href="/explore"]')).not.toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible()
  expect(
    await page.evaluate(
      () => (window as Window & { __browserReleaseMarker?: string }).__browserReleaseMarker,
    ),
  ).toBe('mounted')
  expect(await page.evaluate(() => window.history.length)).toBe(historyLength + 1)
  expect(browserErrors).toEqual([])
})

test('Preferences applies theme from the keyboard and restores trigger focus', async ({
  page,
}) => {
  await prepareBrowserPage(page)
  const browserErrors = watchBrowserErrors(page)
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Preferences' })
  await expect(trigger).toBeEnabled()
  await trigger.focus()
  await trigger.press('Enter')

  const panel = page.getByRole('dialog', { name: 'Preferences' })
  await expect(panel).toBeVisible()
  await panel
    .getByRole('tablist', { name: 'Theme' })
    .getByRole('tab', { name: 'Dark' })
    .click()

  await expect(page.locator('html')).toHaveClass(/dark/)
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')

  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(browserErrors).toEqual([])
})

test('Preferences no longer exposes a language switcher', async ({ page }) => {
  await prepareBrowserPage(page)
  const browserErrors = watchBrowserErrors(page)
  await page.goto('/topics')

  const trigger = page.getByRole('button', { name: 'Preferences' })
  await expect(trigger).toBeEnabled()
  await trigger.click()

  const panel = page.getByRole('dialog', { name: 'Preferences' })
  await expect(panel).toBeVisible()
  await expect(panel.getByRole('tablist', { name: 'Language' })).toHaveCount(0)
  await expect(panel.getByRole('tablist', { name: 'Theme' })).toBeVisible()
  await expect(page).toHaveURL(/\/topics$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  expect(browserErrors).toEqual([])
})
