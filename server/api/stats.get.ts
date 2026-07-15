import { countDistinct } from 'drizzle-orm'
import { countActive } from '../utils/active'
import { useDb, schema } from '../db'

const CACHE_TTL_MS = 60 * 1000
let cache: { at: number, count: number } | null = null

export default defineEventHandler(async () => {
  const { memberCountFallback } = useRuntimeConfig()
  const fallback = Number(memberCountFallback) || 0

  let members = fallback

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    members = cache.count
  } else {
    try {
      const db = useDb()
      // Anyone who has engaged through any form counts once.
      const [row] = await db
        .select({ count: countDistinct(schema.formSubmissions.email) })
        .from(schema.formSubmissions)
      members = row?.count ?? fallback
      cache = { at: Date.now(), count: members }
    } catch (err) {
      console.error('[api/stats] member count query failed', err)
      if (cache) members = cache.count
    }
  }

  return {
    members,
    active: countActive()
  }
})
