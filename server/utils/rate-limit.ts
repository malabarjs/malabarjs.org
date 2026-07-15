import { createHash } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { useDb, schema } from '../db'

// In-memory fallback so a rate-limit outage never blocks or floods forms
// beyond a single instance's view.
const memoryHits = new Map<string, { count: number, reset: number }>()

const memoryLimit = (key: string, max: number, windowMs: number) => {
  const now = Date.now()
  const entry = memoryHits.get(key)
  if (!entry || entry.reset < now) {
    memoryHits.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count += 1
  return true
}

export const hashIp = (ip: string) =>
  createHash('sha256').update(ip).digest('hex').slice(0, 32)

/**
 * Fixed-window rate limit backed by Postgres, so the limit holds across
 * serverless instances. Falls back to a per-instance in-memory window if
 * the database is unreachable.
 */
export const checkRateLimit = async (
  key: string,
  max: number,
  windowMs: number
): Promise<boolean> => {
  try {
    const db = useDb()
    const windowSql = sql`now() + ${windowMs} * interval '1 millisecond'`
    const [row] = await db
      .insert(schema.rateLimits)
      .values({ key, count: 1, resetAt: windowSql as never })
      .onConflictDoUpdate({
        target: schema.rateLimits.key,
        set: {
          count: sql`CASE WHEN ${schema.rateLimits.resetAt} < now() THEN 1 ELSE ${schema.rateLimits.count} + 1 END`,
          resetAt: sql`CASE WHEN ${schema.rateLimits.resetAt} < now() THEN now() + ${windowMs} * interval '1 millisecond' ELSE ${schema.rateLimits.resetAt} END`
        }
      })
      .returning({ count: schema.rateLimits.count })

    // Opportunistic cleanup - the table only ever holds recent windows.
    db.delete(schema.rateLimits)
      .where(sql`${schema.rateLimits.resetAt} < now() - interval '1 day'`)
      .catch(() => {})

    return (row?.count ?? 1) <= max
  } catch (err) {
    console.error('[rate-limit] db unavailable, using in-memory window', err)
    return memoryLimit(key, max, windowMs)
  }
}
