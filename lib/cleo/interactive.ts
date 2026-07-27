/**
 * Interactive response blocks for Cleo.
 *
 * The model may emit fenced `cleo` JSON in assistant Markdown. The client
 * parses those fences into typed UI blocks (follow-ups, choices, portal
 * actions, compare plates) and strips them from the Streamdown prose path.
 */

export type CleoFollowUpItem = {
  label: string
  prompt: string
}

export type CleoPortalActionItem = {
  href: string
  label: string
}

export type CleoCompareRow = {
  label: string
  values: string[]
}

export type CleoFollowUpsBlock = {
  items: CleoFollowUpItem[]
  type: 'follow_ups'
}

export type CleoChoicesBlock = {
  items: CleoFollowUpItem[]
  prompt?: string
  type: 'choices'
}

export type CleoPortalActionsBlock = {
  items: CleoPortalActionItem[]
  type: 'portal_actions'
}

export type CleoCompareBlock = {
  columns: string[]
  rows: CleoCompareRow[]
  title?: string
  type: 'compare'
}

export type CleoInteractiveBlock =
  | CleoFollowUpsBlock
  | CleoChoicesBlock
  | CleoPortalActionsBlock
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
const MAX_ITEMS = 4
const MAX_COMPARE_COLUMNS = 3
const MAX_COMPARE_ROWS = 8
const MAX_LABEL = 48
const MAX_PROMPT = 280
const MAX_HREF = 160
const MAX_CELL = 80

/** Same-site portal paths interactive actions may navigate to. */
const PORTAL_ACTION_HREF =
  /^\/(explore|space)\/[a-z0-9-]+$|^\/(gallery|topics|blog)(?:\/[a-z0-9-]+)?$/

function trimString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim().replace(/\s+/g, ' ')
  if (!trimmed || trimmed.length > max) {
    return null
  }

  return trimmed
}

function parseFollowUpItems(value: unknown): CleoFollowUpItem[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ITEMS) {
    return null
  }

  const items: CleoFollowUpItem[] = []

  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }

    const label = trimString(
      'label' in entry ? entry.label : undefined,
      MAX_LABEL,
    )
    const prompt = trimString(
      'prompt' in entry ? entry.prompt : undefined,
      MAX_PROMPT,
    )

    if (!label || !prompt) {
      return null
    }

    items.push({ label, prompt })
  }

  return items
}

function parsePortalActionItems(
  value: unknown,
): CleoPortalActionItem[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ITEMS) {
    return null
  }

  const items: CleoPortalActionItem[] = []
  const seen = new Set<string>()

  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) {
      return null
    }

    const label = trimString(
      'label' in entry ? entry.label : undefined,
      MAX_LABEL,
    )
    const href = trimString(
      'href' in entry ? entry.href : undefined,
      MAX_HREF,
    )

    if (!label || !href || !PORTAL_ACTION_HREF.test(href) || seen.has(href)) {
      return null
    }

    seen.add(href)
    items.push({ label, href })
  }

  return items
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
      const text = trimString(cell, MAX_CELL)
      if (!text) {
        return null
      }
      values.push(text)
    }

    rows.push({ label, values })
  }

  const block: CleoCompareBlock = {
    type: 'compare',
    columns,
    rows,
  }

  if ('title' in value && value.title !== undefined) {
    const title = trimString(value.title, MAX_LABEL)
    if (!title) {
      return null
    }
    block.title = title
  }

  return block
}

/** Parse and validate one fenced `cleo` JSON payload. */
export function parseCleoInteractiveBlock(
  raw: string,
): CleoInteractiveBlock | null {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.length > 4_000) {
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

  if (record.type === 'follow_ups') {
    const items = parseFollowUpItems(record.items)
    return items ? { type: 'follow_ups', items } : null
  }

  if (record.type === 'choices') {
    const items = parseFollowUpItems(record.items)
    if (!items) {
      return null
    }

    const block: CleoChoicesBlock = { type: 'choices', items }
    if ('prompt' in record && record.prompt !== undefined) {
      const prompt = trimString(record.prompt, MAX_PROMPT)
      if (!prompt) {
        return null
      }
      block.prompt = prompt
    }
    return block
  }

  if (record.type === 'portal_actions') {
    const items = parsePortalActionItems(record.items)
    return items ? { type: 'portal_actions', items } : null
  }

  if (record.type === 'compare') {
    return parseCompareBlock(record)
  }

  return null
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
 * blocks. Incomplete trailing fences (common while streaming) are omitted
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

    // Unclosed or invalid fences are dropped (never rendered as code).
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

/** True when a same-site href is allowed for portal_actions. */
export function isCleoPortalActionHref(href: string): boolean {
  return PORTAL_ACTION_HREF.test(href)
}
