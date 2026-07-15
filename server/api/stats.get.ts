import { countDistinct, inArray } from 'drizzle-orm'
import { countPresence } from '../utils/presence'
import { useDb, schema } from '../db'

// Only these form slugs represent membership. CFP/sponsor/contact
// submissions are separate intents and must not inflate the count.
const MEMBER_FORM_SLUGS = ['join']

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
      const [row] = await db
        .select({ count: countDistinct(schema.formSubmissions.email) })
        .from(schema.formSubmissions)
        .where(inArray(schema.formSubmissions.formSlug, MEMBER_FORM_SLUGS))
      members = row?.count ?? fallback
      cache = { at: Date.now(), count: members }
    } catch (err) {
      console.error('[api/stats] member count query failed', err)
      if (cache) members = cache.count
    }
  }

  return {
    members,
    active: await countPresence()
  }
})
