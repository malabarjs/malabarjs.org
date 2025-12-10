<script setup lang="ts">
definePageMeta({
  layout: 'content'
})

useHead({
  title: 'Brand Guidelines — MalabarJS'
})

const brandKitUrl = '/logo-guidelines.zip'
</script>

<template>
  <main class="py-12 sm:py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold text-highlighted mb-4">
        Brand Guidelines
      </h1>
      <p class="text-lg text-muted mb-12">
        Guidelines for using MalabarJS branding in your content, events, or partnerships.
      </p>

      <div class="prose prose-sm text-muted space-y-6">
        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Download Brand Kit
        </h2>
        <p>
          Get logos, colors, and assets in one package:
        </p>
        <div class="mt-4">
          <UButton
            label="Download Brand Kit (.zip)"
            icon="i-lucide-download"
            :to="brandKitUrl"
            target="_blank"
            size="lg"
          />
        </div>
        <p class="text-sm mt-2">
          Includes: Logo (SVG, PNG), color palette, typography specs, usage guidelines (PDF)
        </p>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Logo
        </h2>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="bg-white border border-default rounded-lg p-6 flex flex-col items-center justify-center gap-3">
            <img
              src="/official-gray-logo.svg"
              alt="MalabarJS Logo (Gray)"
              class="h-16 w-auto"
            >
            <span class="text-xs text-gray-500">For light backgrounds</span>
          </div>
          <div class="bg-gray-900 border border-default rounded-lg p-6 flex flex-col items-center justify-center gap-3">
            <img
              src="/official-white-logo.svg"
              alt="MalabarJS Logo (White)"
              class="h-16 w-auto"
            >
            <span class="text-xs text-gray-400">For dark backgrounds</span>
          </div>
        </div>
        <p class="text-sm mt-2">
          Use the appropriate logo variant based on background. Maintain clear space around the logo.
        </p>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Colors
        </h2>
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div class="h-20 rounded-lg bg-[#00DC82]" />
            <p class="text-sm mt-2 font-mono">Primary</p>
            <p class="text-xs font-mono text-muted">#00DC82</p>
          </div>
          <div>
            <div class="h-20 rounded-lg bg-slate-900 border border-default" />
            <p class="text-sm mt-2 font-mono">Dark</p>
            <p class="text-xs font-mono text-muted">#0f172a</p>
          </div>
          <div>
            <div class="h-20 rounded-lg bg-slate-100 border border-default" />
            <p class="text-sm mt-2 font-mono">Light</p>
            <p class="text-xs font-mono text-muted">#f1f5f9</p>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Typography
        </h2>
        <ul class="space-y-2 list-disc list-inside">
          <li><strong>Primary:</strong> Public Sans (or system sans-serif)</li>
          <li><strong>Malayalam:</strong> FML Nanditha / FML Leela</li>
          <li><strong>Monospace:</strong> For code, use system monospace</li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Usage Guidelines
        </h2>

        <h3 class="text-lg font-medium text-highlighted mt-6">
          ✅ Do
        </h3>
        <ul class="space-y-2 list-disc list-inside">
          <li>Use the official logo without modifications</li>
          <li>Maintain aspect ratio when resizing</li>
          <li>Use on clean, uncluttered backgrounds</li>
          <li>Credit MalabarJS when using our content</li>
        </ul>

        <h3 class="text-lg font-medium text-highlighted mt-6">
          🚫 Don't
        </h3>
        <ul class="space-y-2 list-disc list-inside">
          <li>Modify, distort, or recolor the logo</li>
          <li>Use the logo to imply official endorsement without permission</li>
          <li>Place the logo on busy or clashing backgrounds</li>
          <li>Use old or unofficial versions of the logo</li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Social Media
        </h2>
        <p>
          When mentioning MalabarJS:
        </p>
        <ul class="space-y-2 list-disc list-inside">
          <li>X/Twitter: <span class="font-mono">@malabarjs</span></li>
          <li>Instagram: <span class="font-mono">@malabar.js</span></li>
          <li>LinkedIn: <span class="font-mono">MalabarJS</span></li>
          <li>Hashtag: <span class="font-mono">#MalabarJS</span></li>
        </ul>

        <h2 class="text-xl font-semibold text-highlighted mt-8">
          Questions?
        </h2>
        <p>
          Need assets in a different format or have questions about brand usage?
        </p>
        <p>
          DM us on X: <a href="https://x.com/malabarjs" target="_blank" class="text-primary hover:underline">@malabarjs</a>
        </p>

        <div class="mt-12 pt-6 border-t border-default">
          <p class="text-sm text-muted">
            Last updated: December 2025
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

