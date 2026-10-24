import { Link } from 'react-router-dom'
import { ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { givenName } from '../domain/display'
import { primaryDestination, selectJourney } from '../domain/journeyPath'
import { pathwayOption } from '../domain/onboarding'
import { statusLabel } from '../domain/progression'
import { usePassage } from '../state/PassageContext'

export function HomeScreen() {
  const { views, catalog, student, progress, countdown, countdownDetail, countdownPhase, finaleReady } = usePassage()
  const pathwayId = progress.onboardingProfile?.pathway || student.pathway
  const pathway = pathwayOption(pathwayId)
  const priorities = progress.onboardingProfile?.priorities ?? []
  const categoriesById = Object.fromEntries(catalog.milestones.map((milestone) => [milestone.id, milestone.category]))
  const selection = selectJourney(views, categoriesById, pathwayId, priorities)
  const destination = primaryDestination(selection, { finaleReady })
  const focus = selection.recommended ?? selection.passage
  const name = givenName(student, progress.onboardingProfile)
  const before = countdownPhase === 'before'

  return (
    <ScreenFrame
      eyebrow="Last 100 Days"
      title={before ? 'Your passage opens soon.' : 'Your next step is ready.'}
      lede={
        before
          ? `${name}, the active passage begins one hundred days before Baccalaureate.`
          : `${name}, this season is yours. The countdown and your completed steps move on their own.`
      }
    >
      <section className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-5" aria-label="Days until Baccalaureate">
        <p className="text-xs font-extrabold tracking-[0.14em] text-gold-deep uppercase">
          {countdownPhase === 'within' || countdownPhase === 'day' ? 'The last hundred days' : 'Until Baccalaureate'}
        </p>
        <p
          className={`mt-2 font-display leading-none text-evergreen ${
            countdownPhase === 'within' || countdownPhase === 'day' ? 'text-5xl' : 'text-4xl'
          }`}
        >
          {countdown}
        </p>
        {countdownDetail ? <p className="mt-3 text-sm leading-relaxed text-ink-soft">{countdownDetail}</p> : null}
        {pathway ? <p className="mt-3 text-sm text-ink">Pathway: {pathway.title}.</p> : null}
        <Link to="/readiness" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-evergreen">
          See your readiness
        </Link>
      </section>

      {before ? (
        <Link to="/journey" className={passageButton}>
          See the opening date
        </Link>
      ) : (
        <section className="rounded-[1.6rem] bg-evergreen px-4 py-5 text-ivory">
          <p className="text-xs font-extrabold tracking-[0.14em] text-gold uppercase">Your next step</p>
          <p className="mt-2 font-display text-3xl leading-tight">
            {destination.kind === 'goal' || destination.kind === 'passage'
              ? destination.title
              : destination.kind === 'finale'
                ? 'Baccalaureate is open.'
                : 'Review your passage.'}
          </p>
          {focus && (destination.kind === 'goal' || destination.kind === 'passage') ? (
            <p className="mt-2 text-sm text-ivory/85">{statusLabel(focus.status)}</p>
          ) : null}
          <Link to={destination.href} className="mt-4 inline-flex min-h-11 items-center font-bold text-gold no-underline">
            {destination.label}
          </Link>
        </section>
      )}

      <nav aria-label="Continue your passage" className="grid gap-2">
        <Link to="/journey" className="inline-flex min-h-12 items-center font-bold text-evergreen">
          My Passage
        </Link>
        <Link to="/resources" className="inline-flex min-h-12 items-center font-bold text-evergreen">
          Explore
        </Link>
        <Link to="/next-chapter" className="inline-flex min-h-12 items-center font-bold text-evergreen">
          My Chapter
        </Link>
      </nav>
    </ScreenFrame>
  )
}
