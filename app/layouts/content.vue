<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-b border-default">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <AppLogo class="w-auto h-10 shrink-0 text-highlighted" />
          <span class="font-bold text-highlighted">MalabarJS</span>
        </NuxtLink>

        <UColorModeButton />
      </div>
    </header>

    <!-- Content -->
    <slot />

    <!-- Footer -->
    <footer class="border-t border-default mt-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <NuxtLink
            to="/"
            class="text-muted hover:text-primary transition-colors"
          >
            Home
          </NuxtLink>
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
          <a
            href="https://blog.malabarjs.org"
            target="_blank"
            class="text-muted hover:text-primary transition-colors"
          >
            Blog
          </a>
        </div>
        <p class="text-sm text-muted mt-4">
          © {{ new Date().getFullYear() }} MalabarJS. Built with 🥥 in Kerala.
        </p>
      </div>
    </footer>
  </div>
</template>

