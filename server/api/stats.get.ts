import { countActive } from '../utils/active'

const STORAGE_KEY = 'members:count'

export default defineEventHandler(async () => {
  const storage = useStorage('data')
  let count = await storage.getItem<number>(STORAGE_KEY)
  if (count === null || count === undefined) {
    const { memberCountSeed } = useRuntimeConfig()
    count = Number(memberCountSeed) || 0
    await storage.setItem(STORAGE_KEY, count)
  }
  return {
    members: count,
    active: countActive()
  }
})
