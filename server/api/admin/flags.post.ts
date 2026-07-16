import { createHash, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { useDb, schema } from '../../db'
import { checkRateLimit, hashIp } from '../../utils/rate-limit'
import { FLAG_SCHEMAS, type FlagKey } from '../../utils/flags'

const digest = (value: string) => createHash('sha256').update(value).digest()

const bodySchema = z.object({
  key: z.enum(Object.keys(FLAG_SCHEMAS) as [FlagKey, ...FlagKey[]]),
  value: z.unknown()
})

export default defineEventHandler(async (event) => {
  const { adminToken } = useRuntimeConfig()
  if (!adminToken) {
    throw createError({ statusCode: 503, statusMessage: 'Admin not configured' })
  }

  const ip
    = getRequestHeader(event, 'cf-connecting-ip')
      ?? getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
      ?? event.node.req.socket?.remoteAddress
      ?? 'unknown'

  if (!(await checkRateLimit(`admin:${hashIp(ip)}`, 20, 60 * 60 * 1000))) {
    setResponseHeader(event, 'Retry-After', 3600)
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const auth = getRequestHeader(event, 'authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !timingSafeEqual(digest(token), digest(adminToken))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid flag' })
  }
  const { key, value } = parsed.data
  const valueCheck = FLAG_SCHEMAS[key].safeParse(value)
  if (!valueCheck.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid flag value' })
  }

  const db = useDb()
  await db
    .insert(schema.siteSettings)
    .values({ key, value: valueCheck.data })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value: valueCheck.data, updatedAt: new Date() }
    })

  return { ok: true, [key]: valueCheck.data }
})
