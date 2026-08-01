/**
 * Stage 0 measurement: does useSession() hit /api/auth/get-session on a
 * signed-out homepage load? Also verifies the hint-cookie gate.
 */
import puppeteer from 'puppeteer-core'

const baseURL = process.env.STAGE0_BASE_URL ?? 'http://localhost:3000'
const chromePath =
  process.env.CHROME_PATH ?? '/usr/local/bin/google-chrome'
const hintName = 'cleo.session-hint'

async function loadHome({ setHint } = { setHint: false }) {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  const authRequests = []

  page.on('request', (request) => {
    const url = request.url()
    if (url.includes('/api/auth/')) {
      authRequests.push({
        method: request.method(),
        url,
        resourceType: request.resourceType(),
      })
    }
  })

  if (setHint) {
    await page.setCookie({
      name: hintName,
      value: '1',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
    })
  }

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle0', timeout: 60_000 })
  await new Promise((r) => setTimeout(r, 1500))

  const probe = await page.$eval('[data-stage0-auth-client]', (el) =>
    el.getAttribute('data-stage0-auth-client'),
  )
  const cookies = (await page.cookies(baseURL)).map((c) => ({
    name: c.name,
    httpOnly: c.httpOnly,
    value: c.value,
  }))

  await browser.close()

  return {
    setHint,
    probeState: probe,
    cookies,
    authRequests,
    getSessionRequested: authRequests.some((r) =>
      r.url.includes('/api/auth/get-session'),
    ),
  }
}

const withoutHint = await loadHome({ setHint: false })
const withHint = await loadHome({ setHint: true })

const result = {
  baseURL,
  withoutHint,
  withHint,
  gateWorks:
    withoutHint.getSessionRequested === false &&
    withHint.getSessionRequested === true,
}

console.log(JSON.stringify(result, null, 2))
if (!result.gateWorks) {
  process.exitCode = 1
}
