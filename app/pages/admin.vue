<script setup lang="ts">
import { UPCOMING_EVENT, eventPhase, type EventPhase } from '#shared/event'

definePageMeta({
  layout: 'content'
})

useHead({
  title: 'Event console - MalabarJS',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

// Token lives in memory only - re-enter it each visit.
const token = ref('')
const flags = ref<Record<string, unknown> | null>(null)
const saving = ref(false)
const message = ref<{ kind: 'ok' | 'error', text: string } | null>(null)

const now = ref(new Date())
let clock: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  clock = setInterval(() => (now.value = new Date()), 30_000)
})
onBeforeUnmount(() => {
  if (clock) clearInterval(clock)
})

const autoPhase = computed(() => eventPhase(now.value))
const override = computed(() => {
  const v = flags.value?.eventMode
  return v === 'quiet' || v === 'teaser' || v === 'announced' ? v : null
})
const effective = computed<EventPhase>(() => override.value ?? autoPhase.value)

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  }) + ' IST'

const schedule = computed(() => [
  {
    phase: 'quiet',
    label: 'Quiet',
    window: `until ${fmt(UPCOMING_EVENT.teaseAt)}`,
    desc: 'Nothing about the event is shown'
  },
  {
    phase: 'teaser',
    label: 'Teaser',
    window: fmt(UPCOMING_EVENT.teaseAt),
    desc: '"Something\'s coming" card, details hidden'
  },
  {
    phase: 'announced',
    label: 'Announced',
    window: fmt(UPCOMING_EVENT.announceAt),
    desc: 'Full card with RSVP and details'
  },
  {
    phase: 'past',
    label: 'Past',
    window: `after ${fmt(UPCOMING_EVENT.endsAt)}`,
    desc: 'Card hidden, timeline entry stays as the recap'
  }
])

const overrideOptions = [
  { label: 'Auto - follow the schedule (recommended)', value: 'auto' },
  { label: 'Force quiet', value: 'quiet' },
  { label: 'Force teaser', value: 'teaser' },
  { label: 'Force announced', value: 'announced' }
]

async function loadFlags() {
  try {
    flags.value = await $fetch<Record<string, unknown>>('/api/flags')
  } catch {
    message.value = { kind: 'error', text: 'Could not load current state.' }
  }
}
onMounted(loadFlags)

async function setMode(value: unknown) {
  if (!token.value) {
    message.value = { kind: 'error', text: 'Enter the admin token first.' }
    return
  }
  saving.value = true
  message.value = null
  try {
    await $fetch('/api/admin/flags', {
      method: 'POST',
      headers: { authorization: `Bearer ${token.value}` },
      body: { key: 'eventMode', value }
    })
    flags.value = { ...(flags.value ?? {}), eventMode: value }
    message.value = {
      kind: 'ok',
      text: 'Saved. Visitors pick it up within ~30 seconds.'
    }
  } catch (err: unknown) {
    const e = err as { statusCode?: number }
    message.value = {
      kind: 'error',
      text:
        e?.statusCode === 401
          ? 'Wrong token.'
          : e?.statusCode === 429
            ? 'Too many attempts - try again later.'
            : 'Something went wrong.'
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="py-12 sm:py-16 px-4">
    <div class="max-w-md mx-auto">
      <p class="text-xs font-mono uppercase text-muted tracking-wider mb-1">
        Event console
      </p>
      <h1 class="text-2xl font-bold text-highlighted mb-1">
        {{ UPCOMING_EVENT.title }}
      </h1>
      <p class="text-sm text-muted mb-8">
        {{ UPCOMING_EVENT.dateLabel }} · {{ UPCOMING_EVENT.location }} · phases
        flip automatically on schedule.
      </p>

      <div class="border border-default rounded-lg divide-y divide-default mb-8">
        <div
          v-for="step in schedule"
          :key="step.phase"
          class="p-3.5 flex items-start justify-between gap-4"
          :class="effective === step.phase ? 'bg-primary/5' : ''"
        >
          <div>
            <p class="text-sm font-semibold text-highlighted flex items-center gap-2">
              {{ step.label }}
              <span
                v-if="effective === step.phase"
                class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/15 text-primary"
              >
                live now{{ override ? ' (forced)' : '' }}
              </span>
            </p>
            <p class="text-xs text-muted mt-0.5">
              {{ step.desc }}
            </p>
          </div>
          <span class="text-xs font-mono text-muted whitespace-nowrap pt-0.5">{{ step.window }}</span>
        </div>
      </div>

      <div class="border border-default rounded-lg p-4 mb-6">
        <p class="text-xs font-mono uppercase text-muted mb-1 tracking-wider">
          Override
        </p>
        <p class="text-xs text-muted mb-4">
          Escape hatch only - leave on Auto unless something's on fire.
        </p>

        <UFormField
          label="Admin token"
          class="mb-4"
        >
          <UInput
            v-model="token"
            type="password"
            autocomplete="off"
            placeholder="Paste the admin token"
            class="w-full"
          />
        </UFormField>

        <URadioGroup
          :model-value="(flags?.eventMode as string) ?? 'auto'"
          :items="overrideOptions"
          orientation="vertical"
          :disabled="saving"
          @update:model-value="setMode($event)"
        />
      </div>

      <p
        v-if="message"
        class="text-sm"
        :class="message.kind === 'ok' ? 'text-primary' : 'text-error'"
      >
        {{ message.text }}
      </p>
    </div>
  </main>
</template>
