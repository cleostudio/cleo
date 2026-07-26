import { expect, test } from '@playwright/test'

import { prepareBrowserPage, watchBrowserErrors } from './support'

const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim())

test.describe('@smoke @hosted Cleo live portal grounding', () => {
  test.skip(!hasOpenAI, 'OPENAI_API_KEY required for live Cleo grounding')

  test('Japan starter deep-links Explore Japan inline and navigates', async ({
    page,
  }) => {
    test.setTimeout(180_000)
    await prepareBrowserPage(page)
    const browserErrors = watchBrowserErrors(page)

    await page.goto('/cleo')
    await page.getByRole('button', { name: 'Orient me to Japan' }).click()

    const guideLink = page.locator('.ai-response a[href="/explore/japan"]')
    await expect(guideLink.first()).toBeVisible({ timeout: 120_000 })
    // One inline guide link — no duplicate chip row under the answer.
    await expect(guideLink).toHaveCount(1)
    await expect(page.locator('a.cleo-guide-link')).toHaveCount(0)

    await guideLink.first().click()
    await expect(page).toHaveURL(/\/explore\/japan$/)
    await expect(page.locator('main h1')).toContainText(/Japan/i)

    expect(browserErrors).toEqual([])
  })
})
