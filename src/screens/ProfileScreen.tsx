import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProfileAvatar } from '../components/profile/ProfileAvatar'
import { DemoNote, Meter, ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { formatCalendarDate, BACCALAUREATE_DATE, COMMENCEMENT_DATE } from '../domain/passageCalendar'
import { entryPathForScenario } from '../domain/scenarios'
import type { ScenarioId } from '../data/schemas'
import { pathwayOption } from '../domain/onboarding'
import { usePassage } from '../state/PassageContext'

const scenarios: { id: ScenarioId; label: string }[] = [
  { id: 'new', label: 'Jordan Ellis — New Student' },
  { id: 'in-progress', label: 'Avery Brooks — In Progress' },
  { id: 'almost-graduated', label: 'Morgan Reed — Almost Graduated' },
]

export function ProfileScreen() {
  const { activate, reset, progress, student, preparation, readiness, savePreferences } = usePassage()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const profile = progress.onboardingProfile
  const pathway = pathwayOption(profile?.pathway || student.pathway)

  return (
    <ScreenFrame
      title="Your passage, your pace."
      lede="Your name, pathway, and pace stay on this device. This is not an official student record."
    >
      <section className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold">
            <ProfileAvatar studentId={student.id} />
          </span>
          <p className="font-display text-3xl text-evergreen">{student.name}</p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {student.year} · Baccalaureate {formatCalendarDate(BACCALAUREATE_DATE)} · Commencement{' '}
          {formatCalendarDate(COMMENCEMENT_DATE)}
        </p>
        <p className="mt-2 text-sm">{pathway ? pathway.title : student.pathway}</p>
        {profile?.step1Complete ? (
          <p className="mt-2 text-sm">
            Onboarding name: {profile.firstName} {profile.lastName}
            {profile.major ? ` · ${profile.major}` : ''}
            {profile.graduationTerm ? ` · ${profile.graduationTerm}` : ''}
          </p>
        ) : (
          <p className="mt-2 text-sm">Onboarding answers have not been saved for this student.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          <Meter label="Preparation" completed={preparation.completed} total={preparation.total} />
          <Meter label="Required readiness" completed={readiness.completed} total={readiness.total} />
        </div>
      </section>

      <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-field px-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={progress.preferences.largerText}
          onChange={(event) => savePreferences({ largerText: event.target.checked })}
        />
        Larger reading text
      </label>

      <nav aria-label="Profile sections" className="flex flex-wrap gap-2">
        <Link to="/reflections" className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-4 text-sm font-bold text-evergreen">
          Reflections
        </Link>
        <Link to="/next-chapter" className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-4 text-sm font-bold text-evergreen">
          Goals
        </Link>
        <Link to="/events" className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-4 text-sm font-bold text-evergreen">
          Events
        </Link>
        <Link to="/readiness" className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-4 text-sm font-bold text-evergreen">
          Readiness
        </Link>
        <Link to="/preview" className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-4 text-sm font-bold text-evergreen">
          See each pathway
        </Link>
      </nav>

      <section aria-label="Sample passages" className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-evergreen">Sample passages</h2>
        <p className="text-sm text-ink-soft">
          Opening a sample restores that fictional student’s defined progress and leaves the other students’ saved data alone.
        </p>
        <div className="flex flex-col gap-2" role="group" aria-label="Sample passages">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className={`min-h-12 rounded-full border px-4 text-left text-sm font-bold ${
                progress.scenarioId === scenario.id
                  ? 'border-evergreen bg-evergreen text-ivory'
                  : 'border-evergreen/25 bg-paper text-evergreen'
              }`}
              aria-pressed={progress.scenarioId === scenario.id}
              onClick={() => {
                activate(scenario.id)
                setConfirmReset(false)
                navigate(entryPathForScenario(scenario.id))
              }}
            >
              {scenario.label}
            </button>
          ))}
        </div>
        {confirmReset ? (
          <button
            type="button"
            className="min-h-12 rounded-full bg-danger px-4 font-bold text-ivory"
            onClick={() => {
              reset()
              setConfirmReset(false)
            }}
          >
            Confirm reset of this scenario
          </button>
        ) : (
          <button
            type="button"
            className="min-h-12 rounded-full border border-danger px-4 font-bold text-danger"
            onClick={() => setConfirmReset(true)}
          >
            Reset current scenario
          </button>
        )}
      </section>
      <DemoNote>Reset restores the selected fictional student to the original seed. It does not contact a university system.</DemoNote>
    </ScreenFrame>
  )
}

export function NotFoundScreen() {
  return (
    <ScreenFrame title="This page is not part of the passage." lede="The address does not match a Panther Passage screen.">
      <Link to="/" className={passageButton}>
        Return to the welcome
      </Link>
    </ScreenFrame>
  )
}
