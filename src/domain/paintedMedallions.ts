import type { MilestoneView } from './progression'

/**
 * Centers measured on Journey_Map_Campus_Artwork.png (576×683).
 * Slot 0 is the lower check labeled in the paint. Slot 1 is the next check.
 * The other three are the unlabeled medallions continuing up the path.
 */
export const PAINTED_MEDALLION_SLOTS = [
  { slot: 0, xPercent: (148 / 576) * 100, yPercent: (632 / 683) * 100, artworkCaption: 'Discover Your Pathway' },
  { slot: 1, xPercent: (150 / 576) * 100, yPercent: (568 / 683) * 100, artworkCaption: 'Build Your Graduation Readiness Plan' },
  { slot: 2, xPercent: (236 / 576) * 100, yPercent: (490 / 683) * 100, artworkCaption: '' },
  { slot: 3, xPercent: (322 / 576) * 100, yPercent: (418 / 683) * 100, artworkCaption: '' },
  { slot: 4, xPercent: (400 / 576) * 100, yPercent: (250 / 683) * 100, artworkCaption: '' },
] as const

export interface PaintedAssignment {
  slot: number
  xPercent: number
  yPercent: number
  artworkCaption: string
  milestone: MilestoneView
}

/**
 * The two painted opening medallions are always M01 and M02.
 * The three unlabeled medallions are the next canonical steps around the student's current position.
 */
export function assignPaintedMedallions(views: MilestoneView[]): PaintedAssignment[] {
  const bySequence = [...views].sort((a, b) => a.sequence - b.sequence)
  const opening = [bySequence.find((item) => item.id === 'M01'), bySequence.find((item) => item.id === 'M02')].filter(
    (item): item is MilestoneView => Boolean(item),
  )
  const rest = bySequence.filter((item) => item.sequence > 2)
  const focus =
    rest.find((item) => item.status === 'active' || item.status === 'in-progress') ??
    rest.find((item) => item.status === 'available') ??
    rest[0]
  let start = Math.max(0, rest.findIndex((item) => item.id === focus?.id))
  if (start + 3 > rest.length) start = Math.max(0, rest.length - 3)
  const window = rest.slice(start, start + 3)
  const chosen = [...opening, ...window].slice(0, PAINTED_MEDALLION_SLOTS.length)
  return chosen.map((milestone, index) => ({
    slot: PAINTED_MEDALLION_SLOTS[index].slot,
    xPercent: PAINTED_MEDALLION_SLOTS[index].xPercent,
    yPercent: PAINTED_MEDALLION_SLOTS[index].yPercent,
    artworkCaption: PAINTED_MEDALLION_SLOTS[index].artworkCaption,
    milestone,
  }))
}
