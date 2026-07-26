import { expect, test } from '@playwright/test'

import {
  expectHealthyPublicDocument,
  prepareBrowserPage,
  watchBrowserErrors,
} from './support'

test.describe('@smoke portal expansion and Cleo grounding', () => {
  test('Space index lists Moons, ISS, and Deep Space nebulae', async ({
    page,
  }) => {
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await expectHealthyPublicDocument(page, '/space')
    await expect(page.getByRole('heading', { name: /^Moons/ })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /^Deep Space/ }),
    ).toBeVisible()
    await expect(page.locator('a[href="/space/iss"]')).toBeVisible()
    await expect(page.locator('a[href="/space/europa"]')).toBeVisible()
    await expect(page.locator('a[href="/space/orion-nebula"]')).toBeVisible()

    expect(browserErrors).toEqual([])
  })

  test('Topics reports 23 Space guides and Gallery exposes Moons', async ({
    page,
  }) => {
    await prepareBrowserPage(page)

    await expectHealthyPublicDocument(page, '/topics')
    await expect(page.getByText('23 guides')).toBeVisible()

    await page.goto('/gallery')
    await expect(page.getByRole('radio', { name: 'Moons' })).toBeVisible()
    await page.getByRole('radio', { name: 'Moons' }).click()
    await expect(page.getByText(/Europa/i).first()).toBeVisible()
  })

  test('Maps page unlocks region jumps and Space Earth links back', async ({
    page,
  }) => {
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await expectHealthyPublicDocument(page, '/maps')
    await expect(
      page.getByRole('application', { name: 'Interactive map of Earth' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Asia/ }),
    ).toBeVisible({ timeout: 20_000 })

    await page.goto('/space/earth')
    await expect(
      page.getByRole('link', { name: 'Open the Earth map →' }),
    ).toBeVisible()

    expect(browserErrors).toEqual([])
  })

  test('Cleo empty state starters fill the prompt', async ({ page }) => {
    await prepareBrowserPage(page)
    await page.goto('/cleo')

    await expect(
      page.getByRole('button', { name: 'Orient me to Japan' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Orient me to Japan' }).click()
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue(
      /orientation to Japan.*Deep-link its field guide/i,
    )
  })
})
