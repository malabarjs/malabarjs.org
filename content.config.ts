import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    activities: defineCollection({
      type: 'page',
      source: 'activities/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        tag: z.string().optional()
      })
    })
  }
})

