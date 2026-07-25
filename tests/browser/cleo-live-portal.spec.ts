import { expect, test } from '@playwright/test'

import { prepareBrowserPage, watchBrowserErrors } from './support'

const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim())

test.describe('@smoke @hosted Cleo live portal grounding', () => {
  test.skip(!hasOpenAI, 'OPENAI_API_KEY required for live Cleo grounding')

  test('Japan starter produces an Explore Japan guide chip that navigates', async ({
    page,
  }) => {
    test.setTimeout(180_000)
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await page.goto('/cleo')
    await page.getByRole('button', { name: 'Orient me to Japan' }).click()
    await page.getByRole('button', { name: 'Send' }).click()

    const guideChip = page.locator('a.cleo-guide-link[href="/explore/japan"]')
    await expect(guideChip).toBeVisible({ timeout: 120_000 })
    await expect(guideChip).toContainText(/Japan/i)

    await guideChip.click()
    await expect(page).toHaveURL(/\/explore\/japan$/)
    await expect(page.locator('main h1')).toContainText(/Japan/i)

    expect(browserErrors).toEqual([])
  })
})
