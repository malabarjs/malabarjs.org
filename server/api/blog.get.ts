import { XMLParser } from 'fast-xml-parser'

interface BlogPost {
  title: string
  url: string
  date: string
  summary: string
  image: string | null
}

const FEED_URL = 'https://blog.malabarjs.org/feed/'
const CACHE_TTL_MS = 60 * 60 * 1000

let cache: { at: number, posts: BlogPost[] } | null = null

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
})

const stripTags = (html: string) =>
  html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

const extractOgImage = (html: string): string | null => {
  const match = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  )
  return match ? match[1]! : null
}

const fetchPostImage = async (url: string): Promise<string | null> => {
  try {
    const html = await $fetch<string>(url, { responseType: 'text' })
    return extractOgImage(html)
  } catch {
    return null
  }
}

export default defineEventHandler(async () => {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.posts

  try {
    const xml = await $fetch<string>(FEED_URL, { responseType: 'text' })
    const parsed = parser.parse(xml)

    const rawEntries = parsed?.feed?.entry
      ? Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry]
      : []

    const entries = rawEntries.slice(0, 3)

    const posts: BlogPost[] = await Promise.all(
      entries.map(async (entry: Record<string, unknown>) => {
        const link = entry.link as { '@_href'?: string } | Array<{ '@_href'?: string, '@_rel'?: string }> | undefined
        const href = Array.isArray(link)
          ? (link.find(l => l['@_rel'] === 'alternate')?.['@_href'] ?? link[0]?.['@_href'])
          : link?.['@_href']

        const url = String(href ?? entry.id ?? '')
        const summary = stripTags(String(entry.summary ?? '')).slice(0, 200)

        return {
          title: String(entry.title ?? ''),
          url,
          date: String(entry.published ?? entry.updated ?? ''),
          summary,
          image: url ? await fetchPostImage(url) : null
        }
      })
    )

    cache = { at: Date.now(), posts }
    return posts
  } catch (err) {
    console.error('[api/blog] feed fetch failed', err)
    if (cache) return cache.posts
    return []
  }
})
