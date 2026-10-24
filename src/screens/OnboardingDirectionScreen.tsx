import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'motion/react'
import {
  OnboardingError,
  OnboardingFrame,
  OnboardingIntro,
  OnboardingPrimaryButton,
  usePageTitle,
} from '../components/onboarding/OnboardingChrome'
import { PATHWAY_ICONS } from '../components/onboarding/onboardingIcons'
import { ONBOARDING_ROUTES, PATHWAY_OPTIONS, hydrateProfile, pathwayOption } from '../domain/onboarding'
import { usePassage } from '../state/PassageContext'

export function OnboardingDirectionScreen() {
  usePageTitle('What’s next for you?')
  const navigate = useNavigate()
  const { progress, saveOnboardingProfile } = usePassage()
  const [profile, setProfile] = useState(() => hydrateProfile(progress.onboardingProfile))
  const [error, setError] = useState<string | null>(null)
  const firstRadio = useRef<HTMLInputElement>(null)

  const choose = (pathway: string) => {
    const next = { ...profile, pathway }
    setProfile(next)
    setError(null)
    saveOnboardingProfile(next)
  }

  const next = () => {
    if (!pathwayOption(profile.pathway)) {
      setError('Choose the direction you’re considering to continue.')
      firstRadio.current?.focus()
      return
    }
    navigate(ONBOARDING_ROUTES[3])
  }

  return (
    <OnboardingFrame step={2} backTo={ONBOARDING_ROUTES[1]} backLabel="Back to step 1" titleId="direction-title">
      <OnboardingIntro
        titleId="direction-title"
        title="What’s next for you?"
        description="Choose the direction you’re considering after graduation."
      />

      <div
        role="radiogroup"
        aria-labelledby="direction-title"
        aria-required="true"
        aria-describedby={error ? 'direction-error' : undefined}
        className="-mx-1.5 mt-7 grid gap-3"
      >
        {PATHWAY_OPTIONS.map((option, index) => {
          const checked = profile.pathway === option.id
          const Icon = PATHWAY_ICONS[option.id]
          return (
            <m.label
              key={option.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
              className={`relative flex min-h-[76px] cursor-pointer items-center gap-4 rounded-[9px] border py-3 pr-4 pl-3.5 transition-colors has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus ${
                checked
                  ? 'border-evergreen bg-choice-selected shadow-[inset_0_0_0_1px_var(--color-evergreen)]'
                  : 'border-choice-border bg-field hover:border-[#b9b4a9]'
              }`}
            >
              <input
                ref={index === 0 ? firstRadio : undefined}
                type="radio"
                name="pathway"
                value={option.id}
                checked={checked}
                onChange={() => choose(option.id)}
                aria-describedby={`pathway-${option.id}-description`}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`flex size-[47px] shrink-0 items-center justify-center rounded-full text-ink ${
                  checked ? 'bg-icon-well-selected' : 'bg-icon-well'
                }`}
              >
                <Icon size={25} weight="regular" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[18px] leading-tight font-semibold tracking-[-0.01em] text-ink">
                  {option.title}
                </span>
                <span
                  id={`pathway-${option.id}-description`}
                  className="mt-1 block text-sm leading-[1.4] text-ink-soft"
                >
                  {option.description}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                  checked ? 'border-2 border-evergreen' : 'border-[1.5px] border-[#a5a29d]'
                }`}
              >
                {checked ? <span className="size-2.5 rounded-full bg-evergreen" /> : null}
              </span>
            </m.label>
          )
        })}
      </div>
      <OnboardingError id="direction-error" message={error} />

      <OnboardingPrimaryButton onClick={next}>Continue</OnboardingPrimaryButton>
    </OnboardingFrame>
  )
}
