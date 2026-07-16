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
    label: 'Discussions',
    icon: 'i-lucide-messages-square',
    to: 'https://github.com/orgs/malabarjs/discussions'
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
  title: 'MalabarJS Meetup',
  date: 'Aug 22, 2026',
  location: 'Kerala',
  link: 'https://luma.com/a9xt40nb',
  details: '/activities/2026-08-22-first-meetup'
}

const involveLinks = [
  { label: 'Speak', icon: 'i-lucide-mic', to: '/cfp' },
  { label: 'Volunteer', icon: 'i-lucide-hand-heart', to: '/volunteer' },
  { label: 'Sponsor', icon: 'i-lucide-handshake', to: '/sponsor' },
  { label: 'Contact', icon: 'i-lucide-mail', to: '/contact' }
]

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
          headline: 'mb-6 flex justify-center xl:justify-start',
          title: 'text-center xl:text-left text-4xl',
          description: 'text-center xl:text-left max-w-lg',
          links: 'gap-1 justify-start -ms-2.5'
        }"
      >
        <template #top>
          <SkyBg />

          <div
            class="absolute right-0 xl:-right-1/3 z-[-1] rounded-full bg-primary/15 blur-[200px] size-40 sm:size-72 transform -translate-y-1/2 top-1/2"
          />
        </template>

        <template #headline>
          <NuxtLink
            to="/"
            class="inline-flex"
          >
            <AppLogo class="w-auto h-24 shrink-0 text-highlighted" />
          </NuxtLink>
        </template>

        <!-- UPageSection already wraps #title in a heading element;
             nesting another heading inside is invalid HTML and breaks
             hydration, so this is a span. -->
        <template #title>
          <span
            data-hero-anim
            class="block text-4xl font-bold text-highlighted"
          >
            Malabar JS
            <span class="font-[Nanditha] text-4xl font-bold ms-2">(a-e-_m-À-)</span>
          </span>
        </template>

        <template #default>
          <!-- The pitch -->
          <p
            data-hero-anim
            class="text-muted max-w-md text-center xl:text-left self-center xl:self-start"
          >
            JavaScript culture in Kerala is huge, but scattered. We're building a space for JS folks to come closer together.
          </p>

          <!-- Upcoming Event Card -->
          <div
            data-hero-anim
            class="bg-elevated border border-default rounded-lg p-4 w-full max-w-sm self-center xl:self-start"
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
            <div
              v-if="upcomingEvent.link"
              class="mt-3 flex flex-wrap items-center gap-2"
            >
              <UButton
                label="RSVP on Luma"
                icon="i-lucide-ticket"
                size="sm"
                :to="upcomingEvent.link"
                target="_blank"
                rel="noopener noreferrer"
              />
              <UButton
                label="Details"
                icon="i-lucide-arrow-right"
                trailing
                variant="ghost"
                size="sm"
                :to="upcomingEvent.details"
              />
            </div>
          </div>

          <!-- Action buttons -->
          <div
            data-hero-anim
            class="w-full pt-2 self-center xl:self-start"
          >
            <div class="flex flex-wrap items-center justify-center xl:justify-start gap-3">
              <UButton
                label="Subscribe to the Newsletter"
                icon="i-lucide-mail-plus"
                size="lg"
                to="https://blog.malabarjs.org/subscribe/"
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
            <div class="flex flex-wrap items-center justify-center xl:justify-start gap-2 mt-4">
              <UButton
                v-for="link in involveLinks"
                :key="link.to"
                :label="link.label"
                :icon="link.icon"
                :to="link.to"
                variant="subtle"
                color="neutral"
                size="sm"
              />
            </div>
          </div>

          <!-- Live stats -->
          <div
            data-hero-anim
            class="w-full max-w-sm self-center xl:self-start"
          >
            <LiveStats />
          </div>

          <!-- Social links -->
          <div class="flex items-center gap-1 xl:-ms-2.5 self-center xl:self-start">
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
            to="/cfp"
            class="text-muted hover:text-primary transition-colors"
          >
            Speak
          </NuxtLink>
          <NuxtLink
            to="/volunteer"
            class="text-muted hover:text-primary transition-colors"
          >
            Volunteer
          </NuxtLink>
          <NuxtLink
            to="/sponsor"
            class="text-muted hover:text-primary transition-colors"
          >
            Sponsor
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-muted hover:text-primary transition-colors"
          >
            Contact
          </NuxtLink>
          <NuxtLink
            to="/brand"
            class="text-muted hover:text-primary transition-colors"
          >
            Brand
          </NuxtLink>
          <a
            href="https://github.com/orgs/malabarjs/discussions"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted hover:text-primary transition-colors"
          >
            Discussions
          </a>
          <a
            href="https://lu.ma/malabarjs"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted hover:text-primary transition-colors"
          >
            Events
          </a>
        </nav>
        <p class="text-xs text-muted">
          © {{ new Date().getFullYear() }} MalabarJS · Made in Kerala 🥥
        </p>
      </div>
    </footer>
  </div>
</template>
