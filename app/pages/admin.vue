<script setup lang="ts">
definePageMeta({
  layout: 'content'
})

useHead({
  title: 'Admin - MalabarJS',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

// Token lives in memory only - re-enter it each visit.
const token = ref('')
const flags = ref<Record<string, unknown> | null>(null)
const saving = ref(false)
const message = ref<{ kind: 'ok' | 'error', text: string } | null>(null)

const eventModeOptions = [
  {
    label: 'Teaser - "Something\'s coming", details hidden',
    value: 'teaser'
  },
  {
    label: 'Announced - full event card with RSVP + details',
    value: 'announced'
  }
]

async function loadFlags() {
  try {
    flags.value = await $fetch<Record<string, unknown>>('/api/flags')
  } catch {
    message.value = { kind: 'error', text: 'Could not load current flags.' }
  }
}

onMounted(loadFlags)

async function setFlag(key: string, value: unknown) {
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
      body: { key, value }
    })
    flags.value = { ...(flags.value ?? {}), [key]: value }
    message.value = {
      kind: 'ok',
      text: `Saved. The public site picks it up within ~30 seconds.`
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
      <h1 class="text-2xl font-bold text-highlighted mb-2">
        Site controls
      </h1>
      <p class="text-sm text-muted mb-8">
        Runtime switches - changes go live in ~30 seconds, no deploy needed.
      </p>

      <UFormField
        label="Admin token"
        class="mb-8"
      >
        <UInput
          v-model="token"
          type="password"
          autocomplete="off"
          placeholder="Paste the admin token"
          class="w-full"
        />
      </UFormField>

      <div class="border border-default rounded-lg p-4 mb-6">
        <p class="text-xs font-mono uppercase text-muted mb-3 tracking-wider">
          Event mode
        </p>
        <URadioGroup
          :model-value="(flags?.eventMode as string) ?? 'announced'"
          :items="eventModeOptions"
          orientation="vertical"
          :disabled="saving"
          @update:model-value="setFlag('eventMode', $event)"
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
