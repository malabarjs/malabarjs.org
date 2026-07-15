<script setup lang="ts">
const items = [
  {
    type: 'image',
    src: '/cityjs-delhi-table.jpg',
    alt: 'CityJS Delhi 2026 - MalabarJS table',
    span: 'sm:col-span-2 sm:row-span-2'
  },
  { type: 'video', src: '/community-clip.mp4', alt: 'Community moment', span: '' },
  { type: 'image', src: '/community-1.jpg', alt: 'Community moment', span: '' },
  { type: 'image', src: '/community-2.jpg', alt: 'Community moment', span: '' }
] as const
</script>

<template>
  <section class="pt-6 border-t border-default w-full max-w-sm self-start">
    <h3 class="text-sm font-medium text-muted mb-3">
      From the community
    </h3>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 auto-rows-[80px]">
      <template
        v-for="(item, i) in items"
        :key="i"
      >
        <div
          class="relative overflow-hidden rounded-md border border-default group"
          :class="item.span"
        >
          <video
            v-if="item.type === 'video'"
            :src="item.src"
            class="w-full h-full object-cover"
            muted
            loop
            playsinline
            preload="metadata"
            @mouseenter="(e) => (e.target as HTMLVideoElement).play()"
            @mouseleave="(e) => (e.target as HTMLVideoElement).pause()"
          />
          <img
            v-else
            :src="item.src"
            :alt="item.alt"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          >
          <div
            v-if="item.type === 'video'"
            class="absolute bottom-1 right-1 bg-black/60 text-white rounded-full size-5 flex items-center justify-center pointer-events-none"
          >
            <UIcon
              name="i-lucide-play"
              class="size-3"
            />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
