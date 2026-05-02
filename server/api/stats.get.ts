import { countActive } from '../utils/active'

const CACHE_TTL_MS = 60 * 1000
let cache: { at: number, count: number } | null = null

const countCsvRows = (csv: string): number => {
  // Parse CSV row count, accounting for quoted fields that may contain newlines.
  let rows = 0
  let inQuotes = false
  let hasContent = false
  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i]
    if (ch === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        i++
        continue
      }
      inQuotes = !inQuotes
    } else if (ch === '\n' && !inQuotes) {
      if (hasContent) rows++
      hasContent = false
    } else if (ch !== '\r') {
      hasContent = true
    }
  }
  if (hasContent) rows++
  // Subtract one for the header row.
  return Math.max(0, rows - 1)
}

export default defineEventHandler(async () => {
  const { memberSheetCsvUrl, memberCountFallback } = useRuntimeConfig()
  const fallback = Number(memberCountFallback) || 0

  let members = fallback

  if (memberSheetCsvUrl) {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      members = cache.count
    } else {
      try {
        const csv = await $fetch<string>(memberSheetCsvUrl, { responseType: 'text' })
        members = countCsvRows(csv)
        cache = { at: Date.now(), count: members }
      } catch (err) {
        console.error('[api/stats] sheet fetch failed', err)
        if (cache) members = cache.count
      }
    }
  }

  return {
    members,
    active: countActive()
  }
})
