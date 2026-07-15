<script setup lang="ts">
interface BlogPost {
  title: string
  url: string
  date: string
  summary: string
  image: string | null
}

const { data: posts } = await useAsyncData<BlogPost[]>('blog-feed', () =>
  $fetch('/api/blog'), { default: () => [] })

const fmt = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="pt-6 border-t border-default w-full max-w-sm self-start">
    <h3 class="text-sm font-medium text-muted mb-3">
      From the blog
    </h3>

    <div
      v-if="posts && posts.length"
      class="space-y-3"
    >
      <a
        v-for="post in posts"
        :key="post.url"
        :href="post.url"
        target="_blank"
        rel="noopener noreferrer"
        class="block group"
      >
        <article class="bg-elevated border border-default rounded-lg overflow-hidden transition-colors hover:border-primary">
          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            loading="lazy"
            decoding="async"
            class="w-full aspect-[2/1] object-cover"
          >
          <div class="p-4">
            <time class="text-xs text-muted font-mono">{{ fmt(post.date) }}</time>
            <h4 class="font-semibold text-highlighted mt-1 group-hover:text-primary transition-colors">
              {{ post.title }}
            </h4>
            <p
              v-if="post.summary"
              class="text-sm text-muted mt-1.5 line-clamp-2"
            >
              {{ post.summary }}
            </p>
          </div>
        </article>
      </a>
    </div>

    <p
      v-else
      class="text-sm text-muted"
    >
      Posts coming soon.
    </p>

    <UButton
      label="Read the blog"
      icon="i-lucide-arrow-right"
      trailing
      variant="link"
      to="https://blog.malabarjs.org"
      target="_blank"
      size="sm"
      class="mt-3 -ms-2.5"
    />
  </div>
</template>
