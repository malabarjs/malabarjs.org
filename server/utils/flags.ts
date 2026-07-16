import { z } from 'zod'

/**
 * Registry of runtime-editable flags. Adding a flag = one entry here plus
 * whatever the frontend does with it. Values live in the site_settings
 * table and are edited from /admin.
 */
export const FLAG_SCHEMAS = {
  // auto: phase follows the dates in shared/event.ts (event-driven).
  // Everything else is a manual override for emergencies.
  eventMode: z.enum(['auto', 'quiet', 'teaser', 'announced'])
} as const

export type FlagKey = keyof typeof FLAG_SCHEMAS

export const DEFAULT_FLAGS: Record<FlagKey, unknown> = {
  eventMode: 'auto'
}
