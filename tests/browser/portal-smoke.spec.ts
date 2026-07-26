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

  test('Maps page mounts the interactive Earth stage', async ({ page }) => {
    test.setTimeout(90_000)
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    // Maps is heavier than other portal pages; wait past DockFallback so the
    // preferences control is interactive before asserting chrome health.
    const response = await page.goto('/maps')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: 'Maps' })).toBeVisible()
    await expect(page.locator('nav.dock button:not([disabled])')).toHaveCount(1, {
      timeout: 20_000,
    })
    await expect(
      page.getByText(/Drag to orbit · Scroll to zoom · Click land or sea/i),
    ).toBeVisible()
    await expect(page.getByLabel('Find a country')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Show graticule' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible()
    await expect(page.getByRole('toolbar', { name: 'Filter by region' })).toBeVisible()
    await expect(page.getByLabel(/Sun/i)).toBeVisible()
    await expect(page.getByLabel(/Season/i)).toBeVisible()
    await expect(
      page.getByRole('img', { name: 'Interactive 3D Earth' }),
    ).toBeVisible({ timeout: 20_000 })

    await page.getByRole('button', { name: 'Asia', exact: true }).click()
    await expect(page).toHaveURL(/[?&]r=Asia\b/)

    await page.getByLabel('Find a country').fill('Tokyo')
    await expect(
      page.getByRole('option', { name: /Japan/i }),
    ).toBeVisible()
    await expect(page.getByText(/Capital · Tokyo/i)).toBeVisible()
    await page.getByRole('option', { name: /Japan/i }).click()
    await expect(page).toHaveURL(/[?&]c=japan\b/)
    await expect(
      page.getByRole('region', { name: 'Japan' }),
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('link', { name: 'Open field guide' }),
    ).toHaveAttribute('href', '/explore/japan')
    await expect(
      page.getByRole('link', { name: 'Gallery', exact: true }),
    ).toHaveAttribute('href', '/gallery?q=Japan')
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible()
    await expect(page.getByText(/More in /i)).toBeVisible()

    expect(browserErrors).toEqual([])
  })

  test('Maps URL reconcile and Reset view clear selection', async ({ page }) => {
    test.setTimeout(60_000)
    await prepareBrowserPage(page)

    await page.goto('/maps?c=japan&r=Europe')
    await expect(
      page.getByRole('region', { name: 'Japan' }),
    ).toBeVisible({ timeout: 20_000 })
    await expect(page).toHaveURL(/[?&]c=japan\b/)
    await expect(page).not.toHaveURL(/[?&]r=Europe\b/)

    await page.getByRole('button', { name: 'Asia', exact: true }).click()
    await expect(page).toHaveURL(/[?&]r=Asia\b/)

    // Range inputs are awkward with fill(); drive the seasonal scrub via events.
    await page.locator('#maps-sun-day').evaluate((element) => {
      const input = element as HTMLInputElement
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set
      setter?.call(input, '79')
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await expect(page.getByText(/Season · Mar 20/i)).toBeVisible()

    await page.getByRole('button', { name: 'Reset view' }).click()
    await expect(page.getByRole('region', { name: 'Japan' })).toHaveCount(0)
    await expect(page).not.toHaveURL(/[?&]c=japan\b/)
    await expect(page).not.toHaveURL(/[?&]r=/)
    await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.getByRole('button', { name: 'Live sun' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await page.goto('/maps?c=not-a-country')
    await expect(page).not.toHaveURL(/[?&]c=/)
    await expect(page.getByRole('region', { name: 'Japan' })).toHaveCount(0)
  })

  test('Explore country page deep-links to Maps', async ({ page }) => {
    await prepareBrowserPage(page)

    await expectHealthyPublicDocument(page, '/explore/japan')
    await expect(page.getByRole('link', { name: 'View on Maps →' })).toHaveAttribute(
      'href',
      '/maps?c=japan',
    )
    await expect(
      page.locator('a[href="/maps?c=japan"]').filter({ hasText: /°/ }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'View on Maps →' }).click()
    await expect(page).toHaveURL(/\/maps\?c=japan\b/)
    await expect(
      page.getByRole('region', { name: 'Japan' }),
    ).toBeVisible({ timeout: 20_000 })
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
    // Maps starter is present on the empty state (main sends starters; it does
    // not only fill the prompt).
    await expect(
      page.getByRole('button', { name: 'Where is Japan?' }),
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

  test('Cleo Maps starter sends a Maps deep-link prompt', async ({ page }) => {
    await prepareBrowserPage(page)
    await page.route('**/api/responses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/x-ndjson; charset=utf-8',
        body: `${JSON.stringify({ type: 'text', delta: 'Japan is east of Korea.' })}\n`,
      })
    })
    await page.goto('/cleo')

    await page.getByRole('button', { name: 'Where is Japan?' }).click()
    await expect(
      page.getByText(/Where is Japan on Earth.*\/maps\?c=japan/i),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('')
    await expect(page.getByText('Japan is east of Korea.')).toBeVisible()
  })
})
