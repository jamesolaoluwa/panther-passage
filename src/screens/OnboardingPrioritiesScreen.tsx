import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from '@phosphor-icons/react'
import {
  OnboardingError,
  OnboardingFrame,
  OnboardingIntro,
  OnboardingPrimaryButton,
  usePageTitle,
} from '../components/onboarding/OnboardingChrome'
import { PRIORITY_ICONS } from '../components/onboarding/onboardingIcons'
import { ONBOARDING_ROUTES, PRIORITY_OPTIONS, hydrateProfile, selectedPriorities, togglePriority } from '../domain/onboarding'
import { usePassage } from '../state/PassageContext'

export function OnboardingPrioritiesScreen() {
  usePageTitle('What matters most to you?')
  const navigate = useNavigate()
  const { progress, saveOnboardingProfile } = usePassage()
  const [profile, setProfile] = useState(() => hydrateProfile(progress.onboardingProfile))
  const [error, setError] = useState<string | null>(null)
  const firstBox = useRef<HTMLInputElement>(null)

  const toggle = (id: string) => {
    const next = { ...profile, priorities: togglePriority(profile.priorities, id) }
    setProfile(next)
    if (next.priorities.length > 0) setError(null)
    saveOnboardingProfile(next)
  }

  const next = () => {
    if (selectedPriorities(profile.priorities).length === 0) {
      setError('Choose at least one area to focus on.')
      firstBox.current?.focus()
      return
    }
    navigate(ONBOARDING_ROUTES[4])
  }

  return (
    <OnboardingFrame step={3} backTo={ONBOARDING_ROUTES[2]} backLabel="Back to step 2" titleId="priorities-title">
      <OnboardingIntro
        titleId="priorities-title"
        title="What matters most to you?"
        description="Choose the areas you’d like to focus on during your last 100 days."
      />

      <div
        role="group"
        aria-labelledby="priorities-title"
        aria-describedby={error ? 'priorities-error' : undefined}
        className="mt-7 grid grid-cols-1 gap-2.5 min-[350px]:grid-cols-2"
      >
        {PRIORITY_OPTIONS.map((option, index) => {
          const checked = profile.priorities.includes(option.id)
          const { icon: Icon, tone } = PRIORITY_ICONS[option.id]
          return (
            <label
              key={option.id}
              className={`relative flex min-h-[116px] cursor-pointer flex-col rounded-[9px] border px-3 pt-3 pb-3.5 transition-colors has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus ${
                checked
                  ? 'border-priority-selected-border bg-priority-selected'
                  : 'border-choice-border bg-[#f9f5ec] hover:border-[#b9b4a9]'
              }`}
            >
              <input
                ref={index === 0 ? firstBox : undefined}
                type="checkbox"
                name="priorities"
                value={option.id}
                checked={checked}
                onChange={() => toggle(option.id)}
                aria-describedby={`priority-${option.id}-description`}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`flex size-9 items-center justify-center rounded-full ${
                  tone === 'gold' ? 'bg-icon-well-gold text-icon-gold' : 'bg-[#eef2e8] text-ink'
                }`}
              >
                <Icon size={20} weight="regular" />
              </span>
              <span className="mt-3 block pr-1 text-[15px] leading-tight font-bold text-ink">{option.title}</span>
              <span
                id={`priority-${option.id}-description`}
                className="mt-1 block text-[13px] leading-[1.35] text-ink-soft"
              >
                {option.description}
              </span>
              <span
                aria-hidden="true"
                className={`absolute top-3 right-3 flex size-[18px] items-center justify-center rounded-[4px] ${
                  checked ? 'bg-evergreen text-white' : 'border-[1.5px] border-[#b9b6b0] bg-transparent'
                }`}
              >
                {checked ? <Check size={13} weight="bold" /> : null}
              </span>
            </label>
          )
        })}
      </div>
      <OnboardingError id="priorities-error" message={error} />

      <OnboardingPrimaryButton onClick={next}>Continue</OnboardingPrimaryButton>
    </OnboardingFrame>
  )
}
