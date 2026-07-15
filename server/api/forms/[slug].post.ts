import { forms, formSchema } from '#shared/forms'
import { useDb, schema } from '../../db'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const hits = new Map<string, { count: number, reset: number }>()

const rateLimit = (key: string) => {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count += 1
  return true
}

const buildEmbed = (slug: string, data: Record<string, unknown>) => ({
  title: `New ${slug} submission`,
  fields: Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([name, value]) => ({
      name,
      value: String(Array.isArray(value) ? value.join(', ') : value).slice(
        0,
        1000
      )
    })),
  timestamp: new Date().toISOString()
})

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const config = forms[slug]
  if (!config) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown form' })
  }

  const ip
    = getRequestHeader(event, 'cf-connecting-ip')
      ?? getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
      ?? event.node.req.socket?.remoteAddress
      ?? 'unknown'

  if (!rateLimit(`${slug}:${ip}`)) {
    setResponseHeader(event, 'Retry-After', 3600)
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const body = await readBody(event)

  // Bots fill the hidden field - accept silently and drop.
  if (body && typeof body === 'object' && body.honeypot) {
    return { ok: true }
  }

  // The form's object schema ignores unknown keys, so honeypot never lands
  // in the stored payload.
  const result = formSchema(config).safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }

  const data = result.data

  const email = typeof data.email === 'string' ? data.email : null

  const db = useDb()
  await db.insert(schema.formSubmissions).values({
    formSlug: slug,
    email,
    data
  })

  const { formsWebhookUrl } = useRuntimeConfig()
  if (formsWebhookUrl) {
    // Best-effort notification - the submission is already persisted.
    try {
      await $fetch(formsWebhookUrl, {
        method: 'POST',
        body: {
          content: `New MalabarJS ${config.title} submission`,
          embeds: [buildEmbed(slug, data)]
        }
      })
    } catch (err) {
      console.error(`[api/forms/${slug}] webhook delivery failed`, err)
    }
  }

  return { ok: true }
})
