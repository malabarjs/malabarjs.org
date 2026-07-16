import { z } from 'zod'

/**
 * Registry of runtime-editable flags. Adding a flag = one entry here plus
 * whatever the frontend does with it. Values live in the site_settings
 * table and are edited from /admin.
 */
export const FLAG_SCHEMAS = {
  // teaser: hide meetup details behind a "something's coming" card.
  // announced: show the full event card with RSVP + details.
  eventMode: z.enum(['teaser', 'announced'])
} as const

export type FlagKey = keyof typeof FLAG_SCHEMAS

export const DEFAULT_FLAGS: Record<FlagKey, unknown> = {
  eventMode: 'announced'
}
