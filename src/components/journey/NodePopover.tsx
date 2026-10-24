import { useEffect, useRef } from 'react'
import { m } from 'motion/react'
import { ArrowRight, LockSimple } from '@phosphor-icons/react'
import { statusLabel, type MilestoneView } from '../../domain/progression'

export interface NodePopoverProps {
  view: MilestoneView
  chapterTitle: string
  stepIndex: number
  total: number
  description: string
  taskDone: number
  taskTotal: number
  onPrimary: () => void
  onClose: () => void
}

function primaryLabel(status: MilestoneView['status']): string {
  switch (status) {
    case 'in-progress':
      return 'Continue milestone'
    case 'completed':
      return 'Review step'
    case 'needs-review':
      return 'Review notes'
    default:
      return 'Start step'
  }
}

export function NodePopover({
  view,
  chapterTitle,
  stepIndex,
  total,
  description,
  taskDone,
  taskTotal,
  onPrimary,
  onClose,
}: NodePopoverProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)
  const locked = view.status === 'locked'

  useEffect(() => {
    const focusTarget = primaryRef.current ?? cardRef.current
    focusTarget?.focus()
  }, [])

  return (
    <m.div
      ref={cardRef}
      role="dialog"
      aria-modal="false"
      aria-label={`${view.title}, ${statusLabel(view.status)}`}
      tabIndex={-1}
      data-testid="node-popover"
      initial={{ opacity: 0, scale: 0.8, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -6 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      style={{ transformOrigin: 'top center' }}
      className="absolute top-[calc(100%+0.9rem)] left-1/2 z-30 w-[min(17rem,78vw)] -translate-x-1/2 rounded-[1.25rem] border border-gold/60 bg-white p-4 text-left shadow-[0_20px_48px_rgba(16,38,30,0.26)] outline-none"
      onClick={(event) => event.stopPropagation()}
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 rounded-[3px] border-t border-l border-gold/60 bg-white"
      />
      <p className="text-[0.62rem] font-extrabold tracking-[0.16em] text-gold-deep uppercase">
        {chapterTitle} · Step {stepIndex} of {total}
      </p>
      <h3 className="mt-1 font-display text-xl leading-tight font-semibold text-evergreen">{view.title}</h3>
      <p className="mt-1.5 text-sm leading-snug text-ink-soft">{description}</p>

      {locked ? (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#f3efe4] px-3 py-2 text-sm font-semibold text-ink">
          <LockSimple size={16} weight="fill" aria-hidden="true" className="shrink-0 text-[#8a6414]" />
          Opens after {view.dependsOn.length > 0 ? view.dependsOn.join(' and ') : 'the earlier steps'}
        </p>
      ) : (
        <>
          {taskTotal > 0 ? (
            <p className="mt-2 text-xs font-bold tracking-wide text-evergreen-bright uppercase">
              {taskDone} of {taskTotal} tasks
            </p>
          ) : null}
          <button
            ref={primaryRef}
            type="button"
            onClick={onPrimary}
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-gold bg-evergreen px-4 text-base font-bold text-white"
          >
            {primaryLabel(view.status)}
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-bold text-evergreen"
      >
        Close
      </button>
    </m.div>
  )
}
