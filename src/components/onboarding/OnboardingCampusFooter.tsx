import { useState } from 'react'
import { onboardingCampusFooter } from '../../assets/registry'

/** Approved decorative campus footer shared by all four onboarding steps. Sits in flow below the content. */
export function OnboardingCampusFooter() {
  const [failed, setFailed] = useState(false)
  if (failed) return <div aria-hidden="true" className="mt-auto h-10" />
  return (
    <div aria-hidden="true" className="pointer-events-none mt-auto w-full pt-4 select-none" data-testid="onboarding-campus-footer">
      <img
        src={onboardingCampusFooter.path}
        alt=""
        width={onboardingCampusFooter.width}
        height={onboardingCampusFooter.height}
        draggable={false}
        onError={() => setFailed(true)}
        className="mx-auto block h-auto w-full max-w-[860px]"
      />
    </div>
  )
}
