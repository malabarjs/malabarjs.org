import { readdirSync } from 'node:fs'

// Every activity page must be prerendered explicitly: pre-reveal event pages
// are unlinked, so the crawler can't discover them, and unprerendered
// content pages 404 in the serverless runtime.
const activityRoutes = readdirSync('./content/activities')
  .filter(file => file.endsWith('.md'))
  .map(file => `/activities/${file.replace(/\.md$/, '')}`)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['diff', 'ts', 'vue', 'css', 'js', 'json', 'bash']
        }
      }
    }
  },

  ui: {
    theme: {
      defaultVariants: {
        color: 'neutral'
      }
    }
  },

  runtimeConfig: {
    // Bearer token for /api/admin/flags. Unset = admin endpoint disabled.
    adminToken: '',
    // Optional webhook (Discord-compatible) notified on new form submissions.
    formsWebhookUrl: '',
    // Member count shown if the database is unset / unreachable.
    memberCountFallback: '31'
  },

  routeRules: {
    '/': { prerender: true },
    // Content pages query the markdown database, which isn't available in
    // the serverless runtime - bake them at build time instead.
    '/activities/**': { prerender: true },
    // Client-only admin controls; noindex is set in the page itself.
    '/admin': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', ...activityRoutes]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
