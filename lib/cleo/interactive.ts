/**
 * Generative interactive widgets for Cleo replies.
 *
 * The model embeds fenced `cleo` JSON in assistant Markdown. The client
 * parses those fences into typed widgets (tabs, timeline, facts, compare,
 * steps, cards, gallery, path, scale) that the user interacts with in place —
 * part of the answer, not suggestion chips or quizzes.
 */

import { isCuratedTopicImageSrc } from '~/lib/cleo/portal-links'

export type CleoTabItem = {
  body: string
  label: string
}

export type CleoTimelineEvent = {
  detail?: string
  title: string
  when: string
}

export type CleoFactItem = {
  detail?: string
  href?: string
  label: string
  value: string
}

export type CleoCompareRow = {
  label: string
  values: string[]
}

export type CleoStepItem = {
  body: string
  title: string
}

export type CleoCardItem = {
  detail?: string
  href?: string
  image?: string
  label: string
  summary: string
}

export type CleoGalleryItem = {
  caption: string
  href?: string
  src: string
}

export type CleoPathStop = {
  body: string
  href?: string
  title: string
}

export type CleoScaleItem = {
  href?: string
  label: string
  note?: string
  value: number
}

export type CleoTabsBlock = {
  tabs: CleoTabItem[]
  title?: string
  type: 'tabs'
}

export type CleoTimelineBlock = {
  events: CleoTimelineEvent[]
  title?: string
  type: 'timeline'
}

export type CleoFactsBlock = {
  items: CleoFactItem[]
  title?: string
  type: 'facts'
}

export type CleoCompareBlock = {
  columns: string[]
  hrefs?: string[]
  rows: CleoCompareRow[]
  title?: string
  type: 'compare'
}

export type CleoStepsBlock = {
  steps: CleoStepItem[]
  title?: string
  type: 'steps'
}

export type CleoCardsBlock = {
  cards: CleoCardItem[]
  title?: string
  type: 'cards'
}

export type CleoGalleryBlock = {
  items: CleoGalleryItem[]
  title?: string
  type: 'gallery'
}

export type CleoPathBlock = {
  stops: CleoPathStop[]
  title?: string
  type: 'path'
}

export type CleoScaleBlock = {
  items: CleoScaleItem[]
  title?: string
  type: 'scale'
  unit?: string
}

export type CleoInteractiveBlock =
  | CleoTabsBlock
  | CleoTimelineBlock
  | CleoFactsBlock
  | CleoCompareBlock
  | CleoStepsBlock
  | CleoCardsBlock
  | CleoGalleryBlock
  | CleoPathBlock
  | CleoScaleBlock

export type CleoMarkdownSegment =
  | {
      type: 'markdown'
      content: string
    }
  | {
      type: 'interactive'
      block: CleoInteractiveBlock
    }

/** Fence open at a line start (multiline `^`), including the trailing newline. */
const CLEO_FENCE_OPEN = /^```cleo(?:-ui)?[ \t]*\r?\n/im
const CLEO_FENCE_CLOSE = /\r?\n```[ \t]*(?:\r?\n|$)/

const MAX_TABS = 5
const MAX_TIMELINE_EVENTS = 8
const MAX_FACTS = 8
const MAX_COMPARE_COLUMNS = 3
const MAX_COMPARE_ROWS = 8
const MAX_STEPS = 6
const MAX_CARDS = 6
const MAX_GALLERY = 6
const MAX_PATH_STOPS = 6
const MAX_SCALE_ITEMS = 6
const MAX_SCALE_VALUE = 1e15
const MAX_LABEL = 64
const MAX_SHORT = 120
const MAX_BODY = 700
const MAX_HREF = 160
const MAX_JSON = 8_000

/** Same-site paths widgets may deep-link. */
const WIDGET_HREF =
  /^\/(explore|space)\/[a-z0-9-]+$|^\/(gallery|topics|blog)(?:\/[a-z0-9-]+)?$/

export function isCleoWidgetHref(href: string): boolean {
  return WIDGET_HREF.test(href)
}

function trimString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value
    .trim()
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
  if (!trimmed || trimmed.length > max) {
    return null
  }

  return trimmed
}

function parseOptionalTitle(
  value: Record<string, unknown>,
): string | undefined | null {
  if (!('title' in value) || value.title === undefined) {
    return undefined
  }
  return trimString(value.title, MAX_LABEL)
}

function parseOptionalHref(value: unknown): string | undefined | null {
  if (value === undefined) {
    return undefined
  }
  const href = trimString(value, MAX_HREF)
  if (!href || !isCleoWidgetHref(href)) {
    return null
  }
  return href
}

/** Prefer the mid curated rendition for widget display. */
export function normalizeCuratedWidgetImage(src: string): string {
  return src.replace(/\/w(640|2048)\.jpg$/, '/w1280.jpg')
}

function parseOptionalImage(value: unknown): string | undefined | null {
  if (value === undefined) {
    return undefined
  }
  const src = trimString(value, MAX_HREF)
  if (!src || !isCuratedTopicImageSrc(src)) {
    return null
  }
  return normalizeCuratedWidgetImage(src)
}

function withOptionalTitle<T extends { type: string }>(
  block: T,
  title: string | undefined | null,
): (T & { title?: string }) | null {
  if (title === null) {
    return null
  }
  return title === undefined ? block : { ...block, title }
}

function parseTabsBlock(value: Record<string, unknown>): CleoTabsBlock | null {
  if (
    !Array.isArray(value.tabs) ||
    value.tabs.length < 2 ||
    value.tabs.length > MAX_TABS
  ) {
    return null
  }

  const tabs: CleoTabItem[] = []
  for (const entry of value.tabs) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const label = trimString(
      'label' in entry ? entry.label : undefined,
      MAX_LABEL,
    )
    const body = trimString('body' in entry ? entry.body : undefined, MAX_BODY)
    if (!label || !body) {
      return null
    }
    tabs.push({ label, body })
  }

  return withOptionalTitle({ type: 'tabs', tabs }, parseOptionalTitle(value))
}

function parseTimelineBlock(
  value: Record<string, unknown>,
): CleoTimelineBlock | null {
  if (
    !Array.isArray(value.events) ||
    value.events.length < 2 ||
    value.events.length > MAX_TIMELINE_EVENTS
  ) {
    return null
  }

  const events: CleoTimelineEvent[] = []
  for (const entry of value.events) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const when = trimString('when' in entry ? entry.when : undefined, MAX_LABEL)
    const title = trimString(
      'title' in entry ? entry.title : undefined,
      MAX_SHORT,
    )
    if (!when || !title) {
      return null
    }
    const event: CleoTimelineEvent = { when, title }
    if ('detail' in entry && entry.detail !== undefined) {
      const detail = trimString(entry.detail, MAX_BODY)
      if (!detail) {
        return null
      }
      event.detail = detail
    }
    events.push(event)
  }

  return withOptionalTitle(
    { type: 'timeline', events },
    parseOptionalTitle(value),
  )
}

function parseFactsBlock(value: Record<string, unknown>): CleoFactsBlock | null {
  if (
    !Array.isArray(value.items) ||
    value.items.length < 2 ||
    value.items.length > MAX_FACTS
  ) {
    return null
  }

  const items: CleoFactItem[] = []
  for (const entry of value.items) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const label = trimString(
      'label' in entry ? entry.label : undefined,
      MAX_LABEL,
    )
    const factValue = trimString(
      'value' in entry ? entry.value : undefined,
      MAX_SHORT,
    )
    if (!label || !factValue) {
      return null
    }
    const item: CleoFactItem = { label, value: factValue }
    if ('detail' in entry && entry.detail !== undefined) {
      const detail = trimString(entry.detail, MAX_BODY)
      if (!detail) {
        return null
      }
      item.detail = detail
    }
    if ('href' in entry && entry.href !== undefined) {
      const href = parseOptionalHref(entry.href)
      if (href === null) {
        return null
      }
      if (href !== undefined) {
        item.href = href
      }
    }
    items.push(item)
  }

  return withOptionalTitle({ type: 'facts', items }, parseOptionalTitle(value))
}

function parseCompareBlock(
  value: Record<string, unknown>,
): CleoCompareBlock | null {
  if (!Array.isArray(value.columns) || !Array.isArray(value.rows)) {
    return null
  }

  if (
    value.columns.length < 2 ||
    value.columns.length > MAX_COMPARE_COLUMNS ||
    value.rows.length === 0 ||
    value.rows.length > MAX_COMPARE_ROWS
  ) {
    return null
  }

  const columns: string[] = []
  for (const column of value.columns) {
    const label = trimString(column, MAX_LABEL)
    if (!label) {
      return null
    }
    columns.push(label)
  }

  const rows: CleoCompareRow[] = []
  for (const row of value.rows) {
    if (typeof row !== 'object' || row === null || !Array.isArray(row.values)) {
      return null
    }

    const label = trimString(
      'label' in row ? row.label : undefined,
      MAX_LABEL,
    )
    if (!label || row.values.length !== columns.length) {
      return null
    }

    const values: string[] = []
    for (const cell of row.values) {
      const text = trimString(cell, MAX_SHORT)
      if (!text) {
        return null
      }
      values.push(text)
    }

    rows.push({ label, values })
  }

  let hrefs: string[] | undefined
  if ('hrefs' in value && value.hrefs !== undefined) {
    if (!Array.isArray(value.hrefs) || value.hrefs.length !== columns.length) {
      return null
    }
    hrefs = []
    for (const entry of value.hrefs) {
      const href = parseOptionalHref(entry)
      if (!href) {
        return null
      }
      hrefs.push(href)
    }
  }

  return withOptionalTitle(
    hrefs
      ? { type: 'compare', columns, rows, hrefs }
      : { type: 'compare', columns, rows },
    parseOptionalTitle(value),
  )
}

function parseStepsBlock(value: Record<string, unknown>): CleoStepsBlock | null {
  if (
    !Array.isArray(value.steps) ||
    value.steps.length < 2 ||
    value.steps.length > MAX_STEPS
  ) {
    return null
  }

  const steps: CleoStepItem[] = []
  for (const entry of value.steps) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const title = trimString(
      'title' in entry ? entry.title : undefined,
      MAX_SHORT,
    )
    const body = trimString('body' in entry ? entry.body : undefined, MAX_BODY)
    if (!title || !body) {
      return null
    }
    steps.push({ title, body })
  }

  return withOptionalTitle({ type: 'steps', steps }, parseOptionalTitle(value))
}

function parseCardsBlock(value: Record<string, unknown>): CleoCardsBlock | null {
  if (
    !Array.isArray(value.cards) ||
    value.cards.length < 2 ||
    value.cards.length > MAX_CARDS
  ) {
    return null
  }

  const cards: CleoCardItem[] = []
  for (const entry of value.cards) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const label = trimString(
      'label' in entry ? entry.label : undefined,
      MAX_LABEL,
    )
    const summary = trimString(
      'summary' in entry ? entry.summary : undefined,
      MAX_SHORT,
    )
    if (!label || !summary) {
      return null
    }
    const card: CleoCardItem = { label, summary }
    if ('detail' in entry && entry.detail !== undefined) {
      const detail = trimString(entry.detail, MAX_BODY)
      if (!detail) {
        return null
      }
      card.detail = detail
    }
    if ('href' in entry && entry.href !== undefined) {
      const href = parseOptionalHref(entry.href)
      if (href === null) {
        return null
      }
      if (href !== undefined) {
        card.href = href
      }
    }
    if ('image' in entry && entry.image !== undefined) {
      const image = parseOptionalImage(entry.image)
      if (image === null) {
        return null
      }
      if (image !== undefined) {
        card.image = image
      }
    }
    cards.push(card)
  }

  return withOptionalTitle({ type: 'cards', cards }, parseOptionalTitle(value))
}

function parseGalleryBlock(
  value: Record<string, unknown>,
): CleoGalleryBlock | null {
  if (
    !Array.isArray(value.items) ||
    value.items.length < 1 ||
    value.items.length > MAX_GALLERY
  ) {
    return null
  }

  const items: CleoGalleryItem[] = []
  const seen = new Set<string>()
  for (const entry of value.items) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const caption = trimString(
      'caption' in entry ? entry.caption : undefined,
      MAX_SHORT,
    )
    const image = parseOptionalImage(
      'src' in entry ? entry.src : undefined,
    )
    if (!caption || !image) {
      return null
    }
    if (seen.has(image)) {
      continue
    }
    seen.add(image)
    const item: CleoGalleryItem = { caption, src: image }
    if ('href' in entry && entry.href !== undefined) {
      const href = parseOptionalHref(entry.href)
      if (href === null) {
        return null
      }
      if (href !== undefined) {
        item.href = href
      }
    }
    items.push(item)
  }

  if (items.length === 0) {
    return null
  }

  return withOptionalTitle(
    { type: 'gallery', items },
    parseOptionalTitle(value),
  )
}

function parsePathBlock(value: Record<string, unknown>): CleoPathBlock | null {
  if (
    !Array.isArray(value.stops) ||
    value.stops.length < 2 ||
    value.stops.length > MAX_PATH_STOPS
  ) {
    return null
  }

  const stops: CleoPathStop[] = []
  for (const entry of value.stops) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const title = trimString(
      'title' in entry ? entry.title : undefined,
      MAX_SHORT,
    )
    const body = trimString('body' in entry ? entry.body : undefined, MAX_BODY)
    if (!title || !body) {
      return null
    }
    const stop: CleoPathStop = { title, body }
    if ('href' in entry && entry.href !== undefined) {
      const href = parseOptionalHref(entry.href)
      if (href === null) {
        return null
      }
      if (href !== undefined) {
        stop.href = href
      }
    }
    stops.push(stop)
  }

  return withOptionalTitle({ type: 'path', stops }, parseOptionalTitle(value))
}

function parseScaleValue(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }
  if (value <= 0 || value > MAX_SCALE_VALUE) {
    return null
  }
  return value
}

/** Format a scale magnitude for display (compact when very large). */
export function formatScaleValue(value: number): string {
  if (value >= 1_000_000) {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: 1,
      notation: 'compact',
    }).format(value)
  }

  return new Intl.NumberFormat('en', {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value)
}

function parseScaleBlock(value: Record<string, unknown>): CleoScaleBlock | null {
  if (
    !Array.isArray(value.items) ||
    value.items.length < 2 ||
    value.items.length > MAX_SCALE_ITEMS
  ) {
    return null
  }

  const items: CleoScaleItem[] = []
  for (const entry of value.items) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }
    const label = trimString(
      'label' in entry ? entry.label : undefined,
      MAX_LABEL,
    )
    const magnitude = parseScaleValue(
      'value' in entry ? entry.value : undefined,
    )
    if (!label || magnitude === null) {
      return null
    }
    const item: CleoScaleItem = { label, value: magnitude }
    if ('note' in entry && entry.note !== undefined) {
      const note = trimString(entry.note, MAX_BODY)
      if (!note) {
        return null
      }
      item.note = note
    }
    if ('href' in entry && entry.href !== undefined) {
      const href = parseOptionalHref(entry.href)
      if (href === null) {
        return null
      }
      if (href !== undefined) {
        item.href = href
      }
    }
    items.push(item)
  }

  let unit: string | undefined
  if ('unit' in value && value.unit !== undefined) {
    const parsedUnit = trimString(value.unit, MAX_LABEL)
    if (!parsedUnit) {
      return null
    }
    unit = parsedUnit
  }

  return withOptionalTitle(
    unit
      ? { type: 'scale', items, unit }
      : { type: 'scale', items },
    parseOptionalTitle(value),
  )
}

/** Parse and validate one fenced `cleo` JSON payload. */
export function parseCleoInteractiveBlock(
  raw: string,
): CleoInteractiveBlock | null {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.length > MAX_JSON) {
    return null
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed) as unknown
  } catch {
    return null
  }

  if (typeof parsed !== 'object' || parsed === null || !('type' in parsed)) {
    return null
  }

  const record = parsed as Record<string, unknown>

  switch (record.type) {
    case 'tabs':
      return parseTabsBlock(record)
    case 'timeline':
      return parseTimelineBlock(record)
    case 'facts':
      return parseFactsBlock(record)
    case 'compare':
      return parseCompareBlock(record)
    case 'steps':
      return parseStepsBlock(record)
    case 'cards':
      return parseCardsBlock(record)
    case 'gallery':
      return parseGalleryBlock(record)
    case 'path':
      return parsePathBlock(record)
    case 'scale':
      return parseScaleBlock(record)
    default:
      return null
  }
}

function findNextFence(
  markdown: string,
  from: number,
): { start: number; end: number; body: string; closed: boolean } | null {
  const slice = markdown.slice(from)
  const openMatch = slice.match(CLEO_FENCE_OPEN)
  if (!openMatch || openMatch.index === undefined) {
    return null
  }

  const openStart = from + openMatch.index
  const bodyStart = openStart + openMatch[0].length
  const closeMatch = markdown.slice(bodyStart).match(CLEO_FENCE_CLOSE)
  if (!closeMatch || closeMatch.index === undefined) {
    return {
      start: openStart,
      end: markdown.length,
      body: markdown.slice(bodyStart),
      closed: false,
    }
  }

  const bodyEnd = bodyStart + closeMatch.index
  const end = bodyEnd + closeMatch[0].length
  return {
    start: openStart,
    end,
    body: markdown.slice(bodyStart, bodyEnd),
    closed: true,
  }
}

/**
 * Split assistant Markdown into prose segments and validated interactive
 * widgets. Incomplete trailing fences (common while streaming) are omitted
 * entirely so raw JSON never flashes in the UI.
 */
export function segmentCleoMarkdown(markdown: string): CleoMarkdownSegment[] {
  const segments: CleoMarkdownSegment[] = []
  let cursor = 0

  while (cursor < markdown.length) {
    const fence = findNextFence(markdown, cursor)
    if (!fence) {
      const rest = markdown.slice(cursor)
      if (rest.trim()) {
        segments.push({ type: 'markdown', content: rest })
      }
      break
    }

    const before = markdown.slice(cursor, fence.start)
    if (before.trim()) {
      segments.push({ type: 'markdown', content: before })
    }

    if (!fence.closed) {
      break
    }

    const block = parseCleoInteractiveBlock(fence.body)
    if (block) {
      segments.push({ type: 'interactive', block })
    }

    cursor = fence.end
  }

  return segments
}
