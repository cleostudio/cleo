import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

import matter from 'gray-matter'
import { JSDOM } from 'jsdom'

import { openProductionServer } from './production-server.mjs'

const productionOrigin =
  process.env.PUBLIC_DISCOVERY_EXPECTED_ORIGIN ??
  process.env.PUBLIC_SITE_URL ??
  'https://cleoalpha.vercel.app'

function englishPage(pathname, copy, imageAlt) {
  return {
    path: pathname,
    locale: 'en',
    title: copy.title,
    documentTitle: pathname === '/' ? copy.title : `${copy.title} | Cleo`,
    description: copy.description,
    imageAlt,
  }
}

const publicPages = [
  englishPage(
    '/',
    {
      title: 'Cleo',
      description: '',
    },
    'Cleo',
  ),
  englishPage(
    '/blog',
    {
      title: 'Writing',
      description:
        'Essays by Cleo about design, engineering, products, and the people and ideas that matter along the way.',
    },
    'Writing · Cleo. Essays by Cleo about design, engineering, products, and the people and ideas that matter along the way.',
  ),
  englishPage(
    '/gallery',
    {
      title: 'Gallery',
      description: '',
    },
    'Gallery · Cleo',
  ),
  englishPage(
    '/topics',
    {
      title: 'Topics',
      description: '',
    },
    'Topics · Cleo',
  ),
  englishPage(
    '/explore',
    {
      title: 'Explore',
      description: '',
    },
    'Explore · Cleo',
  ),
  englishPage(
    '/space',
    {
      title: 'Space',
      description:
        'Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, and facts.',
    },
    'Space · Cleo. Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, and facts.',
  ),
  englishPage(
    '/cleo',
    {
      title: 'Cleo',
      description:
        'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link field guides, read images, and generate them.',
    },
    'Cleo. A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link field guides, read images, and generate them.',
  ),
]

const blogDirectory = new URL('../content/blog/', import.meta.url)
for (const slug of (await readdir(blogDirectory)).sort()) {
  const frontmatter = matter(
    await readFile(new URL(`${slug}/index.mdx`, blogDirectory), 'utf8'),
  ).data
  publicPages.push(
    englishPage(`/blog/${slug}`, frontmatter, `${frontmatter.title} · Cleo`),
  )
}

const newsletterDirectory = new URL('../content/newsletters/', import.meta.url)
for (const id of (await readdir(newsletterDirectory)).sort()) {
  const frontmatter = matter(
    await readFile(new URL(`${id}/index.mdx`, newsletterDirectory), 'utf8'),
  ).data
  publicPages.push(
    englishPage(
      `/newsletters/${id}`,
      frontmatter,
      `${frontmatter.title} · Cleo`,
    ),
  )
}

function expectedCanonical(page) {
  return new URL(page.canonical ?? page.path, productionOrigin).href
}

function requiredElement(document, selector, description) {
  const element = document.querySelector(selector)
  assert.ok(element, `missing ${description}`)
  return element
}

async function verifyMetadata(baseUrl, page) {
  const response = await fetch(new URL(page.path, baseUrl))
  assert.equal(response.status, 200, `${page.path} status`)
  const dom = new JSDOM(await response.text())
  const { document } = dom.window

  assert.equal(document.documentElement.lang, page.locale, `${page.path} lang`)
  assert.doesNotMatch(
    document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
    /noindex|nofollow/,
    `${page.path} indexing`,
  )
  assert.equal(document.title, page.documentTitle, `${page.path} title`)
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (page.description) {
    assert.equal(
      requiredElement(
        document,
        'meta[name="description"]',
        `${page.path} description`,
      ).getAttribute('content'),
      page.description,
    )
  } else {
    assert.ok(
      !descriptionMeta || !descriptionMeta.getAttribute('content')?.trim(),
      `${page.path} description should be absent or empty`,
    )
  }
  const canonical = requiredElement(
    document,
    'link[rel="canonical"]',
    `${page.path} canonical`,
  ).getAttribute('href')
  assert.ok(canonical)
  assert.equal(
    new URL(canonical).href,
    expectedCanonical(page),
    `${page.path} canonical`,
  )

  const english = new URL(page.path, productionOrigin).href
  for (const [language, expected] of [
    ['en', english],
    ['x-default', english],
  ]) {
    const alternate = requiredElement(
      document,
      `link[rel="alternate"][hreflang="${language}"]`,
      `${page.path} ${language} alternate`,
    ).getAttribute('href')
    assert.ok(alternate)
    assert.equal(new URL(alternate).href, expected)
  }
  assert.equal(
    document.querySelector('link[rel="alternate"][hreflang="zh-CN"]'),
    null,
    `${page.path} must not expose zh-CN hreflang`,
  )

  assert.equal(
    requiredElement(
      document,
      'meta[property="og:locale"]',
      `${page.path} OG locale`,
    ).getAttribute('content'),
    'en_US',
  )
  for (const [selector, expected, description] of [
    ['meta[property="og:title"]', page.title, 'OG title'],
    ['meta[property="og:description"]', page.description, 'OG description'],
    ['meta[name="twitter:title"]', page.title, 'Twitter title'],
    ['meta[name="twitter:description"]', page.description, 'Twitter description'],
    ['meta[property="og:image:alt"]', page.imageAlt, 'OG image alt'],
    ['meta[name="twitter:image:alt"]', page.imageAlt, 'Twitter image alt'],
  ]) {
    if (!expected && /description$/.test(description)) {
      const element = document.querySelector(selector)
      assert.ok(
        !element || !element.getAttribute('content')?.trim(),
        `${page.path} ${description} should be absent or empty`,
      )
      continue
    }
    const element = requiredElement(
      document,
      selector,
      `${page.path} ${description}`,
    )
    assert.equal(element.getAttribute('content'), expected)
  }
  assert.equal(
    requiredElement(
      document,
      'meta[property="og:image:width"]',
      `${page.path} OG image width`,
    ).getAttribute('content'),
    '1200',
  )
  assert.equal(
    requiredElement(
      document,
      'meta[property="og:image:height"]',
      `${page.path} OG image height`,
    ).getAttribute('content'),
    '630',
  )
  const ogImage = requiredElement(
    document,
    'meta[property="og:image"]',
    `${page.path} OG image`,
  ).getAttribute('content')
  assert.ok(ogImage)
  assert.equal(new URL(ogImage).origin, productionOrigin)
  const remoteImage = new URL(ogImage)
  const localImage = new URL(
    `${remoteImage.pathname}${remoteImage.search}`,
    baseUrl,
  )
  const imageResponse = await fetch(localImage)
  assert.equal(imageResponse.status, 200, `${page.path} OG image status`)
  assert.match(imageResponse.headers.get('content-type') ?? '', /^image\/png/)
  const imageBytes = Buffer.from(await imageResponse.arrayBuffer())
  assert.deepEqual([...imageBytes.subarray(1, 4)], [0x50, 0x4e, 0x47])
  assert.equal(imageBytes.readUInt32BE(16), 1200, `${page.path} PNG width`)
  assert.equal(imageBytes.readUInt32BE(20), 630, `${page.path} PNG height`)
}

async function verifyDiscoveryFiles(baseUrl) {
  const sitemap = await fetch(new URL('/sitemap.xml', baseUrl))
  assert.equal(sitemap.status, 200)
  assert.match(
    sitemap.headers.get('content-type') ?? '',
    /(?:application|text)\/xml/,
  )
  const sitemapXml = await sitemap.text()
  for (const path of new Set(publicPages.map((page) => page.path))) {
    assert.ok(
      sitemapXml.includes(new URL(path, productionOrigin).href),
      `sitemap ${path}`,
    )
  }
  assert.doesNotMatch(sitemapXml, /https:\/\/[^/\s"']+\/en(?:\/|"|<)/)

  const robots = await fetch(new URL('/robots.txt', baseUrl))
  assert.equal(robots.status, 200)
  const robotsText = await robots.text()
  assert.match(robotsText, /User-Agent: \*/)
  assert.match(robotsText, /Allow: \//)
  assert.match(robotsText, /Disallow: \/confirm\//)
  assert.match(robotsText, /Disallow: \/api\//)
  assert.doesNotMatch(robotsText, /Disallow: \/en\//)
  assert.doesNotMatch(robotsText, /Disallow: \/admin/)
  assert.match(
    robotsText,
    new RegExp(`Sitemap: ${new URL('/sitemap.xml', productionOrigin).href}`),
  )

  // Generated app/icon.tsx is served at /icon (extensionless), matching the
  // <link rel="icon" href="/icon?..."> tags Next injects into the document.
  const icon = await fetch(new URL('/icon', baseUrl))
  assert.equal(icon.status, 200)
  assert.match(icon.headers.get('content-type') ?? '', /^image\/png/)
  const iconBytes = new Uint8Array(await icon.arrayBuffer())
  assert.deepEqual([...iconBytes.slice(1, 4)], [0x50, 0x4e, 0x47])
}

async function verifyNotFound(baseUrl) {
  for (const pathname of [
    '/release-check-missing',
    '/blog/not-a-published-post',
    '/newsletters/not-an-id',
  ]) {
    const response = await fetch(new URL(pathname, baseUrl))
    assert.equal(response.status, 404, `${pathname} status`)
    const body = await response.text()
    const document = new JSDOM(body).window.document
    assert.match(
      requiredElement(
        document,
        'meta[name="robots"]',
        `${pathname} robots`,
      ).getAttribute('content') ?? '',
      /noindex/,
    )
    for (const element of document.querySelectorAll(
      'script, style, template, noscript',
    )) {
      element.remove()
    }
    const visibleText = document.body?.textContent ?? ''
    assert.match(visibleText, /This page slipped off the grid/)
    assert.match(visibleText, /Go home/)
    assert.doesNotMatch(
      visibleText,
      /(?:node_modules|\/Users\/|Error:|at\s+\w+\s*\()/,
    )
  }
}

async function verifyNoIndexUtilities(baseUrl) {
  const pages = [
    {
      path: '/confirm/legacy-token',
      title: 'Newsletter confirmation is retired | Cleo',
      description:
        'This old link no longer reads or updates subscriber information. The newsletter service has ended, but site updates remain available through RSS.',
    },
  ]

  for (const page of pages) {
    const response = await fetch(new URL(page.path, baseUrl))
    assert.equal(response.status, 200, `${page.path} status`)
    const document = new JSDOM(await response.text()).window.document
    assert.equal(document.title, page.title, `${page.path} title`)
    assert.equal(
      requiredElement(
        document,
        'meta[name="description"]',
        `${page.path} description`,
      ).getAttribute('content'),
      page.description,
    )
    const robots = requiredElement(
      document,
      'meta[name="robots"]',
      `${page.path} robots`,
    ).getAttribute('content') ?? ''
    assert.match(robots, /noindex/)
    assert.match(robots, /nofollow/)
  }
}

const server = await openProductionServer(process.env.PUBLIC_DISCOVERY_BASE_URL)
try {
  await verifyDiscoveryFiles(server.baseUrl)
  for (const page of publicPages) {
    await verifyMetadata(server.baseUrl, page)
  }
  await verifyNoIndexUtilities(server.baseUrl)
  await verifyNotFound(server.baseUrl)
  console.log(
    `Verified ${publicPages.length} public pages, discovery files, and failure handling against ${server.baseUrl}`,
  )
} finally {
  await server.stop()
}
