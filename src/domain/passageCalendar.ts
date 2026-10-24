/**
 * Baccalaureate is the destination of the Last 100 Days.
 * May 9, 2027 is a simulated date for this demonstration. It is not an official
 * Philander Smith University ceremony date. Commencement remains May 15, 2027
 * on the student records and is not the countdown.
 *
 * The presenter clock is March 28, 2027: day 42 of the active passage.
 * Student screens never describe this clock as a presenter setting.
 */
export const BACCALAUREATE_DATE = '2027-05-09'
export const COMMENCEMENT_DATE = '2027-05-15'
export const PRESENTER_TODAY = new Date(2027, 2, 28)
export const PRELAUNCH_TODAY = new Date(2027, 0, 1)

/** Session clock used only when the app is opened without an explicit date. */
export function readPresenterClock(): Date {
  if (typeof sessionStorage === 'undefined') return PRESENTER_TODAY
  const choice = sessionStorage.getItem('panther-passage:clock')
  if (choice === 'before') return PRELAUNCH_TODAY
  return PRESENTER_TODAY
}

export function formatCalendarDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}
