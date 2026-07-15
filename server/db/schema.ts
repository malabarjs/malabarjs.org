import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * One table for every form. The form's Zod schema (shared/forms) validates
 * the payload before insert; `data` holds the validated submission as-is so
 * new forms need no schema migration.
 */
export const formSubmissions = pgTable(
  'form_submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    formSlug: text('form_slug').notNull(),
    email: text('email'),
    data: jsonb('data').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  table => [
    index('form_submissions_slug_idx').on(table.formSlug),
    index('form_submissions_created_at_idx').on(table.createdAt)
  ]
)

export type FormSubmission = typeof formSubmissions.$inferSelect
export type NewFormSubmission = typeof formSubmissions.$inferInsert
