import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DemoNote, ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { usePassage } from '../state/PassageContext'

const RESPONSES = {
  scripture: {
    title: 'A response to scripture',
    prompt: 'What does this passage bring up for the step you are in? Write in your own words.',
  },
  prayer: {
    title: 'A private prayer',
    prompt: 'If you want to pray, write the prayer here. Leaving this blank does not hold back any milestone.',
  },
} as const

const VERSES: Record<string, { reference: string; text: string; prompt: string }> = {
  identity: {
    reference: 'Psalm 90:12, King James Version',
    text: 'So teach us to number our days, that we may apply our hearts unto wisdom.',
    prompt: 'How do you want to use the days you still have before graduation?',
  },
  career: {
    reference: 'Colossians 3:23, King James Version',
    text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.',
    prompt: 'What kind of work would feel honest to carry into the next season?',
  },
  finance: {
    reference: 'Proverbs 21:5, King James Version',
    text: 'The thoughts of the diligent tend only to plenteousness; but of every one that is hasty only to want.',
    prompt: 'What is one money decision you do not want to rush?',
  },
  wellness: {
    reference: 'Matthew 11:28, King James Version',
    text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    prompt: 'Where do you need rest while things are changing?',
  },
  network: {
    reference: 'Ecclesiastes 4:9, King James Version',
    text: 'Two are better than one; because they have a good reward for their labour.',
    prompt: 'Who makes the next season less lonely?',
  },
  planning: {
    reference: 'Proverbs 16:3, King James Version',
    text: 'Commit thy works unto the Lord, and thy thoughts shall be established.',
    prompt: 'Which plan needs a calmer next step rather than a bigger promise?',
  },
  legacy: {
    reference: 'Matthew 5:16, King James Version',
    text: 'Let your light so shine before men, that they may see your good works.',
    prompt: 'What do you hope someone after you will learn from how you leave?',
  },
}

export function FaithReflectionScreen() {
  const { catalog, views, progress, saveReflection } = usePassage()
  const [params] = useSearchParams()
  const focusId = params.get('focus')
  const focus = catalog.milestones.find((item) => item.id === focusId)
  const current = views.find((item) => item.status === 'active' || item.status === 'in-progress')
  const category = focus?.category ?? catalog.milestones.find((item) => item.id === current?.id)?.category ?? 'identity'
  const verse = VERSES[category] ?? VERSES.identity
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')

  return (
    <ScreenFrame
      eyebrow="Optional"
      title="Scripture and prayer"
      lede="This page is a private, optional practice. It is not a campus ministry, a chapel requirement, or part of graduation progress."
    >
      <p className="text-sm text-ink">
        {focus
          ? `This prompt follows ${focus.title}.`
          : current
            ? `This prompt follows ${current.title}.`
            : 'This prompt follows the identity chapter.'}
      </p>
      <article className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-4">
        <p className="text-xs font-extrabold tracking-[0.14em] text-gold-deep uppercase">{verse.reference}</p>
        <p className="mt-3 font-display text-2xl leading-snug text-evergreen">{verse.text}</p>
        <p className="mt-3 text-sm text-ink">{verse.prompt}</p>
      </article>
      {notice ? (
        <p role="status" className="rounded-2xl bg-summary-well px-3 py-3 text-sm text-evergreen">
          {notice}
        </p>
      ) : null}
      {(Object.keys(RESPONSES) as Array<keyof typeof RESPONSES>).map((id) => {
        const saved = progress.reflections[id]?.text ?? ''
        const value = drafts[id] ?? saved
        const copy = RESPONSES[id]
        return (
          <section key={id} className="rounded-[1.6rem] border border-choice-border bg-paper px-4 py-4">
            <h2 className="font-display text-2xl text-evergreen">{copy.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{copy.prompt}</p>
            <label className="mt-3 block text-sm font-bold text-ink">
              Your writing
              <textarea
                value={value}
                maxLength={5000}
                onChange={(event) => setDrafts((currentDrafts) => ({ ...currentDrafts, [id]: event.target.value }))}
                className="mt-1 min-h-32 w-full rounded-2xl border border-field-border bg-field px-3 py-2 text-base font-normal"
              />
            </label>
            <button
              type="button"
              className={`${passageButton} mt-3`}
              onClick={() => {
                saveReflection(id, value)
                setNotice(`${copy.title} saved. It does not change your passage progress.`)
              }}
            >
              Save reflection
            </button>
          </section>
        )
      })}
      <Link to="/reflections" className="inline-flex min-h-11 items-center font-bold text-evergreen">
        Use the nonreligious reflections instead
      </Link>
      <DemoNote>Scripture here is the public-domain King James Version, offered as an optional prompt. Skipping it leaves every milestone unchanged.</DemoNote>
    </ScreenFrame>
  )
}
