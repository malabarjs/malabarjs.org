<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<{ success: [] }>()

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

const skillOptions: { label: string, value: (typeof SKILL_LEVELS)[number] }[]
  = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'I\'m just curious', value: 'curious' },
    { label: 'Other', value: 'other' }
  ]

const interestOptions: {
  label: string
  value: (typeof INTEREST_VALUES)[number]
}[] = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'React / Next.js', value: 'react' },
  { label: 'Vue / Nuxt', value: 'vue' },
  { label: 'Svelte / SvelteKit', value: 'svelte' },
  { label: 'Node.js', value: 'node' },
  { label: 'Deno / Bun', value: 'deno-bun' },
  { label: 'Open Source', value: 'open-source' },
  { label: 'Design Systems', value: 'design-systems' },
  { label: 'Career Guidance', value: 'career' },
  { label: 'Meetups / Events', value: 'meetups' },
  { label: 'Other', value: 'other' }
]

const involvementOptions: {
  label: string
  value: (typeof INVOLVEMENT_VALUES)[number]
}[] = [
  { label: 'Attend meetups', value: 'attend' },
  { label: 'Contribute to GitHub', value: 'contribute' },
  { label: 'Join discussions', value: 'discuss' },
  { label: 'Volunteer', value: 'volunteer' },
  { label: 'Learn', value: 'learn' },
  { label: 'Teach', value: 'teach' },
  { label: 'Other', value: 'other' }
]

const optionalUrl = z
  .string()
  .trim()
  .url()
  .max(200)
  .optional()
  .or(z.literal('').transform(() => undefined))

const schema = z.object({
  name: z.string().trim().min(2, 'Please share your name').max(80),
  email: z.string().trim().email('Use a valid email').max(160),
  city: z.string().trim().min(2, 'Where are you based?').max(80),
  mobile: z
    .string()
    .trim()
    .min(7, 'Looks too short')
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Use digits and + - ( ) only'),
  skillLevel: z.enum(SKILL_LEVELS, {
    errorMap: () => ({ message: 'Pick one' })
  }),
  skillLevelOther: z.string().trim().max(80).optional(),
  interests: z.array(z.enum(INTEREST_VALUES)).min(1, 'Pick at least one'),
  interestsOther: z.string().trim().max(120).optional(),
  involvement: z.array(z.enum(INVOLVEMENT_VALUES)).min(1, 'Pick at least one'),
  involvementOther: z.string().trim().max(120).optional(),
  github: optionalUrl,
  linkedin: optionalUrl,
  expectations: z.string().trim().min(10, 'A line or two helps').max(1000),
  receiveUpdates: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Pick one' })
  }),
  honeypot: z.string().max(0).optional()
})

type Schema = z.output<typeof schema>

const state = reactive<{
  name: string
  email: string
  city: string
  mobile: string
  skillLevel: (typeof SKILL_LEVELS)[number] | undefined
  skillLevelOther: string
  interests: (typeof INTEREST_VALUES)[number][]
  interestsOther: string
  involvement: (typeof INVOLVEMENT_VALUES)[number][]
  involvementOther: string
  github: string
  linkedin: string
  expectations: string
  receiveUpdates: 'yes' | 'no' | undefined
  honeypot: string
}>({
  name: '',
  email: '',
  city: '',
  mobile: '',
  skillLevel: undefined,
  skillLevelOther: '',
  interests: [],
  interestsOther: '',
  involvement: [],
  involvementOther: '',
  github: '',
  linkedin: '',
  expectations: '',
  receiveUpdates: undefined,
  honeypot: ''
})

const updateOptions = [
  { label: 'Yes - keep me posted', value: 'yes' },
  { label: 'No, thanks', value: 'no' }
]

const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref<string | null>(null)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  errorMsg.value = null
  try {
    await $fetch('/api/join', { method: 'POST', body: event.data })
    submitted.value = true
    emit('success')
  } catch (err: unknown) {
    const e = err as { statusCode?: number }
    errorMsg.value
      = e?.statusCode === 429
        ? 'Too many submissions from this network. Try again later.'
        : 'Something went wrong. Please try again or DM us on X.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div
      v-if="submitted"
      class="text-center py-10"
    >
      <div
        class="mx-auto size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"
      >
        <UIcon
          name="i-lucide-check"
          class="size-6"
        />
      </div>
      <h3 class="text-lg font-semibold text-highlighted mb-2">
        You're in 🥥
      </h3>
      <p class="text-muted text-sm max-w-xs mx-auto">
        Thanks for filling that out - we read every submission and will reach
        out at the email you shared.
      </p>
    </div>

    <UForm
      v-else
      :schema="schema"
      :state="state"
      class="space-y-8"
      @submit="onSubmit"
    >
      <div>
        <p class="text-xs font-mono uppercase text-muted mb-3 tracking-wider">
          Basic info
        </p>
        <div class="space-y-4">
          <UFormField
            label="Full name"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              autocomplete="name"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Email"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="City / district"
            name="city"
            required
            hint="e.g. Kochi, Calicut, Trivandrum"
          >
            <UInput
              v-model="state.city"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Mobile number"
            name="mobile"
            required
          >
            <UInput
              v-model="state.mobile"
              type="tel"
              autocomplete="tel"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <div>
        <p class="text-xs font-mono uppercase text-muted mb-3 tracking-wider">
          Developer profile
        </p>
        <div class="space-y-4">
          <UFormField
            label="Current skill level"
            name="skillLevel"
            required
          >
            <URadioGroup
              v-model="state.skillLevel"
              :items="skillOptions"
              orientation="vertical"
            />
          </UFormField>

          <UFormField
            v-if="state.skillLevel === 'other'"
            label="Tell us more"
            name="skillLevelOther"
          >
            <UInput
              v-model="state.skillLevelOther"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Areas that interest you"
            name="interests"
            required
            hint="Pick as many as you like"
          >
            <UCheckboxGroup
              v-model="state.interests"
              :items="interestOptions"
              :ui="{ root: 'grid grid-cols-1 sm:grid-cols-2 gap-1.5' }"
            />
          </UFormField>

          <UFormField
            v-if="state.interests.includes('other')"
            label="Other interests"
            name="interestsOther"
          >
            <UInput
              v-model="state.interestsOther"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <div>
        <p class="text-xs font-mono uppercase text-muted mb-3 tracking-wider">
          Contribution / participation
        </p>
        <div class="space-y-4">
          <UFormField
            label="How would you like to be involved?"
            name="involvement"
            required
          >
            <UCheckboxGroup
              v-model="state.involvement"
              :items="involvementOptions"
              :ui="{ root: 'grid grid-cols-1 sm:grid-cols-2 gap-1.5' }"
            />
          </UFormField>

          <UFormField
            v-if="state.involvement.includes('other')"
            label="Other"
            name="involvementOther"
          >
            <UInput
              v-model="state.involvementOther"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="GitHub profile"
            name="github"
            hint="Optional"
          >
            <UInput
              v-model="state.github"
              type="url"
              placeholder="https://github.com/username"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="LinkedIn / portfolio"
            name="linkedin"
            hint="Optional"
          >
            <UInput
              v-model="state.linkedin"
              type="url"
              placeholder="https://linkedin.com/in/username"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <div>
        <p class="text-xs font-mono uppercase text-muted mb-3 tracking-wider">
          Final
        </p>
        <div class="space-y-4">
          <UFormField
            label="What do you expect from this community?"
            name="expectations"
            required
          >
            <UTextarea
              v-model="state.expectations"
              :rows="4"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Would you like to receive updates?"
            name="receiveUpdates"
            required
          >
            <URadioGroup
              v-model="state.receiveUpdates"
              :items="updateOptions"
              orientation="vertical"
            />
          </UFormField>
        </div>
      </div>

      <input
        v-model="state.honeypot"
        type="text"
        name="company"
        tabindex="-1"
        autocomplete="off"
        class="absolute left-[-10000px] w-px h-px opacity-0"
        aria-hidden="true"
      >

      <p
        v-if="errorMsg"
        class="text-sm text-error"
      >
        {{ errorMsg }}
      </p>

      <div
        class="flex items-center justify-end gap-2 pt-2 border-t border-default"
      >
        <UButton
          type="submit"
          :loading="loading"
          icon="i-lucide-arrow-right"
          trailing
          size="lg"
        >
          Join MalabarJS
        </UButton>
      </div>
    </UForm>
  </div>
</template>
