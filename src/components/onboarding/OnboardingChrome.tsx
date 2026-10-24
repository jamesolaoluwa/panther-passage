import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, CaretRight, WarningCircle } from '@phosphor-icons/react'
import { OnboardingCampusFooter } from './OnboardingCampusFooter'

export const ONBOARDING_TOTAL_STEPS = 4

export function StepIndicator({ current, total = ONBOARDING_TOTAL_STEPS }: { current: number; total?: number }) {
  return (
    <div className="flex flex-col items-center pt-3.5">
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className="flex items-center">
            {index > 0 ? (
              <span className={`h-0.5 w-[15px] ${index + 1 <= current ? 'bg-evergreen' : 'bg-step-line'}`} />
            ) : null}
            <span
              className={
                index + 1 === current
                  ? 'size-2.5 rounded-full bg-[#0b3e33]'
                  : index + 1 < current
                    ? 'size-2.5 rounded-full bg-evergreen'
                    : 'size-[9px] rounded-full bg-step-idle'
              }
            />
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs leading-none text-ink-soft">
        Step {current} of {total}
      </p>
    </div>
  )
}

export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} · Panther Passage`
    return () => {
      document.title = previous
    }
  }, [title])
}

/** Page frame for onboarding steps 2–4; mirrors the Step 1 header, gutters and footer. */
export function OnboardingFrame({
  step,
  backTo,
  backLabel,
  titleId,
  children,
}: {
  step: number
  backTo: string
  backLabel: string
  titleId: string
  children: ReactNode
}) {
  return (
    <main
      id="main"
      className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-onboarding-surface text-ink"
      aria-labelledby={titleId}
    >
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col min-[680px]:max-w-[620px]">
        <header className="flex items-start justify-between pt-[max(0.75rem,env(safe-area-inset-top))] pr-[21px] pl-[10px]">
          <Link
            to={backTo}
            aria-label={backLabel}
            className="-mt-0.5 inline-flex size-11 items-center justify-center rounded-full text-ink"
          >
            <CaretLeft size={28} weight="regular" aria-hidden="true" />
          </Link>
          <StepIndicator current={step} />
        </header>
        <div className="px-[var(--gutter)] [--gutter:clamp(1.25rem,7.2vw,1.875rem)]">{children}</div>
      </div>
      <OnboardingCampusFooter />
    </main>
  )
}

export function OnboardingIntro({
  titleId,
  title,
  description,
  titleClassName = 'text-[clamp(1.5rem,7.36vw,2rem)] leading-[1.1]',
}: {
  titleId: string
  title: ReactNode
  description: string
  titleClassName?: string
}) {
  return (
    <>
      <h1 id={titleId} className={`mt-10 font-display font-bold tracking-[-0.025em] text-ink ${titleClassName}`}>
        {title}
      </h1>
      <p className="mt-2.5 max-w-[20rem] pl-0.5 text-[15px] leading-[1.45] text-ink-soft">{description}</p>
    </>
  )
}

export function OnboardingPrimaryButton({
  children,
  onClick,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="relative mx-[5px] mt-8 flex h-[52px] w-[calc(100%-10px)] items-center justify-center rounded-full border-2 border-gold bg-evergreen text-lg font-semibold text-white shadow-[0_2px_6px_rgba(16,38,30,0.18)] transition-colors hover:bg-[#1d4a3f] active:bg-[#123329]"
    >
      {children}
      <CaretRight size={20} weight="bold" aria-hidden="true" className="absolute right-6" />
    </button>
  )
}

export function OnboardingError({ id, message }: { id: string; message: string | null }) {
  return (
    <p id={id} role="alert" className={message ? 'mt-3 flex items-start gap-1.5 pl-[5px] text-sm leading-snug text-danger' : 'sr-only'}>
      {message ? (
        <>
          <WarningCircle size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </>
      ) : null}
    </p>
  )
}
