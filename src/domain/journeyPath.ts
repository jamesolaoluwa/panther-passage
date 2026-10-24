import type { MilestoneView } from './progression'

/** Official mobile path viewBox from 09_Assets/04_Journey_Map/Pathways/mobile_route.svg */
export const JOURNEY_PATH_VIEWBOX = { width: 900, height: 2400 } as const

export type PathPoint = { x: number; y: number }

type Quad = { start: PathPoint; control: PathPoint; end: PathPoint }

function quadPoint(segment: Quad, t: number): PathPoint {
  const u = 1 - t
  return {
    x: u * u * segment.start.x + 2 * u * t * segment.control.x + t * t * segment.end.x,
    y: u * u * segment.start.y + 2 * u * t * segment.control.y + t * t * segment.end.y,
  }
}

function distance(a: PathPoint, b: PathPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Quadratic segments of the official winding path, start at the bottom (M01) and climb toward the top.
 * The final T command reflects the previous control, which lands on the documented end point.
 */
const SEGMENTS: Quad[] = [
  { start: { x: 450, y: 2340 }, control: { x: 450, y: 2340 }, end: { x: 365, y: 2200 } },
  { start: { x: 365, y: 2200 }, control: { x: 280, y: 2060 }, end: { x: 420, y: 1920 } },
  { start: { x: 420, y: 1920 }, control: { x: 560, y: 1780 }, end: { x: 455, y: 1650 } },
  { start: { x: 455, y: 1650 }, control: { x: 350, y: 1520 }, end: { x: 470, y: 1385 } },
  { start: { x: 470, y: 1385 }, control: { x: 590, y: 1250 }, end: { x: 465, y: 1115 } },
  { start: { x: 465, y: 1115 }, control: { x: 340, y: 980 }, end: { x: 440, y: 835 } },
  { start: { x: 440, y: 835 }, control: { x: 540, y: 690 }, end: { x: 430, y: 550 } },
  { start: { x: 430, y: 550 }, control: { x: 320, y: 410 }, end: { x: 410, y: 245 } },
  { start: { x: 410, y: 245 }, control: { x: 500, y: 80 }, end: { x: 500, y: 80 } },
]

function samplePath(stepsPerSegment = 24): PathPoint[] {
  const points: PathPoint[] = []
  for (const segment of SEGMENTS) {
    for (let i = 0; i < stepsPerSegment; i += 1) {
      points.push(quadPoint(segment, i / stepsPerSegment))
    }
  }
  points.push(SEGMENTS[SEGMENTS.length - 1].end)
  return points
}

function evenPoints(count: number): PathPoint[] {
  const dense = samplePath()
  const lengths = [0]
  for (let i = 1; i < dense.length; i += 1) {
    lengths.push(lengths[i - 1] + distance(dense[i - 1], dense[i]))
  }
  const total = lengths[lengths.length - 1]
  const picked: PathPoint[] = []
  for (let n = 0; n < count; n += 1) {
    const target = count === 1 ? 0 : (total * n) / (count - 1)
    let index = lengths.findIndex((length) => length >= target)
    if (index < 0) index = dense.length - 1
    picked.push(dense[index])
  }
  return picked
}

export interface MilestoneAnchor {
  xPercent: number
  yPercent: number
  labelSide: 'left' | 'right'
}

/** Fifteen stable anchors in the official 900×2400 path space. Not viewport pixels. */
export function milestoneAnchors(count = 15): MilestoneAnchor[] {
  return evenPoints(count).map((point) => ({
    xPercent: (point.x / JOURNEY_PATH_VIEWBOX.width) * 100,
    yPercent: (point.y / JOURNEY_PATH_VIEWBOX.height) * 100,
    labelSide: point.x < JOURNEY_PATH_VIEWBOX.width / 2 ? 'right' : 'left',
  }))
}

/** Approved catalog categories that match each onboarding pathway. */
export const PATHWAY_CATEGORIES: Record<string, string[]> = {
  career: ['career', 'network'],
  'graduate-school': ['planning', 'network'],
  entrepreneurship: ['finance', 'planning'],
  exploring: ['identity', 'planning'],
  undecided: ['identity', 'planning'],
}

/** Approved priority ids mapped to milestone categories. Matching is exact, not a substring of the priority id. */
export const PRIORITY_CATEGORIES: Record<string, string[]> = {
  'career-readiness': ['career'],
  'financial-independence': ['finance'],
  'networking-mentorship': ['network'],
  'wellness-balance': ['wellness'],
  'life-after-graduation': ['planning'],
  'leadership-legacy': ['legacy'],
}

/** The only résumé milestone in the approved catalog. Later steps depend on it; it is not a universal fallback. */
export const RESUME_MILESTONE_ID = 'M04'

const OPEN_STATUS = new Set(['active', 'in-progress', 'available'])

export function careerIntent(pathwayId: string, priorities: string[]): boolean {
  return pathwayId === 'career' || priorities.includes('career-readiness')
}

export function eligibleMilestones(views: MilestoneView[]): MilestoneView[] {
  return views.filter((item) => OPEN_STATUS.has(item.status)).sort((a, b) => a.sequence - b.sequence)
}

function alignmentScore(
  item: MilestoneView,
  category: string,
  pathwayId: string,
  priorities: string[],
): number {
  const pathwayCategories = PATHWAY_CATEGORIES[pathwayId] ?? []
  const priorityCategories = priorities.flatMap((id) => PRIORITY_CATEGORIES[id] ?? [])
  if (item.id === RESUME_MILESTONE_ID && !careerIntent(pathwayId, priorities)) return -100
  let score = 0
  if (pathwayCategories.includes(category)) score += 4
  if (priorityCategories.includes(category)) score += 3
  if (category === 'career' && !careerIntent(pathwayId, priorities)) score -= 2
  return score
}

export interface JourneySelection {
  /** Highest open milestone that actually matches the pathway or priorities. */
  recommended?: MilestoneView
  /** Other positive matches, excluding a second career card when the first is already career. */
  also: MilestoneView[]
  /** Next eligible passage step. Skips the résumé milestone when another eligible step exists and career was not chosen. */
  passage?: MilestoneView
  /** True when the only honest passage step is the résumé milestone for a student who did not choose career. */
  passageIsGate: boolean
}

export function selectJourney(
  views: MilestoneView[],
  categoriesById: Record<string, string>,
  pathwayId: string,
  priorities: string[],
): JourneySelection {
  const open = eligibleMilestones(views)
  const ranked = open
    .map((item) => ({
      item,
      score: alignmentScore(item, categoriesById[item.id] ?? '', pathwayId, priorities),
    }))
    .sort((a, b) => b.score - a.score || a.item.sequence - b.item.sequence)
  const aligned = ranked.filter((entry) => entry.score > 0).map((entry) => entry.item)
  const recommended = aligned[0]
  const also = aligned
    .filter((item) => item.id !== recommended?.id)
    .filter((item) => {
      const primaryCategory = recommended ? categoriesById[recommended.id] : ''
      const category = categoriesById[item.id] ?? ''
      return !(primaryCategory === 'career' && category === 'career')
    })
    .slice(0, 1)

  const inProgress = open.find((item) => item.status === 'in-progress')
  let passage = inProgress
  if (!passage) {
    const required = open.filter((item) => item.required)
    const pool = required.length > 0 ? required : open
    if (careerIntent(pathwayId, priorities)) {
      passage = pool[0]
    } else {
      passage =
        pool.find((item) => item.id !== RESUME_MILESTONE_ID) ??
        open.find((item) => item.id !== RESUME_MILESTONE_ID) ??
        (open.length === 1 ? open[0] : undefined)
    }
  }

  const passageIsGate = Boolean(
    passage &&
      passage.id === RESUME_MILESTONE_ID &&
      passage.status !== 'in-progress' &&
      !careerIntent(pathwayId, priorities) &&
      !recommended,
  )

  return { recommended, also, passage, passageIsGate }
}

export interface PrimaryDestination {
  href: string
  label: string
  title: string
  kind: 'goal' | 'passage' | 'gate' | 'finale' | 'overview'
}

/** Where Continue and the dashboard hero should go. The résumé milestone is never the unlabeled fallback. */
export function primaryDestination(
  selection: JourneySelection,
  options: { finaleReady?: boolean; chapterId?: string } = {},
): PrimaryDestination {
  if (selection.passage?.status === 'in-progress') {
    return {
      href: `/journey/${selection.passage.id}`,
      label: 'Resume this step',
      title: selection.passage.title,
      kind: 'passage',
    }
  }
  if (selection.recommended) {
    return {
      href: `/journey/${selection.recommended.id}`,
      label: 'Open this step',
      title: selection.recommended.title,
      kind: 'goal',
    }
  }
  if (selection.passage && selection.passage.id !== RESUME_MILESTONE_ID) {
    return {
      href: `/journey/${selection.passage.id}`,
      label: 'Continue the passage',
      title: selection.passage.title,
      kind: 'passage',
    }
  }
  if (selection.passage) {
    const chapterId = options.chapterId ?? selection.passage.chapterId
    return {
      href: `/journey/chapter/${chapterId}`,
      label: 'Review this chapter',
      title: selection.passage.title,
      kind: 'gate',
    }
  }
  if (options.finaleReady) {
    return { href: '/destination', label: 'Open the finale', title: 'Finale', kind: 'finale' }
  }
  return { href: '/journey', label: 'Review My Passage', title: 'My Passage', kind: 'overview' }
}

export function recommendNextMilestone(
  views: MilestoneView[],
  categoriesById: Record<string, string>,
  pathwayId: string,
  priorities: string[],
): MilestoneView | undefined {
  const selection = selectJourney(views, categoriesById, pathwayId, priorities)
  return selection.recommended ?? selection.passage
}

export interface GuideRef {
  id: string
  category: string
  associatedMilestones: string[]
}

const BALANCED_CATEGORIES = ['planning', 'finance', 'wellness', 'network', 'legacy', 'identity', 'career']

/** Guides for the current context. The résumé checklist is not used to fill an empty list. */
export function recommendResources<T extends GuideRef>(
  resources: T[],
  focusId: string | undefined,
  pathwayId: string,
  priorities: string[],
  focusCategory?: string,
): T[] {
  const intent = careerIntent(pathwayId, priorities)
  const associated = resources.filter((resource) => focusId && resource.associatedMilestones.includes(focusId))
  if (associated.length > 0 && (focusId !== RESUME_MILESTONE_ID || intent)) return associated.slice(0, 2)

  const wanted = new Set<string>([
    ...(PATHWAY_CATEGORIES[pathwayId] ?? []),
    ...priorities.flatMap((id) => PRIORITY_CATEGORIES[id] ?? []),
  ])
  if (!intent || focusCategory !== 'career') wanted.delete('career')
  const matched = resources.filter((resource) => wanted.has(resource.category) && (intent || resource.id !== 'R01'))
  if (matched.length > 0) return matched.slice(0, 2)

  return [...resources]
    .filter((resource) => (intent && focusCategory === 'career') || resource.id !== 'R01')
    .sort(
      (a, b) =>
        BALANCED_CATEGORIES.indexOf(a.category) - BALANCED_CATEGORIES.indexOf(b.category) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 2)
}

export function orderEvents<T extends { id: string; category: string }>(
  events: T[],
  pathwayId: string,
  priorities: string[],
): T[] {
  const careerFirst = careerIntent(pathwayId, priorities)
  return [...events].sort((a, b) => {
    const aCareer = a.category === 'career' ? 1 : 0
    const bCareer = b.category === 'career' ? 1 : 0
    if (aCareer !== bCareer) return careerFirst ? bCareer - aCareer : aCareer - bCareer
    return a.id.localeCompare(b.id)
  })
}
