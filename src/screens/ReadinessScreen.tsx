import { Link } from 'react-router-dom'
import { DemoNote, Meter, ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { usePassage } from '../state/PassageContext'

export function ReadinessScreen() {
  const { views, readiness, preparation, finaleReady, countdown } = usePassage()
  const remaining = views.filter((item) => item.required && item.status !== 'completed')
  const done = views.filter((item) => item.status === 'completed')

  return (
    <ScreenFrame
      title="Prepared in ways that matter."
      lede="This page counts preparation inside Panther Passage. It is not official graduation clearance, academic standing, or a university checklist."
    >
      <p className="font-display text-4xl leading-none text-evergreen">{countdown}</p>
      <p className="text-sm leading-relaxed text-ink">
        {readiness.completed} of {readiness.total} required steps are complete. Preparation across all milestones is{' '}
        {preparation.completed} of {preparation.total}. The calendar does not change these counts.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.4rem] bg-paper px-4 py-4">
          <Meter label="Required readiness" completed={readiness.completed} total={readiness.total} />
        </div>
        <div className="rounded-[1.4rem] bg-paper px-4 py-4">
          <Meter label="All milestones" completed={preparation.completed} total={preparation.total} />
        </div>
      </div>
      <section>
        <h2 className="font-display text-2xl text-evergreen">Still open</h2>
        {remaining.length === 0 ? (
          <p className="mt-2 text-sm">Every required milestone is complete.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {remaining.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/journey/${item.id}`}
                  className="flex min-h-12 items-center justify-between rounded-2xl bg-field px-3 text-ink no-underline"
                >
                  <span className="font-bold">
                    {item.id} {item.title}
                  </span>
                  <span className="text-sm">{item.status === 'locked' ? 'Locked' : 'Open'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-display text-2xl text-evergreen">Already complete</h2>
        {done.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Completed milestones will gather here.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {done.map((item) => (
              <li key={item.id} className="text-sm">
                {item.id} {item.title}
                {item.required ? '' : ' · optional'}
              </li>
            ))}
          </ul>
        )}
      </section>
      <Link to={finaleReady ? '/destination' : '/journey'} className={passageButton}>
        {finaleReady ? 'Open the finale' : 'Return to My Passage'}
      </Link>
      <DemoNote>
        The finale opens when all 11 required milestones are complete. The calendar countdown does not open it, and optional milestones do not block it.
      </DemoNote>
    </ScreenFrame>
  )
}
