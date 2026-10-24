import { useNavigate } from 'react-router-dom'
import { ListChecks } from '@phosphor-icons/react'
import { onboardingJourneyPath } from '../assets/registry'
import {
  OnboardingFrame,
  OnboardingIntro,
  OnboardingPrimaryButton,
  usePageTitle,
} from '../components/onboarding/OnboardingChrome'
import { PATHWAY_ICONS } from '../components/onboarding/onboardingIcons'
import { ONBOARDING_ROUTES, firstIncompleteStep, pathwayOption, selectedPriorities } from '../domain/onboarding'
import { usePassage } from '../state/PassageContext'

const summaryCard = 'flex items-center gap-4 rounded-[10px] border border-choice-border bg-[#fbf7ec] py-3.5 pr-4 pl-4'
const summaryWell = 'flex size-[49px] shrink-0 items-center justify-center rounded-full bg-summary-well text-ink'
const summaryLabel = 'text-xs leading-none font-medium tracking-[0.06em] text-ink-soft uppercase'

export function OnboardingConfirmationScreen() {
  usePageTitle('Your journey starts here')
  const navigate = useNavigate()
  const { progress, completeOnboarding } = usePassage()
  const profile = progress.onboardingProfile
  const pathway = pathwayOption(profile?.pathway ?? '')
  const priorities = selectedPriorities(profile?.priorities ?? [])
  const PathwayIcon = pathway ? PATHWAY_ICONS[pathway.id] : null

  const enter = () => {
    const step = firstIncompleteStep(profile)
    if (step < 4) {
      navigate(ONBOARDING_ROUTES[step])
      return
    }
    completeOnboarding()
    navigate('/home')
  }

  return (
    <OnboardingFrame step={4} backTo={ONBOARDING_ROUTES[3]} backLabel="Back to step 3" titleId="confirmation-title">
      <OnboardingIntro
        titleId="confirmation-title"
        title={
          <>
            Your journey
            <br />
            starts here.
          </>
        }
        description="Your Panther Passage is taking shape. Here’s what we’ll help you focus on."
        titleClassName="text-[clamp(2rem,9.7vw,2.65rem)] leading-[1.02]"
      />

      <img
        src={onboardingJourneyPath.path}
        alt=""
        aria-hidden="true"
        width={onboardingJourneyPath.width}
        height={onboardingJourneyPath.height}
        draggable={false}
        className="pointer-events-none mt-2 ml-[19%] block h-auto w-[52%] select-none"
      />

      <div className="mt-1 grid gap-4">
        <section aria-labelledby="summary-pathway" className={summaryCard}>
          <span aria-hidden="true" className={summaryWell}>
            {PathwayIcon ? <PathwayIcon size={26} weight="regular" /> : null}
          </span>
          <div className="min-w-0">
            <h2 id="summary-pathway" className={summaryLabel}>
              Your pathway
            </h2>
            <p className="mt-1.5 font-display text-[22px] leading-tight font-semibold tracking-[-0.01em] text-ink">
              {pathway?.title}
            </p>
          </div>
        </section>

        <section aria-labelledby="summary-priorities" className={summaryCard}>
          <span aria-hidden="true" className={summaryWell}>
            <ListChecks size={26} weight="regular" />
          </span>
          <div className="min-w-0">
            <h2 id="summary-priorities" className={summaryLabel}>
              Your priorities
            </h2>
            <ul className="mt-2 space-y-1 text-base leading-snug font-medium text-ink">
              {priorities.map((priority) => (
                <li key={priority.id}>{priority.title}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <OnboardingPrimaryButton onClick={enter}>Enter My Journey</OnboardingPrimaryButton>
    </OnboardingFrame>
  )
}
