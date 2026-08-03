import { describe, expect, it } from 'vitest'

import { allAtlasEntries, getAtlasEntry } from './index'

/**
 * About prose used to be generated from one template, so all 195 countries
 * shared five byte-identical sentences and 66% of their vocabulary, and every
 * landlocked country was told about its coast. These hold the curated
 * replacement to the bar that fixed.
 */

const entries = allAtlasEntries()
const abouts = entries.map((entry) => entry.about)

function sentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 6)
}

function tokens(text: string) {
  return new Set(text.toLowerCase().match(/[a-z']+/g) ?? [])
}

describe('atlas About prose', () => {
  it('covers every country', () => {
    expect(abouts).toHaveLength(195)
    expect(abouts.every((about) => about.trim().length > 0)).toBe(true)
  })

  it('never reuses a sentence between countries', () => {
    const seen = new Map<string, string>()
    const shared: string[] = []

    for (const entry of entries) {
      for (const sentence of sentences(entry.about)) {
        const owner = seen.get(sentence)

        if (owner && owner !== entry.slug) {
          shared.push(`${owner} / ${entry.slug}: "${sentence.slice(0, 60)}…"`)
        } else {
          seen.set(sentence, entry.slug)
        }
      }
    }

    expect(shared).toEqual([])
  })

  it('keeps two countries from reading like each other', () => {
    // Sampled rather than exhaustive: 195 countries is 18,915 pairs.
    const step = 7
    const overlaps: { pair: string; score: number }[] = []

    for (let index = 0; index < entries.length; index += 1) {
      const other = entries[(index + step) % entries.length]!
      const entry = entries[index]!
      const a = tokens(entry.about)
      const b = tokens(other.about)
      const union = new Set([...a, ...b])
      const shared = [...a].filter((token) => b.has(token)).length

      overlaps.push({
        pair: `${entry.slug} / ${other.slug}`,
        score: shared / union.size,
      })
    }

    const worst = overlaps.sort((left, right) => right.score - left.score)[0]!

    // The template averaged 0.66 and every pair exceeded 0.5.
    expect(worst.score, `${worst.pair} read too alike`).toBeLessThan(0.4)
  })

  it.each([
    ['the old template', /occupies a distinctive corner|coasts or interiors|anchors ordinary exchange|reliable silhouette|compact fact plate|field guide stays evergreen|Orientation here|This primer/i],
    ['a year or date', /\b(1[5-9]\d{2}|20\d{2})\b/],
    ['a statistic', /\d\s?%|\bpercent\b|\b\d[\d,.]*\s?(million|billion|inhabitants|residents)\b/i],
    ['advisory or pricing copy', /\b(visa|vaccination|advisory|entry requirement|price|cheap|expensive)\b/i],
    ['time-anchored wording', /\b(recently|currently|nowadays|as of|these days)\b/i],
    ['brochure superlatives', /\b(must-see|world-class|breathtaking|stunning|hidden gem|bucket list)\b/i],
    ['markdown', /[#*_`>|]/],
  ])('carries no %s', (_label, pattern) => {
    const offenders = entries
      .filter((entry) => pattern.test(entry.about))
      .map((entry) => `${entry.slug}: ${pattern.exec(entry.about)?.[0]}`)

    expect(offenders).toEqual([])
  })

  it('names all three featured places in every entry', () => {
    const fold = (text: string) =>
      text
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()

    const missing: string[] = []

    for (const entry of entries) {
      const about = fold(entry.about)

      for (const place of entry.places) {
        const name = fold(place.name)
        const words = name.split(' ')
        const head = words.length > 1 ? words.slice(0, -1).join(' ') : name

        if (!about.includes(name) && !about.includes(head)) {
          missing.push(`${entry.slug}: ${place.name}`)
        }
      }
    }

    expect(missing).toEqual([])
  })

  it('does not tell a landlocked country about its coastline', () => {
    const landlocked = [
      'afghanistan', 'andorra', 'austria', 'bhutan', 'bolivia', 'botswana',
      'burundi', 'chad', 'ethiopia', 'hungary', 'kazakhstan', 'laos',
      'luxembourg', 'malawi', 'mali', 'mongolia', 'nepal', 'niger',
      'paraguay', 'rwanda', 'san-marino', 'switzerland', 'uganda',
      'vatican-city', 'zambia', 'zimbabwe',
    ]
    const coastal =
      /\b(coastline|its coast|the coast of|seaboard|its shoreline|its beaches|sea coast)\b/i

    const offenders = landlocked
      .map((slug) => getAtlasEntry(slug))
      .filter((entry) => entry && coastal.test(entry.about))
      .map((entry) => `${entry!.slug}: ${coastal.exec(entry!.about)?.[0]}`)

    expect(offenders).toEqual([])
  })
})
