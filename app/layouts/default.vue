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

const joinOpen = ref(false)

function onJoinSuccess() {
  window.setTimeout(() => {
    joinOpen.value = false
  }, 2200)
}

const heroRoot = ref<HTMLElement | null>(null)

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { gsap } = useGsap()
  const root = heroRoot.value
  if (!root) return
  const targets = root.querySelectorAll<HTMLElement>('[data-hero-anim]')
  gsap.from(targets, {
    y: 16,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.08,
    clearProps: 'transform'
  })
})
</script>

<template>
  <div
    ref="heroRoot"
    class="min-h-screen flex flex-col"
  >
    <div class="flex-1 xl:grid xl:grid-cols-2">
      <UPageSection
        description="A space that feels like home for JavaScript developers in Kerala."
        orientation="vertical"
        :ui="{
          root: 'border-b border-default xl:border-b-0',
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
            class="absolute -right-1/3 z-[-1] rounded-full bg-primary/15 blur-[200px] size-40 sm:size-72 transform -translate-y-1/2 top-1/2"
          />
        </template>

        <template #headline>
          <NuxtLink to="/">
            <AppLogo class="w-auto h-24 shrink-0 text-highlighted" />
          </NuxtLink>
        </template>

        <template #title>
          <h1
            data-hero-anim
            class="text-4xl font-bold text-highlighted"
          >
            Malabar JS
            <span class="font-[Nanditha] text-4xl font-bold ms-2">(a-e-_m-À-)</span>
          </h1>
        </template>

        <template #default>
          <!-- The pitch -->
          <p
            data-hero-anim
            class="text-muted max-w-md"
          >
            JavaScript culture in Kerala is huge, but scattered. We're building a space for JS folks to come closer together.
          </p>

          <!-- Upcoming Event Card -->
          <div
            data-hero-anim
            class="bg-elevated border border-default rounded-lg p-4 max-w-sm"
          >
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
          <div
            data-hero-anim
            class="flex flex-wrap items-center gap-3"
          >
            <UButton
              label="Join the Community"
              icon="i-lucide-users"
              size="lg"
              @click="joinOpen = true"
            />
          </div>

          <!-- Live stats -->
          <div
            data-hero-anim
            class="max-w-sm"
          >
            <LiveStats />
          </div>

          <USlideover
            v-model:open="joinOpen"
            title="Join MalabarJS"
            description="Tell us a bit about you. We read every submission."
            :ui="{ content: 'sm:max-w-lg' }"
          >
            <template #body>
              <JoinForm @success="onJoinSuccess" />
            </template>
          </USlideover>

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

          <MediaGallery />

          <BlogFeed />
        </template>
      </UPageSection>

      <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
        <UColorModeButton class="fixed top-4 right-4 z-10" />

        <slot />
      </section>
    </div>

    <MembersMap />

    <footer class="border-t border-default px-4 sm:px-6 py-6">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
        <nav class="flex flex-wrap gap-x-4 gap-y-2">
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
        </nav>
        <p class="text-xs text-muted">
          © {{ new Date().getFullYear() }} MalabarJS · Made in Kerala 🥥
        </p>
      </div>
    </footer>
  </div>
</template>
