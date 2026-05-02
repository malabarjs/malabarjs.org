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
    joinWebhookUrl: '',
    // Published Google Sheet CSV URL — source of truth for member count.
    // File → Share → Publish to web → CSV.
    memberSheetCsvUrl: '',
    // Fallback shown if the sheet URL is unset / unreachable.
    memberCountFallback: '31'
  },

  routeRules: {
    '/': { prerender: true }
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
