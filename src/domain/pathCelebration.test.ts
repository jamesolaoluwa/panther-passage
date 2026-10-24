import { describe, expect, it } from 'vitest'
import { diffPathStatuses, statusMapFromViews, type StatusMap } from './pathCelebration'
import type { MilestoneView } from './progression'

function view(id: string, status: MilestoneView['status']): MilestoneView {
  return {
    id,
    title: id,
    chapterId: 'P1',
    sequence: 1,
    required: true,
    dependsOn: [],
    status,
  }
}

describe('diffPathStatuses', () => {
  it('reports nothing on the first visit (no stored baseline)', () => {
    const current: StatusMap = { M01: 'completed', M02: 'active' }
    expect(diffPathStatuses(null, current)).toEqual({ newlyCompleted: [], newlyUnlocked: [] })
  })

  it('detects a step that just became complete', () => {
    const prev: StatusMap = { M01: 'in-progress', M02: 'locked' }
    const current: StatusMap = { M01: 'completed', M02: 'locked' }
    expect(diffPathStatuses(prev, current)).toEqual({ newlyCompleted: ['M01'], newlyUnlocked: [] })
  })

  it('detects a step that just unlocked from locked', () => {
    const prev: StatusMap = { M02: 'locked' }
    const current: StatusMap = { M02: 'active' }
    expect(diffPathStatuses(prev, current)).toEqual({ newlyCompleted: [], newlyUnlocked: ['M02'] })
  })

  it('treats needs-review to open as an unlock', () => {
    const prev: StatusMap = { M05: 'needs-review' }
    const current: StatusMap = { M05: 'available' }
    expect(diffPathStatuses(prev, current).newlyUnlocked).toEqual(['M05'])
  })

  it('ignores statuses that did not change', () => {
    const prev: StatusMap = { M01: 'completed', M02: 'active' }
    const current: StatusMap = { M01: 'completed', M02: 'active' }
    expect(diffPathStatuses(prev, current)).toEqual({ newlyCompleted: [], newlyUnlocked: [] })
  })

  it('builds a status map from views', () => {
    const views = [view('M01', 'completed'), view('M02', 'active')]
    expect(statusMapFromViews(views)).toEqual({ M01: 'completed', M02: 'active' })
  })
})
