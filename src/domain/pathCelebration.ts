import type { MilestoneStatus, MilestoneView } from './progression'

export type StatusMap = Record<string, MilestoneStatus>

export interface PathDiff {
  newlyCompleted: string[]
  newlyUnlocked: string[]
}

export function statusMapFromViews(views: MilestoneView[]): StatusMap {
  const map: StatusMap = {}
  for (const view of views) map[view.id] = view.status
  return map
}

/**
 * Pure comparison of the statuses last seen on the map against the current ones.
 * Used to celebrate a step that was just completed and the next step that just unlocked.
 */
export function diffPathStatuses(prev: StatusMap | null, current: StatusMap): PathDiff {
  const newlyCompleted: string[] = []
  const newlyUnlocked: string[] = []
  if (!prev) return { newlyCompleted, newlyUnlocked }
  for (const [id, status] of Object.entries(current)) {
    const before = prev[id]
    if (!before) continue
    if (status === 'completed' && before !== 'completed') {
      newlyCompleted.push(id)
    }
    const wasClosed = before === 'locked' || before === 'needs-review'
    const nowOpen = status === 'active' || status === 'available' || status === 'in-progress'
    if (wasClosed && nowOpen) {
      newlyUnlocked.push(id)
    }
  }
  return { newlyCompleted, newlyUnlocked }
}

const KEY_PREFIX = 'panther-passage:path-statuses:'

export function readStoredStatuses(studentId: string): StatusMap | null {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + studentId)
    return raw ? (JSON.parse(raw) as StatusMap) : null
  } catch {
    return null
  }
}

export function writeStoredStatuses(studentId: string, map: StatusMap): void {
  try {
    sessionStorage.setItem(KEY_PREFIX + studentId, JSON.stringify(map))
  } catch {
    /* storage unavailable; celebrations simply will not replay */
  }
}
