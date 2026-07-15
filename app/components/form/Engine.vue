<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { FormConfig } from '#shared/forms'
import { initialFormState, stepSchema } from '#shared/forms'

const props = defineProps<{ config: FormConfig }>()
const emit = defineEmits<{ success: [] }>()

const state = reactive<Record<string, unknown>>(initialFormState(props.config))
const honeypot = ref('')

const stepIndex = ref(0)
const direction = ref<'forward' | 'back'>('forward')
const steps = computed(() => props.config.steps)
const step = computed(() => steps.value[stepIndex.value]!)
const isLast = computed(() => stepIndex.value === steps.value.length - 1)
const multiStep = computed(() => steps.value.length > 1)

const currentSchema = computed(() => stepSchema(step.value))

const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref<string | null>(null)

// --- Draft autosave -------------------------------------------------------
const draftKey = `malabarjs:form-draft:${props.config.slug}`
let saveTimer: ReturnType<typeof setTimeout> | null = null
const restored = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem(draftKey)
    if (!raw) return
    const draft = JSON.parse(raw) as {
      state?: Record<string, unknown>
      step?: number
    }
    if (draft.state) {
      for (const key of Object.keys(state)) {
        if (key in draft.state) state[key] = draft.state[key]
      }
      restored.value = true
    }
    if (
      typeof draft.step === 'number'
      && draft.step > 0
      && draft.step < steps.value.length
    ) {
      stepIndex.value = draft.step
    }
  } catch {
    /* corrupt draft - start fresh */
  }
})

watch(
  [state, stepIndex],
  () => {
    if (submitted.value) return
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({ state, step: stepIndex.value })
        )
      } catch {
        /* storage full / unavailable */
      }
    }, 400)
  },
  { deep: true }
)

const clearDraft = () => {
  if (saveTimer) clearTimeout(saveTimer)
  try {
    localStorage.removeItem(draftKey)
  } catch {
    /* ignore */
  }
}

const startOver = () => {
  clearDraft()
  Object.assign(state, initialFormState(props.config))
  stepIndex.value = 0
  restored.value = false
}

// --- Navigation & submit --------------------------------------------------
function goBack() {
  if (stepIndex.value === 0) return
  direction.value = 'back'
  stepIndex.value -= 1
}

async function onStepSubmit(_event: FormSubmitEvent<Record<string, unknown>>) {
  errorMsg.value = null

  if (!isLast.value) {
    direction.value = 'forward'
    stepIndex.value += 1
    return
  }

  loading.value = true
  try {
    await $fetch(`/api/forms/${props.config.slug}`, {
      method: 'POST',
      body: { ...toRaw(state), honeypot: honeypot.value }
    })
    submitted.value = true
    clearDraft()
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
    <!-- Success state -->
    <div
      v-if="submitted"
      class="text-center py-14"
    >
      <div
        class="mx-auto size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"
      >
        <UIcon
          name="i-lucide-check"
          class="size-7"
        />
      </div>
      <h2 class="text-xl font-semibold text-highlighted mb-2">
        {{ config.success.title }}
      </h2>
      <p class="text-muted text-sm max-w-sm mx-auto">
        {{ config.success.message }}
      </p>
      <UButton
        to="/"
        variant="link"
        icon="i-lucide-arrow-left"
        class="mt-6"
      >
        Back to home
      </UButton>
    </div>

    <div v-else>
      <!-- Restored-draft notice -->
      <UAlert
        v-if="restored"
        icon="i-lucide-history"
        color="neutral"
        variant="subtle"
        title="Draft restored"
        description="We saved where you left off."
        class="mb-6"
        :actions="[
          {
            label: 'Start over',
            variant: 'link',
            onClick: startOver
          }
        ]"
      />

      <!-- Progress -->
      <div
        v-if="multiStep"
        class="mb-8"
      >
        <div
          class="flex items-baseline justify-between gap-4 text-xs font-mono uppercase tracking-wider text-muted mb-2"
        >
          <span>Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
          <span class="text-highlighted normal-case tracking-normal font-sans font-medium">
            {{ step.title }}
          </span>
        </div>
        <div
          class="h-1 rounded-full bg-elevated overflow-hidden"
          role="progressbar"
          :aria-valuenow="stepIndex + 1"
          :aria-valuemin="1"
          :aria-valuemax="steps.length"
          :aria-label="`Step ${stepIndex + 1} of ${steps.length}`"
        >
          <div
            class="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${((stepIndex + 1) / steps.length) * 100}%` }"
          />
        </div>
      </div>

      <Transition
        :name="direction === 'forward' ? 'step-forward' : 'step-back'"
        mode="out-in"
      >
        <UForm
          :key="stepIndex"
          :schema="currentSchema"
          :state="state"
          class="space-y-6"
          @submit="onStepSubmit"
        >
          <p
            v-if="step.description"
            class="text-sm text-muted"
          >
            {{ step.description }}
          </p>

          <UFormField
            v-for="field in step.fields"
            :key="field.name"
            :label="field.label"
            :name="field.name"
            :required="field.required"
            :hint="field.hint"
          >
            <FormFieldControl
              v-model="state[field.name]"
              :field="field"
            />
          </UFormField>

          <input
            v-model="honeypot"
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
            class="flex items-center justify-between gap-2 pt-4 border-t border-default"
          >
            <UButton
              v-if="stepIndex > 0"
              type="button"
              variant="ghost"
              icon="i-lucide-arrow-left"
              size="lg"
              @click="goBack"
            >
              Back
            </UButton>
            <span v-else />

            <UButton
              type="submit"
              :loading="loading"
              :icon="isLast ? undefined : 'i-lucide-arrow-right'"
              trailing
              size="lg"
            >
              {{ isLast ? (config.submitLabel ?? 'Submit') : 'Continue' }}
            </UButton>
          </div>
        </UForm>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.step-forward-enter-active,
.step-forward-leave-active,
.step-back-enter-active,
.step-back-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.step-forward-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.step-forward-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
.step-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.step-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (prefers-reduced-motion: reduce) {
  .step-forward-enter-active,
  .step-forward-leave-active,
  .step-back-enter-active,
  .step-back-leave-active {
    transition: none;
  }
}
</style>
