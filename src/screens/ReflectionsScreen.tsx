import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoNote, ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { usePassage } from '../state/PassageContext'

const PROMPTS = [
  {
    id: 'accomplishments',
    title: 'Personal accomplishments',
    prompt: 'What did you finish during this passage that you want to remember?',
  },
  {
    id: 'lessons',
    title: 'Lessons learned',
    prompt: 'What became clearer about how you work, decide, or ask for support?',
  },
  {
    id: 'future',
    title: 'Future goals',
    prompt: 'What do you want the first season after graduation to make possible?',
  },
  {
    id: 'future-self',
    title: 'A note to your future self',
    prompt: 'Write a few lines your future self can open on a hard day.',
  },
]

export function ReflectionsScreen() {
  const { progress, saveReflection } = usePassage()
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')

  return (
    <ScreenFrame
      title="What will you carry forward?"
      lede="Reflections stay private on this device. They are not a portfolio submitted anywhere."
    >
      {notice ? (
        <p role="status" className="rounded-2xl bg-summary-well px-3 py-3 text-sm text-evergreen">
          {notice}
        </p>
      ) : null}
      <ol className="flex flex-col gap-4">
        {PROMPTS.map((prompt) => {
          const saved = progress.reflections[prompt.id]?.text ?? ''
          const value = drafts[prompt.id] ?? saved
          return (
            <li key={prompt.id} className="rounded-[1.6rem] border border-choice-border bg-paper px-4 py-4">
              <h2 className="font-display text-2xl text-evergreen">{prompt.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{prompt.prompt}</p>
              <label className="mt-3 block text-sm font-bold text-ink">
                Your writing
                <textarea
                  value={value}
                  maxLength={5000}
                  onChange={(event) => setDrafts((current) => ({ ...current, [prompt.id]: event.target.value }))}
                  className="mt-1 min-h-32 w-full rounded-2xl border border-field-border bg-field px-3 py-2 text-base font-normal"
                />
              </label>
              <button
                type="button"
                className={`${passageButton} mt-3`}
                onClick={() => {
                  saveReflection(prompt.id, value)
                  setNotice(`${prompt.title} saved.`)
                }}
              >
                Save reflection
              </button>
              {saved ? <p className="mt-2 text-xs text-ink-soft">A saved version is already on this device.</p> : null}
            </li>
          )
        })}
      </ol>
      <Link to="/reflections/faith" className="inline-flex min-h-11 items-center font-bold text-evergreen">
        Scripture and prayer, optional
      </Link>
      <DemoNote>Visibility is private. These notes stay with this passage. Faith practice is optional and does not affect readiness.</DemoNote>
    </ScreenFrame>
  )
}
