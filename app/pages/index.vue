<script setup lang="ts">
// Query all activities from /content/activities/, sorted by date descending
const { data: activities } = await useAsyncData('activities', () =>
  queryCollection('activities').order('date', 'DESC').all()
)
</script>

<template>
  <UChangelogVersions
    as="main"
    :indicator-motion="false"
    :ui="{
      root: 'py-16 sm:py-24 lg:py-32',
      indicator: 'inset-y-0'
    }"
  >
    <UChangelogVersion
      v-for="activity in activities"
      :key="activity.stem"
      :tag="activity.tag"
      :title="activity.title"
      :date="activity.date"
      :ui="{
        root: 'flex items-start',
        container: 'max-w-xl',
        header: 'border-b border-default pb-4',
        title: 'text-3xl',
        date: 'text-xs/9 text-highlighted font-mono',
        indicator:
          'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
      }"
    >
      <template #body>
        <ContentRenderer :value="activity" />
      </template>
    </UChangelogVersion>

    <!-- Fallback when no activities exist -->
    <div
      v-if="!activities?.length"
      class="text-center text-muted py-12"
    >
      <p class="mb-2">
        No activities yet.
      </p>
      <p class="text-sm">
        Check back soon for updates!
      </p>
    </div>
  </UChangelogVersions>
</template>
