import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

/**
 * Lazy, provider-agnostic Postgres connection. Works with any standard
 * Postgres via DATABASE_URL (Neon, Railway, RDS, Docker, self-hosted…).
 * `prepare: false` keeps it compatible with transaction-mode poolers.
 */
export const useDb = () => {
  if (_db) return _db
  const url = process.env.DATABASE_URL
  if (!url) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Form storage is not configured'
    })
  }
  const client = postgres(url, { max: 5, prepare: false })
  _db = drizzle(client, { schema })
  return _db
}

export { schema }
