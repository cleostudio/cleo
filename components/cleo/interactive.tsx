'use client'

import Link from 'next/link'

import type { CleoInteractiveBlock } from '~/lib/cleo/interactive'
import { cn } from '~/lib/utils'

type InteractiveBlocksProps = {
  block: CleoInteractiveBlock
  className?: string
  disabled?: boolean
  onPrompt?: (prompt: string) => void
}

function PromptButtons({
  items,
  disabled,
  onPrompt,
}: {
  items: Array<{ label: string; prompt: string }>
  disabled?: boolean
  onPrompt?: (prompt: string) => void
}) {
  return (
    <div className="cleo-interactive-actions">
      {items.map((item) => (
        <button
          className="cleo-interactive-action"
          disabled={disabled || !onPrompt}
          key={`${item.label}:${item.prompt}`}
          onClick={() => onPrompt?.(item.prompt)}
          type="button"
        >
          {item.label}
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
        <PromptButtons
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
        {block.prompt ? (
          <p className="cleo-interactive-prompt">{block.prompt}</p>
        ) : null}
        <PromptButtons
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
        <div className="cleo-interactive-actions">
          {block.items.map((item) => (
            <Link
              className="cleo-interactive-action"
              href={item.href}
              key={item.href}
            >
              {item.label}
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
      {block.title ? (
        <p className="cleo-interactive-compare-title">{block.title}</p>
      ) : null}
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
                  <td key={`${row.label}-${block.columns[index]}`}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
