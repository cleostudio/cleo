import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import matter from 'gray-matter'

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const blogRoot = join(repositoryRoot, 'content', 'blog')
const newsletterRoot = join(repositoryRoot, 'content', 'newsletters')
const linkPreviewsPath = join(repositoryRoot, 'content', 'link-previews.json')
const hanPattern = /\p{Script=Han}/u
const dashPattern = /[—–]/u

function withoutFencedCode(source) {
  return source.replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm, '')
}

function localImageReferences(source) {
  return [
    ...withoutFencedCode(source).matchAll(
      /!\[[^\]]*\]\(((?:\.\/|\/content\/)[^\s)]+)(?:\s+"[^"]*")?\)/g,
    ),
  ].map(([, reference]) => reference)
}

async function contentDirectories(root) {
  const entries = await readdir(root, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

test('every blog post is English-only index.mdx', async (t) => {
  for (const directory of await contentDirectories(blogRoot)) {
    const path = join(blogRoot, directory, 'index.mdx')

    let source
    try {
      source = await readFile(path, 'utf8')
    } catch (error) {
      if (error?.code === 'ENOENT') continue
      throw error
    }

    await t.test(directory, async () => {
      const parsed = matter(source)

      assert.doesNotMatch(
        source,
        dashPattern,
        `${directory}/index.mdx must not contain em or en dashes`,
      )
      assert.equal(
        typeof parsed.data.title,
        'string',
        `${directory} must have a title`,
      )
      assert.ok(parsed.data.title.trim(), `${directory} must have a nonempty title`)
      assert.equal(
        typeof parsed.data.description,
        'string',
        `${directory} must have a description`,
      )
      assert.ok(
        parsed.data.description.trim(),
        `${directory} must have a nonempty description`,
      )
      assert.doesNotMatch(
        source,
        hanPattern,
        `${directory}/index.mdx must not contain Han characters`,
      )
      assert.ok(
        localImageReferences(parsed.content).every((ref) => typeof ref === 'string'),
        `${directory}/index.mdx image references are readable`,
      )
    })
  }
})

test('every newsletter archive is English-only index.mdx', async (t) => {
  for (const directory of await contentDirectories(newsletterRoot)) {
    const path = join(newsletterRoot, directory, 'index.mdx')
    const source = await readFile(path, 'utf8')

    await t.test(directory, async () => {
      const parsed = matter(source)

      assert.doesNotMatch(
        source,
        dashPattern,
        `${directory}/index.mdx must not contain em or en dashes`,
      )
      assert.equal(
        typeof parsed.data.title,
        'string',
        `${directory} must have a title`,
      )
      assert.ok(parsed.data.title.trim(), `${directory} must have a nonempty title`)
      assert.equal(
        typeof parsed.data.description,
        'string',
        `${directory} must have a description`,
      )
      assert.ok(
        parsed.data.description.trim(),
        `${directory} must have a nonempty description`,
      )
      assert.doesNotMatch(
        source,
        hanPattern,
        `${directory}/index.mdx must not contain Han characters`,
      )
    })
  }
})

test('Han link-preview fields have English equivalents', async (t) => {
  const previews = JSON.parse(await readFile(linkPreviewsPath, 'utf8'))

  for (const [url, preview] of Object.entries(previews)) {
    await t.test(url, () => {
      for (const field of ['title', 'titleEn', 'description', 'descriptionEn']) {
        const value = preview[field]
        if (typeof value !== 'string') continue

        assert.doesNotMatch(
          value,
          dashPattern,
          `${url} ${field} must not contain em or en dashes`,
        )
      }

      for (const field of ['title', 'description']) {
        const value = preview[field]
        if (typeof value !== 'string' || !hanPattern.test(value)) continue

        const englishField = `${field}En`
        const englishValue = preview[englishField]
        assert.equal(
          typeof englishValue,
          'string',
          `${url} needs ${englishField} because ${field} contains Han characters`,
        )
        assert.ok(englishValue.trim(), `${url} must have a nonempty ${englishField}`)
        assert.doesNotMatch(
          englishValue,
          hanPattern,
          `${url} ${englishField} must not contain Han characters`,
        )
      }
    })
  }
})
