<script setup lang="ts">
import { forms } from '#shared/forms'

definePageMeta({
  layout: 'content'
})

const route = useRoute()
const config = forms[String(route.params.form)]

if (!config) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: `${config.title} - MalabarJS`,
  meta: [{ name: 'description', content: config.description }]
})
</script>

<template>
  <main class="py-12 sm:py-16 px-4">
    <div class="max-w-xl mx-auto">
      <div class="mb-10">
        <div
          v-if="config!.icon"
          class="size-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5"
        >
          <UIcon
            :name="config!.icon"
            class="size-5"
          />
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-highlighted mb-3">
          {{ config!.title }}
        </h1>
        <p class="text-muted">
          {{ config!.description }}
        </p>
      </div>

      <FormEngine :config="config!" />
    </div>
  </main>
</template>
