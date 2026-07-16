import { describe, expect, it } from 'vitest'
import {
  forms,
  formSchema,
  formFields,
  initialFormState,
  stepSchema
} from '../shared/forms'

const validSamples: Record<string, Record<string, unknown>> = {
  cfp: {
    name: 'Test Speaker',
    email: 'speaker@example.com',
    city: 'Kochi',
    github: '',
    event: 'meetup-2026-08',
    talkTitle: 'A talk about testing',
    abstract:
      'A long enough abstract about what this talk covers and why it matters.',
    format: 'standard',
    audienceLevel: 'any',
    experience: '',
    notes: ''
  },
  volunteer: {
    name: 'Test Volunteer',
    email: 'volunteer@example.com',
    city: 'Calicut',
    areas: ['event-ops'],
    availability: 'occasional',
    notes: ''
  },
  sponsor: {
    organization: 'Acme Corp',
    website: 'https://acme.example.com',
    name: 'Test Contact',
    email: 'sponsor@example.com',
    supportTypes: ['venue', 'swag'],
    message: 'We would love to host a meetup at our office.'
  },
  contact: {
    name: 'Test Person',
    email: 'contact@example.com',
    topic: 'general',
    message: 'Just saying hi to the community.'
  }
}

describe('form registry', () => {
  it('registers each form under its own slug', () => {
    for (const [slug, config] of Object.entries(forms)) {
      expect(config.slug).toBe(slug)
    }
  })

  it('has a valid sample for every registered form', () => {
    expect(Object.keys(validSamples).sort()).toEqual(
      Object.keys(forms).sort()
    )
  })

  it('uses unique field names within each form', () => {
    for (const config of Object.values(forms)) {
      const names = formFields(config).map(f => f.name)
      expect(new Set(names).size).toBe(names.length)
    }
  })

  it('gives options to every select/radio/checkboxes field', () => {
    for (const config of Object.values(forms)) {
      for (const field of formFields(config)) {
        if (['select', 'radio', 'checkboxes'].includes(field.type)) {
          expect(field.options?.length, `${config.slug}.${field.name}`)
            .toBeGreaterThan(0)
        }
      }
    }
  })
})

describe('formSchema', () => {
  it.each(Object.keys(validSamples))('accepts a valid %s submission', (slug) => {
    const result = formSchema(forms[slug]!).safeParse(validSamples[slug])
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
  })

  it('rejects a bad email', () => {
    const result = formSchema(forms.contact!).safeParse({
      ...validSamples.contact,
      email: 'not-an-email'
    })
    expect(result.success).toBe(false)
  })

  it('rejects an out-of-enum value', () => {
    const result = formSchema(forms.contact!).safeParse({
      ...validSamples.contact,
      topic: 'nonsense'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty checkbox groups', () => {
    const result = formSchema(forms.volunteer!).safeParse({
      ...validSamples.volunteer,
      areas: []
    })
    expect(result.success).toBe(false)
  })

  it('strips unknown keys like honeypot from parsed data', () => {
    const result = formSchema(forms.contact!).safeParse({
      ...validSamples.contact,
      honeypot: 'bot'
    })
    expect(result.success).toBe(true)
    expect(result.data).not.toHaveProperty('honeypot')
  })

  it('normalizes empty optional URLs to undefined', () => {
    const result = formSchema(forms.cfp!).safeParse(validSamples.cfp)
    expect(result.success).toBe(true)
    expect(result.data!.github).toBeUndefined()
  })
})

describe('step handling', () => {
  it('validates one step at a time', () => {
    const cfp = forms.cfp!
    const stepOne = stepSchema(cfp.steps[0]!)
    // Step 1 fields valid, step 2 fields absent - step schema must pass.
    const result = stepOne.safeParse({
      name: 'Test',
      email: 'test@example.com',
      city: 'Kochi',
      github: ''
    })
    expect(result.success).toBe(true)
  })

  it('builds initial state for every field', () => {
    for (const config of Object.values(forms)) {
      const state = initialFormState(config)
      for (const field of formFields(config)) {
        expect(state[field.name]).toEqual(
          field.type === 'checkboxes' ? [] : ''
        )
      }
    }
  })
})
