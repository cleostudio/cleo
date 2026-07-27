'use client'

import {
  type KeyboardEvent,
  Fragment,
  useId,
  useState,
} from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { ZoomImage } from '~/components/zoom-image'
import {
  type CleoInteractiveBlock,
  formatScaleValue,
  isCleoWidgetHref,
} from '~/lib/cleo/interactive'
import { topicPhotoZoomForSrc } from '~/lib/cleo/topic-photo-zoom'
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
        <Link
          className="cleo-widget-inline-link"
          href={href}
          key={`${href}-${match.index}`}
        >
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

function WidgetPhoto({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const zoom = topicPhotoZoomForSrc(src)
  if (!zoom) {
    return null
  }

  return (
    <div className={cn('cleo-widget-photo', className)}>
      <ZoomImage
        alt={alt.trim() || zoom.alt}
        className="cleo-widget-photo-image"
        expandedContent={
          <PhotoZoomDetails
            collection={zoom.collection}
            license={zoom.license}
            photographer={zoom.photographer}
            subtitle={zoom.subtitle}
            title={zoom.title}
          />
        }
        height={zoom.height}
        renditions={zoom.renditions}
        sizes="(max-width: 40rem) 100vw, 22rem"
        src={src}
        width={zoom.width}
      />
    </div>
  )
}

function WidgetShell({
  title,
  className,
  children,
  actions,
}: {
  title?: string
  className?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className={cn('cleo-widget', className)}>
      {title || actions ? (
        <header className="cleo-widget-header">
          {title ? <h3 className="cleo-widget-title">{title}</h3> : null}
          {actions}
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
  const expandableIndexes = block.events
    .map((event, index) => (event.detail ? index : -1))
    .filter((index) => index >= 0)
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set())
  const allOpen =
    expandableIndexes.length > 0 &&
    expandableIndexes.every((index) => open.has(index))

  return (
    <WidgetShell
      actions={
        expandableIndexes.length >= 3 ? (
          <button
            className="cleo-widget-header-action"
            onClick={() =>
              setOpen(allOpen ? new Set() : new Set(expandableIndexes))
            }
            type="button"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        ) : null
      }
      title={block.title}
    >
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
  const expandableIndexes = block.items
    .map((item, index) =>
      item.detail || item.href ? index : -1,
    )
    .filter((index) => index >= 0)
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set())
  const allOpen =
    expandableIndexes.length > 0 &&
    expandableIndexes.every((index) => open.has(index))

  return (
    <WidgetShell
      actions={
        expandableIndexes.length >= 3 ? (
          <button
            className="cleo-widget-header-action"
            onClick={() =>
              setOpen(allOpen ? new Set() : new Set(expandableIndexes))
            }
            type="button"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        ) : null
      }
      title={block.title}
    >
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
  const baseId = useId()
  const [focus, setFocus] = useState(0)
  const focusedLabel = block.columns[focus] ?? block.columns[0]
  const focusedHref = block.hrefs?.[focus]

  function onSubjectsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }
    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next =
      (focus + delta + block.columns.length) % block.columns.length
    setFocus(next)
    document.getElementById(`${baseId}-subject-${next}`)?.focus()
  }

  return (
    <WidgetShell title={block.title}>
      <div
        aria-label={block.title ?? 'Subjects'}
        className="cleo-widget-compare-subjects"
        onKeyDown={onSubjectsKeyDown}
        role="group"
      >
        {block.columns.map((column, index) => (
          <button
            aria-pressed={focus === index}
            className="cleo-widget-compare-subject"
            data-active={focus === index || undefined}
            id={`${baseId}-subject-${index}`}
            key={column}
            onClick={() => setFocus(index)}
            tabIndex={focus === index ? 0 : -1}
            type="button"
          >
            {column}
          </button>
        ))}
      </div>

      <div className="cleo-widget-compare-focus-panel" key={focus}>
        <p className="cleo-widget-compare-focus-label">{focusedLabel}</p>
        <dl className="cleo-widget-compare-focus-list">
          {block.rows.map((row) => (
            <div className="cleo-widget-compare-focus-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.values[focus]}</dd>
            </div>
          ))}
        </dl>
        {focusedHref ? (
          <Link className="cleo-widget-guide-link" href={focusedHref}>
            Open guide
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        ) : null}
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
                    data-dim={focus !== index || undefined}
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
  const progress = ((active + 1) / block.steps.length) * 100

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

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setActive((current) => Math.min(block.steps.length - 1, current + 1))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setActive((current) => Math.max(0, current - 1))
    }
  }

  return (
    <WidgetShell title={block.title}>
      <div className="cleo-widget-steps" onKeyDown={onKeyDown}>
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress)}
          className="cleo-widget-steps-bar"
          role="progressbar"
        >
          <span
            className="cleo-widget-steps-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="cleo-widget-steps-progress">
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
      </div>
    </WidgetShell>
  )
}

function CardsWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'cards' }>
}) {
  const expandableIndexes = block.cards
    .map((card, index) =>
      card.detail || card.href || card.image ? index : -1,
    )
    .filter((index) => index >= 0)
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set())
  const allOpen =
    expandableIndexes.length > 0 &&
    expandableIndexes.every((index) => open.has(index))

  return (
    <WidgetShell
      actions={
        expandableIndexes.length >= 3 ? (
          <button
            className="cleo-widget-header-action"
            onClick={() =>
              setOpen(allOpen ? new Set() : new Set(expandableIndexes))
            }
            type="button"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        ) : null
      }
      title={block.title}
    >
      <div className="cleo-widget-cards">
        {block.cards.map((card, index) => {
          const expandable = Boolean(card.detail || card.href || card.image)
          const isOpen = open.has(index)
          return (
            <article
              className="cleo-widget-card"
              data-open={isOpen || undefined}
              key={`${card.label}-${index}`}
            >
              {card.image ? (
                <WidgetPhoto
                  alt={card.label}
                  className="cleo-widget-card-photo"
                  src={card.image}
                />
              ) : null}
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

function GalleryWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'gallery' }>
}) {
  const [active, setActive] = useState(0)
  const current = block.items[active] ?? block.items[0]
  const multi = block.items.length > 1

  function step(delta: number) {
    setActive(
      (currentIndex) =>
        (currentIndex + delta + block.items.length) % block.items.length,
    )
  }

  function onGalleryKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!multi) {
      return
    }
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }
    event.preventDefault()
    step(event.key === 'ArrowRight' ? 1 : -1)
  }

  return (
    <WidgetShell title={block.title}>
      <div
        className="cleo-widget-gallery"
        onKeyDown={onGalleryKeyDown}
        tabIndex={multi ? 0 : undefined}
      >
        <div className="cleo-widget-gallery-stage" key={active}>
          <WidgetPhoto alt={current.caption} src={current.src} />
          <div className="cleo-widget-gallery-meta">
            <p className="cleo-widget-gallery-caption">{current.caption}</p>
            <div className="cleo-widget-gallery-meta-actions">
              {multi ? (
                <p className="cleo-widget-gallery-counter" aria-live="polite">
                  {active + 1} / {block.items.length}
                </p>
              ) : null}
              {current.href ? (
                <Link className="cleo-widget-guide-link" href={current.href}>
                  Open guide
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {multi ? (
          <>
            <div className="cleo-widget-gallery-nav">
              <button
                className="cleo-widget-gallery-nav-button"
                onClick={() => step(-1)}
                type="button"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
                Previous
              </button>
              <button
                className="cleo-widget-gallery-nav-button"
                onClick={() => step(1)}
                type="button"
              >
                Next
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div
              aria-label="Photographs"
              className="cleo-widget-gallery-thumbs"
              role="listbox"
            >
              {block.items.map((item, index) => {
                const selected = index === active
                const zoom = topicPhotoZoomForSrc(item.src)
                return (
                  <button
                    aria-selected={selected}
                    className="cleo-widget-gallery-thumb"
                    data-active={selected || undefined}
                    key={`${item.src}-${index}`}
                    onClick={() => setActive(index)}
                    role="option"
                    type="button"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- curated static JPEG thumbs */}
                    <img
                      alt=""
                      className="cleo-widget-gallery-thumb-image"
                      height={zoom?.height ?? 80}
                      src={item.src}
                      width={zoom?.width ?? 120}
                    />
                    <span className="sr-only">{item.caption}</span>
                  </button>
                )
              })}
            </div>
          </>
        ) : null}
      </div>
    </WidgetShell>
  )
}

function PathWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'path' }>
}) {
  const [active, setActive] = useState(0)
  const [done, setDone] = useState<ReadonlySet<number>>(() => new Set())
  const stop = block.stops[active] ?? block.stops[0]
  const doneCount = done.size
  const progress = (doneCount / block.stops.length) * 100
  const allDone = doneCount === block.stops.length

  function toggleDone(index: number) {
    setDone((current) => toggleIndex(current, index))
  }

  function markActiveDone() {
    setDone((current) => {
      const next = new Set(current)
      next.add(active)
      return next
    })
    if (active < block.stops.length - 1) {
      setActive((current) => current + 1)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      setActive((current) => Math.min(block.stops.length - 1, current + 1))
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      setActive((current) => Math.max(0, current - 1))
    }
  }

  return (
    <WidgetShell title={block.title}>
      <div className="cleo-widget-path" onKeyDown={onKeyDown}>
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress)}
          className="cleo-widget-path-bar"
          role="progressbar"
        >
          <span
            className="cleo-widget-path-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="cleo-widget-path-meta">
          {allDone
            ? 'Path complete'
            : `${doneCount} of ${block.stops.length} complete`}
        </p>

        <ol className="cleo-widget-path-stops">
          {block.stops.map((item, index) => {
            const isActive = index === active
            const isDone = done.has(index)
            return (
              <li key={`${item.title}-${index}`}>
                <button
                  aria-current={isActive ? 'step' : undefined}
                  className="cleo-widget-path-stop"
                  data-active={isActive || undefined}
                  data-done={isDone || undefined}
                  onClick={() => setActive(index)}
                  type="button"
                >
                  <span className="cleo-widget-path-check" aria-hidden="true">
                    {isDone ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  <span className="cleo-widget-path-stop-title">
                    {item.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="cleo-widget-path-stage" key={active}>
          <h4 className="cleo-widget-path-title">{stop.title}</h4>
          <WidgetProse text={stop.body} />
          {stop.href ? (
            <Link className="cleo-widget-guide-link" href={stop.href}>
              Open guide
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          ) : null}
        </div>

        <div className="cleo-widget-path-controls">
          <button
            className="cleo-widget-path-button"
            onClick={() => toggleDone(active)}
            type="button"
          >
            {done.has(active) ? 'Mark unread' : 'Mark done'}
          </button>
          <button
            className="cleo-widget-path-button"
            data-primary=""
            disabled={allDone && done.has(active)}
            onClick={markActiveDone}
            type="button"
          >
            {active === block.stops.length - 1 || done.has(active) ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                {allDone ? 'Complete' : 'Continue'}
              </>
            ) : (
              <>
                Continue
                <ChevronRight aria-hidden="true" className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </WidgetShell>
  )
}

function ScaleWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'scale' }>
}) {
  const baseId = useId()
  const [focus, setFocus] = useState(0)
  const max = Math.max(...block.items.map((item) => item.value))
  const current = block.items[focus] ?? block.items[0]
  const relative = Math.round((current.value / max) * 100)

  function onListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return
    }
    event.preventDefault()
    const delta = event.key === 'ArrowDown' ? 1 : -1
    const next = (focus + delta + block.items.length) % block.items.length
    setFocus(next)
    document.getElementById(`${baseId}-item-${next}`)?.focus()
  }

  return (
    <WidgetShell title={block.title}>
      <div className="cleo-widget-scale">
        <div
          aria-label={block.title ?? 'Scale'}
          className="cleo-widget-scale-list"
          onKeyDown={onListKeyDown}
          role="listbox"
        >
          {block.items.map((item, index) => {
            const selected = index === focus
            const width = Math.max(4, (item.value / max) * 100)
            return (
              <button
                aria-selected={selected}
                className="cleo-widget-scale-row"
                data-active={selected || undefined}
                id={`${baseId}-item-${index}`}
                key={`${item.label}-${index}`}
                onClick={() => setFocus(index)}
                role="option"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                <span className="cleo-widget-scale-label">{item.label}</span>
                <span className="cleo-widget-scale-track" aria-hidden="true">
                  <span
                    className="cleo-widget-scale-fill"
                    style={{ width: `${width}%` }}
                  />
                </span>
                <span className="cleo-widget-scale-value">
                  {formatScaleValue(item.value)}
                  {block.unit ? (
                    <span className="cleo-widget-scale-unit">
                      {' '}
                      {block.unit}
                    </span>
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>

        <div className="cleo-widget-scale-focus" key={focus}>
          <p className="cleo-widget-scale-focus-label">{current.label}</p>
          <p className="cleo-widget-scale-focus-value">
            {formatScaleValue(current.value)}
            {block.unit ? ` ${block.unit}` : ''}
            {relative < 100 ? (
              <span className="cleo-widget-scale-relative">
                {' '}
                · {relative}% of largest
              </span>
            ) : (
              <span className="cleo-widget-scale-relative"> · largest</span>
            )}
          </p>
          {current.note ? <WidgetProse text={current.note} /> : null}
          {current.href ? (
            <Link className="cleo-widget-guide-link" href={current.href}>
              Open guide
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          ) : null}
        </div>
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
    ) : block.type === 'cards' ? (
      <CardsWidget block={block} />
    ) : block.type === 'gallery' ? (
      <GalleryWidget block={block} />
    ) : block.type === 'path' ? (
      <PathWidget block={block} />
    ) : (
      <ScaleWidget block={block} />
    )

  return <div className={cn('cleo-interactive', className)}>{content}</div>
}
