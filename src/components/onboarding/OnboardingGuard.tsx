import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ONBOARDING_ROUTES, firstIncompleteStep, type OnboardingStep } from '../../domain/onboarding'
import { usePassage } from '../../state/PassageContext'

/** Sends direct visits to a later step back to the first step that still needs an answer. */
export function OnboardingGuard({ step, children }: { step: OnboardingStep; children: ReactNode }) {
  const { progress } = usePassage()
  const reachable = firstIncompleteStep(progress.onboardingProfile)
  if (step > reachable) return <Navigate to={ONBOARDING_ROUTES[reachable]} replace />
  return <>{children}</>
}
