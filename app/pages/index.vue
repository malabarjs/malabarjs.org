<script setup lang="ts">
const { data: activities } = await useAsyncData('activities', () =>
  queryCollection('activities').order('date', 'DESC').all()
)

// Upcoming events stay out of the timeline until the reveal phase.
const { hiddenPreReveal } = useSiteFlags()
const visibleActivities = computed(() =>
  (activities.value ?? []).filter(a => !hiddenPreReveal(a))
)

// stem includes the collection folder ('activities/…'); strip it so links
// resolve to /activities/<slug> instead of /activities/activities/<slug>.
const activityLink = (stem: string) =>
  `/activities/${stem.replace(/^activities\//, '')}`

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { gsap } = useGsap()
  const items = document.querySelectorAll<HTMLElement>('[data-timeline-item]')
  items.forEach((item) => {
    gsap.from(item, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })
  })
})
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
      v-for="activity in visibleActivities"
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
        <div data-timeline-item>
          <NuxtLink
            v-if="activity.image"
            :to="activityLink(activity.stem)"
            class="block mb-4 overflow-hidden rounded-lg border border-default group"
          >
            <img
              :src="activity.image"
              :alt="activity.imageAlt || activity.title"
              loading="lazy"
              decoding="async"
              class="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
            >
          </NuxtLink>
          <ContentRenderer :value="activity" />
          <div class="mt-4">
            <UButton
              :to="activityLink(activity.stem)"
              icon="i-lucide-arrow-right"
              trailing
              variant="link"
              size="sm"
              class="-ms-2.5"
            >
              Read more
            </UButton>
          </div>
        </div>
      </template>
    </UChangelogVersion>

    <!-- Fallback when no activities exist -->
    <div
      v-if="!visibleActivities.length"
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
