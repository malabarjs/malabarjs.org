/**
 * The upcoming event and its reveal schedule. Phases flip automatically on
 * these dates (event-driven); /admin can force a phase when needed.
 *
 * quiet     -> nothing about the event is shown
 * teaser    -> "Something's coming" card, details hidden
 * announced -> full card with RSVP + details
 * past      -> event date has passed; timeline entry stays as the recap
 */
export const UPCOMING_EVENT = {
  title: 'MalabarJS Meetup',
  dateLabel: 'Aug 22, 2026',
  location: 'Kerala',
  link: 'https://luma.com/a9xt40nb',
  details: '/activities/2026-08-22-first-meetup',
  /** Teaser campaign starts (3 weeks out). */
  teaseAt: '2026-08-01T00:00:00+05:30',
  /** Full reveal (2 weeks out). */
  announceAt: '2026-08-08T00:00:00+05:30',
  /** End of event day, IST. */
  endsAt: '2026-08-22T23:59:59+05:30'
}

export type EventPhase = 'quiet' | 'teaser' | 'announced' | 'past'

export const eventPhase = (now: Date = new Date()): EventPhase => {
  const t = now.getTime()
  if (t >= new Date(UPCOMING_EVENT.endsAt).getTime()) return 'past'
  if (t >= new Date(UPCOMING_EVENT.announceAt).getTime()) return 'announced'
  if (t >= new Date(UPCOMING_EVENT.teaseAt).getTime()) return 'teaser'
  return 'quiet'
}
