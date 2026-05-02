import { touchActive, countActive } from '../utils/active'

export default defineEventHandler(async (event) => {
  const cookieName = 'mjs_v'
  let visitor = getCookie(event, cookieName)
  if (!visitor) {
    visitor = globalThis.crypto.randomUUID()
    setCookie(event, cookieName, visitor, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    })
  }
  touchActive(visitor)
  return { active: countActive() }
})
