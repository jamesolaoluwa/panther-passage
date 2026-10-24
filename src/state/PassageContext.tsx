import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { getCatalog } from '../data/catalog'
import type { Catalog, OnboardingProfile, PlanGoal, Preferences, ScenarioId, Student, UserProgress } from '../data/schemas'
import {
  countdownPresentation,
  type CountdownPhase,
  deriveMilestoneViews,
  earnedCrestIds,
  isFinaleReady,
  preparationCounts,
  readinessCounts,
  withTaskUpdate,
  type MilestoneView,
  type ProgressCounts,
} from '../domain/progression'
import {
  activateScenario,
  hydrate,
  resetScenario,
  writeProgress,
  type KeyValueStore,
  type LoadResult,
} from '../domain/persistence'
import { BACCALAUREATE_DATE, readPresenterClock } from '../domain/passageCalendar'

interface TaskUpdate {
  taskId: string
  checked: boolean
  answer?: string
}

interface PassageValue {
  catalog: Catalog
  student: Student
  progress: UserProgress
  warning: string | null
  views: MilestoneView[]
  preparation: ProgressCounts
  readiness: ProgressCounts
  crests: string[]
  finaleReady: boolean
  daysRemaining: number
  countdown: string
  countdownDetail: string | null
  countdownPhase: CountdownPhase
  now: Date
  activate: (scenarioId: ScenarioId) => void
  reset: () => void
  completeOnboarding: () => void
  saveOnboardingProfile: (profile: OnboardingProfile) => void
  setTask: (taskId: string, checked: boolean, answer?: string) => void
  setTasks: (updates: TaskUpdate[]) => void
  toggleRsvp: (eventId: string) => void
  toggleSavedResource: (resourceId: string) => void
  saveReflection: (key: string, text: string) => void
  savePlanNotes: (notes: string) => void
  saveGoals: (goals: PlanGoal[]) => void
  savePreferences: (preferences: Preferences) => void
}

const PassageContext = createContext<PassageValue | null>(null)

export function PassageProvider({
  children,
  store,
  now = readPresenterClock(),
}: {
  children: ReactNode
  store?: KeyValueStore
  now?: Date
}) {
  const storage = useMemo(() => store ?? window.localStorage, [store])
  const catalog = useMemo(() => getCatalog(), [])
  const [session, setSession] = useState<LoadResult>(() => hydrate(storage, catalog))

  const value = useMemo<PassageValue>(() => {
    const student = catalog.students.find((item) => item.id === session.progress.studentId)
    if (!student) {
      throw new Error('The active demonstration student is missing from the dataset.')
    }
    const views = deriveMilestoneViews(catalog.milestones, catalog.tasks, session.progress)
    const countdown = countdownPresentation(BACCALAUREATE_DATE, now)
    const daysRemaining = countdown.days

    const commit = (progress: UserProgress) => {
      const warning = writeProgress(storage, progress)
      setSession({ progress, warning, source: 'stored' })
    }

    return {
      catalog,
      student,
      progress: session.progress,
      warning: session.warning,
      views,
      preparation: preparationCounts(views),
      readiness: readinessCounts(views),
      crests: earnedCrestIds(views, catalog.achievements),
      finaleReady: isFinaleReady(views),
      daysRemaining,
      countdown: countdown.headline,
      countdownDetail: countdown.detail,
      countdownPhase: countdown.phase,
      now,
      activate: (scenarioId) => {
        setSession(activateScenario(storage, catalog, scenarioId, now))
      },
      reset: () => {
        setSession(resetScenario(storage, catalog, session.progress, now))
      },
      completeOnboarding: () => {
        commit({
          ...session.progress,
          onboardingComplete: true,
          updatedAt: now.toISOString(),
        })
      },
      saveOnboardingProfile: (profile) => {
        commit({
          ...session.progress,
          onboardingProfile: profile,
          updatedAt: new Date().toISOString(),
        })
      },
      setTask: (taskId, checked, answer) => {
        if (!catalog.tasks.some((task) => task.id === taskId)) return
        commit(withTaskUpdate(session.progress, catalog.milestones, catalog.tasks, taskId, checked, answer, now))
      },
      setTasks: (updates) => {
        let progress = session.progress
        for (const update of updates) {
          if (!catalog.tasks.some((task) => task.id === update.taskId)) continue
          progress = withTaskUpdate(
            progress,
            catalog.milestones,
            catalog.tasks,
            update.taskId,
            update.checked,
            update.answer,
            now,
          )
        }
        commit(progress)
      },
      toggleRsvp: (eventId) => {
        if (!catalog.events.some((event) => event.id === eventId)) return
        const ids = session.progress.rsvpEventIds
        commit({
          ...session.progress,
          rsvpEventIds: ids.includes(eventId) ? ids.filter((id) => id !== eventId) : [...ids, eventId],
          updatedAt: now.toISOString(),
        })
      },
      toggleSavedResource: (resourceId) => {
        if (!catalog.resources.some((resource) => resource.id === resourceId)) return
        const ids = session.progress.savedResourceIds
        commit({
          ...session.progress,
          savedResourceIds: ids.includes(resourceId) ? ids.filter((id) => id !== resourceId) : [...ids, resourceId],
          updatedAt: now.toISOString(),
        })
      },
      saveReflection: (key, text) => {
        if (!/^[a-z0-9-]{1,40}$/.test(key)) return
        commit({
          ...session.progress,
          reflections: {
            ...session.progress.reflections,
            [key]: { text: text.slice(0, 5000), visibility: 'private' },
          },
          updatedAt: now.toISOString(),
        })
      },
      savePlanNotes: (notes) => {
        commit({ ...session.progress, planNotes: notes.slice(0, 5000), updatedAt: now.toISOString() })
      },
      saveGoals: (goals) => {
        commit({ ...session.progress, goals: goals.slice(0, 24), updatedAt: now.toISOString() })
      },
      savePreferences: (preferences) => {
        commit({ ...session.progress, preferences, updatedAt: now.toISOString() })
      },
    }
  }, [catalog, now, session, storage])

  return <PassageContext.Provider value={value}>{children}</PassageContext.Provider>
}

export function usePassage(): PassageValue {
  const value = useContext(PassageContext)
  if (!value) {
    throw new Error('usePassage must be used inside PassageProvider.')
  }
  return value
}
