import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ScreenFrame, StatusPill, passageButton } from '../components/ui/ScreenFrame'
import type { PlanGoal } from '../data/schemas'
import { PATHWAY_CATEGORIES, PRIORITY_CATEGORIES, careerIntent } from '../domain/journeyPath'
import { pathwayOption } from '../domain/onboarding'
import { statusLabel } from '../domain/progression'
import { usePassage } from '../state/PassageContext'

const AREAS = [
  'Career development',
  'Financial preparation',
  'Graduate education',
  'Entrepreneurship',
  'Networking',
  'Relocation',
  'Personal development',
] as const

const SECTIONS = [
  {
    id: 'direction',
    title: 'Where you are going',
    hint: 'Your pathway',
    lede: 'This is the direction you chose. Every chapter of the passage stays available.',
  },
  {
    id: 'goals',
    title: 'What you want to achieve',
    hint: 'One aim at a time',
    lede: 'Add one aim. Saved goals stay on this device and do not change completed steps.',
  },
  {
    id: 'support',
    title: 'How you will support yourself',
    hint: 'Money, in your words',
    lede: 'A personal money draft. Not a financial aid decision or a bank record.',
  },
  {
    id: 'circle',
    title: 'Who belongs with you',
    hint: 'People for the next season',
    lede: 'Name the people and communities you want beside you.',
  },
  {
    id: 'prepare',
    title: 'What you need to prepare',
    hint: 'Steps that match your direction',
    lede: 'Only the steps that follow your pathway and priorities.',
  },
  {
    id: 'wellness',
    title: 'Wellness and purpose',
    hint: 'Rest, and faith if you want it',
    lede: 'Rest and meaning sit beside the practical plan. Faith is optional.',
  },
  {
    id: 'first-90',
    title: 'Your first 90 days',
    hint: 'A note for the first season',
    lede: 'Sketch the first season after graduation. This note stays on this device.',
  },
] as const

const GROUPS = [
  { label: 'Start here', ids: ['direction', 'goals'] },
  { label: 'The life around it', ids: ['support', 'circle', 'wellness'] },
  { label: 'Before you leave', ids: ['prepare', 'first-90'] },
] as const

const AREA_BY_SECTION: Record<string, string[]> = {
  direction: ['Career development', 'Graduate education', 'Entrepreneurship', 'Relocation'],
  support: ['Financial preparation'],
  circle: ['Networking'],
  wellness: ['Personal development'],
}

export function NextChapterScreen() {
  const { section } = useParams()
  if (!section) return <ChapterOverview />
  const match = SECTIONS.find((item) => item.id === section)
  if (!match) {
    return (
      <ScreenFrame title="That part of the plan is not here." lede="Choose one of the seven planning pages.">
        <Link to="/next-chapter" className={passageButton}>
          Return to My Chapter
        </Link>
      </ScreenFrame>
    )
  }
  return <ChapterSection id={match.id} title={match.title} lede={match.lede} />
}

function ChapterOverview() {
  return (
    <ScreenFrame eyebrow="My Chapter" title="A plan in seven parts." lede="Open one part. The others wait.">
      {GROUPS.map((group) => (
        <section key={group.label} aria-labelledby={`chapter-group-${group.label}`}>
          <h2 id={`chapter-group-${group.label}`} className="text-xs font-extrabold tracking-[0.16em] text-gold-deep uppercase">
            {group.label}
          </h2>
          <ol className="mt-2 overflow-hidden rounded-[1.4rem] border border-gold/30 bg-paper">
            {group.ids.map((id, index) => {
              const item = SECTIONS.find((section) => section.id === id)!
              const number =
                GROUPS.slice(0, GROUPS.findIndex((entry) => entry.label === group.label)).reduce(
                  (count, entry) => count + entry.ids.length,
                  0,
                ) +
                index +
                1
              return (
                <li key={item.id} className={index > 0 ? 'border-t border-gold/20' : undefined}>
                  <Link
                    to={`/next-chapter/${item.id}`}
                    className="flex min-h-14 items-center gap-3 px-4 py-3 text-ink no-underline"
                  >
                    <span className="w-5 font-display text-lg text-gold-deep">{number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-tight text-evergreen">{item.title}</span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{item.hint}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </ScreenFrame>
  )
}

function ChapterSection({ id, title, lede }: { id: string; title: string; lede: string }) {
  const { progress, catalog, views, student } = usePassage()
  const pathwayId = progress.onboardingProfile?.pathway || student.pathway
  const priorities = progress.onboardingProfile?.priorities ?? []
  const pathway = pathwayOption(pathwayId)
  const areas = AREA_BY_SECTION[id] ?? []
  const goals = progress.goals.filter((goal) => (areas.length === 0 ? true : areas.includes(goal.area)))

  return (
    <ScreenFrame title={title} lede={lede}>
      <Link to="/next-chapter" className="inline-flex min-h-11 items-center text-sm font-bold text-evergreen">
        All seven parts
      </Link>
      {id === 'direction' ? (
        <p className="rounded-2xl bg-paper px-3 py-3 text-sm">
          Pathway: <span className="font-bold">{pathway ? pathway.title : 'Not chosen yet'}</span>
        </p>
      ) : null}
      {id === 'goals' ? <GoalForm /> : null}
      {id === 'first-90' ? <PlanNote /> : null}
      {id === 'prepare' ? <PrepareList pathwayId={pathwayId} priorities={priorities} /> : null}
      {id === 'wellness' ? (
        <p className="flex flex-col gap-2 text-sm">
          <Link to="/reflections" className="inline-flex min-h-11 items-center font-bold text-evergreen">
            Nonreligious reflections
          </Link>
          <Link to="/reflections/faith" className="inline-flex min-h-11 items-center font-bold text-evergreen">
            Scripture and prayer, optional
          </Link>
        </p>
      ) : null}
      {id !== 'goals' && id !== 'prepare' && goals.length > 0 ? <GoalList goals={goals} empty="" /> : null}
      {id === 'goals' ? <GoalList goals={progress.goals} empty="No goals yet. Add one when you are ready." /> : null}
      {id === 'prepare' ? null : (
        <RelatedSteps
          ids={relatedMilestoneIds(id, pathwayId, priorities, catalog.milestones, views)}
          catalogTitles={Object.fromEntries(catalog.milestones.map((item) => [item.id, item.title]))}
        />
      )}
    </ScreenFrame>
  )
}

function relatedMilestoneIds(
  section: string,
  pathwayId: string,
  priorities: string[],
  milestones: { id: string; category: string }[],
  views: { id: string; status: string }[],
): string[] {
  const bySection: Record<string, string[]> = {
    direction: ['planning', 'identity'],
    support: ['finance'],
    circle: ['network'],
    wellness: ['wellness', 'identity'],
    'first-90': ['planning', 'legacy'],
    goals: [...(PATHWAY_CATEGORIES[pathwayId] ?? []), ...priorities.flatMap((item) => PRIORITY_CATEGORIES[item] ?? [])],
  }
  const categories = new Set(bySection[section] ?? [])
  if (!careerIntent(pathwayId, priorities)) categories.delete('career')
  return milestones
    .filter((item) => categories.has(item.category))
    .map((item) => item.id)
    .filter((id) => views.some((view) => view.id === id))
    .slice(0, 2)
}

function PrepareList({ pathwayId, priorities }: { pathwayId: string; priorities: string[] }) {
  const { catalog, views } = usePassage()
  const categories = new Set<string>([
    ...(PATHWAY_CATEGORIES[pathwayId] ?? []),
    ...priorities.flatMap((item) => PRIORITY_CATEGORIES[item] ?? []),
  ])
  if (!careerIntent(pathwayId, priorities)) categories.delete('career')
  if (categories.size === 0) {
    for (const category of ['identity', 'planning', 'finance', 'wellness', 'network', 'legacy']) categories.add(category)
  }
  const items = views.filter((view) => {
    const category = catalog.milestones.find((item) => item.id === view.id)?.category
    return category ? categories.has(category) : false
  })
  const current = items.find((item) => item.status === 'active' || item.status === 'in-progress' || item.status === 'available')
  const ahead = items.filter((item) => item.status === 'locked' || item.status === 'needs-review')
  const done = items.filter((item) => item.status === 'completed')
  const rest = items.filter((item) => item !== current && !ahead.includes(item) && !done.includes(item))

  return (
    <div className="flex flex-col gap-4">
      {current ? (
        <Link to={`/journey/${current.id}`} className={`${passageButton} px-4 text-left`}>
          Continue · {current.title}
        </Link>
      ) : null}
      {ahead.length > 0 || rest.length > 0 ? (
        <ul className="overflow-hidden rounded-[1.4rem] border border-gold/30 bg-paper">
          {[...rest, ...ahead].map((item, index) => (
            <li key={item.id} className={index > 0 ? 'border-t border-gold/20' : undefined}>
              <Link to={`/journey/${item.id}`} className="flex min-h-12 items-center justify-between gap-3 px-4 text-ink no-underline">
                <span className="font-bold">{item.title}</span>
                <span className="shrink-0 text-sm text-ink-soft">{statusLabel(item.status)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {done.length > 0 ? (
        <details className="rounded-[1.4rem] border border-gold/30 bg-paper px-4 py-3">
          <summary className="min-h-11 cursor-pointer font-bold text-evergreen">Completed · {done.length}</summary>
          <ul className="mt-2 flex flex-col">
            {done.map((item) => (
              <li key={item.id}>
                <Link to={`/journey/${item.id}`} className="inline-flex min-h-11 items-center text-sm font-bold text-evergreen">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

function RelatedSteps({ ids, catalogTitles }: { ids: string[]; catalogTitles: Record<string, string> }) {
  if (ids.length === 0) return null
  return (
    <section aria-label="Connected journey steps">
      <h2 className="text-xs font-extrabold tracking-[0.16em] text-gold-deep uppercase">From your passage</h2>
      <ul className="mt-2 flex flex-col">
        {ids.map((id) => (
          <li key={id}>
            <Link to={`/journey/${id}`} className="inline-flex min-h-11 items-center font-bold text-evergreen">
              {id} {catalogTitles[id]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function GoalList({ goals, empty }: { goals: PlanGoal[]; empty: string }) {
  const { progress, saveGoals } = usePassage()
  if (goals.length === 0) return <p className="text-sm text-ink-soft">{empty}</p>
  return (
    <ul className="flex flex-col gap-2">
      {goals.map((goal) => (
        <li key={goal.id} className="rounded-2xl bg-field px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="gold">{goal.area}</StatusPill>
            <StatusPill tone={goal.done ? 'done' : 'neutral'}>{goal.done ? 'Complete' : 'Open'}</StatusPill>
          </div>
          <p className="mt-2 font-display text-xl text-evergreen">{goal.title}</p>
          {goal.notes ? <p className="mt-1 text-sm">{goal.notes}</p> : null}
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-11 rounded-full px-3 text-sm font-bold text-evergreen"
              onClick={() =>
                saveGoals(progress.goals.map((item) => (item.id === goal.id ? { ...item, done: !item.done } : item)))
              }
            >
              {goal.done ? 'Mark open' : 'Mark complete'}
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full px-3 text-sm font-bold text-danger"
              onClick={() => saveGoals(progress.goals.filter((item) => item.id !== goal.id))}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function GoalForm() {
  const { progress, saveGoals } = usePassage()
  const [params] = useSearchParams()
  const requested = params.get('area')
  const [area, setArea] = useState(AREAS.includes(requested as (typeof AREAS)[number]) ? requested! : AREAS[0])
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [savedNote, setSavedNote] = useState('')

  const saveGoal = () => {
    const clean = title.trim()
    if (clean.length < 1) {
      setError('Give the goal a title before saving.')
      return
    }
    setError('')
    const next: PlanGoal = {
      id: `g${Date.now().toString(36)}`,
      area,
      title: clean.slice(0, 160),
      notes: notes.trim().slice(0, 1000),
      done: false,
    }
    saveGoals([...progress.goals, next])
    setTitle('')
    setNotes('')
    setSavedNote('Goal saved on this device.')
  }

  return (
    <form
      className="grid gap-3 rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-4"
      onSubmit={(event) => {
        event.preventDefault()
        saveGoal()
      }}
    >
      <label className="text-sm font-bold text-ink">
        Planning area
        <select
          value={area}
          onChange={(event) => setArea(event.target.value)}
          className="mt-1 min-h-12 w-full rounded-2xl border border-field-border bg-field px-3 text-base"
        >
          {AREAS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-bold text-ink">
        Goal title
        <input
          value={title}
          maxLength={160}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 min-h-12 w-full rounded-2xl border border-field-border bg-field px-3 text-base"
        />
      </label>
      <label className="text-sm font-bold text-ink">
        Notes
        <textarea
          value={notes}
          maxLength={1000}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-1 min-h-24 w-full rounded-2xl border border-field-border bg-field px-3 py-2 text-base"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm font-bold text-danger">
          {error}
        </p>
      ) : null}
      {savedNote ? (
        <p role="status" className="text-sm font-bold text-evergreen">
          {savedNote}
        </p>
      ) : null}
      <button type="submit" className={passageButton}>
        Save goal
      </button>
    </form>
  )
}

function PlanNote() {
  const { progress, savePlanNotes } = usePassage()
  const [plan, setPlan] = useState(progress.planNotes)
  const [savedNote, setSavedNote] = useState('')
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        savePlanNotes(plan)
        setSavedNote('Working note saved.')
      }}
    >
      <label className="text-sm font-bold text-ink">
        Private working note
        <textarea
          value={plan}
          maxLength={5000}
          onChange={(event) => setPlan(event.target.value)}
          className="mt-1 min-h-28 w-full rounded-2xl border border-field-border bg-paper px-3 py-2 text-base"
        />
      </label>
      <button type="submit" className="inline-flex min-h-12 w-fit items-center rounded-full border border-evergreen px-4 font-bold text-evergreen">
        Save working note
      </button>
      {savedNote ? (
        <p role="status" className="text-sm font-bold text-evergreen">
          {savedNote}
        </p>
      ) : null}
    </form>
  )
}
