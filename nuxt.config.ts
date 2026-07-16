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
    // Optional webhook (Discord-compatible) notified on new form submissions.
    formsWebhookUrl: '',
    // Member count shown if the database is unset / unreachable.
    memberCountFallback: '31'
  },

  routeRules: {
    '/': { prerender: true },
    // Content pages query the markdown database, which isn't available in
    // the serverless runtime - bake them at build time instead.
    '/activities/**': { prerender: true }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
