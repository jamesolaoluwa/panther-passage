import { Children, isValidElement, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'motion/react'

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: 'easeOut' as const } },
}

export const passageButton =
  'inline-flex min-h-12 w-full items-center justify-center rounded-full bg-evergreen px-5 text-center font-body text-base font-bold text-ivory no-underline transition-colors hover:bg-evergreen-bright disabled:cursor-not-allowed disabled:opacity-50'

export function ScreenFrame({
  eyebrow = '100 days of becoming',
  title,
  lede,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  children: ReactNode
}) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} · Panther Passage`
    return () => {
      document.title = previous
    }
  }, [title])

  return (
    <article className="passage-rise">
      <p className="text-[0.68rem] font-extrabold tracking-[0.18em] text-gold-deep uppercase">{eyebrow}</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-[2.15rem] leading-[0.95] font-semibold tracking-[-0.03em] text-evergreen sm:max-w-[20ch] sm:text-[2.7rem]">
        {title}
      </h1>
      {lede ? <p className="mt-3 max-w-[46rem] text-[15px] leading-relaxed text-ink">{lede}</p> : null}
      <m.div
        className="mt-6 flex flex-col gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {Children.map(children, (child) =>
          isValidElement(child) ? <m.div variants={staggerItem}>{child}</m.div> : child,
        )}
      </m.div>
    </article>
  )
}

export function StatusPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'done' | 'now' | 'locked' | 'gold'
}) {
  const tones = {
    neutral: 'bg-icon-well text-ink',
    done: 'bg-summary-well text-evergreen',
    now: 'bg-evergreen text-ivory',
    locked: 'bg-field text-ink-soft ring-1 ring-field-border',
    gold: 'bg-icon-well-gold text-ink',
  }
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Meter({ label, completed, total }: { label: string; completed: number; total: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="font-display text-xl text-evergreen">
          {completed}
          <span className="text-sm text-ink-soft"> / {total}</span>
        </p>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7e1d4]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-label={label}
      >
        <m.div
          className="h-full rounded-full bg-evergreen"
          initial={{ width: 0 }}
          animate={{ width: total === 0 ? '0%' : `${Math.round((100 * completed) / total)}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function DemoNote({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-ink-soft">{children}</p>
}

const support = [
  ['/events', 'Events'],
  ['/achievements', 'Achievements'],
  ['/reflections', 'Reflections'],
  ['/readiness', 'Readiness'],
  ['/destination', 'Finale'],
] as const

export function SupportLinks() {
  return (
    <nav aria-label="More of the passage" className="flex flex-wrap gap-2">
      {support.map(([to, label]) => (
        <Link
          key={to}
          to={to}
          className="inline-flex min-h-11 items-center rounded-full border border-gold/60 bg-paper px-4 text-sm font-bold text-evergreen no-underline"
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
