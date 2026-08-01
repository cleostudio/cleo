/**
 * Stage 1 manual verification helper (not a product dependency).
 */
import puppeteer from 'puppeteer-core'

const baseURL = process.env.STAGE1_BASE_URL ?? 'http://localhost:3000'
const chromePath =
  process.env.CHROME_PATH ?? '/usr/local/bin/google-chrome'
const threadId = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  protocolTimeout: 120_000,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage()
page.setDefaultTimeout(15_000)
const results = []

async function check(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
  } catch (error) {
    results.push({
      name,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

await check('history dialog opens', async () => {
  await page.goto(`${baseURL}/cleo`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('button[aria-label="Conversation history"]')
  await page.click('button[aria-label="Conversation history"]')
  await page.waitForSelector('[role="dialog"]')
  await page.keyboard.press('Escape')
})

await check('q handoff strips query and lands on a thread id', async () => {
  await page.goto(`${baseURL}/cleo?q=${encodeURIComponent('Tell me about Japan')}`, {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForFunction(
    () =>
      !location.search.includes('q=') &&
      /\/cleo\/[0-9a-f-]{36}$/i.test(location.pathname),
    { timeout: 10_000 },
  )
})

await check('seeded thread resumes from history', async () => {
  // Must be same-origin; about:blank denies IndexedDB.
  await page.goto(`${baseURL}/cleo`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(async (id) => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open('cleo-threads', 1)
      req.onupgradeneeded = () => {
        const database = req.result
        if (!database.objectStoreNames.contains('threads')) {
          database.createObjectStore('threads', { keyPath: 'id' })
        }
        if (!database.objectStoreNames.contains('messages')) {
          const messages = database.createObjectStore('messages', {
            keyPath: 'id',
          })
          messages.createIndex('byThread', 'threadId', { unique: false })
        }
        if (!database.objectStoreNames.contains('images')) {
          const images = database.createObjectStore('images', { keyPath: 'id' })
          images.createIndex('byThread', 'threadId', { unique: false })
          images.createIndex('byMessage', 'messageId', { unique: false })
        }
        if (!database.objectStoreNames.contains('reasoning')) {
          const reasoning = database.createObjectStore('reasoning', {
            keyPath: 'messageId',
          })
          reasoning.createIndex('byThread', 'threadId', { unique: false })
          reasoning.createIndex('byExpiry', 'expiresAt', { unique: false })
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    const now = Date.now()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(['threads', 'messages'], 'readwrite')
      tx.objectStore('threads').put({
        id,
        title: 'What is Mars?',
        createdAt: now,
        updatedAt: now,
        lastMessageAt: now,
        byteSize: 32,
      })
      tx.objectStore('messages').put({
        id: 'msg-user-1',
        threadId: id,
        seq: 0,
        role: 'user',
        content: 'What is Mars?',
        imageIds: [],
        createdAt: now,
      })
      tx.objectStore('messages').put({
        id: 'msg-assistant-1',
        threadId: id,
        seq: 1,
        role: 'assistant',
        content: 'Mars is the fourth planet from the Sun.',
        imageIds: [],
        createdAt: now,
      })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  }, threadId)

  await page.goto(`${baseURL}/cleo/${threadId}`, {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForFunction(
    () => document.body.innerText.includes('fourth planet'),
    { timeout: 10_000 },
  )

  await page.goto(`${baseURL}/cleo`, { waitUntil: 'domcontentloaded' })
  await page.click('button[aria-label="Conversation history"]')
  await page.waitForFunction(
    () => document.body.innerText.includes('What is Mars?'),
    { timeout: 10_000 },
  )
})

await browser.close()
console.log(JSON.stringify({ baseURL, results }, null, 2))
if (results.some((result) => !result.ok)) process.exitCode = 1
