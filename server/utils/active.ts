// In-memory active-viewer tracker. Process-local, so on multi-instance setups
// counts will be per-instance - fine for a small community site.

const ACTIVE_TTL_MS = 60 * 1000
const active = new Map<string, number>()

export const touchActive = (key: string) => {
  active.set(key, Date.now())
}

export const countActive = () => {
  const cutoff = Date.now() - ACTIVE_TTL_MS
  for (const [key, ts] of active) {
    if (ts < cutoff) active.delete(key)
  }
  return active.size
}
