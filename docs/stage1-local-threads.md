# Stage 1 — Local Cleo threads

Zero infrastructure: IndexedDB under the existing AskForm client state.

## Storage schema (`cleo-threads` v1)

| Store | Key | Contents |
| --- | --- | --- |
| `threads` | `id` (UUID) | title, createdAt, updatedAt, lastMessageAt, byteSize |
| `messages` | `id` (UUID) | threadId, seq, role, content, hidden?, incomplete?, activities?, imageIds[] |
| `images` | `id` (UUID) | threadId, messageId, mime, bytes, **blob** (never base64) |
| `reasoning` | `messageId` | threadId, items[], bytes, createdAt, expiresAt |

Thread and message ids are `crypto.randomUUID()` — ready to become Stage 2
Postgres primary keys with no remap.

Location coordinates are never written.

## Caps and eviction

| Cap | Value |
| --- | --- |
| Per thread | 32 MiB |
| All threads | 96 MiB |
| Reasoning / thread | 2 MiB |
| Reasoning TTL | 30 days |

When a thread exceeds the per-thread cap: drop reasoning, then oldest images;
never drop message text. When the origin total exceeds the global cap: purge
expired reasoning, then delete oldest threads by `lastMessageAt`.

## IndexedDB unavailable

`getThreadStore()` opens IndexedDB lazily. Any open/read/write failure returns
an ephemeral driver whose methods no-op (`save` → `false`, `list` → `[]`).
AskForm keeps working in memory exactly as before Stage 1.

## Routes

- `/cleo` — empty chat; first persistable turn creates a UUID and
  `history.replaceState`s to `/cleo/[threadId]`. `/cleo?q=…` creates a thread,
  strips `q`, asks once.
- `/cleo/[threadId]` — client-loaded resume from IndexedDB; shell stays
  prerenderable (`generateStaticParams` → `[]`).

## UI

History dialog: list / resume / rename / delete / new. Auto title from the
first user message (word-boundary truncate); manual rename wins on later saves.
