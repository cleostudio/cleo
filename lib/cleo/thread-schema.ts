import { relations, sql } from 'drizzle-orm'
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { user } from '~/lib/auth-schema'

/**
 * Application thread tables (plan §3.1).
 * FK to Better Auth `user.id`. Image bytes are Stage 3 — only metadata here.
 */

export const thread = pgTable(
  'thread',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('thread_user_last_message_idx')
      .on(table.userId, table.lastMessageAt)
      .where(sql`${table.deletedAt} is null`),
  ],
)

export const message = pgTable(
  'message',
  {
    id: text('id').primaryKey(),
    threadId: text('thread_id')
      .notNull()
      .references(() => thread.id, { onDelete: 'cascade' }),
    seq: integer('seq').notNull(),
    role: text('role').notNull(), // 'user' | 'assistant'
    content: text('content').notNull().default(''),
    status: text('status').notNull(), // 'complete' | 'incomplete' | 'error'
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('message_thread_seq_uidx').on(table.threadId, table.seq),
  ],
)

export const messageImage = pgTable('message_image', {
  id: text('id').primaryKey(),
  messageId: text('message_id')
    .notNull()
    .references(() => message.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(), // 'attachment' | 'generated'
  blobPathname: text('blob_pathname').notNull(),
  mime: text('mime').notNull(),
  bytes: integer('bytes').notNull(),
  width: integer('width'),
  height: integer('height'),
  position: integer('position').notNull(),
})

export const messageReasoning = pgTable('message_reasoning', {
  messageId: text('message_id')
    .primaryKey()
    .references(() => message.id, { onDelete: 'cascade' }),
  items: jsonb('items').notNull(),
  bytes: integer('bytes').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
})

export const threadRelations = relations(thread, ({ many, one }) => ({
  user: one(user, { fields: [thread.userId], references: [user.id] }),
  messages: many(message),
}))

export const messageRelations = relations(message, ({ one, many }) => ({
  thread: one(thread, {
    fields: [message.threadId],
    references: [thread.id],
  }),
  images: many(messageImage),
  reasoning: one(messageReasoning, {
    fields: [message.id],
    references: [messageReasoning.messageId],
  }),
}))

export const messageImageRelations = relations(messageImage, ({ one }) => ({
  message: one(message, {
    fields: [messageImage.messageId],
    references: [message.id],
  }),
}))

export const messageReasoningRelations = relations(
  messageReasoning,
  ({ one }) => ({
    message: one(message, {
      fields: [messageReasoning.messageId],
      references: [message.id],
    }),
  }),
)
