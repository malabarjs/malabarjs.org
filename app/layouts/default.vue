<script setup lang="ts">
const socialLinks = [
  {
    label: 'Blog',
    icon: 'i-lucide-pen-line',
    to: 'https://blog.malabarjs.org'
  },
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
const joinFormUrl = 'https://forms.gle/TBKPRekxr4wN6EJp9'
</script>

<template>
  <div class="min-h-screen xl:grid xl:grid-cols-2">
    <UPageSection
      description="A space that feels like home for JavaScript developers in Kerala."
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
        <NuxtLink to="/">
          <AppLogo class="w-auto h-24 shrink-0 text-highlighted" />
        </NuxtLink>
      </template>

      <template #title>
        <h1 class="text-4xl font-bold text-highlighted">
          Malabar JS
          <span class="font-[Nanditha] text-4xl font-bold ms-2">(a-e-_m-À-)</span>
        </h1>
      </template>

      <template #default>
        <!-- The pitch -->
        <p class="text-muted max-w-md">
          JavaScript culture in Kerala is huge, but scattered. We're building a space for JS folks to come closer together.
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

        <!-- From the blog -->
        <div class="pt-6 border-t border-default max-w-sm">
          <h3 class="text-sm font-medium text-muted mb-3">
            From the blog
          </h3>
          <a
            href="https://blog.malabarjs.org/why-start-another-javascript-community-in-kerala-the-honest-answer/"
            target="_blank"
            class="block group"
          >
            <article class="bg-elevated border border-default rounded-lg p-4 transition-colors hover:border-primary">
              <time class="text-xs text-muted font-mono">04 Dec, 2025</time>
              <h4 class="font-semibold text-highlighted mt-1 group-hover:text-primary transition-colors">
                Why Start Another JavaScript Community in Kerala? (The Honest Answer)
              </h4>
              <p class="text-sm text-muted mt-1.5 line-clamp-2">
                The honest answer.
              </p>
            </article>
          </a>
          <UButton
            label="Read the blog"
            icon="i-lucide-arrow-right"
            trailing
            variant="link"
            to="https://blog.malabarjs.org"
            target="_blank"
            size="sm"
            class="mt-3 -ms-2.5"
          />
        </div>

        <!-- Footer Links -->
        <div class="pt-6 border-t border-default max-w-sm">
          <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-3">
            <NuxtLink
              to="/about"
              class="text-muted hover:text-primary transition-colors"
            >
              About
            </NuxtLink>
            <NuxtLink
              to="/code-of-conduct"
              class="text-muted hover:text-primary transition-colors"
            >
              Code of Conduct
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-muted hover:text-primary transition-colors"
            >
              Terms
            </NuxtLink>
            <NuxtLink
              to="/partners"
              class="text-muted hover:text-primary transition-colors"
            >
              Partners
            </NuxtLink>
            <NuxtLink
              to="/brand"
              class="text-muted hover:text-primary transition-colors"
            >
              Brand
            </NuxtLink>
          </div>
        </div>
      </template>
    </UPageSection>

    <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
      <UColorModeButton class="fixed top-4 right-4 z-10" />

      <slot />
    </section>
  </div>
</template>

