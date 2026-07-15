import { z } from 'zod'

export type FieldType
  = | 'text'
    | 'email'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkboxes'

export interface FieldOption {
  label: string
  value: string
}

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  /** Zod schema for this field - shared by client and server validation. */
  schema: z.ZodType
  required?: boolean
  hint?: string
  placeholder?: string
  autocomplete?: string
  /** Rows for textarea fields. */
  rows?: number
  /** Options for select / radio / checkboxes fields. */
  options?: FieldOption[]
  /** Grid columns for checkboxes (default 2 on sm+). */
  columns?: 1 | 2
}

export interface FormStep {
  title: string
  description?: string
  fields: FieldConfig[]
}

export interface FormConfig {
  slug: string
  title: string
  description: string
  icon?: string
  submitLabel?: string
  /** Optional pointer shown under the description, e.g. to GitHub Discussions. */
  aside?: {
    text: string
    label: string
    to: string
  }
  success: {
    title: string
    message: string
  }
  steps: FormStep[]
}

export const defineForm = (config: FormConfig): FormConfig => config

export const formFields = (config: FormConfig): FieldConfig[] =>
  config.steps.flatMap(step => step.fields)

/** Full object schema for a form - used server-side and on final submit. */
export const formSchema = (config: FormConfig) => {
  const shape: Record<string, z.ZodType> = {}
  for (const field of formFields(config)) shape[field.name] = field.schema
  return z.object(shape)
}

/** Schema restricted to one step - used for per-step client validation. */
export const stepSchema = (step: FormStep) => {
  const shape: Record<string, z.ZodType> = {}
  for (const field of step.fields) shape[field.name] = field.schema
  return z.object(shape)
}

/** Initial reactive state for a form. */
export const initialFormState = (config: FormConfig) => {
  const state: Record<string, unknown> = {}
  for (const field of formFields(config)) {
    state[field.name] = field.type === 'checkboxes' ? [] : ''
  }
  return state
}
