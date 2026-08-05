/**
 * Turn Responses API `url_citation` annotations into clickable Markdown links
 * when the model cited a source without emitting a Markdown URL.
 */

export type UrlCitation = {
  end_index: number
  start_index: number
  title: string
  type: "url_citation"
  url: string
}

const MAX_CITATION_LABEL = 160

function isSafeHttpUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function escapeLinkLabel(label: string) {
  return label
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CITATION_LABEL)
}

/** Accept only well-formed web URL citations with a usable character span. */
export function parseUrlCitation(value: unknown): UrlCitation | null {
  if (typeof value !== "object" || value === null) {
    return null
  }

  const record = value as Record<string, unknown>
  if (record.type !== "url_citation") {
    return null
  }

  if (
    typeof record.url !== "string" ||
    !isSafeHttpUrl(record.url) ||
    typeof record.start_index !== "number" ||
    typeof record.end_index !== "number" ||
    !Number.isFinite(record.start_index) ||
    !Number.isFinite(record.end_index) ||
    record.start_index < 0 ||
    record.end_index <= record.start_index
  ) {
    return null
  }

  const title =
    typeof record.title === "string" ? record.title.trim().slice(0, MAX_CITATION_LABEL) : ""

  return {
    type: "url_citation",
    url: record.url,
    title,
    start_index: Math.floor(record.start_index),
    end_index: Math.floor(record.end_index),
  }
}

function spanAlreadyLinked(text: string, citation: UrlCitation) {
  const { start_index: start, end_index: end, url } = citation
  if (start > text.length || end > text.length) {
    return true
  }

  const span = text.slice(start, end)
  if (!span.trim()) {
    return true
  }

  // Avoid nesting inside an existing Markdown link.
  if (span.includes("](") || /\[[^\]]*$/.test(text.slice(0, start))) {
    return true
  }

  const around = text.slice(
    Math.max(0, start - 2),
    Math.min(text.length, end + url.length + 8)
  )
  return around.includes(`](${url})`)
}

/**
 * Wrap annotated spans as `[label](url)` from right to left so earlier indices
 * stay valid. Leaves text unchanged when every citation is already linked.
 */
export function applyUrlCitations(
  text: string,
  citations: readonly UrlCitation[]
) {
  if (!text || citations.length === 0) {
    return text
  }

  const ordered = [...citations].sort((left, right) => {
    if (right.start_index !== left.start_index) {
      return right.start_index - left.start_index
    }
    return right.end_index - left.end_index
  })

  let result = text
  let guardEnd = Number.POSITIVE_INFINITY

  for (const citation of ordered) {
    if (citation.end_index > guardEnd) {
      continue
    }
    if (spanAlreadyLinked(result, citation)) {
      continue
    }

    const span = result.slice(citation.start_index, citation.end_index)
    const label = escapeLinkLabel(span) || escapeLinkLabel(citation.title)
    if (!label) {
      continue
    }

    result =
      result.slice(0, citation.start_index) +
      `[${label}](${citation.url})` +
      result.slice(citation.end_index)
    guardEnd = citation.start_index
  }

  return result
}
