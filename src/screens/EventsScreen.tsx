import { useState } from 'react'
import { DemoNote, ScreenFrame, StatusPill } from '../components/ui/ScreenFrame'
import { usePassage } from '../state/PassageContext'

function formatWhen(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function EventsScreen() {
  const { catalog, progress, toggleRsvp } = usePassage()
  const categories = ['all', ...Array.from(new Set(catalog.events.map((event) => event.category)))]
  const [category, setCategory] = useState('all')
  const [notice, setNotice] = useState('')
  const events = catalog.events.filter((event) => category === 'all' || event.category === category)

  return (
    <ScreenFrame
      title="Make room for connection."
      lede="Every gathering below is simulated. An RSVP confirms your place in this passage only."
    >
      <label className="block max-w-xs text-sm font-bold text-ink">
        Category
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-1 min-h-12 w-full rounded-2xl border border-field-border bg-field px-3 text-base"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? 'All categories' : item}
            </option>
          ))}
        </select>
      </label>
      {notice ? (
        <p role="status" className="rounded-2xl bg-summary-well px-3 py-3 text-sm text-evergreen">
          {notice}
        </p>
      ) : null}
      {events.length === 0 ? (
        <p role="status">No simulated events are in that category.</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {events.map((event) => {
            const going = progress.rsvpEventIds.includes(event.id)
            const noted = event.rsvpCount + (going ? 1 : 0)
            const full = !going && noted >= event.capacity
            return (
              <li key={event.id} className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="gold">{event.category}</StatusPill>
                  <StatusPill>Simulated</StatusPill>
                  {going ? <StatusPill tone="done">You are attending</StatusPill> : null}
                </div>
                <h2 className="mt-3 font-display text-2xl leading-tight text-evergreen">{event.title}</h2>
                <p className="mt-2 text-sm">{event.description}</p>
                <p className="mt-2 text-sm text-ink-soft">
                  {formatWhen(event.date)} · {event.location}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Demo seats noted: {noted} of {event.capacity}. The published count does not include a real roster.
                </p>
                <button
                  type="button"
                  disabled={full}
                  className="mt-3 inline-flex min-h-12 items-center rounded-full bg-evergreen px-4 font-bold text-ivory disabled:opacity-50"
                  onClick={() => {
                    toggleRsvp(event.id)
                    setNotice(going ? `RSVP cancelled for ${event.title}.` : `RSVP saved for ${event.title}. This does not reserve a real seat.`)
                  }}
                >
                  {going ? 'Cancel RSVP' : full ? 'Simulated gathering is full' : 'RSVP'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <DemoNote>Attendance is stored only in this browser. It does not reserve a seat at a real event.</DemoNote>
    </ScreenFrame>
  )
}
