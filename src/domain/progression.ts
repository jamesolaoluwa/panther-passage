import type { Achievement, Milestone, Task, UserProgress } from '../data/schemas'

export type MilestoneStatus =
  | 'locked'
  | 'available'
  | 'active'
  | 'in-progress'
  | 'completed'
  | 'needs-review'

export interface MilestoneView {
  id: string
  title: string
  chapterId: Milestone['chapterId']
  sequence: number
  required: boolean
  dependsOn: string[]
  status: MilestoneStatus
}

export interface ProgressCounts {
  completed: number
  total: number
  percent: number
}

const TEXT_TASK = /\b(write|draft|list|allocate)\b/i

export function taskRequiresText(label: string): boolean {
  return TEXT_TASK.test(label)
}

const DAY_MS = 86_400_000

function utcDay(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day)
}

/** Signed calendar days from the local date of `now` to the graduation date. Negative means the date has passed. */
export function calendarDaysUntil(graduationDate: string, now: Date): number {
  const [year, month, day] = graduationDate.split('-').map(Number)
  if (!year || !month || !day) return 0
  const today = utcDay(now.getFullYear(), now.getMonth() + 1, now.getDate())
  return Math.round((utcDay(year, month, day) - today) / DAY_MS)
}

export function daysUntilGraduation(graduationDate: string, now: Date): number {
  return Math.max(0, calendarDaysUntil(graduationDate, now))
}

/** The calendar day 100 days before graduation, formatted in UTC so the label does not shift overnight. */
export function lastHundredStartLabel(graduationDate: string): string {
  const [year, month, day] = graduationDate.split('-').map(Number)
  if (!year || !month || !day) return ''
  const start = new Date(utcDay(year, month, day) - 100 * DAY_MS)
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(start)
}

export type CountdownPhase = 'before' | 'within' | 'day' | 'after'

export interface CountdownPresentation {
  headline: string
  detail: string | null
  phase: CountdownPhase
  days: number
}

export function countdownPresentation(graduationDate: string, now: Date): CountdownPresentation {
  const signed = calendarDaysUntil(graduationDate, now)
  if (signed < 0) {
    return { headline: 'Your passage continues beyond Baccalaureate.', detail: null, phase: 'after', days: 0 }
  }
  if (signed === 0) {
    return { headline: 'Baccalaureate', detail: null, phase: 'day', days: 0 }
  }
  const headline = signed === 1 ? '1 day until Baccalaureate' : `${signed} days until Baccalaureate`
  if (signed > 100) {
    return {
      headline,
      detail: `Your passage opens ${lastHundredStartLabel(graduationDate)}.`,
      phase: 'before',
      days: signed,
    }
  }
  return { headline, detail: null, phase: 'within', days: signed }
}

export function countdownLabel(days: number): string {
  if (days < 0) return 'Your passage continues beyond Baccalaureate.'
  if (days === 0) return 'Baccalaureate'
  if (days === 1) return '1 day until Baccalaureate'
  return `${days} days until Baccalaureate`
}

function tasksFor(milestone: Milestone, tasks: Task[]): Task[] {
  return tasks.filter((task) => task.milestoneId === milestone.id && task.required)
}

function taskIsSatisfied(task: Task, progress: UserProgress): boolean {
  if (!progress.taskChecks[task.id]) return false
  if (!taskRequiresText(task.label)) return true
  const text = (progress.answers[task.id] ?? '').trim()
  return text.length >= 1 && text.length <= 500
}

function milestoneTasksSatisfied(milestone: Milestone, tasks: Task[], progress: UserProgress): boolean {
  if (progress.honoredMilestoneIds?.includes(milestone.id)) return true
  const own = tasksFor(milestone, tasks)
  return own.length === 3 && own.every((task) => taskIsSatisfied(task, progress))
}

const RETIRED_TASKS: Record<string, string[]> = {
  M04: ['T041', 'T042', 'T043'],
  M08: ['T081', 'T082', 'T083'],
}

/**
 * Résumé and interview task checks are not copied onto the replacement prompts.
 * A milestone that was already complete stays complete so later steps do not relock.
 */
export function retireRejectedActivities(progress: UserProgress): UserProgress {
  if ((progress.contentRevision ?? 1) >= 2) return progress
  const taskChecks = { ...progress.taskChecks }
  const answers = { ...progress.answers }
  const honored = new Set(progress.honoredMilestoneIds ?? [])
  for (const [milestoneId, taskIds] of Object.entries(RETIRED_TASKS)) {
    if (!taskIds.every((id) => taskChecks[id])) continue
    honored.add(milestoneId)
    for (const id of taskIds) {
      taskChecks[id] = false
      delete answers[id]
    }
  }
  return { ...progress, taskChecks, answers, honoredMilestoneIds: [...honored], contentRevision: 2 }
}

function hasStarted(milestone: Milestone, tasks: Task[], progress: UserProgress): boolean {
  return tasksFor(milestone, tasks).some((task) => {
    if (progress.taskChecks[task.id]) return true
    return (progress.answers[task.id] ?? '').trim().length > 0
  })
}

export function deriveMilestoneViews(
  milestones: Milestone[],
  tasks: Task[],
  progress: UserProgress,
): MilestoneView[] {
  const ordered = [...milestones].sort((a, b) => a.sequence - b.sequence)
  const completed = new Set<string>()
  const draft: MilestoneView[] = []

  for (const milestone of ordered) {
    const dependenciesMet = milestone.dependsOn.every((id) => completed.has(id))
    const tasksDone = milestoneTasksSatisfied(milestone, tasks, progress)
    let status: MilestoneStatus
    if (!dependenciesMet) {
      status = tasksDone ? 'needs-review' : 'locked'
    } else if (tasksDone) {
      status = 'completed'
      completed.add(milestone.id)
    } else if (hasStarted(milestone, tasks, progress)) {
      status = 'in-progress'
    } else {
      status = 'available'
    }
    draft.push({
      id: milestone.id,
      title: milestone.title,
      chapterId: milestone.chapterId,
      sequence: milestone.sequence,
      required: milestone.required,
      dependsOn: milestone.dependsOn,
      status,
    })
  }

  const active =
    draft.find((item) => item.status === 'in-progress') ??
    draft.find((item) => item.required && item.status === 'available') ??
    draft.find((item) => item.status === 'available')

  if (active && active.status === 'available') {
    active.status = 'active'
  }

  return draft
}

export function completedMilestoneIds(views: MilestoneView[]): string[] {
  return views.filter((item) => item.status === 'completed').map((item) => item.id)
}

export function preparationCounts(views: MilestoneView[]): ProgressCounts {
  const completed = views.filter((item) => item.status === 'completed').length
  const total = views.length
  return { completed, total, percent: total === 0 ? 0 : Math.round((100 * completed) / total) }
}

export function readinessCounts(views: MilestoneView[]): ProgressCounts {
  const required = views.filter((item) => item.required)
  const completed = required.filter((item) => item.status === 'completed').length
  const total = required.length
  return { completed, total, percent: total === 0 ? 0 : Math.round((100 * completed) / total) }
}

export function isFinaleReady(views: MilestoneView[]): boolean {
  const readiness = readinessCounts(views)
  return readiness.total > 0 && readiness.completed === readiness.total
}

export function earnedCrestIds(views: MilestoneView[], achievements: Achievement[]): string[] {
  const completed = new Set(views.filter((item) => item.status === 'completed').map((item) => item.id))
  const ids = achievements
    .filter((achievement) => {
      const required = views.filter((item) => item.chapterId === achievement.chapterId && item.required)
      return required.length > 0 && required.every((item) => completed.has(item.id))
    })
    .map((achievement) => achievement.id)
  return [...new Set(ids)]
}

export function withTaskUpdate(
  progress: UserProgress,
  milestones: Milestone[],
  tasks: Task[],
  taskId: string,
  checked: boolean,
  answer?: string,
  now = new Date(),
): UserProgress {
  const next: UserProgress = {
    ...progress,
    taskChecks: { ...progress.taskChecks, [taskId]: checked },
    answers:
      answer === undefined
        ? progress.answers
        : { ...progress.answers, [taskId]: answer.trim().slice(0, 500) },
    updatedAt: now.toISOString(),
  }
  const views = deriveMilestoneViews(milestones, tasks, next)
  return { ...next, completedMilestoneIds: completedMilestoneIds(views) }
}

/** Required-task completion for one milestone, used by the path node pop-up. Honored milestones count as fully done. */
export function milestoneTaskCounts(
  milestoneId: string,
  milestones: Milestone[],
  tasks: Task[],
  progress: UserProgress,
): { done: number; total: number } {
  const milestone = milestones.find((item) => item.id === milestoneId)
  if (!milestone) return { done: 0, total: 0 }
  const own = tasksFor(milestone, tasks)
  if (progress.honoredMilestoneIds?.includes(milestoneId)) {
    return { done: own.length, total: own.length }
  }
  const done = own.filter((task) => taskIsSatisfied(task, progress)).length
  return { done, total: own.length }
}

export function statusLabel(status: MilestoneStatus): string {
  switch (status) {
    case 'locked':
      return 'Locked'
    case 'available':
      return 'Available'
    case 'active':
      return 'Current step'
    case 'in-progress':
      return 'In progress'
    case 'completed':
      return 'Completed'
    case 'needs-review':
      return 'Needs review'
  }
}
