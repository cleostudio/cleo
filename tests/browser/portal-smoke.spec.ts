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

    await page.goto('/maps?region=europe')
    await expect(page.getByRole('button', { name: /Europe/ })).toBeVisible({
      timeout: 20_000,
    })
    await expect(page.locator('.earth-map-region[data-active]')).toContainText(
      'Europe',
    )
    await expect(page.getByText('Explore guides')).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Browse Explore guides →' }),
    ).toHaveAttribute('href', '/explore#region-Europe')

    await page.goto('/maps?country=japan')
    await expect(page.getByRole('link', { name: /Open field guide/ })).toBeVisible({
      timeout: 20_000,
    })

    await page.goto('/maps?country=not-a-real-country')
    await expect(
      page.getByText(/No country matched .*not-a-real-country/i),
    ).toBeAttached({ timeout: 20_000 })
    await expect(
      page.getByRole('application', { name: 'Interactive map of Earth' }),
    ).toBeVisible()

    await page.goto('/space/earth')
    await expect(
      page.getByRole('link', { name: 'Open the Earth map →' }),
    ).toBeVisible()

    await page.goto('/explore')
    await expect(
      page.locator('a[href="/maps?region=oceania"]').first(),
    ).toBeVisible()

    expect(browserErrors).toEqual([])
  })

  test('Cleo empty state starters send the prompt', async ({ page }) => {
    await prepareBrowserPage(page)
    await page.route('**/api/responses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/x-ndjson; charset=utf-8',
        body:
          `${JSON.stringify({ type: 'text', delta: 'Japan is a good place to start.' })}\n`,
      })
    })
    await page.goto('/cleo')

    await expect(
      page.getByRole('button', { name: 'Orient me to Japan' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Orient me to Japan' }).click()

    await expect(
      page.getByText(/orientation to Japan.*Deep-link its field guide/i),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('')
    await expect(
      page.getByRole('button', { name: 'Orient me to Japan' }),
    ).toHaveCount(0)
    await expect(page.getByText('Japan is a good place to start.')).toBeVisible()
  })
})
