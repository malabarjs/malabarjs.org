import { useDb, schema } from '../db'
import { DEFAULT_FLAGS } from '../utils/flags'

const CACHE_TTL_MS = 30 * 1000
let cache: { at: number, flags: Record<string, unknown> } | null = null

export default defineEventHandler(async () => {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.flags

  const flags: Record<string, unknown> = { ...DEFAULT_FLAGS }
  try {
    const db = useDb()
    const rows = await db.select().from(schema.siteSettings)
    for (const row of rows) flags[row.key] = row.value
    cache = { at: Date.now(), flags }
  } catch (err) {
    console.error('[api/flags] settings query failed', err)
    if (cache) return cache.flags
  }
  return flags
})
