import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HandsPraying } from '@phosphor-icons/react'
import { DemoNote, ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { scriptureForDate, secularReflectionKey, verseReflectionKey } from '../domain/dailyScripture'
import { usePassage } from '../state/PassageContext'

export function DailyPrayerScreen() {
  const { now } = usePassage()
  const verse = scriptureForDate(now)

  return (
    <ScreenFrame
      eyebrow="Optional"
      title="Today's prayer"
      lede="Read this if it helps. It is a private prayer, not a chapel requirement, and it does not change your passage."
    >
      <article className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-extrabold tracking-[0.14em] text-gold-deep uppercase">{verse.reference}</p>
          <span
            data-icon="praying-hands"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f3eee0] text-evergreen"
            aria-hidden="true"
          >
            <HandsPraying size={22} weight="duotone" />
          </span>
        </div>
        <p className="mt-3 font-display text-2xl leading-snug text-evergreen">{verse.text}</p>
        <h2 className="mt-6 font-display text-2xl text-evergreen">A prayer for this verse</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{verse.prayer}</p>
      </article>
      <Link to="/reflections/today" className={passageButton}>
        Reflect on This
      </Link>
      <Link to="/reflections" className="inline-flex min-h-11 items-center font-bold text-evergreen">
        Use a reflection without scripture
      </Link>
      <DemoNote>
        The verse is the public-domain King James Version. Skipping the prayer or the reflection leaves every milestone unchanged.
      </DemoNote>
    </ScreenFrame>
  )
}

export function DailyReflectionScreen() {
  const { now, progress, saveReflection } = usePassage()
  const verse = scriptureForDate(now)
  const verseKey = verseReflectionKey(verse.id)
  const secularKey = secularReflectionKey(verse.id)
  const [verseDraft, setVerseDraft] = useState<string | null>(null)
  const [secularDraft, setSecularDraft] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const verseValue = verseDraft ?? progress.reflections[verseKey]?.text ?? ''
  const secularValue = secularDraft ?? progress.reflections[secularKey]?.text ?? ''

  return (
    <ScreenFrame
      eyebrow="Optional"
      title="Reflect on this"
      lede="Write only what you want to keep on this device. Neither note is submitted anywhere, and neither one changes your readiness."
    >
      <p className="font-display text-xl leading-snug text-evergreen">{verse.text}</p>
      <p className="text-xs font-bold tracking-wide text-ink-soft">{verse.reference}</p>
      {notice ? (
        <p role="status" className="rounded-2xl bg-summary-well px-3 py-3 text-sm text-evergreen">
          {notice}
        </p>
      ) : null}
      <section className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-4">
        <h2 className="font-display text-2xl text-evergreen">On this verse</h2>
        <label className="mt-3 block text-sm font-bold text-ink">
          Your thoughts
          <textarea
            value={verseValue}
            maxLength={5000}
            onChange={(event) => setVerseDraft(event.target.value)}
            className="mt-1 min-h-32 w-full rounded-2xl border border-field-border bg-field px-3 py-2 text-base font-normal"
          />
        </label>
        <button
          type="button"
          className={`${passageButton} mt-3`}
          onClick={() => {
            saveReflection(verseKey, verseValue)
            setNotice('Your reflection is saved on this device. It does not change your passage progress.')
          }}
        >
          Save this reflection
        </button>
      </section>
      <section className="rounded-[1.6rem] border border-choice-border bg-paper px-4 py-4">
        <h2 className="font-display text-2xl text-evergreen">Without scripture</h2>
        <p className="mt-1 text-sm text-ink-soft">{verse.secularPrompt}</p>
        <label className="mt-3 block text-sm font-bold text-ink">
          Your reflection
          <textarea
            value={secularValue}
            maxLength={5000}
            onChange={(event) => setSecularDraft(event.target.value)}
            className="mt-1 min-h-32 w-full rounded-2xl border border-field-border bg-field px-3 py-2 text-base font-normal"
          />
        </label>
        <button
          type="button"
          className={`${passageButton} mt-3`}
          onClick={() => {
            saveReflection(secularKey, secularValue)
            setNotice('Your nonreligious reflection is saved on this device. It does not change your passage progress.')
          }}
        >
          Save the nonreligious reflection
        </button>
      </section>
      <Link to="/reflections" className="inline-flex min-h-11 items-center font-bold text-evergreen">
        Open the other private reflections
      </Link>
      <DemoNote>Both notes stay in this browser. They are not sent to a university office.</DemoNote>
    </ScreenFrame>
  )
}
