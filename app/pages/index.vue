<script setup lang="ts">
import { ref } from "vue";

const versions = ref<
  Array<{ tag: string; title: string; date: string; markdown: string }>
>([]);

// Fallback minimal dataset so page still renders when no local markdown exists
versions.value = [
  {
    tag: "founding",
    title: "MalabarJS Founded",
    date: "2025-11-22",
    markdown:
      "MalabarJS was founded in 2025 to empower Kerala’s developers through collaboration, open-source, and shared learning.",
  },
];
</script>

<template>
  <UChangelogVersions
    as="main"
    :indicator-motion="false"
    :ui="{
      root: 'py-16 sm:py-24 lg:py-32',
      indicator: 'inset-y-0',
    }"
  >
    <UChangelogVersion
      v-for="version in versions"
      :key="version.tag"
      v-bind="version"
      :ui="{
        root: 'flex items-start',
        container: 'max-w-xl',
        header: 'border-b border-default pb-4',
        title: 'text-3xl',
        date: 'text-xs/9 text-highlighted font-mono',
        indicator:
          'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32',
      }"
    >
      <template #body>
        <!--
          Use MDC to render markdown/html when available. If markdown is empty,
          provide a small helpful fallback that points to content/activities.
        -->
        <MDC v-if="version.markdown" :value="version.markdown" />

        <div v-else class="text-sm text-muted">
          <p class="mb-2">{{ version.title }}</p>
          <p class="text-xs">
            Add a markdown file to <code>/content/activities/</code> with
            frontmatter (title, date). The content will appear here
            automatically.
          </p>
        </div>
      </template>
    </UChangelogVersion>
  </UChangelogVersions>
</template>
