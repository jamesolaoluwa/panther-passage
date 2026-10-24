import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { GraduationCap } from '@phosphor-icons/react'
import { journeyMapArtwork } from '../../assets/registry'
import { milestoneTaskCounts, statusLabel, type MilestoneView } from '../../domain/progression'
import type { Chapter, Milestone, Task, UserProgress } from '../../data/schemas'
import {
  diffPathStatuses,
  readStoredStatuses,
  statusMapFromViews,
  writeStoredStatuses,
  type PathDiff,
} from '../../domain/pathCelebration'
import { NodePopover } from './NodePopover'

const SCROLL_KEY = 'panther-passage:journey-scroll'
const FACE_BASE = '/assets/panther-passage/06_Milestones'

export function rememberJourneyScroll() {
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
}

const FACES: Record<MilestoneView['status'], string> = {
  locked: `${FACE_BASE}/Locked/Milestone_Locked.svg`,
  available: `${FACE_BASE}/Available/Milestone_Available.svg`,
  active: `${FACE_BASE}/Active/Milestone_Active.svg`,
  'in-progress': `${FACE_BASE}/In_Progress/Milestone_In_Progress.svg`,
  completed: `${FACE_BASE}/Completed/Milestone_Completed.svg`,
  'needs-review': `${FACE_BASE}/In_Progress/Milestone_In_Progress.svg`,
}

function nodeDiameter(status: MilestoneView['status']): number {
  if (status === 'active' || status === 'in-progress' || status === 'needs-review') return 74
  if (status === 'locked') return 54
  return 62
}

interface NodeRow {
  kind: 'node'
  view: MilestoneView
  ordinal: number
  x: number
  y: number
  diameter: number
}
interface BannerRow {
  kind: 'banner'
  chapter: Chapter
  y: number
}
interface FinaleRow {
  kind: 'finale'
  ready: boolean
  x: number
  y: number
}
type Row = NodeRow | BannerRow | FinaleRow

interface PassagePathProps {
  milestones: MilestoneView[]
  chapters: Chapter[]
  catalogMilestones: Milestone[]
  tasks: Task[]
  progress: UserProgress
  finaleReady: boolean
  /** Student id keys the remembered statuses so celebrations only replay for the viewer's own progress. */
  studentId: string
}

export function PassagePath({
  milestones,
  chapters,
  catalogMilestones,
  tasks,
  progress,
  finaleReady,
  studentId,
}: PassagePathProps) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(360)
  const [openId, setOpenId] = useState<string | null>(null)
  const [celebration, setCelebration] = useState<PathDiff>({ newlyCompleted: [], newlyUnlocked: [] })
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const activeNodeRef = useRef<HTMLDivElement>(null)
  const [showJump, setShowJump] = useState(false)

  useLayoutEffect(() => {
    const el = layerRef.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Compare the statuses last seen on the map with the current ones so a step the
  // student just finished (and the next one that unlocked) can be celebrated.
  useEffect(() => {
    const current = statusMapFromViews(milestones)
    const diff = diffPathStatuses(readStoredStatuses(studentId), current)
    writeStoredStatuses(studentId, current)
    if (diff.newlyCompleted.length > 0 || diff.newlyUnlocked.length > 0) {
      setCelebration(diff)
      const timer = window.setTimeout(
        () => setCelebration({ newlyCompleted: [], newlyUnlocked: [] }),
        4200,
      )
      return () => window.clearTimeout(timer)
    }
  }, [milestones, studentId])

  const chapterById = useMemo(() => {
    const map: Record<string, Chapter> = {}
    for (const chapter of chapters) map[chapter.id] = chapter
    return map
  }, [chapters])

  const { rows, nodePoints, totalHeight, activeId } = useMemo(() => {
    const centerX = width / 2
    const amplitude = Math.min(width * 0.3, 104)
    const rows: Row[] = []
    const nodePoints: { x: number; y: number; status: MilestoneView['status'] }[] = []
    let cursorY = 20
    let lastChapter: string | null = null
    let ordinal = 0
    let activeId: string | null = null

    for (const view of milestones) {
      if (view.chapterId !== lastChapter) {
        const chapter = chapterById[view.chapterId]
        if (chapter) {
          if (lastChapter !== null) cursorY += 10
          rows.push({ kind: 'banner', chapter, y: cursorY })
          cursorY += 60
        }
        lastChapter = view.chapterId
      }
      const diameter = nodeDiameter(view.status)
      const x = centerX + Math.sin(ordinal * 0.8) * amplitude
      const y = cursorY + 44
      rows.push({ kind: 'node', view, ordinal, x, y, diameter })
      nodePoints.push({ x, y, status: view.status })
      if (!activeId && (view.status === 'active' || view.status === 'in-progress')) {
        activeId = view.id
      }
      cursorY += 112
      ordinal += 1
    }

    // Finale marker (graduation) at the end of the trail.
    const finaleX = centerX + Math.sin(ordinal * 0.8) * amplitude
    const finaleY = cursorY + 44
    rows.push({ kind: 'finale', ready: finaleReady, x: finaleX, y: finaleY })
    nodePoints.push({ x: finaleX, y: finaleY, status: finaleReady ? 'available' : 'locked' })
    cursorY += 124

    return { rows, nodePoints, totalHeight: cursorY, activeId }
  }, [milestones, chapterById, width, finaleReady])

  // Road geometry: full trail plus the "lit" portion up to the current step.
  const fullPath = useMemo(() => pointsToPath(nodePoints.map((p) => ({ x: p.x, y: p.y }))), [nodePoints])
  const litCount = useMemo(() => {
    let last = 0
    nodePoints.forEach((p, index) => {
      if (p.status === 'completed' || p.status === 'active' || p.status === 'in-progress') last = index
    })
    return last
  }, [nodePoints])
  const litPath = useMemo(
    () => pointsToPath(nodePoints.slice(0, litCount + 1).map((p) => ({ x: p.x, y: p.y }))),
    [nodePoints, litCount],
  )

  // Auto-scroll to the current step on first open (unless a saved scroll will restore).
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved) return
    const el = activeNodeRef.current
    if (el && typeof el.scrollIntoView === 'function') {
      requestAnimationFrame(() => el.scrollIntoView({ block: 'center', behavior: 'auto' }))
    }
  }, [activeId])

  // Floating "jump to current" button appears when the active node is off-screen.
  useEffect(() => {
    const el = activeNodeRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setShowJump(!entry.isIntersecting),
      { rootMargin: '-96px 0px -160px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [activeId, totalHeight])

  useEffect(() => {
    if (!openId) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePopover()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId])

  const closePopover = useCallback(() => {
    const id = openId
    setOpenId(null)
    if (id) nodeRefs.current[id]?.focus()
  }, [openId])

  const go = useCallback(
    (path: string) => {
      rememberJourneyScroll()
      navigate(path)
    },
    [navigate],
  )

  if (milestones.length === 0) {
    return (
      <p role="status" className="px-5 py-10 text-center text-sm text-ink-soft">
        No milestones are available yet.
      </p>
    )
  }

  const openView = openId ? milestones.find((view) => view.id === openId) ?? null : null

  return (
    <section data-testid="journey-path" data-environment="approved-artwork" className="relative mt-2">
      {/* Campus scene backdrop — approved artwork framed as the trailhead. */}
      <div className="relative h-[clamp(168px,42vw,288px)] w-full overflow-hidden">
        <img
          src={journeyMapArtwork.path}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 size-full scale-110 object-cover blur-xl"
        />
        <img
          src={journeyMapArtwork.path}
          alt=""
          width={journeyMapArtwork.width}
          height={journeyMapArtwork.height}
          draggable={false}
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-ivory" />
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <span className="rounded-full border border-gold/60 bg-white/85 px-4 py-1 font-display text-sm font-semibold text-evergreen backdrop-blur-sm">
            Your passage begins here
          </span>
        </div>
      </div>

      {openId ? (
        <button
          type="button"
          aria-label="Close step details"
          tabIndex={-1}
          onClick={closePopover}
          className="fixed inset-0 z-20 cursor-default bg-transparent"
        />
      ) : null}

      <AnimatePresence>
        {celebration.newlyCompleted.length > 0 || celebration.newlyUnlocked.length > 0 ? (
          <m.div
            key="celebrate-toast"
            role="status"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-30 flex justify-center px-4"
          >
            <span className="rounded-full border-2 border-gold bg-evergreen px-5 py-2 text-center text-sm font-bold text-white shadow-lg">
              {celebration.newlyCompleted.length > 0
                ? `Step complete! ${celebration.newlyUnlocked.length > 0 ? 'Your next step just unlocked.' : ''}`.trim()
                : 'A new step just unlocked.'}
            </span>
          </m.div>
        ) : null}
      </AnimatePresence>

      <div className="relative mx-auto w-full max-w-[34rem] px-4">
        <div ref={layerRef} className="relative" style={{ height: totalHeight }}>
          {/* Winding road */}
          <svg
            className="pointer-events-none absolute inset-0 size-full"
            width={width}
            height={totalHeight}
            viewBox={`0 0 ${width} ${totalHeight}`}
            fill="none"
            aria-hidden="true"
          >
            <path d={fullPath} stroke="#d9d2bf" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <path
              d={fullPath}
              stroke="#efe9d8"
              strokeWidth={14}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 22"
            />
            <m.path
              d={litPath}
              stroke="#c7a338"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          </svg>

          {rows.map((row) => {
            if (row.kind === 'banner') {
              return (
                <m.div
                  key={`banner-${row.chapter.id}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4 }}
                  style={{ top: row.y }}
                  className="absolute inset-x-0 flex flex-col items-center"
                >
                  <span className="text-[0.62rem] font-extrabold tracking-[0.22em] text-gold-deep uppercase">
                    {row.chapter.daysRemaining} days
                  </span>
                  <span className="mt-0.5 rounded-full bg-evergreen px-4 py-1 font-display text-sm font-semibold text-white shadow-sm">
                    {row.chapter.title}
                  </span>
                </m.div>
              )
            }

            if (row.kind === 'finale') {
              return (
                <div
                  key="finale"
                  style={{ top: row.y, left: row.x }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                >
                  <button
                    type="button"
                    data-finale={row.ready ? 'ready' : 'locked'}
                    aria-label={row.ready ? 'Cross the threshold to your destination' : 'Destination opens once the required steps are complete'}
                    onClick={() => go('/destination')}
                    className={`grid size-16 place-items-center rounded-full border-4 shadow-[0_8px_0_rgba(0,0,0,0.12)] transition active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                      row.ready ? 'border-gold bg-evergreen' : 'border-[#c9c2af] bg-[#e7e1d1]'
                    }`}
                  >
                    <GraduationCap size={30} weight="fill" aria-hidden="true" className={row.ready ? 'text-gold' : 'text-[#9a927c]'} />
                  </button>
                  <span className="mt-2 text-center text-xs font-bold text-evergreen">Destination</span>
                </div>
              )
            }

            const { view, x, y, diameter } = row
            const isActive = view.id === activeId
            const counts = isActive ? milestoneTaskCounts(view.id, catalogMilestones, tasks, progress) : null
            return (
              <div
                key={view.id}
                ref={isActive ? activeNodeRef : undefined}
                style={{ top: y, left: x }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              >
                {isActive ? (
                  <m.span
                    aria-hidden="true"
                    className="absolute rounded-full border-2 border-gold"
                    style={{ width: diameter + 18, height: diameter + 18 }}
                    initial={{ opacity: 0.55, scale: 0.9 }}
                    animate={reduce ? { opacity: 0.5 } : { opacity: [0.55, 0, 0.55], scale: [0.9, 1.25, 0.9] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ) : null}

                {isActive && counts && counts.total > 0 ? (
                  <ProgressRing diameter={diameter + 10} done={counts.done} total={counts.total} reduce={!!reduce} />
                ) : null}

                <button
                  ref={(el) => {
                    nodeRefs.current[view.id] = el
                  }}
                  type="button"
                  data-milestone={view.id}
                  data-slot={row.ordinal}
                  data-status={view.status}
                  aria-current={isActive ? 'step' : undefined}
                  aria-expanded={openId === view.id}
                  aria-haspopup="dialog"
                  aria-label={`${view.title}, ${statusLabel(view.status)}`}
                  onClick={() => setOpenId((current) => (current === view.id ? null : view.id))}
                  className="relative appearance-none rounded-full border-0 bg-transparent p-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  style={{ width: diameter, height: diameter }}
                >
                  <m.img
                    src={FACES[view.status]}
                    alt=""
                    draggable={false}
                    className="size-full object-contain drop-shadow-[0_6px_6px_rgba(16,38,30,0.18)]"
                    whileTap={reduce ? undefined : { scale: 0.88 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  />
                </button>

                {isActive ? (
                  <m.span
                    aria-hidden="true"
                    animate={reduce ? undefined : { y: [0, -5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="pointer-events-none absolute -top-9 rounded-full bg-gold px-3 py-1 text-[0.7rem] font-extrabold tracking-wide text-evergreen uppercase shadow-md after:absolute after:-bottom-1 after:left-1/2 after:size-2.5 after:-translate-x-1/2 after:rotate-45 after:bg-gold"
                  >
                    {view.status === 'in-progress' ? 'Resume' : 'Start'}
                  </m.span>
                ) : null}

                {celebration.newlyCompleted.includes(view.id) ? <SparkleBurst reduce={!!reduce} /> : null}

                <AnimatePresence>
                  {openId === view.id && openView ? (
                    <NodePopover
                      view={openView}
                      chapterTitle={chapterById[openView.chapterId]?.title ?? ''}
                      stepIndex={openView.sequence}
                      total={milestones.length}
                      description={catalogMilestones.find((m) => m.id === openView.id)?.description ?? ''}
                      taskDone={milestoneTaskCounts(openView.id, catalogMilestones, tasks, progress).done}
                      taskTotal={milestoneTaskCounts(openView.id, catalogMilestones, tasks, progress).total}
                      onPrimary={() => go(`/journey/${openView.id}`)}
                      onClose={closePopover}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {showJump && activeId ? (
          <m.button
            type="button"
            key="jump"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => activeNodeRef.current?.scrollIntoView?.({ block: 'center', behavior: 'smooth' })}
            className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-gold bg-evergreen px-5 py-2.5 text-sm font-bold text-white shadow-lg"
          >
            Jump to current step
          </m.button>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

function ProgressRing({
  diameter,
  done,
  total,
  reduce,
}: {
  diameter: number
  done: number
  total: number
  reduce: boolean
}) {
  const stroke = 5
  const r = (diameter - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = total > 0 ? done / total : 0
  return (
    <svg
      aria-hidden="true"
      className="absolute -rotate-90"
      width={diameter}
      height={diameter}
      style={{ top: `calc(50% - ${diameter / 2}px)` }}
    >
      <circle cx={diameter / 2} cy={diameter / 2} r={r} fill="none" stroke="#efe9d8" strokeWidth={stroke} />
      <m.circle
        cx={diameter / 2}
        cy={diameter / 2}
        r={r}
        fill="none"
        stroke="#c7a338"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={reduce ? false : { strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct) }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  )
}

function SparkleBurst({ reduce }: { reduce: boolean }) {
  if (reduce) {
    return (
      <img
        src={`${FACE_BASE}/Overlays/sparkle.svg`}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 -right-2 size-5"
      />
    )
  }
  const sparks = [0, 60, 120, 180, 240, 300]
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {sparks.map((angle, index) => {
        const rad = (angle * Math.PI) / 180
        return (
          <m.img
            key={angle}
            src={`${FACE_BASE}/Overlays/sparkle.svg`}
            alt=""
            className="absolute top-1/2 left-1/2 size-4"
            initial={{ opacity: 0, scale: 0.2, x: '-50%', y: '-50%' }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.2, 1, 0.6],
              x: `calc(-50% + ${Math.cos(rad) * 46}px)`,
              y: `calc(-50% + ${Math.sin(rad) * 46}px)`,
            }}
            transition={{ duration: 1.1, delay: index * 0.04, ease: 'easeOut' }}
          />
        )
      })}
    </span>
  )
}

/** Build a smooth-ish poly-line road through node centers. */
function pointsToPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const curr = points[i]
    const midY = (prev.y + curr.y) / 2
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
  }
  return d
}
