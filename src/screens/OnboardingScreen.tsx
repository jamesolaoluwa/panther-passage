import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaretDown, CaretLeft, CaretRight, WarningCircle } from '@phosphor-icons/react'
import { OnboardingCampusFooter } from '../components/onboarding/OnboardingCampusFooter'
import type { OnboardingProfile } from '../data/schemas'
import {
  GRADUATION_OPTIONS,
  GRADUATION_OPTIONS_GROUP_LABEL,
  MAJOR_OPTIONS,
  MAJOR_OPTIONS_GROUP_LABEL,
  ONBOARDING_ROUTES,
  PROFILE_FIELD_ORDER,
  STUDENT_ID_MAX,
  NAME_MAX,
  hydrateProfile,
  normalizeProfile,
  validateProfile,
  type ProfileErrors,
  type ProfileField,
  type SelectOption,
} from '../domain/onboarding'
import { usePassage } from '../state/PassageContext'

const TOTAL_STEPS = 4

const fieldBase =
  'block h-12 w-full rounded-[10px] border bg-field text-base text-ink transition-colors focus:border-evergreen focus-visible:outline-offset-1'
const fieldBorder = (invalid: boolean) => (invalid ? 'border-danger' : 'border-field-border')

export function OnboardingScreen() {
  const navigate = useNavigate()
  const { progress, saveOnboardingProfile } = usePassage()
  const [profile, setProfile] = useState<OnboardingProfile>(() => hydrateProfile(progress.onboardingProfile))
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [attempted, setAttempted] = useState(false)
  const fieldRefs = useRef<Partial<Record<ProfileField, HTMLInputElement | HTMLSelectElement | null>>>({})

  useEffect(() => {
    const previous = document.title
    document.title = 'Tell us about yourself · Panther Passage'
    return () => {
      document.title = previous
    }
  }, [])

  const update = (field: ProfileField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next: OnboardingProfile = { ...profile, [field]: event.target.value, step1Complete: false }
    setProfile(next)
    if (attempted) setErrors(validateProfile(next))
    saveOnboardingProfile(next)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttempted(true)
    const found = validateProfile(profile)
    setErrors(found)
    const firstInvalid = PROFILE_FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }
    const complete = { ...normalizeProfile(profile), step1Complete: true }
    setProfile(complete)
    saveOnboardingProfile(complete)
    navigate(ONBOARDING_ROUTES[2])
  }

  const register = (field: ProfileField) => (element: HTMLInputElement | HTMLSelectElement | null) => {
    fieldRefs.current[field] = element
  }

  return (
    <main
      id="main"
      className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-onboarding-surface text-ink"
      aria-labelledby="onboarding-title"
    >
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col min-[680px]:max-w-[620px]">
        <header className="flex items-start justify-between pt-[max(0.75rem,env(safe-area-inset-top))] pr-[21px] pl-[10px]">
          <Link
            to="/"
            aria-label="Back to welcome"
            className="-mt-0.5 inline-flex size-11 items-center justify-center rounded-full text-ink"
          >
            <CaretLeft size={28} weight="regular" aria-hidden="true" />
          </Link>
          <StepIndicator current={1} total={TOTAL_STEPS} />
        </header>

        <div className="px-[var(--gutter)] [--gutter:clamp(1.25rem,7.2vw,1.875rem)]">
          <h1
            id="onboarding-title"
            className="mt-10 font-display text-[clamp(1.5rem,7.36vw,2rem)] leading-[1.1] font-bold tracking-[-0.025em] text-ink"
          >
            Tell us about yourself.
          </h1>
          <p className="mt-2.5 max-w-[19.5rem] pl-0.5 text-[15px] leading-[1.45] text-ink-soft">
            A few details will help us personalize your Panther Passage experience.
          </p>

          <form noValidate onSubmit={submit} className="mt-8">
            <div className="grid grid-cols-1 gap-x-3 gap-y-6 min-[360px]:grid-cols-2">
              <Field id="first-name" label="First name" required error={errors.firstName}>
                <input
                  ref={register('firstName')}
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  autoCapitalize="words"
                  maxLength={NAME_MAX + 30}
                  placeholder="Enter your first name"
                  required
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? 'first-name-error' : undefined}
                  value={profile.firstName}
                  onChange={update('firstName')}
                  className={`${fieldBase} ${fieldBorder(Boolean(errors.firstName))} onboarding-input px-3`}
                />
              </Field>
              <Field id="last-name" label="Last name" required error={errors.lastName}>
                <input
                  ref={register('lastName')}
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  autoCapitalize="words"
                  maxLength={NAME_MAX + 30}
                  placeholder="Enter your last name"
                  required
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? 'last-name-error' : undefined}
                  value={profile.lastName}
                  onChange={update('lastName')}
                  className={`${fieldBase} ${fieldBorder(Boolean(errors.lastName))} onboarding-input px-3`}
                />
              </Field>
            </div>

            <div className="mt-6 grid gap-6">
              <Field id="student-id" label="Student ID number" required error={errors.studentId}>
                <input
                  ref={register('studentId')}
                  id="student-id"
                  name="studentId"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={STUDENT_ID_MAX + 20}
                  placeholder="Enter your student ID number"
                  required
                  aria-invalid={Boolean(errors.studentId)}
                  aria-describedby={errors.studentId ? 'student-id-error' : undefined}
                  value={profile.studentId}
                  onChange={update('studentId')}
                  className={`${fieldBase} ${fieldBorder(Boolean(errors.studentId))} onboarding-input px-4`}
                />
              </Field>

              <Field id="major" label="What are you studying?" error={errors.major}>
                <SelectControl
                  ref={register('major')}
                  id="major"
                  name="major"
                  placeholder="Select your major"
                  groupLabel={MAJOR_OPTIONS_GROUP_LABEL}
                  options={MAJOR_OPTIONS}
                  value={profile.major}
                  onChange={update('major')}
                  error={errors.major}
                />
              </Field>

              <Field id="graduation" label="When are you graduating?" required error={errors.graduationTerm}>
                <SelectControl
                  ref={register('graduationTerm')}
                  id="graduation"
                  name="graduationTerm"
                  placeholder="Select your graduation term or year"
                  groupLabel={GRADUATION_OPTIONS_GROUP_LABEL}
                  options={GRADUATION_OPTIONS}
                  value={profile.graduationTerm}
                  onChange={update('graduationTerm')}
                  error={errors.graduationTerm}
                  required
                />
              </Field>
            </div>

            <button
              type="submit"
              className="relative mx-[5px] mt-8 flex h-[52px] w-[calc(100%-10px)] items-center justify-center rounded-full border-2 border-gold bg-evergreen text-lg font-semibold text-white shadow-[0_2px_6px_rgba(16,38,30,0.18)] transition-colors hover:bg-[#1d4a3f] active:bg-[#123329]"
            >
              Continue
              <CaretRight size={20} weight="bold" aria-hidden="true" className="absolute right-6" />
            </button>

          </form>
        </div>
      </div>
      <OnboardingCampusFooter />
    </main>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex flex-col items-center pt-3.5">
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className="flex items-center">
            {index > 0 ? <span className="h-0.5 w-[15px] bg-step-line" /> : null}
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

function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block pl-[5px] text-[15px] leading-tight font-semibold text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1.5 text-gold-deep">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 pl-[5px] text-sm leading-snug text-danger">
          <WarningCircle size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}

function SelectControl({
  ref,
  id,
  name,
  placeholder,
  groupLabel,
  options,
  value,
  onChange,
  error,
  required = false,
}: {
  ref: (element: HTMLSelectElement | null) => void
  id: string
  name: string
  placeholder: string
  groupLabel: string
  options: SelectOption[]
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  error?: string
  required?: boolean
}) {
  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        value={value}
        onChange={onChange}
        className={`${fieldBase} ${fieldBorder(Boolean(error))} cursor-pointer appearance-none truncate pr-11 pl-4 ${
          value ? 'text-ink' : 'onboarding-select-empty'
        }`}
      >
        <option value="">{placeholder}</option>
        <optgroup label={groupLabel}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      </select>
      {value ? null : (
        <span aria-hidden="true" className="onboarding-select-placeholder">
          {placeholder}
        </span>
      )}
      <CaretDown
        size={18}
        weight="bold"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#26292e]"
      />
    </div>
  )
}

