/**
 * Compare surface — side-by-side fact plates for two same-kind catalog subjects.
 * v1: Explore country pairs and Space planet pairs. No new corpus.
 */

import { getAtlasEntry, type AtlasEntry } from '~/lib/atlas'
import { getSpaceSubject, spaceSubjects, type SpaceSubject } from '~/lib/space'

export type CompareCollection = 'explore' | 'space'

export type CompareRef = {
  collection: CompareCollection
  slug: string
}

export type CompareSide =
  | { collection: 'explore'; subject: AtlasEntry }
  | { collection: 'space'; subject: SpaceSubject }

export type CompareRow = {
  label: string
  a: string
  b: string
}

export type ComparePair = {
  kind: 'explore' | 'space'
  a: CompareSide
  b: CompareSide
  rows: CompareRow[]
  href: string
}

export type CompareResolveResult =
  | { status: 'empty' }
  | { status: 'incomplete'; a: CompareRef | null; b: CompareRef | null }
  | { status: 'unknown'; ref: CompareRef }
  | { status: 'mixed'; a: CompareRef; b: CompareRef }
  | { status: 'unsupported'; reason: string; a: CompareRef; b: CompareRef }
  | { status: 'ready'; pair: ComparePair }

const REF_PATTERN = /^(explore|space):([a-z0-9-]+)$/i

/** Starter pairs shown on the empty Compare page. */
export const COMPARE_STARTERS: Array<{ label: string; a: string; b: string }> = [
  { label: 'Japan · France', a: 'explore:japan', b: 'explore:france' },
  { label: 'Brazil · Australia', a: 'explore:brazil', b: 'explore:australia' },
  { label: 'Earth · Mars', a: 'space:earth', b: 'space:mars' },
  { label: 'Jupiter · Saturn', a: 'space:jupiter', b: 'space:saturn' },
]

export function formatCompareRef(ref: CompareRef): string {
  return `${ref.collection}:${ref.slug}`
}

export function compareHref(a: CompareRef, b: CompareRef): string {
  const params = new URLSearchParams({
    a: formatCompareRef(a),
    b: formatCompareRef(b),
  })
  return `/compare?${params.toString()}`
}

/** Parse `explore:japan` / `space:mars`. Bare slugs resolve when unambiguous. */
export function parseCompareRef(raw: string | undefined | null): CompareRef | null {
  const value = raw?.trim()
  if (!value) return null

  const namespaced = REF_PATTERN.exec(value)
  if (namespaced) {
    return {
      collection: namespaced[1]!.toLowerCase() as CompareCollection,
      slug: namespaced[2]!.toLowerCase(),
    }
  }

  const slug = value.toLowerCase()
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const explore = getAtlasEntry(slug)
  const space = getSpaceSubject(slug)
  if (explore && !space) return { collection: 'explore', slug }
  if (space && !explore) return { collection: 'space', slug }
  return null
}

export function isComparableSpaceSubject(subject: SpaceSubject): boolean {
  return subject.facts.kind === 'Planet'
}

export function comparableSpaceSubjects(): SpaceSubject[] {
  return spaceSubjects.filter(isComparableSpaceSubject)
}

function formatRadius(radiusKm: number | null): string {
  if (radiusKm == null) return '—'
  return `${radiusKm.toLocaleString('en-US')} km`
}

function resolveSide(ref: CompareRef): CompareSide | null {
  if (ref.collection === 'explore') {
    const subject = getAtlasEntry(ref.slug)
    if (!subject) return null
    return { collection: 'explore', subject }
  }
  const subject = getSpaceSubject(ref.slug)
  if (!subject) return null
  return { collection: 'space', subject }
}

function exploreRows(a: AtlasEntry, b: AtlasEntry): CompareRow[] {
  return [
    { label: 'Capital', a: a.facts.capital, b: b.facts.capital },
    {
      label: 'Languages',
      a: a.facts.languages.join(', '),
      b: b.facts.languages.join(', '),
    },
    { label: 'Currency', a: a.facts.currency, b: b.facts.currency },
    {
      label: 'Area',
      a: `${a.facts.areaKm2.toLocaleString('en-US')} km²`,
      b: `${b.facts.areaKm2.toLocaleString('en-US')} km²`,
    },
    { label: 'Region', a: a.facts.region, b: b.facts.region },
    { label: 'ISO 3166-1', a: a.code, b: b.code },
  ]
}

function spaceRows(a: SpaceSubject, b: SpaceSubject): CompareRow[] {
  return [
    { label: 'Kind', a: a.facts.kind, b: b.facts.kind },
    { label: 'System', a: a.facts.system, b: b.facts.system },
    { label: 'Mean distance', a: a.facts.meanDistance, b: b.facts.meanDistance },
    {
      label: 'Equatorial radius',
      a: formatRadius(a.facts.radiusKm),
      b: formatRadius(b.facts.radiusKm),
    },
    { label: 'Orbital period', a: a.facts.orbitalPeriod, b: b.facts.orbitalPeriod },
    { label: 'Rotation', a: a.facts.rotationPeriod, b: b.facts.rotationPeriod },
    { label: 'Companions', a: a.facts.companions, b: b.facts.companions },
    { label: 'Catalog', a: a.code, b: b.code },
  ]
}

export function sideName(side: CompareSide): string {
  return side.subject.name
}

export function sideHref(side: CompareSide): string {
  return side.collection === 'explore'
    ? `/explore/${side.subject.slug}`
    : `/space/${side.subject.slug}`
}

export function sideCode(side: CompareSide): string {
  return side.subject.code
}

export function resolveComparePair(
  rawA: string | undefined | null,
  rawB: string | undefined | null,
): CompareResolveResult {
  const aRef = parseCompareRef(rawA)
  const bRef = parseCompareRef(rawB)

  if (!aRef && !bRef) return { status: 'empty' }
  if (!aRef || !bRef) return { status: 'incomplete', a: aRef, b: bRef }

  if (aRef.collection !== bRef.collection) {
    return { status: 'mixed', a: aRef, b: bRef }
  }

  const aSide = resolveSide(aRef)
  if (!aSide) return { status: 'unknown', ref: aRef }
  const bSide = resolveSide(bRef)
  if (!bSide) return { status: 'unknown', ref: bRef }

  if (aSide.collection === 'explore' && bSide.collection === 'explore') {
    return {
      status: 'ready',
      pair: {
        kind: 'explore',
        a: aSide,
        b: bSide,
        rows: exploreRows(aSide.subject, bSide.subject),
        href: compareHref(aRef, bRef),
      },
    }
  }

  if (aSide.collection === 'space' && bSide.collection === 'space') {
    if (
      !isComparableSpaceSubject(aSide.subject) ||
      !isComparableSpaceSubject(bSide.subject)
    ) {
      return {
        status: 'unsupported',
        reason:
          'Space compare currently covers planets only — pick two planets such as Earth and Mars.',
        a: aRef,
        b: bRef,
      }
    }
    return {
      status: 'ready',
      pair: {
        kind: 'space',
        a: aSide,
        b: bSide,
        rows: spaceRows(aSide.subject, bSide.subject),
        href: compareHref(aRef, bRef),
      },
    }
  }

  return { status: 'mixed', a: aRef, b: bRef }
}
