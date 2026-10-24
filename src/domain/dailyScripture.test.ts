import { DAILY_SCRIPTURES, scriptureForDate } from './dailyScripture'

describe('scripture of the day', () => {
  it('uses the King James text and stays on the same verse for a calendar day', () => {
    const morning = scriptureForDate(new Date(2026, 9, 23, 1, 0, 0))
    const evening = scriptureForDate(new Date(2026, 9, 23, 23, 30, 0))
    expect(morning).toEqual(evening)
    expect(DAILY_SCRIPTURES.map((item) => item.text)).toContain(morning.text)
    expect(morning.reference).toContain('King James Version')
  })

  it('moves to another verse on the next calendar day', () => {
    const today = scriptureForDate(new Date(2026, 9, 23))
    const tomorrow = scriptureForDate(new Date(2026, 9, 24))
    expect(tomorrow.id).not.toBe(today.id)
  })
})