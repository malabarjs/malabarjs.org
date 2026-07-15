import type { FormConfig } from './types'
import { cfpForm } from './cfp'
import { volunteerForm } from './volunteer'
import { sponsorForm } from './sponsor'
import { contactForm } from './contact'

export * from './types'
export * from './fields'

/**
 * Registry of all forms, keyed by slug. Adding a new form = create a config
 * file with defineForm() and register it here. The page route, API endpoint,
 * validation, and persistence all pick it up automatically.
 */
export const forms: Record<string, FormConfig> = {
  [cfpForm.slug]: cfpForm,
  [volunteerForm.slug]: volunteerForm,
  [sponsorForm.slug]: sponsorForm,
  [contactForm.slug]: contactForm
}
