'use client'

import { History, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '~/components/cleo/ui/button'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  deleteThread,
  listThreads,
  renameThread,
  type StoredThreadMeta,
} from '~/lib/cleo/thread-store'
import { cn } from '~/lib/utils'

function formatThreadWhen(timestamp: number) {
  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(timestamp))
  } catch {
    return ''
  }
}

export function ThreadToolbar({
  currentThreadId,
  listVersion,
  onNewThread,
  onOpenThread,
  onThreadsChanged,
}: {
  currentThreadId: string | null
  listVersion: number
  onNewThread: () => void
  onOpenThread: (threadId: string) => void
  onThreadsChanged: () => void
}) {
  const [open, setOpen] = useState(false)
  const [threads, setThreads] = useState<StoredThreadMeta[]>([])
  const [available, setAvailable] = useState(true)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  useEffect(() => {
    let cancelled = false
    void listThreads()
      .then((rows) => {
        if (!cancelled) {
          setThreads(rows)
          setAvailable(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setThreads([])
          setAvailable(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [listVersion, open])

  async function handleDelete(threadId: string) {
    await deleteThread(threadId)
    setThreads((current) => current.filter((thread) => thread.id !== threadId))
    onThreadsChanged()
    if (threadId === currentThreadId) {
      setOpen(false)
      onNewThread()
    }
  }

  async function handleRenameSubmit(threadId: string) {
    const ok = await renameThread(threadId, renameValue)
    if (ok) {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? { ...thread, title: renameValue.trim() }
            : thread,
        ),
      )
      onThreadsChanged()
    }
    setRenamingId(null)
    setRenameValue('')
  }

  return (
    <div className="cleo-thread-toolbar app-column">
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          aria-label="Conversation history"
          className="cleo-thread-toolbar-button"
          onClick={() => setOpen(true)}
          size="sm"
          type="button"
          variant="ghost"
        >
          <History aria-hidden="true" className="size-4" />
          <span>History</span>
        </Button>

        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Conversations</DialogTitle>
            <DialogClose aria-label="Close conversations">Close</DialogClose>
          </DialogHeader>
          <DialogBody>
            {!available ? (
              <p className="text-sm text-muted-foreground">
                Local history is unavailable in this browser. Cleo still works;
                conversations just will not survive a reload.
              </p>
            ) : threads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No saved conversations yet. Ask something and it will show up
                here.
              </p>
            ) : (
              <ul className="cleo-thread-list">
                {threads.map((thread) => {
                  const active = thread.id === currentThreadId
                  const renaming = renamingId === thread.id
                  return (
                    <li
                      className={cn(
                        'cleo-thread-list-item',
                        active && 'cleo-thread-list-item-active',
                      )}
                      key={thread.id}
                    >
                      {renaming ? (
                        <form
                          className="cleo-thread-rename"
                          onSubmit={(event) => {
                            event.preventDefault()
                            void handleRenameSubmit(thread.id)
                          }}
                        >
                          <input
                            aria-label="Conversation title"
                            autoFocus
                            className="cleo-thread-rename-input"
                            onChange={(event) =>
                              setRenameValue(event.target.value)
                            }
                            value={renameValue}
                          />
                          <button className="cleo-thread-icon-button" type="submit">
                            Save
                          </button>
                        </form>
                      ) : (
                        <>
                          <button
                            className="cleo-thread-list-open"
                            onClick={() => {
                              setOpen(false)
                              onOpenThread(thread.id)
                            }}
                            type="button"
                          >
                            <span className="cleo-thread-list-title">
                              {thread.title}
                            </span>
                            <span className="cleo-thread-list-when">
                              {formatThreadWhen(thread.lastMessageAt)}
                            </span>
                          </button>
                          <div className="cleo-thread-list-actions">
                            <button
                              aria-label={`Rename ${thread.title}`}
                              className="cleo-thread-icon-button"
                              onClick={() => {
                                setRenamingId(thread.id)
                                setRenameValue(thread.title)
                              }}
                              type="button"
                            >
                              <Pencil aria-hidden="true" className="size-3.5" />
                            </button>
                            <button
                              aria-label={`Delete ${thread.title}`}
                              className="cleo-thread-icon-button"
                              onClick={() => {
                                void handleDelete(thread.id)
                              }}
                              type="button"
                            >
                              <Trash2 aria-hidden="true" className="size-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpen(false)
                onNewThread()
              }}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Plus aria-hidden="true" className="size-4" />
              New conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        aria-label="New conversation"
        className="cleo-thread-toolbar-button"
        onClick={onNewThread}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Plus aria-hidden="true" className="size-4" />
        <span>New</span>
      </Button>
    </div>
  )
}
