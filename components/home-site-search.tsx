'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { cleoAskHref } from '~/lib/cleo/ask-link'
import {
  createSiteSearchIndex,
  looksLikeCleoRequest,
  searchSiteCatalog,
  SITE_SEARCH_GROUP_LABEL,
  SITE_SEARCH_KIND_LABEL,
  splitTitleMatches,
  type SiteSearchHit,
  type SiteSearchResult,
} from '~/lib/site-search'

const RESULT_LIMIT = 9

/** Stable default so the memoized index and option list do not churn. */
const NO_SPOTLIGHT: string[] = []

/** A row the visitor can highlight and open. */
type SearchOption =
  | { key: string; href: string; row: 'hit'; result: SiteSearchResult }
  | { key: string; href: string; row: 'ask'; prompt: string }

type OptionGroup = { key: string; label: string; options: SearchOption[] }

function hitOption(hit: SiteSearchHit, titleMatches: [number, number][] = []) {
  return {
    key: hit.id,
    href: hit.href,
    row: 'hit' as const,
    result: { hit, score: 0, titleMatches },
  }
}

function askOption(prompt: string): SearchOption {
  return { key: 'ask-cleo', href: cleoAskHref(prompt), row: 'ask', prompt }
}

/**
 * Matches grouped by kind, each group ordered by its best match, with the Ask
 * Cleo row last — or first when the query reads as a question rather than a
 * name to look up.
 */
function resultGroups(
  results: SiteSearchResult[],
  askPrompt: string,
): OptionGroup[] {
  const groups: OptionGroup[] = []
  const byKind = new Map<string, OptionGroup>()

  for (const result of results) {
    let group = byKind.get(result.hit.kind)
    if (!group) {
      group = {
        key: result.hit.kind,
        label: SITE_SEARCH_GROUP_LABEL[result.hit.kind],
        options: [],
      }
      byKind.set(result.hit.kind, group)
      groups.push(group)
    }
    group.options.push(hitOption(result.hit, result.titleMatches))
  }

  const ask: OptionGroup = {
    key: 'ask',
    label: groups.length === 0 ? 'No catalog match' : 'Ask',
    options: [askOption(askPrompt)],
  }

  return looksLikeCleoRequest(askPrompt) || groups.length === 0
    ? [ask, ...groups]
    : [...groups, ask]
}

function isTypingElsewhere(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

export function HomeSiteSearch({
  hits,
  spotlightIds = NO_SPOTLIGHT,
}: {
  hits: SiteSearchHit[]
  /** Catalog ids offered before the visitor has typed anything. */
  spotlightIds?: string[]
}) {
  const baseId = useId()
  const listboxId = `${baseId}-results`
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [askModifier, setAskModifier] = useState('⌘')

  const index = useMemo(() => createSiteSearchIndex(hits), [hits])
  const trimmed = query.trim()

  const results = useMemo(
    () => searchSiteCatalog(index, trimmed, RESULT_LIMIT),
    [index, trimmed],
  )

  const spotlight = useMemo<OptionGroup[]>(() => {
    const byId = new Map(hits.map((entry) => [entry.id, entry]))
    const options = spotlightIds
      .map((id) => byId.get(id))
      .filter((entry): entry is SiteSearchHit => Boolean(entry))
      .map((entry) => hitOption(entry))
    return options.length > 0
      ? [{ key: 'spotlight', label: 'Start anywhere', options }]
      : []
  }, [hits, spotlightIds])

  const isSearching = trimmed.length > 0
  const groups = useMemo(
    () => (isSearching ? resultGroups(results, trimmed) : spotlight),
    [isSearching, results, spotlight, trimmed],
  )
  const options = useMemo(
    () => groups.flatMap((group) => group.options),
    [groups],
  )
  const isPanelOpen = isOpen && options.length > 0

  // With a query the top match is highlighted by default, so Return always has
  // an obvious target. The quiet empty state highlights nothing until asked.
  const highlighted = options.findIndex((option) => option.key === activeKey)
  const activeIndex = highlighted >= 0 ? highlighted : isSearching ? 0 : -1
  const activeOption = activeIndex >= 0 ? options[activeIndex] : undefined

  useEffect(() => {
    if (!/mac|iphone|ipad|ipod/i.test(navigator.userAgent)) setAskModifier('Ctrl')
  }, [])

  // `/` and ⌘K reach the search bar from anywhere on the page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isSlash = event.key === '/' && !event.metaKey && !event.ctrlKey
      const isCommandK =
        (event.key === 'k' || event.key === 'K') &&
        (event.metaKey || event.ctrlKey)
      if (!isSlash && !isCommandK) return
      if (event.altKey || event.shiftKey) return
      if (isTypingElsewhere(event.target)) return

      event.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!isPanelOpen) return
    panelRef.current
      ?.querySelector('[data-active]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, isPanelOpen])

  function closeAndClear() {
    setQuery('')
    setActiveKey(null)
    setIsOpen(false)
  }

  function openOption(option: SearchOption | undefined) {
    if (!option) return
    closeAndClear()
    router.push(option.href)
  }

  function moveActive(step: number) {
    if (options.length === 0) return
    const from = activeIndex < 0 ? (step > 0 ? -1 : 0) : activeIndex
    const next = (from + step + options.length) % options.length
    setActiveKey(options[next]!.key)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      if (isPanelOpen) setIsOpen(false)
      else if (query) setQuery('')
      return
    }

    if (event.key === 'Enter') {
      // ⌘/Ctrl-Return hands the question to Cleo whatever is highlighted.
      if (isSearching && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        openOption(askOption(trimmed))
        return
      }
      if (!activeOption) return
      event.preventDefault()
      openOption(activeOption)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }
      moveActive(event.key === 'ArrowDown' ? 1 : -1)
      return
    }

    if (!isPanelOpen) return

    if (event.key === 'Home') {
      event.preventDefault()
      setActiveKey(options[0]!.key)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveKey(options.at(-1)!.key)
    }
  }

  return (
    <div
      className="home-site-search"
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return
        setIsOpen(false)
      }}
    >
      <div className="home-site-search-field">
        <input
          ref={inputRef}
          id="home-site-search"
          type="search"
          role="combobox"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveKey(null)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search anything, or ask Cleo"
          aria-label="Search"
          aria-controls={listboxId}
          aria-expanded={isPanelOpen}
          aria-activedescendant={
            isPanelOpen && activeOption ? `${baseId}-${activeOption.key}` : undefined
          }
          aria-autocomplete="list"
          aria-describedby={`${baseId}-hint`}
          autoComplete="off"
          spellCheck={false}
          className="home-site-search-input"
        />
        <kbd className="home-site-search-key" aria-hidden>
          /
        </kbd>
      </div>

      <p className="sr-only" id={`${baseId}-hint`}>
        Countries, space, photographs, and writing. Return opens the highlighted
        result; Command or Control with Return asks Cleo instead.
      </p>

      {isPanelOpen ? (
        <div className="home-site-search-panel" ref={panelRef}>
          <div
            className="home-site-search-groups"
            id={listboxId}
            role="listbox"
            aria-label="Search results"
          >
            {groups.map((group) => (
              <div
                className="home-site-search-group"
                key={group.key}
                role="group"
                aria-label={group.label}
              >
                <p className="home-site-search-group-label" aria-hidden>
                  {group.label}
                </p>
                {group.options.map((option) => (
                  <SearchOptionRow
                    id={`${baseId}-${option.key}`}
                    isActive={option.key === activeOption?.key}
                    key={option.key}
                    onActivate={closeAndClear}
                    onHover={() => setActiveKey(option.key)}
                    option={option}
                  />
                ))}
              </div>
            ))}
          </div>

          {isSearching ? (
            <p className="home-site-search-footer" aria-hidden>
              <span>
                <kbd>↩</kbd> open
              </span>
              <span>
                <kbd>{askModifier}</kbd>
                <kbd>↩</kbd> ask Cleo
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {isSearching
          ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
          : ''}
      </p>
    </div>
  )
}

function SearchOptionRow({
  id,
  isActive,
  onActivate,
  onHover,
  option,
}: {
  id: string
  isActive: boolean
  onActivate: () => void
  onHover: () => void
  option: SearchOption
}) {
  return (
    <Link
      aria-selected={isActive}
      className="home-site-search-row"
      data-active={isActive || undefined}
      href={option.href}
      id={id}
      onNavigate={onActivate}
      // Keep focus — and so the open panel — in the field while a row is clicked.
      onMouseDown={(event) => event.preventDefault()}
      onMouseMove={onHover}
      prefetch={false}
      role="option"
      tabIndex={-1}
    >
      {option.row === 'ask' ? (
        <span className="home-site-search-row-title">
          <span className="home-site-search-row-name">
            <span className="home-site-search-match">{option.prompt}</span>
          </span>
          <span className="home-site-search-row-kind">Ask Cleo</span>
        </span>
      ) : (
        <span className="home-site-search-row-title">
          <span
            className="home-site-search-row-name"
            data-emphasis={option.result.titleMatches.length > 0 || undefined}
          >
            {splitTitleMatches(
              option.result.hit.title,
              option.result.titleMatches,
            ).map((part, partIndex) =>
              part.match ? (
                <span className="home-site-search-match" key={partIndex}>
                  {part.text}
                </span>
              ) : (
                <span key={partIndex}>{part.text}</span>
              ),
            )}
          </span>
          <span className="home-site-search-row-kind">
            {SITE_SEARCH_KIND_LABEL[option.result.hit.kind]}
          </span>
        </span>
      )}
      <span className="home-site-search-row-meta">
        {option.row === 'ask' ? 'AI answer' : option.result.hit.subtitle}
      </span>
    </Link>
  )
}
