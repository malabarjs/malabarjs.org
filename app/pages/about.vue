<script setup lang="ts">
definePageMeta({
  layout: 'content'
})

useHead({
  title: 'About — MalabarJS'
})
</script>

<template>
  <main class="py-12 sm:py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold text-highlighted mb-8">
        About MalabarJS
      </h1>

      <div class="prose prose-sm text-muted space-y-6">
        <p class="text-lg text-highlighted">
          MalabarJS is a community for JavaScript developers in Kerala, India. We exist to bring together frontend engineers, full-stack developers, indie hackers, and anyone passionate about the JavaScript ecosystem.
        </p>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Why MalabarJS?
        </h2>
        <p>
          Kerala has an incredible pool of JavaScript talent - developers working at startups, building products, contributing to open source, learning React/Vue/Svelte, shipping with Node/Bun/Deno. But everyone's scattered in their own corners.
        </p>
        <p>
          MalabarJS is that missing space where JS folks in Kerala can come together - to share knowledge, celebrate projects, find collaborators, and grow the local JS culture.
        </p>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          What We Do
        </h2>
        <ul class="space-y-2 list-disc list-inside">
          <li><strong>Meetups:</strong>  Regular gatherings for talks, demos, and conversations</li>
          <li><strong>Writing:</strong> Blog posts about JS, frontend, and the local tech scene</li>
          <li><strong>Open Source:</strong> Community projects built together</li>
          <li><strong>Showcasing:</strong> Highlighting projects and people from Kerala</li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Our Values
        </h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">01</span>
            <div>
              <strong class="text-highlighted">Inclusive by Default</strong>
              <p class="mt-1">Everyone's welcome - beginners, experts, and everyone in between. No gatekeeping.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">02</span>
            <div>
              <strong class="text-highlighted">Open Source Mindset</strong>
              <p class="mt-1">We share knowledge freely, contribute to OSS, and build in public.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">03</span>
            <div>
              <strong class="text-highlighted">Local First</strong>
              <p class="mt-1">Rooted in Kerala, celebrating local talent, connected globally.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">04</span>
            <div>
              <strong class="text-highlighted">No Corporate Nonsense</strong>
              <p class="mt-1">We're a community, not a company. No sales pitches at meetups.</p>
            </div>
          </li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          The Team
        </h2>
        <p>
          MalabarJS is currently organized by:
        </p>
        <div class="mt-4">
          <div class="flex items-center gap-4">
            <img
              src="/alwinjohn.jpg"
              alt="Alwin John"
              class="w-16 h-16 rounded-full object-cover border border-default"
            >
            <div>
              <p class="font-semibold text-highlighted">Alwin John</p>
              <p class="text-sm">Organizer</p>
              <a
                href="https://x.com/_alwin_john"
                target="_blank"
                class="text-sm text-primary hover:underline"
              >
                @_alwin_john
              </a>
            </div>
          </div>
        </div>
        <p class="mt-6 text-sm">
          Want to help organize? DM us on <a href="https://x.com/malabarjs" target="_blank" class="text-primary hover:underline">X (@malabarjs)</a>.
        </p>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Founded
        </h2>
        <p>
          November 2025, Kerala, India.
        </p>

        <div class="mt-12 pt-6 border-t border-default">
          <p class="text-sm">
            Read the full story: <a href="https://blog.malabarjs.org/why-start-another-javascript-community-in-kerala-the-honest-answer/" target="_blank" class="text-primary hover:underline">Why Start Another JavaScript Community in Kerala?</a>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

