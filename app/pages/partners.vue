<script setup lang="ts">
definePageMeta({
  layout: 'content'
})

useHead({
  title: 'Community Partners — MalabarJS'
})
</script>

<template>
  <main class="py-12 sm:py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold text-highlighted mb-4">
        Community Partners
      </h1>
      <p class="text-lg text-muted mb-12">
        Partner with MalabarJS to support Kerala's JavaScript community.
      </p>

      <div class="prose prose-sm text-muted space-y-6">
        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Why Partner With Us?
        </h2>
        <p>
          MalabarJS is building a vibrant community of JavaScript developers across Kerala. By partnering with us, you can:
        </p>
        <ul class="space-y-2 list-disc list-inside">
          <li>Reach talented JS developers in Kerala</li>
          <li>Support the local open-source ecosystem</li>
          <li>Showcase your brand at meetups and events</li>
          <li>Connect with potential hires who are actively learning and building</li>
          <li>Give back to the developer community</li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Partnership Options
        </h2>

        <div class="space-y-6 mt-6">
          <div class="bg-elevated border border-default rounded-lg p-6">
            <h3 class="font-semibold text-highlighted text-lg">
              🎤 Event Sponsor
            </h3>
            <p class="mt-2">
              Sponsor a meetup or workshop. Your brand featured in event promotion, on-site presence, and post-event content.
            </p>
          </div>

          <div class="bg-elevated border border-default rounded-lg p-6">
            <h3 class="font-semibold text-highlighted text-lg">
              🏠 Venue Partner
            </h3>
            <p class="mt-2">
              Host our meetups at your space. Perfect for co-working spaces, tech companies, or educational institutions.
            </p>
          </div>

          <div class="bg-elevated border border-default rounded-lg p-6">
            <h3 class="font-semibold text-highlighted text-lg">
              🤝 Community Partner
            </h3>
            <p class="mt-2">
              Cross-promotion with other tech communities, conferences, or developer groups. Let's grow together.
            </p>
          </div>

          <div class="bg-elevated border border-default rounded-lg p-6">
            <h3 class="font-semibold text-highlighted text-lg">
              📚 Learning Partner
            </h3>
            <p class="mt-2">
              Provide resources, courses, or tools for our community members. Help developers level up.
            </p>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          What We Offer Partners
        </h2>
        <ul class="space-y-2 list-disc list-inside">
          <li>Logo placement on website and event materials</li>
          <li>Shoutouts on social media (X, Instagram, LinkedIn)</li>
          <li>Speaking slot or demo opportunity at events (if relevant)</li>
          <li>Access to community for hiring/recruiting</li>
          <li>Collaboration on community projects</li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          What We Expect
        </h2>
        <ul class="space-y-2 list-disc list-inside">
          <li>Alignment with our community values</li>
          <li>No hard sales pitches at events, be genuinely helpful</li>
          <li>Promotion of MalabarJS through your channels when relevant</li>
          <li>Responsive communication with organizers</li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Current Partners
        </h2>
        <div class="bg-elevated border border-dashed border-default rounded-lg p-8 text-center">
          <p class="text-muted">
            Be our first partner! 🥥
          </p>
        </div>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Interested?
        </h2>
        <p>
          Reach out to discuss partnership opportunities:
        </p>
        <p>
          DM us on X: <a href="https://x.com/malabarjs" target="_blank" class="text-primary hover:underline">@malabarjs</a>
        </p>

        <div class="mt-8">
          <UButton
            label="DM Us on X"
            icon="i-simple-icons-x"
            to="https://x.com/malabarjs"
            target="_blank"
            size="lg"
          />
        </div>

        <div class="mt-12 pt-6 border-t border-default">
          <p class="text-sm text-muted">
            We're selective about partnerships to maintain community trust. We prioritize partners who genuinely want to support developers over pure brand exposure.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

