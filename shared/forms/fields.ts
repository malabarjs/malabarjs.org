import { z } from 'zod'

export const requiredString = (message: string, min = 2, max = 160) =>
  z.string().trim().min(min, message).max(max)

export const optionalString = (max = 500) =>
  z.string().trim().max(max).optional()

export const emailField = () =>
  z.string().trim().pipe(z.email('Use a valid email')).pipe(z.string().max(160))

export const optionalUrl = () =>
  z
    .string()
    .trim()
    .pipe(z.url('Use a valid URL (https://…)'))
    .pipe(z.string().max(200))
    .optional()
    .or(z.literal('').transform(() => undefined))

export const oneOf = <const T extends readonly [string, ...string[]]>(
  values: T,
  message = 'Pick one'
) => z.enum(values, message)

export const someOf = <const T extends readonly [string, ...string[]]>(
  values: T,
  message = 'Pick at least one'
) => z.array(z.enum(values)).min(1, message).max(values.length)
