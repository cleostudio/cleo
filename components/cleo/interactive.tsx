'use client'

import Link from 'next/link'
import { ArrowUpRight, ChevronRight, MessageCircle } from 'lucide-react'

import type { CleoInteractiveBlock } from '~/lib/cleo/interactive'
import { cn } from '~/lib/utils'

type InteractiveBlocksProps = {
  block: CleoInteractiveBlock
  className?: string
  disabled?: boolean
  onPrompt?: (prompt: string) => void
}

function FollowUpButtons({
  items,
  disabled,
  onPrompt,
}: {
  items: Array<{ label: string; prompt: string }>
  disabled?: boolean
  onPrompt?: (prompt: string) => void
}) {
  return (
    <div className="cleo-interactive-followups">
      {items.map((item) => (
        <button
          className="cleo-interactive-chip"
          disabled={disabled || !onPrompt}
          key={`${item.label}:${item.prompt}`}
          onClick={() => onPrompt?.(item.prompt)}
          type="button"
        >
          <MessageCircle aria-hidden="true" className="cleo-interactive-chip-icon" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

function ChoiceCards({
  items,
  disabled,
  onPrompt,
}: {
  items: Array<{ label: string; prompt: string }>
  disabled?: boolean
  onPrompt?: (prompt: string) => void
}) {
  return (
    <div className="cleo-interactive-choice-list">
      {items.map((item) => (
        <button
          className="cleo-interactive-choice"
          disabled={disabled || !onPrompt}
          key={`${item.label}:${item.prompt}`}
          onClick={() => onPrompt?.(item.prompt)}
          type="button"
        >
          <span className="cleo-interactive-choice-label">{item.label}</span>
          <ChevronRight
            aria-hidden="true"
            className="cleo-interactive-choice-chevron"
          />
        </button>
      ))}
    </div>
  )
}

export function InteractiveBlock({
  block,
  className,
  disabled = false,
  onPrompt,
}: InteractiveBlocksProps) {
  if (block.type === 'follow_ups') {
    return (
      <div
        aria-label="Suggested follow-ups"
        className={cn('cleo-interactive', className)}
        role="group"
      >
        <p className="cleo-interactive-eyebrow">Continue</p>
        <FollowUpButtons
          disabled={disabled}
          items={block.items}
          onPrompt={onPrompt}
        />
      </div>
    )
  }

  if (block.type === 'choices') {
    return (
      <div
        aria-label="Choices"
        className={cn('cleo-interactive', className)}
        role="group"
      >
        <p className="cleo-interactive-eyebrow">
          {block.prompt ?? 'Choose a direction'}
        </p>
        <ChoiceCards
          disabled={disabled}
          items={block.items}
          onPrompt={onPrompt}
        />
      </div>
    )
  }

  if (block.type === 'portal_actions') {
    return (
      <div
        aria-label="Portal actions"
        className={cn('cleo-interactive', className)}
        role="group"
      >
        <p className="cleo-interactive-eyebrow">Open on Cleo</p>
        <div className="cleo-interactive-portal-list">
          {block.items.map((item) => (
            <Link
              className="cleo-interactive-portal"
              href={item.href}
              key={item.href}
            >
              <span className="cleo-interactive-portal-label">{item.label}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="cleo-interactive-portal-icon"
              />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      aria-label={block.title ?? 'Comparison'}
      className={cn('cleo-interactive cleo-interactive-compare', className)}
    >
      <div className="cleo-interactive-compare-plate">
        {block.title ? (
          <p className="cleo-interactive-compare-title">{block.title}</p>
        ) : (
          <p className="cleo-interactive-eyebrow">Compare</p>
        )}
        <div className="cleo-interactive-compare-scroll">
          <table className="cleo-interactive-compare-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Attribute</span>
                </th>
                {block.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, index) => (
                    <td key={`${row.label}-${block.columns[index]}`}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
