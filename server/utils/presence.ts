import { sql } from 'drizzle-orm'
import { useDb, schema } from '../db'
import { touchActive, countActive } from './active'

const ACTIVE_WINDOW = sql`now() - interval '60 seconds'`

/**
 * Postgres-backed active-visitor tracking, so the "reading now" count is
 * accurate across serverless instances. Falls back to the per-instance
 * in-memory tracker if the database is unreachable.
 */
export const touchPresence = async (visitor: string) => {
  try {
    const db = useDb()
    await db
      .insert(schema.presence)
      .values({ visitor, lastSeen: sql`now()` as never })
      .onConflictDoUpdate({
        target: schema.presence.visitor,
        set: { lastSeen: sql`now()` }
      })
    // Opportunistic cleanup of long-gone visitors.
    db.delete(schema.presence)
      .where(sql`${schema.presence.lastSeen} < now() - interval '1 hour'`)
      .catch(() => {})
  } catch {
    touchActive(visitor)
  }
}

export const countPresence = async (): Promise<number> => {
  try {
    const db = useDb()
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.presence)
      .where(sql`${schema.presence.lastSeen} > ${ACTIVE_WINDOW}`)
    return row?.count ?? 0
  } catch {
    return countActive()
  }
}
