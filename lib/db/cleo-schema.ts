import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { user } from '~/lib/db/auth-schema'

/**
 * Cleo turn feedback (Phase B). Stores rating + short critique and capped
 * excerpts for offline eval triage — not a full transcript warehouse.
 */
export const cleoFeedback = pgTable(
  'cleo_feedback',
  {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    /** Signed-in owner; null for guest feedback. */
    userId: text('user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    /** Privacy-preserving guest correlator when `userId` is null. */
    guestKeyHash: text('guest_key_hash'),
    /** Client-generated turn id (one feedback row per turn). */
    turnId: text('turn_id').notNull().unique(),
    /** `up` | `down` */
    rating: text('rating').notNull(),
    /** Optional short critique (feeds Optimize / meta-prompt). */
    comment: text('comment'),
    promptHash: text('prompt_hash').notNull(),
    assistantHash: text('assistant_hash').notNull(),
    promptExcerpt: text('prompt_excerpt'),
    assistantExcerpt: text('assistant_excerpt'),
    /** Server-computed: assistant Markdown had invented portal paths/images. */
    inventedPaths: boolean('invented_paths').default(false).notNull(),
  },
  (table) => [
    index('cleo_feedback_userId_idx').on(table.userId),
    index('cleo_feedback_createdAt_idx').on(table.createdAt),
    index('cleo_feedback_rating_idx').on(table.rating),
  ],
)

export const cleoFeedbackRelations = relations(cleoFeedback, ({ one }) => ({
  user: one(user, {
    fields: [cleoFeedback.userId],
    references: [user.id],
  }),
}))
