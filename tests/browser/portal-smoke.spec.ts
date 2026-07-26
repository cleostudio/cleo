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

  test('World page mounts the interactive Earth stage', async ({ page }) => {
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await expectHealthyPublicDocument(page, '/world')
    await expect(page.getByRole('heading', { name: 'World' })).toBeVisible()
    await expect(
      page.getByText(/Drag to orbit · Scroll to zoom/i),
    ).toBeVisible()
    await expect(page.getByLabel('Find a country')).toBeVisible()
    await expect(page.getByRole('group', { name: 'Frame a region' })).toBeVisible()
    await expect(
      page.getByRole('img', { name: 'Interactive 3D Earth' }),
    ).toBeVisible({ timeout: 20_000 })

    await page.getByRole('button', { name: 'Asia' }).click()
    await expect(page).toHaveURL(/[?&]r=Asia\b/)
    await expect(page.getByRole('button', { name: 'Asia' })).toHaveAttribute(
      'data-active',
      '',
    )

    const search = page.getByLabel('Find a country')
    await search.fill('Japan')
    await search.press('Enter')
    await expect(page).toHaveURL(/[?&]c=japan\b/)
    await expect(page).not.toHaveURL(/[?&]r=/)
    await expect(page.getByRole('button', { name: 'Asia' })).toHaveAttribute(
      'data-active',
      '',
    )
    await expect(
      page.getByRole('region', { name: 'Japan' }),
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('link', { name: 'Open field guide' }),
    ).toHaveAttribute('href', '/explore/japan')
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page).toHaveURL(/\/world\/?$/)
    await expect(page.getByRole('region', { name: 'Japan' })).toHaveCount(0)

    await page.goto('/world?c=not-a-country&r=Asia')
    await expect(page).toHaveURL(/[?&]r=Asia\b/)
    await expect(page).not.toHaveURL(/[?&]c=/)

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

    await page.getByRole('button', { name: 'Show Japan on the globe' }).click()
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue(
      /\/world\?c=japan/i,
    )
  })
})
