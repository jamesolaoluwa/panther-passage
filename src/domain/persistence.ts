import { progressSchema, type Catalog, type ScenarioId, type UserProgress } from '../data/schemas'
import { completedMilestoneIds, deriveMilestoneViews, retireRejectedActivities } from './progression'
import { seedForScenario } from './scenarios'

export const ACTIVE_STUDENT_KEY = 'panther-passage:demo:v1:active'

export interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface LoadResult {
  progress: UserProgress
  warning: string | null
  source: 'stored' | 'seed'
}

export function studentStorageKey(studentId: string): string {
  return `panther-passage:demo:v1:${studentId}`
}

export function createMemoryStore(): KeyValueStore {
  const values = new Map<string, string>()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value)
    },
    removeItem: (key) => {
      values.delete(key)
    },
  }
}

function alignCompletedIds(catalog: Catalog, progress: UserProgress): UserProgress {
  const views = deriveMilestoneViews(catalog.milestones, catalog.tasks, progress)
  return { ...progress, completedMilestoneIds: completedMilestoneIds(views) }
}

export function readProgress(store: KeyValueStore, catalog: Catalog, studentId: string): LoadResult {
  const student = catalog.students.find((item) => item.id === studentId)
  const fallbackScenario = student?.scenario ?? 'new'
  const raw = store.getItem(studentStorageKey(studentId))
  if (!raw) {
    return { progress: seedForScenario(catalog, fallbackScenario), warning: null, source: 'seed' }
  }

  try {
    const parsed = progressSchema.safeParse(JSON.parse(raw))
    if (!parsed.success || parsed.data.studentId !== studentId) {
      return {
        progress: seedForScenario(catalog, fallbackScenario),
        warning: 'Saved demonstration data was unusable, so the original scenario was restored.',
        source: 'seed',
      }
    }
    return { progress: alignCompletedIds(catalog, retireRejectedActivities(parsed.data)), warning: null, source: 'stored' }
  } catch {
    return {
      progress: seedForScenario(catalog, fallbackScenario),
      warning: 'Saved demonstration data could not be read, so the original scenario was restored.',
      source: 'seed',
    }
  }
}

export function writeProgress(store: KeyValueStore, progress: UserProgress): string | null {
  try {
    store.setItem(studentStorageKey(progress.studentId), JSON.stringify(progress))
    store.setItem(ACTIVE_STUDENT_KEY, progress.studentId)
    return null
  } catch {
    return 'This browser could not save the demonstration. Progress will last for this visit only.'
  }
}

export function activateScenario(store: KeyValueStore, catalog: Catalog, scenarioId: ScenarioId, now = new Date()): LoadResult {
  const progress = seedForScenario(catalog, scenarioId, now)
  const warning = writeProgress(store, progress)
  return { progress, warning, source: 'seed' }
}

export function resetScenario(store: KeyValueStore, catalog: Catalog, progress: UserProgress, now = new Date()): LoadResult {
  return activateScenario(store, catalog, progress.scenarioId, now)
}

export function hydrate(store: KeyValueStore, catalog: Catalog): LoadResult {
  const activeId = store.getItem(ACTIVE_STUDENT_KEY)
  if (!activeId) {
    return activateScenario(store, catalog, 'new')
  }
  const known = catalog.students.some((student) => student.id === activeId)
  if (!known) {
    const restored = activateScenario(store, catalog, 'new')
    return {
      ...restored,
      warning: 'The saved student did not match a demonstration profile, so Jordan Ellis was restored.',
    }
  }
  const loaded = readProgress(store, catalog, activeId)
  writeProgress(store, loaded.progress)
  return loaded
}
