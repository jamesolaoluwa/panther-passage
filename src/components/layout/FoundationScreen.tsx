import type { ReactNode } from 'react'

export function FoundationScreen({
  title,
  summary,
  children,
}: {
  title: string
  summary: string
  children?: ReactNode
}) {
  return (
    <article className="flex flex-col gap-5">
      <p className="font-body text-[0.72rem] font-extrabold tracking-[0.16em] text-evergreen-bright uppercase">
        100 days of becoming
      </p>
      <h1 className="font-display text-[2.35rem] leading-[1.05] font-semibold text-balance text-evergreen">{title}</h1>
      <p className="max-w-[34ch] text-[1.02rem] leading-relaxed text-slate">{summary}</p>
      {children}
      <p className="border-t border-gold/40 pt-4 text-sm leading-relaxed text-slate/80">
        Foundation preview. This screen is not finished, and Panther Passage is a simulated competition
        experience rather than an official university system.
      </p>
    </article>
  )
}
