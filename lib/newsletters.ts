import { readFileSync } from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import { z } from 'zod'

import { type ArchivedNewsletterId } from './public-content-routes'

export {
  archivedNewsletterIds,
  isArchivedNewsletterId,
  type ArchivedNewsletterId,
} from './public-content-routes'

const NEWSLETTERS_DIR = path.join(process.cwd(), 'content/newsletters')

const newsletterFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})

export const archivedNewsletterImages = {
  '/content/newsletters/1/cover.jpg': { width: 1200, height: 675 },
  '/content/newsletters/1/post-welcome.jpg': { width: 1200, height: 675 },
  '/content/newsletters/1/post-country.jpg': { width: 1200, height: 675 },
  '/content/newsletters/1/post-ask.jpg': { width: 1200, height: 675 },
} as const

export type ArchivedNewsletter = {
  id: ArchivedNewsletterId
  title: string
  description: string
  titleEn: string
  descriptionEn: string
  body: string
  bodyEn: string
}

const archivedNewsletterCache = new Map<
  ArchivedNewsletterId,
  ArchivedNewsletter
>()

export function getArchivedNewsletter(
  id: ArchivedNewsletterId,
): ArchivedNewsletter {
  const cached = archivedNewsletterCache.get(id)
  if (cached) return cached

  const raw = readFileSync(path.join(NEWSLETTERS_DIR, id, 'index.mdx'), 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = newsletterFrontmatterSchema.parse(data)

  const newsletter = {
    id,
    ...frontmatter,
    titleEn: frontmatter.title,
    descriptionEn: frontmatter.description,
    body: content,
    bodyEn: content,
  }

  archivedNewsletterCache.set(id, newsletter)
  return newsletter
}
