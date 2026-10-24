import { useState } from 'react'
import { PATHWAY_OPTIONS, PRIORITY_OPTIONS, hydrateProfile, togglePriority } from '../../domain/onboarding'
import { usePassage } from '../../state/PassageContext'

/** Updates direction without touching completed milestones, reflections, or task notes. */
export function DirectionEditor() {
  const { progress, student, saveOnboardingProfile } = usePassage()
  const profile = hydrateProfile(progress.onboardingProfile)
  const [pathway, setPathway] = useState(profile.pathway || student.pathway)
  const [priorities, setPriorities] = useState<string[]>(profile.priorities)
  const [notice, setNotice] = useState('')

  const save = () => {
    const [first, ...rest] = student.name.split(' ')
    saveOnboardingProfile({
      ...profile,
      firstName: profile.firstName || first || 'Student',
      lastName: profile.lastName || rest.join(' ') || 'Demo',
      studentId: profile.studentId || student.id,
      graduationTerm: profile.graduationTerm || 'spring-2027',
      step1Complete: profile.step1Complete,
      pathway,
      priorities,
    })
    setNotice('Direction saved. Completed steps are unchanged.')
  }

  return (
    <form
      className="mx-4 mt-4 rounded-[1.15rem] border border-gold/40 bg-[#f8f1df] px-4 py-4"
      onSubmit={(event) => {
        event.preventDefault()
        save()
      }}
    >
      <p className="text-[0.68rem] font-extrabold tracking-[0.16em] text-gold-deep uppercase">Your direction</p>
      <h2 className="mt-1 font-display text-2xl text-evergreen">What comes after these first two steps</h2>
      <p className="mt-2 text-sm text-ink">
        M01 and M02 stay on every passage. This choice changes later recommendations. It does not erase finished work.
      </p>
      <fieldset className="mt-3">
        <legend className="text-sm font-bold">Primary direction</legend>
        <div className="mt-2 flex flex-col gap-2">
          {PATHWAY_OPTIONS.map((option) => (
            <label key={option.id} className="flex min-h-11 items-start gap-3 text-sm">
              <input
                type="radio"
                name="journey-pathway"
                className="mt-1"
                checked={pathway === option.id}
                onChange={() => setPathway(option.id)}
              />
              <span>
                <span className="font-bold">{option.title}</span>
                <span className="mt-0.5 block text-ink-soft">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-3">
        <legend className="text-sm font-bold">Also on your mind</legend>
        <div className="mt-2 flex flex-col gap-2">
          {PRIORITY_OPTIONS.map((option) => (
            <label key={option.id} className="flex min-h-11 items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={priorities.includes(option.id)}
                onChange={() => setPriorities((current) => togglePriority(current, option.id))}
              />
              <span>
                <span className="font-bold">{option.title}</span>
                <span className="mt-0.5 block text-ink-soft">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="mt-3 inline-flex min-h-12 items-center rounded-full bg-evergreen px-4 font-bold text-ivory">
        Save direction
      </button>
      {notice ? (
        <p role="status" className="mt-2 text-sm font-bold text-evergreen">
          {notice}
        </p>
      ) : null}
    </form>
  )
}
