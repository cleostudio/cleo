import { countries } from '~/lib/countries'
import type { AtlasEntry, AtlasManifest, AtlasRenditionWidth } from './types'

const RENDITION_WIDTHS: AtlasRenditionWidth[] = [640, 1024, 1600]
const MIN_ABOUT_WORDS = 250
const MAX_ABOUT_WORDS = 350

export class AtlasValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AtlasValidationError'
  }
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function assertHttps(url: string, context: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new AtlasValidationError(`${context}: invalid URL ${url}`)
  }
  if (parsed.protocol !== 'https:') {
    throw new AtlasValidationError(`${context}: must be https (${url})`)
  }
}

export function validateAtlasManifest(manifest: AtlasManifest): void {
  const countrySlugs = countries.map((country) => country.slug)
  const manifestSlugs = Object.keys(manifest)

  for (const slug of countrySlugs) {
    if (!(slug in manifest)) {
      throw new AtlasValidationError(`Missing atlas entry for country slug "${slug}"`)
    }
  }

  for (const slug of manifestSlugs) {
    if (!countrySlugs.includes(slug)) {
      throw new AtlasValidationError(`Unknown atlas slug "${slug}" not in countries registry`)
    }
  }

  if (manifestSlugs.length !== new Set(manifestSlugs).size) {
    throw new AtlasValidationError('Duplicate atlas slug keys')
  }

  const codes = new Set<string>()
  for (const slug of countrySlugs) {
    const entry = manifest[slug]!
    validateEntry(entry, slug)
    if (codes.has(entry.code)) {
      throw new AtlasValidationError(`Duplicate ISO code ${entry.code}`)
    }
    codes.add(entry.code)
  }
}

function validateEntry(entry: AtlasEntry, slug: string) {
  const ctx = `atlas[${slug}]`
  if (entry.slug !== slug) {
    throw new AtlasValidationError(`${ctx}: slug mismatch`)
  }
  if (!entry.name.trim()) throw new AtlasValidationError(`${ctx}: missing name`)
  if (!entry.code || entry.code.length !== 2) {
    throw new AtlasValidationError(`${ctx}: invalid ISO code`)
  }

  const words = wordCount(entry.about)
  if (words < MIN_ABOUT_WORDS || words > MAX_ABOUT_WORDS) {
    throw new AtlasValidationError(
      `${ctx}: about must be ${MIN_ABOUT_WORDS}–${MAX_ABOUT_WORDS} words (got ${words})`,
    )
  }

  const { facts } = entry
  if (!facts.capital.trim()) throw new AtlasValidationError(`${ctx}: missing capital`)
  if (!facts.languages.length) throw new AtlasValidationError(`${ctx}: missing languages`)
  if (!facts.currency.trim()) throw new AtlasValidationError(`${ctx}: missing currency`)
  if (!(facts.areaKm2 > 0)) throw new AtlasValidationError(`${ctx}: invalid areaKm2`)
  if (!facts.region.trim()) throw new AtlasValidationError(`${ctx}: missing facts.region`)

  if (!Array.isArray(entry.places) || entry.places.length !== 3) {
    throw new AtlasValidationError(`${ctx}: must have exactly three places`)
  }
  for (const [index, place] of entry.places.entries()) {
    if (!place.name.trim() || !place.description.trim()) {
      throw new AtlasValidationError(`${ctx}: place[${index}] incomplete`)
    }
  }

  if (entry.sources.length < 2 || entry.sources.length > 4) {
    throw new AtlasValidationError(`${ctx}: sources must be 2–4`)
  }
  if (!entry.sources.some((source) => source.kind === 'country')) {
    throw new AtlasValidationError(`${ctx}: needs an authoritative country source`)
  }
  if (!entry.sources.some((source) => source.kind === 'place')) {
    throw new AtlasValidationError(`${ctx}: needs at least one place source`)
  }
  for (const source of entry.sources) {
    if (!source.label.trim()) throw new AtlasValidationError(`${ctx}: source missing label`)
    assertHttps(source.url, `${ctx} source`)
  }

  const { photo } = entry
  if (!photo.placeName.trim()) throw new AtlasValidationError(`${ctx}: photo.placeName missing`)
  if (!photo.alt.trim()) throw new AtlasValidationError(`${ctx}: photo.alt missing`)
  if (!photo.caption.trim()) throw new AtlasValidationError(`${ctx}: photo.caption missing`)
  if (!photo.photographer.trim()) {
    throw new AtlasValidationError(`${ctx}: photo.photographer missing`)
  }
  assertHttps(photo.sourceUrl, `${ctx} photo.sourceUrl`)
  if (photo.license !== 'Pexels License') {
    throw new AtlasValidationError(`${ctx}: photo.license must be Pexels License`)
  }
  if (!photo.provenance.trim()) throw new AtlasValidationError(`${ctx}: photo.provenance missing`)
  if (!/^[a-f0-9]{64}$/.test(photo.checksum)) {
    throw new AtlasValidationError(`${ctx}: photo.checksum must be sha256 hex`)
  }
  if (!(photo.width > 0 && photo.height > 0)) {
    throw new AtlasValidationError(`${ctx}: photo dimensions invalid`)
  }
  if (photo.renditions.length !== 3) {
    throw new AtlasValidationError(`${ctx}: photo needs 640/1024/1600 renditions`)
  }
  const widths = new Set(photo.renditions.map((r) => r.width))
  for (const width of RENDITION_WIDTHS) {
    if (!widths.has(width)) {
      throw new AtlasValidationError(`${ctx}: missing ${width}px rendition`)
    }
  }
  for (const rendition of photo.renditions) {
    if (!rendition.src.startsWith('/images/atlas/')) {
      throw new AtlasValidationError(`${ctx}: rendition must be local /images/atlas/ path`)
    }
    if (!(rendition.bytes > 0)) {
      throw new AtlasValidationError(`${ctx}: rendition bytes missing`)
    }
  }
}
