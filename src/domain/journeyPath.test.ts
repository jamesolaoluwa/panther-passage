import {
  JOURNEY_PATH_VIEWBOX,
  milestoneAnchors,
  primaryDestination,
  recommendNextMilestone,
  recommendResources,
  selectJourney,
} from './journeyPath'
import type { MilestoneView } from './progression'

describe('journey path anchors', () => {
  const anchors = milestoneAnchors(15)

  it('places fifteen points inside the official path viewBox, starting near the bottom', () => {
    expect(anchors).toHaveLength(15)
    expect(anchors[0].yPercent).toBeGreaterThan(90)
    expect(anchors[14].yPercent).toBeLessThan(15)
    for (const anchor of anchors) {
      expect(anchor.xPercent).toBeGreaterThan(20)
      expect(anchor.xPercent).toBeLessThan(80)
      expect(anchor.yPercent).toBeGreaterThanOrEqual(0)
      expect(anchor.yPercent).toBeLessThanOrEqual(100)
    }
  })

  it('keeps later milestones higher on the path than earlier ones overall', () => {
    expect(anchors[0].yPercent).toBeGreaterThan(anchors[7].yPercent)
    expect(anchors[7].yPercent).toBeGreaterThan(anchors[14].yPercent)
  })

  it('uses the documented 900 by 2400 coordinate space', () => {
    expect(JOURNEY_PATH_VIEWBOX).toEqual({ width: 900, height: 2400 })
  })
})

describe('journey recommendation', () => {
  it('lets a graduate-school goal outrank an open career step', () => {
    const next = recommendNextMilestone(
      [
        {
          id: 'M08',
          title: 'Choose a Next Opportunity',
          chapterId: 'P3',
          sequence: 8,
          required: true,
          dependsOn: ['M07'],
          status: 'active',
        },
        {
          id: 'M09',
          title: 'Find a Support Circle',
          chapterId: 'P3',
          sequence: 9,
          required: false,
          dependsOn: ['M08'],
          status: 'available',
        },
      ],
      { M08: 'career', M09: 'network' },
      'graduate-school',
      [],
    )
    expect(next?.id).toBe('M09')
  })

  it('does not send an entrepreneurship student to the résumé step while another step is open', () => {
    const views: MilestoneView[] = [
      view('M03', 3, 'P1', false, 'available'),
      view('M04', 4, 'P2', true, 'available'),
    ]
    const selection = selectJourney(views, { M03: 'identity', M04: 'career' }, 'entrepreneurship', [
      'financial-independence',
    ])
    expect(selection.recommended?.id).not.toBe('M04')
    expect(selection.passage?.id).toBe('M03')
    expect(primaryDestination(selection).href).not.toBe('/journey/M04')
  })

  it('keeps the résumé step for a student who chose career', () => {
    const views: MilestoneView[] = [
      view('M03', 3, 'P1', false, 'available'),
      view('M04', 4, 'P2', true, 'available'),
    ]
    const selection = selectJourney(views, { M03: 'identity', M04: 'career' }, 'career', ['career-readiness'])
    expect(selection.recommended?.id).toBe('M04')
    expect(primaryDestination(selection).href).toBe('/journey/M04')
  })

  it('balances a career priority with a financial priority when both steps are open', () => {
    const views: MilestoneView[] = [
      view('M04', 4, 'P2', true, 'available'),
      view('M10', 10, 'P4', true, 'available'),
    ]
    const selection = selectJourney(views, { M04: 'career', M10: 'finance' }, 'entrepreneurship', [
      'career-readiness',
      'financial-independence',
    ])
    expect(selection.recommended?.id).toBe('M10')
    expect(selection.also.map((item) => item.id)).toContain('M04')
  })

  it('keeps completed work independent from a changed goal', () => {
    const completed = view('M01', 1, 'P1', true, 'completed')
    const before = selectJourney([completed, view('M02', 2, 'P1', true, 'active')], { M01: 'identity', M02: 'identity' }, 'career', [
      'career-readiness',
    ])
    const after = selectJourney(
      [completed, view('M02', 2, 'P1', true, 'active')],
      { M01: 'identity', M02: 'identity' },
      'graduate-school',
      ['life-after-graduation'],
    )
    expect(before.passage?.id).toBe('M02')
    expect(after.passage?.id).toBe('M02')
    expect(completed.status).toBe('completed')
  })

  it('fills guides from the current context instead of the résumé checklist', () => {
    const guides = [
      { id: 'R01', category: 'career', associatedMilestones: ['M04'] },
      { id: 'R03', category: 'finance', associatedMilestones: ['M10'] },
      { id: 'R05', category: 'planning', associatedMilestones: ['M13'] },
    ]
    expect(recommendResources(guides, 'M10', 'entrepreneurship', ['financial-independence'], 'finance').map((item) => item.id)).toEqual([
      'R03',
    ])
    expect(recommendResources(guides, 'M01', 'career', [], 'identity').some((item) => item.id === 'R01')).toBe(false)
    expect(recommendResources(guides, 'M04', 'career', ['career-readiness'], 'career').map((item) => item.id)).toEqual(['R01'])
  })
})

function view(
  id: string,
  sequence: number,
  chapterId: MilestoneView['chapterId'],
  required: boolean,
  status: MilestoneView['status'],
): MilestoneView {
  return { id, title: id, chapterId, sequence, required, dependsOn: [], status }
}
