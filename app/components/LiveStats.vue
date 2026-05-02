<script setup lang="ts">
interface Stats { members: number, active: number }

const stats = ref<Stats>({ members: 0, active: 0 })
const previous = ref<Stats>({ members: 0, active: 0 })

let pollTimer: ReturnType<typeof setInterval> | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null

async function pullStats() {
  try {
    const data = await $fetch<Stats>('/api/stats')
    previous.value = stats.value
    stats.value = data
  } catch {
    /* offline */
  }
}

async function heartbeat() {
  try {
    await $fetch('/api/heartbeat', { method: 'POST' })
  } catch {
    /* offline */
  }
}

onMounted(async () => {
  await heartbeat()
  await pullStats()
  pollTimer = setInterval(pullStats, 15_000)
  heartbeatTimer = setInterval(heartbeat, 45_000)
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
  if (heartbeatTimer) clearInterval(heartbeatTimer)
})
</script>

<template>
  <div class="flex items-stretch gap-2 text-xs font-mono">
    <div class="flex-1 bg-elevated border border-default rounded-md px-3 py-2">
      <div class="text-muted text-[10px] uppercase tracking-wider mb-0.5">
        Members
      </div>
      <div class="text-highlighted text-base font-semibold tabular-nums">
        {{ stats.members.toLocaleString() }}
      </div>
    </div>

    <div class="flex-1 bg-elevated border border-default rounded-md px-3 py-2 relative overflow-hidden">
      <div class="text-muted text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
        <span class="relative flex size-1.5">
          <span class="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
          <span class="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        Reading now
      </div>
      <div class="text-highlighted text-base font-semibold tabular-nums">
        {{ Math.max(stats.active, 1) }}
      </div>
    </div>
  </div>
</template>
