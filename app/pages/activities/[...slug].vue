<script setup lang="ts">
definePageMeta({
  layout: 'content'
})

const route = useRoute()
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : String(route.params.slug ?? '')

const { data: activity } = await useAsyncData(`activity-${slug}`, () =>
  queryCollection('activities').where('stem', '=', slug).first()
)

if (!activity.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Activity not found',
    fatal: true
  })
}

const fmt = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

useHead({
  title: `${activity.value.title} - MalabarJS`
})

useSeoMeta({
  title: activity.value.title,
  ogTitle: activity.value.title,
  ogImage: activity.value.image
    ? `https://malabarjs.org${activity.value.image}`
    : undefined,
  twitterCard: activity.value.image ? 'summary_large_image' : 'summary'
})
</script>

<template>
  <main class="py-12 sm:py-16 px-4">
    <article class="max-w-2xl mx-auto">
      <UButton
        to="/"
        icon="i-lucide-arrow-left"
        variant="link"
        size="sm"
        class="-ms-2.5 mb-6"
      >
        All activities
      </UButton>

      <header class="mb-8">
        <div class="flex items-center gap-3 text-xs text-muted font-mono mb-3">
          <time>{{ fmt(activity!.date) }}</time>
          <span
            v-if="activity!.tag"
            class="px-2 py-0.5 rounded-full bg-elevated border border-default text-highlighted"
          >{{ activity!.tag }}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-highlighted">
          {{ activity!.title }}
        </h1>
      </header>

      <figure
        v-if="activity!.image"
        class="mb-8 overflow-hidden rounded-lg border border-default"
      >
        <img
          :src="activity!.image"
          :alt="activity!.imageAlt || activity!.title"
          loading="eager"
          decoding="async"
          class="w-full h-auto block"
        >
        <figcaption
          v-if="activity!.imageAlt"
          class="text-xs text-muted px-4 py-2 border-t border-default bg-elevated"
        >
          {{ activity!.imageAlt }}
        </figcaption>
      </figure>

      <div class="prose prose-sm sm:prose-base text-muted max-w-none">
        <ContentRenderer :value="activity!" />
      </div>

      <div
        class="mt-12 pt-6 border-t border-default flex items-center justify-between text-sm"
      >
        <UButton
          to="/"
          icon="i-lucide-arrow-left"
          variant="link"
          size="sm"
          class="-ms-2.5"
        >
          Back to timeline
        </UButton>
        <NuxtLink
          to="/partners"
          class="text-muted hover:text-primary transition-colors"
        >
          Partner with us →
        </NuxtLink>
      </div>
    </article>
  </main>
</template>
