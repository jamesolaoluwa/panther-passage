import { getCatalog } from '../data/catalog'
import { deriveMilestoneViews, preparationCounts, withTaskUpdate } from './progression'
import {
  activateScenario,
  createMemoryStore,
  hydrate,
  readProgress,
  resetScenario,
  studentStorageKey,
} from './persistence'

const catalog = getCatalog()
const now = new Date(2026, 9, 23)

describe('demo scenarios and persistence', () => {
  it('loads each fictional student with the documented progress', () => {
    const store = createMemoryStore()
    const jordan = activateScenario(store, catalog, 'new', now)
    expect(jordan.progress.studentId).toBe('S-A')
    expect(jordan.progress.onboardingComplete).toBe(false)
    expect(preparationCounts(deriveMilestoneViews(catalog.milestones, catalog.tasks, jordan.progress)).completed).toBe(0)

    const avery = activateScenario(store, catalog, 'in-progress', now)
    expect(avery.progress.studentId).toBe('S-B')
    expect(avery.progress.completedMilestoneIds).toEqual(['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07'])
    expect(avery.progress.onboardingComplete).toBe(true)

    const morgan = activateScenario(store, catalog, 'almost-graduated', now)
    expect(morgan.progress.studentId).toBe('S-C')
    expect(morgan.progress.completedMilestoneIds).toHaveLength(14)
    expect(store.getItem('panther-passage:demo:v1:active')).toBe('S-C')
    expect(readProgress(store, catalog, 'S-A').progress.completedMilestoneIds).toEqual([])
  })

  it('saves task progress, restores it, and resets back to the seed', () => {
    const store = createMemoryStore()
    const loaded = activateScenario(store, catalog, 'new', now)
    const edited = withTaskUpdate(loaded.progress, catalog.milestones, catalog.tasks, 'T011', true, 'Design', now)
    store.setItem(studentStorageKey(edited.studentId), JSON.stringify(edited))
    const restored = readProgress(store, catalog, 'S-A')
    expect(restored.source).toBe('stored')
    expect(restored.progress.taskChecks.T011).toBe(true)
    expect(restored.progress.answers.T011).toBe('Design')

    const reset = resetScenario(store, catalog, restored.progress, now)
    expect(reset.progress.taskChecks.T011).toBe(false)
    expect(hydrate(store, catalog).progress.studentId).toBe('S-A')
  })

  it('replaces corrupt storage with the scenario seed and a warning', () => {
    const store = createMemoryStore()
    store.setItem('panther-passage:demo:v1:active', 'S-B')
    store.setItem(studentStorageKey('S-B'), '{not json')
    const loaded = hydrate(store, catalog)
    expect(loaded.warning).toMatch(/could not be read/i)
    expect(loaded.progress.studentId).toBe('S-B')
    expect(loaded.progress.completedMilestoneIds).toContain('M07')
  })
})
