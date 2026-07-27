'use client'

import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

import type { CleoInteractiveBlock } from '~/lib/cleo/interactive'
import { cn } from '~/lib/utils'

type InteractiveBlocksProps = {
  block: CleoInteractiveBlock
  className?: string
}

function WidgetShell({
  title,
  eyebrow,
  className,
  children,
}: {
  title?: string
  eyebrow: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('cleo-widget', className)}>
      <div className="cleo-widget-header">
        <p className="cleo-widget-eyebrow">{eyebrow}</p>
        {title ? <p className="cleo-widget-title">{title}</p> : null}
      </div>
      {children}
    </div>
  )
}

function TabsWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'tabs' }>
}) {
  const [active, setActive] = useState(0)
  const current = block.tabs[active] ?? block.tabs[0]

  return (
    <WidgetShell eyebrow="Explore" title={block.title}>
      <div
        aria-label={block.title ?? 'Topic tabs'}
        className="cleo-widget-tabs"
        role="tablist"
      >
        {block.tabs.map((tab, index) => {
          const selected = index === active
          return (
            <button
              aria-controls={`cleo-tab-panel-${index}`}
              aria-selected={selected}
              className="cleo-widget-tab"
              data-active={selected || undefined}
              id={`cleo-tab-${index}`}
              key={`${tab.label}-${index}`}
              onClick={() => setActive(index)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        aria-labelledby={`cleo-tab-${active}`}
        className="cleo-widget-tab-panel"
        id={`cleo-tab-panel-${active}`}
        role="tabpanel"
      >
        {current.body}
      </div>
    </WidgetShell>
  )
}

function QuizWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'quiz' }>
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const revealed = selected !== null
  const correct = selected === block.answer

  return (
    <WidgetShell eyebrow="Quiz" title={block.question}>
      <div className="cleo-widget-quiz-options" role="group">
        {block.options.map((option) => {
          const isSelected = selected === option.id
          const isAnswer = option.id === block.answer
          const state = !revealed
            ? 'idle'
            : isAnswer
              ? 'correct'
              : isSelected
                ? 'wrong'
                : 'idle'

          return (
            <button
              aria-pressed={isSelected}
              className="cleo-widget-quiz-option"
              data-state={state}
              disabled={revealed}
              key={option.id}
              onClick={() => setSelected(option.id)}
              type="button"
            >
              <span className="cleo-widget-quiz-option-label">{option.label}</span>
              {revealed && isAnswer ? (
                <Check aria-hidden="true" className="cleo-widget-quiz-icon" />
              ) : null}
              {revealed && isSelected && !isAnswer ? (
                <X aria-hidden="true" className="cleo-widget-quiz-icon" />
              ) : null}
            </button>
          )
        })}
      </div>
      {revealed ? (
        <div
          className="cleo-widget-quiz-feedback"
          data-state={correct ? 'correct' : 'wrong'}
        >
          <p className="cleo-widget-quiz-result">
            {correct ? 'Correct.' : `Not quite — answer: ${
              block.options.find((option) => option.id === block.answer)?.label ??
              block.answer
            }.`}
          </p>
          {block.explanation ? (
            <p className="cleo-widget-quiz-explanation">{block.explanation}</p>
          ) : null}
        </div>
      ) : (
        <p className="cleo-widget-hint">Tap an answer to check it.</p>
      )}
    </WidgetShell>
  )
}

function TimelineWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'timeline' }>
}) {
  const [open, setOpen] = useState<number | null>(
    block.events.findIndex((event) => event.detail) >= 0
      ? block.events.findIndex((event) => event.detail)
      : null,
  )

  return (
    <WidgetShell eyebrow="Timeline" title={block.title}>
      <ol className="cleo-widget-timeline">
        {block.events.map((event, index) => {
          const expandable = Boolean(event.detail)
          const isOpen = open === index
          return (
            <li className="cleo-widget-timeline-item" key={`${event.when}-${event.title}`}>
              <div className="cleo-widget-timeline-rail" aria-hidden="true" />
              {expandable ? (
                <button
                  aria-expanded={isOpen}
                  className="cleo-widget-timeline-trigger"
                  onClick={() => setOpen(isOpen ? null : index)}
                  type="button"
                >
                  <span className="cleo-widget-timeline-when">{event.when}</span>
                  <span className="cleo-widget-timeline-title">{event.title}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className="cleo-widget-timeline-chevron"
                    data-open={isOpen || undefined}
                  />
                </button>
              ) : (
                <div className="cleo-widget-timeline-trigger" data-static="">
                  <span className="cleo-widget-timeline-when">{event.when}</span>
                  <span className="cleo-widget-timeline-title">{event.title}</span>
                </div>
              )}
              {expandable && isOpen ? (
                <p className="cleo-widget-timeline-detail">{event.detail}</p>
              ) : null}
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
  const [open, setOpen] = useState<number | null>(null)

  return (
    <WidgetShell eyebrow="Facts" title={block.title}>
      <div className="cleo-widget-facts">
        {block.items.map((item, index) => {
          const expandable = Boolean(item.detail)
          const isOpen = open === index
          return (
            <div className="cleo-widget-fact" key={`${item.label}-${item.value}`}>
              {expandable ? (
                <button
                  aria-expanded={isOpen}
                  className="cleo-widget-fact-row"
                  onClick={() => setOpen(isOpen ? null : index)}
                  type="button"
                >
                  <span className="cleo-widget-fact-label">{item.label}</span>
                  <span className="cleo-widget-fact-value">{item.value}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className="cleo-widget-fact-chevron"
                    data-open={isOpen || undefined}
                  />
                </button>
              ) : (
                <div className="cleo-widget-fact-row" data-static="">
                  <span className="cleo-widget-fact-label">{item.label}</span>
                  <span className="cleo-widget-fact-value">{item.value}</span>
                </div>
              )}
              {expandable && isOpen ? (
                <p className="cleo-widget-fact-detail">{item.detail}</p>
              ) : null}
            </div>
          )
        })}
      </div>
      {block.items.some((item) => item.detail) ? (
        <p className="cleo-widget-hint">Tap a fact to expand it.</p>
      ) : null}
    </WidgetShell>
  )
}

function CompareWidget({
  block,
}: {
  block: Extract<CleoInteractiveBlock, { type: 'compare' }>
}) {
  const [focus, setFocus] = useState<number | null>(null)

  return (
    <WidgetShell eyebrow="Compare" title={block.title}>
      <div className="cleo-widget-compare-scroll">
        <table className="cleo-widget-compare-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Attribute</span>
              </th>
              {block.columns.map((column, index) => (
                <th key={column} scope="col">
                  <button
                    aria-pressed={focus === index}
                    className="cleo-widget-compare-focus"
                    data-active={focus === index || undefined}
                    onClick={() => setFocus(focus === index ? null : index)}
                    type="button"
                  >
                    {column}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td
                    data-focus={focus === index || undefined}
                    data-dim={focus !== null && focus !== index || undefined}
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
      <p className="cleo-widget-hint">Tap a column name to focus it.</p>
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
    ) : block.type === 'quiz' ? (
      <QuizWidget block={block} />
    ) : block.type === 'timeline' ? (
      <TimelineWidget block={block} />
    ) : block.type === 'facts' ? (
      <FactsWidget block={block} />
    ) : (
      <CompareWidget block={block} />
    )

  return <div className={cn('cleo-interactive', className)}>{content}</div>
}
