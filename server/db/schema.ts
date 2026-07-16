import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

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

/**
 * Fixed-window rate limiting shared across serverless instances.
 * Keys are `<scope>:<sha256(ip)>` - raw IPs are never stored.
 */
export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  resetAt: timestamp('reset_at', { withTimezone: true }).notNull()
})

/** Active-visitor heartbeats, shared across serverless instances. */
export const presence = pgTable('presence', {
  visitor: text('visitor').primaryKey(),
  lastSeen: timestamp('last_seen', { withTimezone: true }).notNull()
})

/**
 * Runtime feature flags / site settings, editable from /admin without a
 * deploy. Known keys and their allowed values are validated in the admin
 * endpoint.
 */
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
})
