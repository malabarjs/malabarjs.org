import { eventPhase, type EventPhase } from '#shared/event'

/**
 * Event phase resolution. The phase is event-driven (computed from the
 * dates in shared/event.ts); the /admin override only applies when it is
 * set to something other than 'auto'. Flags are fetched client-side
 * because the pages using them are prerendered.
 */
export const useSiteFlags = () => {
  const { data: flags } = useFetch<Record<string, unknown>>('/api/flags', {
    key: 'site-flags',
    server: false,
    default: () => ({ eventMode: 'auto' })
  })

  const phase = computed<EventPhase>(() => {
    const override = flags.value?.eventMode
    if (override === 'quiet' || override === 'teaser' || override === 'announced') {
      return override
    }
    return eventPhase()
  })

  /** True when an activity should stay hidden pre-reveal. */
  const hiddenPreReveal = (activity: { tag?: string, date?: string }) =>
    (phase.value === 'quiet' || phase.value === 'teaser')
    && activity.tag === 'event'
    && !!activity.date
    && new Date(activity.date).getTime() > Date.now()

  return { flags, phase, hiddenPreReveal }
}
