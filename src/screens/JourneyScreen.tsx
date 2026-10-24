import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GraduationCap } from '@phosphor-icons/react'
import { ProfileAvatar } from '../components/profile/ProfileAvatar'
import { PassagePath } from '../components/journey/PassagePath'
import { PATHWAY_OPTIONS, pathwayOption } from '../domain/onboarding'
import { selectJourney } from '../domain/journeyPath'
import { BACCALAUREATE_DATE } from '../domain/passageCalendar'
import { lastHundredStartLabel, statusLabel, type MilestoneView } from '../domain/progression'
import { usePassage } from '../state/PassageContext'

export function JourneyScreen() {
  const { views, catalog, student, progress, finaleReady, countdown, countdownDetail, countdownPhase, warning } =
    usePassage()
  const [params] = useSearchParams()
  const before = params.get('phase') === 'before' || countdownPhase === 'before'

  useEffect(() => {
    const previous = document.title
    document.title = 'Your Journey · Panther Passage'
    const saved = sessionStorage.getItem('panther-passage:journey-scroll')
    if (saved) window.scrollTo(0, Number(saved))
    return () => {
      document.title = previous
    }
  }, [])

  const pathwayId = progress.onboardingProfile?.pathway || student.pathway
  const pathway = pathwayOption(pathwayId) ?? PATHWAY_OPTIONS.find((option) => option.id === student.pathway)
  const categoriesById = useMemo(
    () => Object.fromEntries(catalog.milestones.map((milestone) => [milestone.id, milestone.category])),
    [catalog.milestones],
  )
  const selection = selectJourney(views, categoriesById, pathwayId, progress.onboardingProfile?.priorities ?? [])
  const recommendation = selection.recommended ?? selection.passage

  return (
    <article className="flex flex-col bg-ivory text-ink min-[900px]:grid min-[900px]:grid-cols-[minmax(0,1fr)_19.5rem] min-[900px]:items-start">
      <div>
        <header className="border-b border-gold/25 bg-ivory px-5 pt-[max(0.85rem,env(safe-area-inset-top))]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-[2.05rem] leading-[0.95] font-semibold tracking-[-0.03em] text-evergreen">
                Your Journey
              </h1>
              <p className="mt-1.5 text-[15px] text-ink-soft">Your Panther Passage</p>
            </div>
            <Link
              to="/profile"
              aria-label="Profile"
              className="inline-flex size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-gold"
            >
              <ProfileAvatar studentId={student.id} />
            </Link>
          </div>

          <div className="mt-4 pb-3" aria-label="Graduation progress">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3eee0] text-ink">
                <GraduationCap size={20} weight="regular" aria-hidden="true" />
              </span>
              {before ? null : <ChapterRail views={views} chapters={catalog.chapters} />}
            </div>
            <p className="mt-2 text-sm font-bold text-evergreen">{countdown}</p>
          </div>
          {warning ? (
            <p role="status" className="mb-3 rounded-2xl bg-paper px-3 py-2 text-sm text-evergreen">
              {warning}
            </p>
          ) : null}
        </header>

        {before ? (
          <section className="px-5 py-10" aria-labelledby="prelaunch-heading">
            <h2 id="prelaunch-heading" className="font-display text-3xl text-evergreen">
              Your passage has not opened.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              The map stays closed until {lastHundredStartLabel(BACCALAUREATE_DATE)}.
            </p>
            <p className="mt-4 font-display text-2xl text-evergreen">
              {countdownPhase === 'before' ? countdown : `Opens ${lastHundredStartLabel(BACCALAUREATE_DATE)}`}
            </p>
            {countdownPhase === 'before' && countdownDetail ? (
              <p className="mt-2 text-sm text-ink-soft">{countdownDetail}</p>
            ) : null}
          </section>
        ) : (
          <PassagePath
            milestones={views}
            chapters={catalog.chapters}
            catalogMilestones={catalog.milestones}
            tasks={catalog.tasks}
            progress={progress}
            finaleReady={finaleReady}
            studentId={student.id}
          />
        )}
      </div>

      {before ? null : (
      <section
        className="px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] min-[900px]:sticky min-[900px]:top-0 min-[900px]:pt-6"
        aria-labelledby="journey-list-heading"
      >
        {recommendation ? (
          <p className="text-sm text-ink-soft" data-testid="journey-next">
            {selection.recommended ? 'For your goals' : 'Next passage step'}:{' '}
            <span className="font-semibold text-evergreen">{recommendation.title}</span>
          </p>
        ) : null}
        <h2 id="journey-list-heading" className="mt-4 font-display text-xl text-evergreen">
          All fifteen steps
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {pathway ? `${pathway.title}. ` : ''}
          The painted checks stay in the artwork. The list reaches every step, including those past this scene.
        </p>
        <nav aria-label="Jump to a chapter" className="mt-3 flex flex-wrap gap-2">
          {catalog.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              to={`/journey/chapter/${chapter.id}`}
              className="inline-flex min-h-11 items-center rounded-full border border-gold/50 bg-paper px-3 text-sm font-bold text-evergreen no-underline"
            >
              {chapter.title}
            </Link>
          ))}
        </nav>
        <ol className="mt-4 flex flex-col gap-2">
          {views.map((item) => {
            const firstInChapter = views.find((candidate) => candidate.chapterId === item.chapterId)?.id === item.id
            return (
            <li key={item.id} id={firstInChapter ? `chapter-${item.chapterId}` : undefined}>
              <Link
                to={`/journey/${item.id}`}
                data-milestone={item.id}
                data-status={item.status}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-paper px-3 py-2 text-ink no-underline"
              >
                <span>
                  <span className="block text-xs font-bold tracking-wide text-evergreen-bright uppercase">
                    {item.id}
                    {item.required ? '' : ' · Optional'}
                  </span>
                  <span className="font-display text-lg leading-tight text-evergreen">{item.title}</span>
                </span>
                <span className="shrink-0 text-sm font-bold">{statusLabel(item.status)}</span>
              </Link>
            </li>
            )
          })}
        </ol>
      </section>
      )}
    </article>
  )
}

function ChapterRail({
  views,
  chapters,
}: {
  views: MilestoneView[]
  chapters: { id: string; title: string }[]
}) {
  return (
    <ol className="flex min-w-0 flex-1 items-center" aria-label="Chapters">
      {chapters.map((chapter, index) => {
        const chapterViews = views.filter((item) => item.chapterId === chapter.id)
        const required = chapterViews.filter((item) => item.required)
        const done = required.length > 0 && required.every((item) => item.status === 'completed')
        const started = chapterViews.some((item) => item.status !== 'locked')
        const state = done ? 'complete' : started ? 'in progress' : 'not started'
        return (
          <li key={chapter.id} className="flex min-w-0 flex-1 items-center">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 ${done || started ? 'bg-evergreen/35' : 'bg-[#e4dfd4]'}`}
              />
            ) : null}
            <Link
              to={`/journey/chapter/${chapter.id}`}
              aria-label={`${chapter.title}, ${state}`}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full"
            >
              <span
                className={`size-3 rounded-full ${done ? 'bg-evergreen' : started ? 'bg-gold' : 'bg-[#d8d2c8]'}`}
                aria-hidden="true"
              />
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
