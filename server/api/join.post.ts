import { z } from 'zod'

const SKILL_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'curious',
  'other'
] as const

const INTEREST_VALUES = [
  'javascript',
  'typescript',
  'react',
  'vue',
  'svelte',
  'node',
  'deno-bun',
  'open-source',
  'design-systems',
  'career',
  'meetups',
  'other'
] as const

const INVOLVEMENT_VALUES = [
  'attend',
  'contribute',
  'discuss',
  'volunteer',
  'learn',
  'teach',
  'other'
] as const

const optionalUrl = z
  .string()
  .trim()
  .url()
  .max(200)
  .optional()
  .or(z.literal('').transform(() => undefined))

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  city: z.string().trim().min(2).max(80),
  mobile: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Use digits and + - ( ) only'),
  skillLevel: z.enum(SKILL_LEVELS),
  skillLevelOther: z.string().trim().max(80).optional(),
  interests: z
    .array(z.enum(INTEREST_VALUES))
    .min(1)
    .max(INTEREST_VALUES.length),
  interestsOther: z.string().trim().max(120).optional(),
  involvement: z
    .array(z.enum(INVOLVEMENT_VALUES))
    .min(1)
    .max(INVOLVEMENT_VALUES.length),
  involvementOther: z.string().trim().max(120).optional(),
  github: optionalUrl,
  linkedin: optionalUrl,
  expectations: z.string().trim().min(10).max(1000),
  receiveUpdates: z.enum(['yes', 'no']),
  honeypot: z.string().max(0).optional()
})

type Submission = z.infer<typeof schema>

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

const formatList = (values: readonly string[], other?: string) => {
  const parts = [...values]
  if (other) parts.push(`other: ${other}`)
  return parts.join(', ')
}

const GOOGLE_FORM_ID
  = '1FAIpQLSd4lplhNhbOiSVCDkZmHF7t3z0gvpQyXMNYNpa1-LNWP8d8yA'

const SKILL_LABELS: Record<(typeof SKILL_LEVELS)[number], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  curious: 'I’m just curious',
  other: '__other_option__'
}

const INTEREST_LABELS: Record<(typeof INTEREST_VALUES)[number], string> = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'react': 'React / Next.js',
  'vue': 'Vue / Nuxt',
  'svelte': 'Svelte / SvelteKit',
  'node': 'Node.js',
  'deno-bun': 'Deno / Bun',
  'open-source': 'Open Source',
  'design-systems': 'Design Systems',
  'career': 'Career Guidance',
  'meetups': 'Meetups / Events',
  'other': '__other_option__'
}

const INVOLVEMENT_LABELS: Record<(typeof INVOLVEMENT_VALUES)[number], string>
  = {
    attend: 'Attend meetups',
    contribute: 'Contribute to GitHub',
    discuss: 'Join discussions',
    volunteer: 'Volunteer',
    learn: 'Learn',
    teach: 'Teach',
    other: '__other_option__'
  }

const buildGoogleFormBody = (data: Submission): URLSearchParams => {
  const params = new URLSearchParams()
  params.append('entry.2089427863', data.name)
  params.append('entry.1605012573', data.email)
  params.append('entry.819710303', data.city)
  params.append('entry.2135502768', data.mobile)

  params.append('entry.1942333596', SKILL_LABELS[data.skillLevel])
  if (data.skillLevel === 'other' && data.skillLevelOther) {
    params.append(
      'entry.1942333596.other_option_response',
      data.skillLevelOther
    )
  }

  for (const v of data.interests)
    params.append('entry.1931828927', INTEREST_LABELS[v])
  if (data.interests.includes('other') && data.interestsOther) {
    params.append(
      'entry.1931828927.other_option_response',
      data.interestsOther
    )
  }

  for (const v of data.involvement)
    params.append('entry.2006259761', INVOLVEMENT_LABELS[v])
  if (data.involvement.includes('other') && data.involvementOther) {
    params.append(
      'entry.2006259761.other_option_response',
      data.involvementOther
    )
  }

  if (data.github) params.append('entry.820432012', data.github)
  if (data.linkedin) params.append('entry.1004684362', data.linkedin)
  params.append('entry.415359493', data.expectations)
  params.append('entry.38142635', data.receiveUpdates === 'yes' ? 'Yes' : 'No')

  // Multi-page form: 4 sections (Basic Info, Developer Profile,
  // Contribution / Participation, Final). Without pageHistory the
  // formResponse endpoint records a timestamp but discards all entries.
  params.append('pageHistory', '0,1,2,3')
  params.append('fvv', '1')
  // fbzx is a per-load random token; a stable value is accepted server-side.
  params.append('fbzx', String(Date.now()))

  return params
}

const submitToGoogleForm = async (data: Submission) => {
  const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`
  const body = buildGoogleFormBody(data).toString()
  // Use native fetch - ofetch/$fetch reserialises string bodies and breaks form encoding.
  const res = await globalThis.fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'user-agent': 'malabarjs-site/1.0 (+https://malabarjs.org)'
    },
    body,
    redirect: 'follow'
  })
  if (!res.ok && res.status !== 0) {
    throw new Error(`google form responded ${res.status}`)
  }
}

const buildEmbed = (data: Submission) => ({
  title: `${data.name} - ${data.city}`,
  fields: [
    { name: 'Email', value: data.email, inline: true },
    { name: 'Mobile', value: data.mobile, inline: true },
    {
      name: 'Skill',
      value: data.skillLevelOther
        ? `${data.skillLevel} (${data.skillLevelOther})`
        : data.skillLevel,
      inline: true
    },
    { name: 'Updates', value: data.receiveUpdates, inline: true },
    {
      name: 'Interests',
      value: formatList(data.interests, data.interestsOther) || '-'
    },
    {
      name: 'Involvement',
      value: formatList(data.involvement, data.involvementOther) || '-'
    },
    { name: 'GitHub', value: data.github || '-', inline: true },
    { name: 'LinkedIn', value: data.linkedin || '-', inline: true },
    { name: 'Expectations', value: data.expectations.slice(0, 1000) }
  ],
  timestamp: new Date().toISOString()
})

export default defineEventHandler(async (event) => {
  const ip
    = getRequestHeader(event, 'cf-connecting-ip')
      ?? getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
      ?? event.node.req.socket?.remoteAddress
      ?? 'unknown'

  if (!rateLimit(ip)) {
    setResponseHeader(event, 'Retry-After', 3600)
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const body = await readBody(event)
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }

  const { honeypot, ...data } = result.data
  if (honeypot) {
    return { ok: true }
  }

  const { joinWebhookUrl } = useRuntimeConfig()

  try {
    await submitToGoogleForm(data)
  } catch (err) {
    console.error('[api/join] google form delivery failed', err)
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not deliver - try again'
    })
  }

  // Member count is read live from the published Google Sheet CSV in
  // /api/stats — no local counter to maintain.

  if (joinWebhookUrl) {
    try {
      await $fetch(joinWebhookUrl, {
        method: 'POST',
        body: {
          content: 'New MalabarJS join request',
          embeds: [buildEmbed(data)]
        }
      })
    } catch (err) {
      console.error('[api/join] webhook delivery failed', err)
      throw createError({
        statusCode: 502,
        statusMessage: 'Could not deliver - try again'
      })
    }
  } else {
    console.info('[api/join] new submission (no webhook configured):', {
      name: data.name,
      email: data.email,
      city: data.city,
      skillLevel: data.skillLevel,
      interests: data.interests,
      involvement: data.involvement,
      receiveUpdates: data.receiveUpdates
    })
  }

  return { ok: true }
})
