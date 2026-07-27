/**
 * Generative interactive widgets for Cleo replies.
 *
 * The model embeds fenced `cleo` JSON in assistant Markdown. The client
 * parses those fences into typed widgets (tabs, timeline, facts, compare)
 * that the user interacts with in place — part of the answer, not suggestion
 * chips or quizzes.
 */

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
  label: string
  value: string
}

export type CleoCompareRow = {
  label: string
  values: string[]
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
  rows: CleoCompareRow[]
  title?: string
  type: 'compare'
}

export type CleoInteractiveBlock =
  | CleoTabsBlock
  | CleoTimelineBlock
  | CleoFactsBlock
  | CleoCompareBlock

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
const MAX_LABEL = 64
const MAX_SHORT = 120
const MAX_BODY = 700
const MAX_JSON = 8_000

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

  const title = parseOptionalTitle(value)
  if (title === null) {
    return null
  }

  return title === undefined
    ? { type: 'tabs', tabs }
    : { type: 'tabs', tabs, title }
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

  const title = parseOptionalTitle(value)
  if (title === null) {
    return null
  }

  return title === undefined
    ? { type: 'timeline', events }
    : { type: 'timeline', events, title }
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
    items.push(item)
  }

  const title = parseOptionalTitle(value)
  if (title === null) {
    return null
  }

  return title === undefined
    ? { type: 'facts', items }
    : { type: 'facts', items, title }
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

  const title = parseOptionalTitle(value)
  if (title === null) {
    return null
  }

  return title === undefined
    ? { type: 'compare', columns, rows }
    : { type: 'compare', columns, rows, title }
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
