<script setup>
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/official-white-logo.svg' },
    { rel: 'icon', type: 'image/png', href: '/official-white-logo.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Malabar JS'
const description = 'Join a community that celebrates curiosity, supports creators, and brings ambitious JavaScript developers together.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterCard: 'summary_large_image'
})

const socialLinks = [
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/malabarjs'
  },
  {
    label: 'X',
    icon: 'i-simple-icons-x',
    to: 'https://x.com/malabarjs'
  },
  {
    label: 'Instagram',
    icon: 'i-simple-icons-instagram',
    to: 'https://www.instagram.com/malabar.js/'
  },
  {
    label: 'LinkedIn',
    icon: 'i-simple-icons-linkedin',
    to: 'https://www.linkedin.com/company/malabarjs/'
  }
]

// Upcoming event - update this when you have events scheduled
const upcomingEvent = {
  title: 'First Meetup Coming Soon',
  date: 'TBA',
  location: 'Kerala',
  link: null // Add event link when available
}

// Google Form for joining
const joinFormUrl = 'https://forms.gle/TBKPRekxr4wN6EJp9' // ← Replace with your Google Form URL
</script>

<template>
  <UApp>
    <div class="min-h-screen xl:grid xl:grid-cols-2">
      <UPageSection
        description="Join a community that celebrates curiosity, supports creators, and brings ambitious JavaScript developers together."
        orientation="vertical"
        :ui="{
          root: 'border-b border-default xl:border-b-0 xl:h-screen xl:overflow-y-auto xl:overflow-x-hidden',
          container: 'h-full items-center justify-center py-16 sm:py-24 lg:py-32',
          wrapper: 'flex flex-col',
          headline: 'mb-6',
          title: 'text-left text-4xl',
          description: 'text-left max-w-lg',
          links: 'gap-1 justify-start -ms-2.5'
        }"
      >
        <template #top>
          <SkyBg />

          <div
            class="absolute -right-1/2 z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-100 transform -translate-y-1/2 top-1/2"
          />
        </template>

        <template #headline>
          <AppLogo class="w-auto h-24 shrink-0 text-highlighted" />
        </template>

        <template #title>
          <h1 class="text-4xl font-bold text-highlighted">
            Malabar JS
            <span class="font-[Nanditha] text-4xl font-bold ms-2">(a-e-_m-À-)</span>
          </h1>
        </template>

        <template #default>
          <!-- Malayalam tagline (FML Leela) -->
          <p class="font-[Leela] text-2xl text-muted">
            -tIc-f-¯nse Hm-¸-¬- tkmgvkv Pm-hm-kv{In-]väv I-½yq-Wn-än-
          </p>

          <!-- Upcoming Event Card -->
          <div class="bg-elevated border border-default rounded-lg p-4 max-w-sm">
            <div class="flex items-center gap-2 text-primary text-xs font-medium mb-2">
              <UIcon
                name="i-lucide-calendar"
                class="size-4"
              />
              <span>UPCOMING</span>
            </div>
            <h3 class="font-semibold text-highlighted">
              {{ upcomingEvent.title }}
            </h3>
            <p class="text-sm text-muted mt-1">
              {{ upcomingEvent.date }} · {{ upcomingEvent.location }}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <UButton
              label="Join the Community"
              icon="i-lucide-users"
              :to="joinFormUrl"
              target="_blank"
              size="lg"
            />
          </div>

          <!-- Social links -->
          <div class="flex items-center gap-1 -ms-2.5">
            <UButton
              v-for="link in socialLinks"
              :key="link.label"
              :icon="link.icon"
              :to="link.to"
              target="_blank"
              variant="ghost"
              size="md"
              :aria-label="link.label"
            />
          </div>
        </template>
      </UPageSection>

      <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
        <UColorModeButton class="fixed top-4 right-4 z-10" />

        <NuxtPage />
      </section>
    </div>
  </UApp>
</template>
