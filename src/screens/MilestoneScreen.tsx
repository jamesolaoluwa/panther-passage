import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  CaretRight,
  Check,
  ClipboardText,
  Coins,
  Compass,
  Heart,
  MapPin,
  Users,
  type Icon,
} from '@phosphor-icons/react'
import { DirectionEditor } from '../components/journey/DirectionEditor'
import { ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import type { Task } from '../data/schemas'
import { primaryDestination, selectJourney } from '../domain/journeyPath'
import { pathwayNote } from '../domain/pathwayExperiences'
import { statusLabel, taskRequiresText, type MilestoneStatus } from '../domain/progression'
import { usePassage } from '../state/PassageContext'

function categoryLabel(category: string) {
  return category.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function iconFor(category: string): Icon {
  switch (category) {
    case 'career':
      return Briefcase
    case 'finance':
      return Coins
    case 'wellness':
      return Heart
    case 'network':
      return Users
    case 'planning':
      return ClipboardText
    case 'legacy':
      return BookOpen
    case 'identity':
      return Compass
    default:
      return MapPin
  }
}

function needsNote(task: Task) {
  return taskRequiresText(task.label)
}

function taskHint(task: Task) {
  if (taskRequiresText(task.label)) {
    return 'Write a short note on this device, then mark the step complete.'
  }
  return 'Open this step and mark it when the action is done.'
}

function MilestoneMedallion({ category }: { category: string }) {
  const Icon = iconFor(category)
  return (
    <div className="relative size-[4.75rem] shrink-0" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f6dc9a] to-[#b8892c] shadow-[0_10px_18px_rgba(23,63,53,0.16)]" />
      <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-gradient-to-b from-[#1c6b50] to-[#10281f] text-[#f7f4eb]">
        <Icon size={30} weight="fill" />
      </div>
    </div>
  )
}

export function MilestoneScreen() {
  const { milestoneId = '' } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { catalog, views, progress, student, setTask } = usePassage()
  const view = views.find((item) => item.id === milestoneId)
  const milestone = catalog.milestones.find((item) => item.id === milestoneId)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [celebrate, setCelebrate] = useState(false)
  const wasCompleteRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (!milestone) return
    const previous = document.title
    document.title = `${milestone.title} · Panther Passage`
    return () => {
      document.title = previous
    }
  }, [milestone])

  // Fire a one-shot celebration when this milestone flips to complete while being viewed.
  useEffect(() => {
    if (!milestone || !view) return
    const own = catalog.tasks.filter((task) => task.milestoneId === milestone.id)
    const allDone = own.length > 0 && own.every((task) => progress.taskChecks[task.id])
    const complete = allDone && view.status === 'completed'
    const previous = wasCompleteRef.current
    wasCompleteRef.current = complete
    if (previous === false && complete) {
      setCelebrate(true)
      const timer = window.setTimeout(() => setCelebrate(false), 2600)
      return () => window.clearTimeout(timer)
    }
  }, [milestone, view, catalog.tasks, progress.taskChecks])

  const requestedTask = params.get('task')
  useEffect(() => {
    if (!requestedTask || !milestone) return
    const task = catalog.tasks.find((item) => item.id === requestedTask && item.milestoneId === milestone.id)
    if (!task) return
    setDraft(progress.answers[task.id] ?? '')
    setOpenTaskId(task.id)
  }, [requestedTask, milestone, catalog.tasks, progress.answers])

  useEffect(() => {
    if (!openTaskId) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenTaskId(null)
    }
    window.addEventListener('keydown', onKey)
    document.getElementById('task-dialog-title')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [openTaskId])

  if (!view || !milestone) {
    return (
      <ScreenFrame title="That step is not on this passage." lede="The milestone id does not match M01 through M15.">
        <Link to="/journey" className={passageButton}>
          Return to My Passage
        </Link>
      </ScreenFrame>
    )
  }

  const tasks = catalog.tasks
    .filter((task) => task.milestoneId === milestone.id)
    .sort((a, b) => a.order - b.order)
  const resources = catalog.resources.filter((resource) => resource.associatedMilestones.includes(milestone.id))
  const doneCount = tasks.filter((task) => progress.taskChecks[task.id]).length
  const locked = view.status === 'locked' || view.status === 'needs-review'
  const openTask = tasks.find((task) => task.id === openTaskId) ?? null
  const nextIncomplete = tasks.find((task) => !progress.taskChecks[task.id])
  const pathwayId = progress.onboardingProfile?.pathway || student.pathway
  const priorities = progress.onboardingProfile?.priorities ?? []
  const categoriesById = Object.fromEntries(catalog.milestones.map((item) => [item.id, item.category]))
  const selection = selectJourney(
    views.filter((item) => item.id !== view.id),
    categoriesById,
    pathwayId,
    priorities,
  )
  const destination = primaryDestination(selection, { chapterId: view.chapterId })
  const foreignTask = Boolean(
    requestedTask && !tasks.some((task) => task.id === requestedTask),
  )
  const CategoryIcon = iconFor(milestone.category)

  const openTaskDialog = (task: Task) => {
    setError('')
    setDraft(progress.answers[task.id] ?? '')
    setOpenTaskId(task.id)
  }

  const saveTask = (checked: boolean) => {
    if (!openTask || locked) return
    if (checked && needsNote(openTask) && draft.trim().length < 1) {
      setError(`Add a short note for “${openTask.label}” before marking it complete.`)
      return
    }
    setError('')
    setTask(openTask.id, checked, needsNote(openTask) ? draft : undefined)
    setOpenTaskId(null)
  }

  const continueMilestone = () => {
    if (locked) return
    if (nextIncomplete) {
      openTaskDialog(nextIncomplete)
      return
    }
    navigate(destination.href)
  }

  return (
    <article className="bg-ivory text-ink">
      <header className="sticky top-0 z-20 bg-ivory/95 px-4 pt-[max(0.7rem,env(safe-area-inset-top))] pb-3 backdrop-blur-sm">
        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-2">
          <Link
            to="/journey"
            aria-label="Back to My Passage"
            className="inline-flex size-11 items-center justify-center rounded-full text-evergreen"
          >
            <ArrowLeft size={22} weight="bold" aria-hidden="true" />
          </Link>
          <p className="truncate text-center text-[15px] font-bold tracking-[-0.01em] text-ink">Milestone Details</p>
          <span className="inline-flex min-h-9 max-w-[9.5rem] items-center gap-1.5 rounded-full bg-[#e7f2ea] px-3 text-xs font-bold text-evergreen">
            <CategoryIcon size={14} weight="fill" aria-hidden="true" />
            <span className="truncate">{categoryLabel(milestone.category)}</span>
          </span>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:px-6">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-3 px-4 pt-2">
            <MilestoneMedallion category={milestone.category} />
            <div className="min-w-0 flex-1">
              <p className="sr-only">
                Chapter {milestone.chapterId}. Milestone {milestone.id}. {milestone.required ? 'Required' : 'Optional'}.
              </p>
              <p className="text-[0.68rem] font-extrabold tracking-[0.16em] text-evergreen">YOUR JOURNEY</p>
              <h1 className="mt-1 font-display text-[1.95rem] leading-[0.98] font-semibold tracking-[-0.03em] text-evergreen">
                {milestone.title}
              </h1>
              <p className="mt-2 text-[15px] leading-snug text-[#5d6862]">{milestone.description}</p>
              <StatusChip status={view.status} />
            </div>
          </div>

          <section className="mx-4 mt-4 rounded-[1.15rem] border border-[#e5dfd3] bg-white px-4 py-3" aria-label="Progress">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <p className="font-semibold text-ink">Progress</p>
              <p className="text-[#5d6862]">
                {doneCount} of {tasks.length} tasks completed
              </p>
            </div>
            <div
              className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-[#d9eee3]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={tasks.length}
              aria-valuenow={doneCount}
              aria-label="Action steps"
            >
              <m.div
                className="h-full rounded-full bg-[#1b684c]"
                initial={false}
                animate={{ width: tasks.length === 0 ? '0%' : `${Math.round((100 * doneCount) / tasks.length)}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 22 }}
              />
            </div>
          </section>
        </div>

        {milestone.id === 'M01' ? <DirectionEditor /> : null}
        {milestone.id === 'M02' ? (
          <p className="mx-4 mt-4 text-sm leading-relaxed text-ink">
            This plan is for every student. The life you are building after it lives in{' '}
            <Link to="/next-chapter" className="font-bold text-evergreen">
              My Chapter
            </Link>
            .
          </p>
        ) : null}
        {pathwayNote(progress.onboardingProfile?.pathway || '', milestone.id) ? (
          <p className="mx-4 mt-4 text-sm leading-relaxed text-ink">
            {pathwayNote(progress.onboardingProfile?.pathway || '', milestone.id)}
          </p>
        ) : null}
        {progress.honoredMilestoneIds?.includes(milestone.id) ? (
          <p className="mx-4 mt-4 text-sm leading-relaxed text-ink">
            This step already counts in your passage. The earlier activity was removed and was not copied onto these prompts.
          </p>
        ) : null}

        <section className="scroll-mt-24 px-4 pt-6" aria-labelledby="action-steps-heading">
          <div className="flex items-end justify-between gap-3">
            <h2 id="action-steps-heading" className="font-display text-[1.7rem] leading-none font-semibold text-evergreen">
              Your Action Steps
            </h2>
            <p className="pb-1 text-sm text-[#6b736e]">{tasks.length} tasks</p>
          </div>
          {foreignTask ? (
            <p role="status" className="mt-3 text-sm text-ink">
              That action is not part of this step.
            </p>
          ) : null}
          {locked ? (
            <p role="status" className="mt-3 text-sm text-ink">
              {view.status === 'needs-review'
                ? 'These notes are saved. This step still waits on an earlier milestone.'
                : `This step opens after ${view.dependsOn.join(' and ')}.`}
            </p>
          ) : null}
          <ul className="mt-3 flex flex-col gap-2.5">
            {tasks.map((task) => {
              const done = Boolean(progress.taskChecks[task.id])
              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => openTaskDialog(task)}
                    className={`flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left motion-safe:transition-colors ${
                      done ? 'border-[#d5e7db] bg-[#e7f3eb]' : 'border-[#e6e0d4] bg-white'
                    }`}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-[0.45rem] border-2 motion-safe:transition-colors ${
                        done ? 'border-evergreen bg-evergreen text-ivory' : 'border-[#7f9c8e] bg-white text-transparent'
                      }`}
                      aria-hidden="true"
                    >
                      <AnimatePresence initial={false}>
                        {done ? (
                          <m.span
                            key="check"
                            initial={reduce ? false : { scale: 0, rotate: -25 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                          >
                            <Check size={16} weight="bold" />
                          </m.span>
                        ) : null}
                      </AnimatePresence>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-tight text-ink">{task.label}</span>
                      <span className="mt-0.5 block text-sm leading-snug text-[#5d6862]">{taskHint(task)}</span>
                    </span>
                    <CaretRight size={18} className="shrink-0 text-[#8b938e]" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="scroll-mt-24 px-4 pt-7" aria-labelledby="resources-heading">
          <div className="flex items-end justify-between gap-3">
            <h2 id="resources-heading" className="font-display text-[1.7rem] leading-none font-semibold text-evergreen">
              Helpful Resources
            </h2>
            <p className="pb-1 text-sm text-[#6b736e]">
              {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
            </p>
          </div>
          {resources.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-[#e6e0d4] bg-white px-3 py-3 text-sm text-[#5d6862]">
              No simulated guide is linked to this step.{' '}
              <Link to="/resources" className="font-bold text-evergreen">
                Browse Explore
              </Link>
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {resources.map((resource) => {
                const Icon = iconFor(resource.category)
                return (
                  <li key={resource.id}>
                    <Link
                      to={`/resources?open=${resource.id}`}
                      className="flex min-h-16 items-center gap-3 rounded-2xl border border-[#e6e0d4] bg-white px-3 py-3 text-ink no-underline"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e7f2ea] text-evergreen">
                        <Icon size={20} weight="duotone" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold leading-tight">{resource.title}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-[#5d6862]">{resource.summary}</span>
                      </span>
                      <CaretRight size={18} className="shrink-0 text-[#8b938e]" aria-hidden="true" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
          <p className="mt-3 text-xs leading-relaxed text-[#5d6862]">
            These guides are simulated. They are not university services.
          </p>
        </section>

        <div className="px-4 pt-5 pb-6 lg:col-span-2">
          {view.status === 'completed' ? (
            <p role="status" className="mb-3 rounded-2xl bg-[#e7f3eb] px-3 py-3 text-sm font-semibold text-evergreen">
              {milestone.successCopy}
            </p>
          ) : null}
          <p className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Link to="/reflections" className="inline-flex min-h-11 items-center font-bold text-evergreen">
              Personal reflection
            </Link>
            <Link to={`/reflections/faith?focus=${milestone.id}`} className="inline-flex min-h-11 items-center font-bold text-evergreen">
              Scripture and prayer, optional
            </Link>
          </p>
          {view.status === 'completed' && destination.kind !== 'overview' ? (
            <Link
              to={destination.href}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-gold bg-evergreen text-lg font-semibold text-white no-underline shadow-[0_8px_18px_rgba(16,38,30,0.12)]"
            >
              {destination.kind === 'gate' ? 'Review this chapter' : destination.label}
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-gold bg-evergreen text-lg font-semibold text-white shadow-[0_8px_18px_rgba(16,38,30,0.12)] disabled:opacity-50"
              disabled={locked}
              onClick={continueMilestone}
            >
              {view.status === 'completed' ? 'Return to My Passage' : 'Continue Milestone'}
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openTask ? (
          <m.div
            key="task-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-30 flex items-end justify-center bg-evergreen/40 p-3 sm:items-center"
            role="presentation"
          >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-dialog-title"
            initial={reduce ? false : { opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-[1.4rem] bg-ivory px-4 py-4 shadow-[0_24px_60px_rgba(16,38,30,0.28)]"
          >
            <p className="text-[0.68rem] font-extrabold tracking-[0.16em] text-gold-deep uppercase">Action step</p>
            <h2 id="task-dialog-title" tabIndex={-1} className="mt-1 font-display text-3xl leading-tight text-evergreen outline-none">
              {openTask.label}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5d6862]">{taskHint(openTask)}</p>
            <p className="mt-2 text-sm text-ink">{milestone.purpose}</p>
            {needsNote(openTask) ? (
              <label className="mt-4 block text-sm font-bold text-ink">
                Your note
                <textarea
                  aria-label={openTask.label}
                  value={draft}
                  maxLength={500}
                  disabled={locked}
                  onChange={(event) => setDraft(event.target.value)}
                  className="mt-1 min-h-28 w-full rounded-2xl border border-field-border bg-white px-3 py-2 text-base font-normal"
                />
              </label>
            ) : null}
            {error ? (
              <p role="alert" className="mt-3 text-sm font-bold text-danger">
                {error}
              </p>
            ) : null}
            <div className="mt-4 flex flex-col gap-2">
              {progress.taskChecks[openTask.id] ? (
                <button
                  type="button"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-evergreen font-bold text-evergreen"
                  disabled={locked}
                  onClick={() => saveTask(false)}
                >
                  Mark not complete
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-gold bg-evergreen font-bold text-white disabled:opacity-50"
                  disabled={locked}
                  onClick={() => saveTask(true)}
                >
                  Mark this step complete
                </button>
              )}
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full font-bold text-evergreen"
                onClick={() => setOpenTaskId(null)}
              >
                Close
              </button>
            </div>
          </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {celebrate ? (
          <m.div
            key="milestone-celebrate"
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
          >
            <m.div
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="flex flex-col items-center gap-3 rounded-[1.6rem] bg-evergreen/95 px-8 py-6 text-center shadow-2xl"
            >
              <span className="grid size-16 place-items-center rounded-full bg-gold">
                <Check size={34} weight="bold" className="text-evergreen" aria-hidden="true" />
              </span>
              <p className="font-display text-2xl font-semibold text-white">Milestone complete</p>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </article>
  )
}

function StatusChip({ status }: { status: MilestoneStatus }) {
  const label = statusLabel(status)
  const active = status === 'active' || status === 'in-progress' || status === 'available'
  const done = status === 'completed'
  return (
    <p
      className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        done ? 'bg-[#e7f3eb] text-evergreen' : active ? 'bg-[#f6e7c4] text-[#8a6414]' : 'bg-[#efece4] text-[#5d6862]'
      }`}
    >
      <span className={`size-2 rounded-full ${done ? 'bg-evergreen' : active ? 'bg-gold-deep' : 'bg-[#b7b1a6]'}`} aria-hidden="true" />
      {label}
    </p>
  )
}
