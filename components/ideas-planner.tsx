'use client'

import {
  type FormEvent,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from 'react'

import { TopicsBlueprintStage } from '~/components/hidden-list-stage'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import {
  addIdea,
  type Idea,
  readIdeasFromStorage,
  removeIdea,
  sortIdeas,
  toggleIdeaDone,
  writeIdeasToStorage,
} from '~/lib/ideas'
import { T } from '~/lib/i18n'
import { cn } from '~/lib/utils'

function subscribeIdeas(_onStoreChange: () => void) {
  // Storage is owned by this component; no cross-tab sync for v1.
  return () => {}
}

function getServerIdeasSnapshot(): Idea[] {
  return []
}

export function IdeasPlanner() {
  const titleId = useId()
  const noteId = useId()
  const [hydrated, setHydrated] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')

  // Avoid SSR/client mismatch: storage is read only after mount.
  const ready = useSyncExternalStore(
    subscribeIdeas,
    () => hydrated,
    () => false,
  )

  useEffect(() => {
    setIdeas(readIdeasFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeIdeasToStorage(ideas)
  }, [ideas, hydrated])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = addIdea(ideas, title, note)
    if (next === ideas) return
    setIdeas(next)
    setTitle('')
    setNote('')
  }

  const sorted = sortIdeas(ideas)
  const openCount = ideas.filter((idea) => !idea.done).length

  return (
    <div className="mt-8">
      <form className="idea-composer" onSubmit={onSubmit}>
        <div className="idea-composer-fields">
          <Input
            id={titleId}
            label={<T zh="想法" en="Idea" />}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A topic, guide, or experiment worth trying"
            maxLength={200}
            autoComplete="off"
            required
          />
          <label className="idea-note-label" htmlFor={noteId}>
            <span className="text-sm text-muted-foreground">
              <T zh="备注（可选）" en="Notes (optional)" />
            </span>
            <Textarea
              id={noteId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Why it matters, next step, or constraints"
              maxLength={2000}
              rows={3}
            />
          </label>
        </div>
        <div className="idea-composer-actions">
          <Button type="submit" variant="primary" size="lg" disabled={!title.trim()}>
            <T zh="加入列表" en="Add idea" />
          </Button>
          <p className="idea-composer-hint text-sm text-muted-foreground">
            <T
              zh="保存在本机浏览器，刷新后仍在。"
              en="Saved in this browser only. Clears if site data is wiped."
            />
          </p>
        </div>
      </form>

      <TopicsBlueprintStage className="mt-10">
        {!ready ? (
          <p className="text-sm text-muted-foreground">
            <T zh="加载想法…" en="Loading ideas…" />
          </p>
        ) : sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            <T
              zh="还没有想法。写下下一篇写作、一个新主题，或一条值得探索的线索。"
              en="No ideas yet. Capture the next essay, topic, or trail worth exploring."
            />
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              <T
                zh={`${openCount} 条进行中 · 共 ${ideas.length} 条`}
                en={`${openCount} open · ${ideas.length} total`}
              />
            </p>
            <ul className="focus-list flex flex-col">
              {sorted.map((idea, index) => (
                <li
                  key={idea.id}
                  className="enter-swing"
                  style={
                    {
                      '--enter-delay': `${120 + Math.min(index, 8) * 40}ms`,
                    } as React.CSSProperties
                  }
                >
                  <IdeaRow
                    idea={idea}
                    index={index}
                    onToggle={() => setIdeas((current) => toggleIdeaDone(current, idea.id))}
                    onRemove={() => setIdeas((current) => removeIdea(current, idea.id))}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </TopicsBlueprintStage>
    </div>
  )
}

function IdeaRow({
  idea,
  index,
  onToggle,
  onRemove,
}: {
  idea: Idea
  index: number
  onToggle: () => void
  onRemove: () => void
}) {
  return (
    <div
      className={cn('idea-row hairline-top', idea.done && 'idea-row-done')}
      data-list-stage-row
      data-list-stage-id={idea.id}
    >
      <span
        className="idea-index tabular-nums text-muted-foreground"
        aria-hidden
        data-list-stage-anchor
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="idea-body">
        <p className="idea-title font-medium text-foreground">{idea.title}</p>
        {idea.note ? (
          <p className="idea-note text-muted-foreground">{idea.note}</p>
        ) : null}
      </div>
      <div className="idea-actions">
        <button type="button" className="idea-action" onClick={onToggle}>
          <T zh={idea.done ? '重开' : '完成'} en={idea.done ? 'Reopen' : 'Done'} />
        </button>
        <button type="button" className="idea-action" onClick={onRemove}>
          <T zh="删除" en="Remove" />
        </button>
      </div>
    </div>
  )
}
