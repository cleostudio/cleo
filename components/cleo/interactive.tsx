'use client'

import {
  type KeyboardEvent,
  useId,
  useState,
} from 'react'
import { ChevronDown } from 'lucide-react'

import type { CleoInteractiveBlock } from '~/lib/cleo/interactive'
import { cn } from '~/lib/utils'

type InteractiveBlocksProps = {
  block: CleoInteractiveBlock
  className?: string
}

function toggleIndex(open: ReadonlySet<number>, index: number) {
  const next = new Set(open)
  if (next.has(index)) {
    next.delete(index)
  } else {
    next.add(index)
  }
  return next
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
    const next =
      (active + delta + block.tabs.length) % block.tabs.length
    setActive(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  return (
    <WidgetShell className="cleo-widget-tabs-shell" title={block.title}>
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
        {current.body}
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
                  onClick={() => setOpen((current) => toggleIndex(current, index))}
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
                  {isOpen ? (
                    <span className="cleo-widget-timeline-detail">
                      {event.detail}
                    </span>
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
          const expandable = Boolean(item.detail)
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
                  onClick={() => setOpen((current) => toggleIndex(current, index))}
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
              {expandable && isOpen ? (
                <p className="cleo-widget-fact-detail">{item.detail}</p>
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
          <caption className="sr-only">
            {block.title ?? 'Comparison'}
          </caption>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td
                    data-focus={focus === index || undefined}
                    data-dim={
                      (focus !== null && focus !== index) || undefined
                    }
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
    ) : (
      <CompareWidget block={block} />
    )

  return <div className={cn('cleo-interactive', className)}>{content}</div>
}
