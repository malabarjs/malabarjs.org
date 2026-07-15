<script setup lang="ts">
import type { FieldConfig } from '#shared/forms'

const props = defineProps<{ field: FieldConfig }>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model = defineModel<any>()

const inputType = computed(() =>
  props.field.type === 'text' ? 'text' : props.field.type
)
</script>

<template>
  <UInput
    v-if="['text', 'email', 'tel', 'url'].includes(field.type)"
    v-model="model"
    :type="inputType"
    :placeholder="field.placeholder"
    :autocomplete="field.autocomplete"
    size="lg"
    class="w-full"
  />

  <UTextarea
    v-else-if="field.type === 'textarea'"
    v-model="model"
    :rows="field.rows ?? 4"
    :placeholder="field.placeholder"
    size="lg"
    class="w-full"
  />

  <USelect
    v-else-if="field.type === 'select'"
    v-model="model"
    :items="field.options"
    :placeholder="field.placeholder ?? 'Pick one'"
    size="lg"
    class="w-full"
  />

  <URadioGroup
    v-else-if="field.type === 'radio'"
    v-model="model"
    :items="field.options"
    orientation="vertical"
  />

  <UCheckboxGroup
    v-else-if="field.type === 'checkboxes'"
    v-model="model"
    :items="field.options"
    :ui="{
      root:
        field.columns === 1
          ? 'grid grid-cols-1 gap-1.5'
          : 'grid grid-cols-1 sm:grid-cols-2 gap-1.5'
    }"
  />
</template>
