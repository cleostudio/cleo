import { defineConfig, devices } from '@playwright/test'

const hostedBaseUrl = process.env.PLAYWRIGHT_BASE_URL
const baseURL = hostedBaseUrl ?? 'http://127.0.0.1:3210'
const localServerEnv = {
  ...process.env,
  SITE_URL: process.env.SITE_URL ?? 'https://your-domain.com',
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL ?? 'https://your-domain.com',
}

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: hostedBaseUrl
    ? undefined
    : {
        command: 'pnpm start --hostname 127.0.0.1 --port 3210',
        env: localServerEnv,
        reuseExistingServer: false,
        timeout: 120_000,
        url: baseURL,
      },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-smoke',
      grep: /@smoke/,
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
})
