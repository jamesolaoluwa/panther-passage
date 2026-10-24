import { getCatalog } from '../data/catalog'
import { seedForScenario } from './scenarios'
import {
  calendarDaysUntil,
  countdownLabel,
  countdownPresentation,
  daysUntilGraduation,
  lastHundredStartLabel,
  deriveMilestoneViews,
  earnedCrestIds,
  isFinaleReady,
  preparationCounts,
  readinessCounts,
  taskRequiresText,
  withTaskUpdate,
} from './progression'

const catalog = getCatalog()
const fixedNow = new Date(2026, 9, 23)

function viewsFor(scenario: 'new' | 'in-progress' | 'almost-graduated') {
  const progress = seedForScenario(catalog, scenario, fixedNow)
  return deriveMilestoneViews(catalog.milestones, catalog.tasks, progress)
}

describe('progression', () => {
  it('separates the graduation countdown from preparation progress', () => {
    expect(daysUntilGraduation('2027-05-15', fixedNow)).toBe(204)
    expect(daysUntilGraduation('2024-03-01', new Date(2024, 1, 28))).toBe(2)
    expect(daysUntilGraduation('2025-03-01', new Date(2025, 1, 28))).toBe(1)
    expect(daysUntilGraduation('2026-10-22', fixedNow)).toBe(0)
    expect(countdownLabel(0)).toBe('Baccalaureate')
    expect(lastHundredStartLabel('2027-05-15')).toBe('February 4')
    expect(lastHundredStartLabel('2027-05-09')).toBe('January 29')
    expect(lastHundredStartLabel('2024-05-15')).toBe('February 5')
    expect(countdownPresentation('2027-05-15', fixedNow)).toMatchObject({
      phase: 'before',
      days: 204,
      detail: 'Your passage opens February 4.',
    })
    expect(countdownPresentation('2027-05-15', new Date(2027, 1, 4))).toMatchObject({ phase: 'within', days: 100, detail: null })
    expect(countdownPresentation('2027-05-15', new Date(2027, 2, 26))).toMatchObject({ phase: 'within', days: 50 })
    expect(countdownPresentation('2027-05-15', new Date(2027, 4, 14))).toMatchObject({
      phase: 'within',
      headline: '1 day until Baccalaureate',
    })
    expect(countdownPresentation('2027-05-15', new Date(2027, 4, 15)).headline).toBe('Baccalaureate')
    expect(countdownPresentation('2027-05-15', new Date(2027, 4, 16)).phase).toBe('after')
    expect(calendarDaysUntil('2027-05-15', new Date(2027, 4, 16))).toBe(-1)
    const jordan = viewsFor('new')
    expect(preparationCounts(jordan)).toMatchObject({ completed: 0, total: 15, percent: 0 })
    expect(readinessCounts(jordan)).toMatchObject({ completed: 0, total: 11, percent: 0 })
  })

  it('unlocks the next required step without forcing the optional one', () => {
    let progress = seedForScenario(catalog, 'new', fixedNow)
    for (const taskId of ['T011', 'T012', 'T013', 'T021', 'T022', 'T023']) {
      progress = withTaskUpdate(progress, catalog.milestones, catalog.tasks, taskId, true, 'A saved note', fixedNow)
    }
    const views = deriveMilestoneViews(catalog.milestones, catalog.tasks, progress)
    expect(views.find((item) => item.id === 'M03')?.status).toBe('available')
    expect(views.find((item) => item.id === 'M04')?.status).toBe('active')
    expect(earnedCrestIds(views, catalog.achievements)).toEqual(['A01'])
    expect(earnedCrestIds(views, catalog.achievements)).toEqual(['A01'])
    expect(readinessCounts(views).completed).toBe(2)
    expect(preparationCounts(views).completed).toBe(2)
  })

  it('does not treat a checked writing task as complete without text', () => {
    expect(taskRequiresText('Write your north-star statement')).toBe(true)
    expect(taskRequiresText('Confirm your starting point')).toBe(false)
    const progress = seedForScenario(catalog, 'new', fixedNow)
    const checked = withTaskUpdate(progress, catalog.milestones, catalog.tasks, 'T012', true, '   ', fixedNow)
    const views = deriveMilestoneViews(catalog.milestones, catalog.tasks, checked)
    expect(views.find((item) => item.id === 'M01')?.status).not.toBe('completed')
  })

  it('opens M15 from M13 and withholds the finale until every required milestone is done', () => {
    const morgan = viewsFor('almost-graduated')
    expect(morgan.find((item) => item.id === 'M15')?.status).toBe('active')
    expect(morgan.find((item) => item.id === 'M14')?.status).toBe('completed')
    expect(isFinaleReady(morgan)).toBe(false)
    expect(earnedCrestIds(morgan, catalog.achievements)).toEqual(['A01', 'A02', 'A03', 'A04'])

    let progress = seedForScenario(catalog, 'almost-graduated', fixedNow)
    for (const taskId of ['T151', 'T152', 'T153']) {
      progress = withTaskUpdate(progress, catalog.milestones, catalog.tasks, taskId, true, 'A promise', fixedNow)
    }
    const finished = deriveMilestoneViews(catalog.milestones, catalog.tasks, progress)
    expect(isFinaleReady(finished)).toBe(true)
    expect(earnedCrestIds(finished, catalog.achievements)).toHaveLength(5)
    expect(preparationCounts(finished).completed).toBe(15)
    expect(readinessCounts(finished).completed).toBe(11)
  })

  it('keeps a finished later step in review when an earlier requirement is undone', () => {
    let progress = seedForScenario(catalog, 'in-progress', fixedNow)
    progress = withTaskUpdate(progress, catalog.milestones, catalog.tasks, 'T011', false, undefined, fixedNow)
    const views = deriveMilestoneViews(catalog.milestones, catalog.tasks, progress)
    expect(views.find((item) => item.id === 'M01')?.status).not.toBe('completed')
    expect(views.find((item) => item.id === 'M02')?.status).toBe('needs-review')
    expect(views.find((item) => item.id === 'M07')?.status).toBe('needs-review')
    expect(preparationCounts(views).completed).toBe(0)
  })
})
