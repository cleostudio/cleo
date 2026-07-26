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

  test('Topics reports Space and Oceans tallies; Gallery exposes Moons', async ({
    page,
  }) => {
    await prepareBrowserPage(page)

    await expectHealthyPublicDocument(page, '/topics')
    await expect(page.getByText('23 guides')).toBeVisible()
    await expect(page.getByText('14 guides')).toBeVisible()

    await page.goto('/gallery')
    await expect(page.getByRole('radio', { name: 'Moons' })).toBeVisible()
    await page.getByRole('radio', { name: 'Moons' }).click()
    await expect(page.getByText(/Europa/i).first()).toBeVisible()
  })

  test('Oceans index lists basins and Mediterranean; Sky links Orion Nebula', async ({
    page,
  }) => {
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await expectHealthyPublicDocument(page, '/oceans')
    await expect(
      page.getByRole('heading', { name: /^Ocean basins/ }),
    ).toBeVisible()
    await expect(page.locator('a[href="/oceans/pacific"]')).toBeVisible()
    await expect(page.locator('a[href="/oceans/mediterranean"]')).toBeVisible()

    await expectHealthyPublicDocument(page, '/sky')
    await expect(page.locator('a[href="/space/orion-nebula"]')).toBeVisible()
    await expect(page.locator('a[href="/space/andromeda"]')).toBeVisible()

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

  test('Biomes index lists Forests and Tundra', async ({ page }) => {
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await expectHealthyPublicDocument(page, '/biomes')
    await expect(page.getByRole('heading', { name: /^Forests/ })).toBeVisible()
    await expect(page.locator('a[href="/biomes/tundra"]')).toBeVisible()
    await expect(page.locator('a[href="/biomes/desert"]')).toBeVisible()

    expect(browserErrors).toEqual([])
  })

  test('Compare plate shows Japan and France capitals', async ({ page }) => {
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await expectHealthyPublicDocument(
      page,
      '/compare?a=explore:japan&b=explore:france',
    )
    await expect(page.getByRole('heading', { name: /Japan.*France/i })).toBeVisible()
    await expect(page.getByText('Capital')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Japan' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'France' }).first()).toBeVisible()

    expect(browserErrors).toEqual([])
  })
})
