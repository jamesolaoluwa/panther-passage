import { Link } from 'react-router-dom'
import { onboardingCampusFooter } from '../assets/registry'
import { ScreenFrame, StatusPill, passageButton } from '../components/ui/ScreenFrame'
import { givenName } from '../domain/display'
import { usePassage } from '../state/PassageContext'

export function DestinationScreen() {
  const { finaleReady, student, progress, views, catalog, crests, readiness } = usePassage()
  const name = givenName(student, progress.onboardingProfile)
  const note = progress.reflections['future-self']?.text?.trim()
  const remaining = views.filter((item) => item.required && item.status !== 'completed')

  if (!finaleReady) {
    return (
      <ScreenFrame
        title="The threshold is still ahead."
        lede={`${readiness.completed} of ${readiness.total} required steps are complete. Baccalaureate opens when those steps are finished.`}
      >
        <ul className="flex flex-col gap-2">
          {remaining.map((item) => (
            <li key={item.id}>
              <Link to={`/journey/${item.id}`} className="inline-flex min-h-12 items-center font-bold text-evergreen">
                {item.id} {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/readiness" className={passageButton}>
          Review readiness
        </Link>
      </ScreenFrame>
    )
  }

  return (
    <ScreenFrame
      title="Baccalaureate."
      lede={`${name}, the required passage is complete. This moment marks Baccalaureate in the story of your passage. It is not an official ceremony record.`}
    >
      <div className="overflow-hidden rounded-[1.8rem] border border-gold/50 bg-paper">
        <img
          src={onboardingCampusFooter.path}
          alt=""
          width={onboardingCampusFooter.width}
          height={onboardingCampusFooter.height}
          className="block h-auto w-full"
        />
        <div className="px-4 py-5">
          <p className="text-xs font-extrabold tracking-[0.16em] text-gold-deep uppercase">Graduation destination</p>
          <p className="mt-2 font-display text-4xl leading-none text-evergreen">Cross the threshold</p>
          <p className="mt-3 max-w-[36rem] text-sm leading-relaxed">
            Eleven required milestones are complete. Carry the work into the next chapter, at your own pace.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {catalog.achievements
              .filter((item) => crests.includes(item.id))
              .map((item) => (
                <StatusPill key={item.id} tone="gold">
                  {item.name}
                </StatusPill>
              ))}
          </div>
        </div>
      </div>
      {note ? (
        <blockquote className="rounded-[1.4rem] bg-summary-well px-4 py-4 text-ink">
          <p className="text-xs font-extrabold tracking-[0.14em] text-evergreen uppercase">From your future-self note</p>
          <p className="mt-2 font-display text-xl leading-snug">{note}</p>
        </blockquote>
      ) : (
        <p className="text-sm text-ink-soft">A future-self reflection will appear here after you save one.</p>
      )}
      <Link to="/next-chapter" className={passageButton}>
        Open My Next Chapter
      </Link>
      <Link to="/reflections" className="inline-flex min-h-11 items-center font-bold text-evergreen">
        Read your reflections
      </Link>
    </ScreenFrame>
  )
}
