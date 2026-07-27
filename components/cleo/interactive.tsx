'use client'

import {
  type KeyboardEvent,
  Fragment,
  useId,
  useState,
} from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

import {
  type CleoInteractiveBlock,
  isCleoWidgetHref,
} from '~/lib/cleo/interactive'
import { cn } from '~/lib/utils'

type InteractiveBlocksProps = {
  block: CleoInteractiveBlock
  className?: string
}

const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

function toggleIndex(open: ReadonlySet<number>, index: number) {
  const next = new Set(open)
  if (next.has(index)) {
    next.delete(index)
  } else {
    next.add(index)
  }
  return next
}

/** Plain widget copy with optional same-site Markdown links. */
function WidgetProse({ text, className }: { text: string; className?: string }) {
  const nodes: React.ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null
  const pattern = new RegExp(MARKDOWN_LINK.source, 'g')

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index))
    }

    const label = match[1]
    const href = match[2]
    if (href && isCleoWidgetHref(href)) {
      nodes.push(
        <Link className="cleo-widget-inline-link" href={href} key={`${href}-${match.index}`}>
          {label}
        </Link>,
      )
    } else {
      nodes.push(label)
    }

    cursor = match.index + match[0].length
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor))
  }

  return (
    <div className={cn('cleo-widget-prose', className)}>
      {nodes.map((node, index) => (
        <Fragment key={index}>{node}</Fragment>
      ))}
    </div>
  )
}

function WidgetShell({
  title,
  className,
  children,
}: {
  title?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('cleo-widget', className)}>
      {title ? (
        <header className="cleo-widget-header">
          <h3 className="cleo-widget-title">{title}</h3>
        </header>
      ) : null}
      {children}
    </div>
  )
}

function TabsWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'tabs' }>
}) {
  const baseId = useId()
  const [active, setActive] = useState(0)
  const current = block.tabs[active] ?? block.tabs[0]

  function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }

    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next = (active + delta + block.tabs.length) % block.tabs.length
    setActive(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  return (
    <WidgetShell title={block.title}>
      <div
        aria-label={block.title ?? 'Sections'}
        className="cleo-widget-tabs"
        onKeyDown={onTabListKeyDown}
        role="tablist"
      >
        {block.tabs.map((tab, index) => {
          const selected = index === active
          return (
            <button
              aria-controls={`${baseId}-panel-${index}`}
              aria-selected={selected}
              className="cleo-widget-tab"
              data-active={selected || undefined}
              id={`${baseId}-tab-${index}`}
              key={`${tab.label}-${index}`}
              onClick={() => setActive(index)}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        aria-labelledby={`${baseId}-tab-${active}`}
        className="cleo-widget-tab-panel"
        id={`${baseId}-panel-${active}`}
        key={active}
        role="tabpanel"
      >
        <WidgetProse text={current.body} />
      </div>
    </WidgetShell>
  )
}

function TimelineWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'timeline' }>
}) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set())

  return (
    <WidgetShell title={block.title}>
      <ol className="cleo-widget-timeline">
        {block.events.map((event, index) => {
          const expandable = Boolean(event.detail)
          const isOpen = open.has(index)
          return (
            <li
              className="cleo-widget-timeline-item"
              data-open={isOpen || undefined}
              key={`${event.when}-${event.title}`}
            >
              <div className="cleo-widget-timeline-marker" aria-hidden="true">
                <span className="cleo-widget-timeline-dot" />
                <span className="cleo-widget-timeline-line" />
              </div>
              {expandable ? (
                <button
                  aria-expanded={isOpen}
                  className="cleo-widget-timeline-card"
                  onClick={() =>
                    setOpen((current) => toggleIndex(current, index))
                  }
                  type="button"
                >
                  <span className="cleo-widget-timeline-when">{event.when}</span>
                  <span className="cleo-widget-timeline-title-row">
                    <span className="cleo-widget-timeline-title">
                      {event.title}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className="cleo-widget-chevron"
                      data-open={isOpen || undefined}
                    />
                  </span>
                  {isOpen && event.detail ? (
                    <WidgetProse
                      className="cleo-widget-timeline-detail"
                      text={event.detail}
                    />
                  ) : null}
                </button>
              ) : (
                <div className="cleo-widget-timeline-card" data-static="">
                  <span className="cleo-widget-timeline-when">{event.when}</span>
                  <span className="cleo-widget-timeline-title">{event.title}</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </WidgetShell>
  )
}

function FactsWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'facts' }>
}) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set())

  return (
    <WidgetShell title={block.title}>
      <div className="cleo-widget-facts">
        {block.items.map((item, index) => {
          const expandable = Boolean(item.detail || item.href)
          const isOpen = open.has(index)
          return (
            <div
              className="cleo-widget-fact"
              data-open={isOpen || undefined}
              key={`${item.label}-${item.value}`}
            >
              {expandable ? (
                <button
                  aria-expanded={isOpen}
                  className="cleo-widget-fact-row"
                  onClick={() =>
                    setOpen((current) => toggleIndex(current, index))
                  }
                  type="button"
                >
                  <span className="cleo-widget-fact-copy">
                    <span className="cleo-widget-fact-label">{item.label}</span>
                    <span className="cleo-widget-fact-value">{item.value}</span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="cleo-widget-chevron"
                    data-open={isOpen || undefined}
                  />
                </button>
              ) : (
                <div className="cleo-widget-fact-row" data-static="">
                  <span className="cleo-widget-fact-copy">
                    <span className="cleo-widget-fact-label">{item.label}</span>
                    <span className="cleo-widget-fact-value">{item.value}</span>
                  </span>
                </div>
              )}
              {isOpen ? (
                <div className="cleo-widget-fact-panel">
                  {item.detail ? <WidgetProse text={item.detail} /> : null}
                  {item.href ? (
                    <Link className="cleo-widget-guide-link" href={item.href}>
                      Open guide
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </WidgetShell>
  )
}

function CompareWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'compare' }>
}) {
  const [focus, setFocus] = useState<number | null>(0)

  return (
    <WidgetShell title={block.title}>
      <div className="cleo-widget-compare-subjects" role="group">
        {block.columns.map((column, index) => (
          <button
            aria-pressed={focus === index}
            className="cleo-widget-compare-subject"
            data-active={focus === index || undefined}
            key={column}
            onClick={() => setFocus(focus === index ? null : index)}
            type="button"
          >
            {column}
          </button>
        ))}
      </div>
      <div className="cleo-widget-compare-scroll">
        <table className="cleo-widget-compare-table">
          <caption className="sr-only">{block.title ?? 'Comparison'}</caption>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td
                    data-dim={
                      (focus !== null && focus !== index) || undefined
                    }
                    data-focus={focus === index || undefined}
                    key={`${row.label}-${block.columns[index]}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetShell>
  )
}

function StepsWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'steps' }>
}) {
  const [active, setActive] = useState(0)
  const [done, setDone] = useState<ReadonlySet<number>>(() => new Set())
  const step = block.steps[active] ?? block.steps[0]
  const isLast = active === block.steps.length - 1
  const isDone = done.has(active)

  function markDoneAndAdvance() {
    setDone((current) => {
      const next = new Set(current)
      next.add(active)
      return next
    })
    if (!isLast) {
      setActive((current) => current + 1)
    }
  }

  return (
    <WidgetShell title={block.title}>
      <div className="cleo-widget-steps-progress" aria-hidden="true">
        {block.steps.map((item, index) => (
          <button
            className="cleo-widget-steps-dot"
            data-active={index === active || undefined}
            data-done={done.has(index) || undefined}
            key={`${item.title}-${index}`}
            onClick={() => setActive(index)}
            type="button"
          >
            <span className="sr-only">
              Step {index + 1}: {item.title}
            </span>
          </button>
        ))}
      </div>

      <div className="cleo-widget-steps-stage" key={active}>
        <p className="cleo-widget-steps-meta">
          Step {active + 1} of {block.steps.length}
        </p>
        <h4 className="cleo-widget-steps-title">{step.title}</h4>
        <WidgetProse text={step.body} />
      </div>

      <div className="cleo-widget-steps-controls">
        <button
          className="cleo-widget-steps-button"
          disabled={active === 0}
          onClick={() => setActive((current) => Math.max(0, current - 1))}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Back
        </button>
        <button
          className="cleo-widget-steps-button"
          data-primary=""
          onClick={markDoneAndAdvance}
          type="button"
        >
          {isDone || isLast ? (
            <>
              <Check aria-hidden="true" className="size-4" />
              {isLast ? 'Done' : 'Continue'}
            </>
          ) : (
            <>
              Continue
              <ChevronRight aria-hidden="true" className="size-4" />
            </>
          )}
        </button>
      </div>
    </WidgetShell>
  )
}

function CardsWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'cards' }>
}) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set())

  return (
    <WidgetShell title={block.title}>
      <div className="cleo-widget-cards">
        {block.cards.map((card, index) => {
          const expandable = Boolean(card.detail || card.href)
          const isOpen = open.has(index)
          return (
            <article
              className="cleo-widget-card"
              data-open={isOpen || undefined}
              key={`${card.label}-${index}`}
            >
              {expandable ? (
                <button
                  aria-expanded={isOpen}
                  className="cleo-widget-card-trigger"
                  onClick={() =>
                    setOpen((current) => toggleIndex(current, index))
                  }
                  type="button"
                >
                  <span className="cleo-widget-card-label">{card.label}</span>
                  <span className="cleo-widget-card-summary">{card.summary}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className="cleo-widget-chevron"
                    data-open={isOpen || undefined}
                  />
                </button>
              ) : (
                <div className="cleo-widget-card-trigger" data-static="">
                  <span className="cleo-widget-card-label">{card.label}</span>
                  <span className="cleo-widget-card-summary">{card.summary}</span>
                </div>
              )}
              {isOpen ? (
                <div className="cleo-widget-card-panel">
                  {card.detail ? <WidgetProse text={card.detail} /> : null}
                  {card.href ? (
                    <Link className="cleo-widget-guide-link" href={card.href}>
                      Open guide
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </WidgetShell>
  )
}

export function InteractiveBlock({
  block,
  className,
}: InteractiveBlocksProps) {
  const content =
    block.type === 'tabs' ? (
      <TabsWidget block={block} />
    ) : block.type === 'timeline' ? (
      <TimelineWidget block={block} />
    ) : block.type === 'facts' ? (
      <FactsWidget block={block} />
    ) : block.type === 'compare' ? (
      <CompareWidget block={block} />
    ) : block.type === 'steps' ? (
      <StepsWidget block={block} />
    ) : (
      <CardsWidget block={block} />
    )

  return <div className={cn('cleo-interactive', className)}>{content}</div>
}
