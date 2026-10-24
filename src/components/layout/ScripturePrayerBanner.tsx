import { HandsPraying } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { scriptureForDate } from '../../domain/dailyScripture'
import { usePassage } from '../../state/PassageContext'

export function ScripturePrayerBanner() {
  const { now } = usePassage()
  const verse = scriptureForDate(now)

  return (
    <section aria-labelledby="scripture-of-the-day" className="px-5 pt-4">
      <div className="flex items-start gap-4 border-l-2 border-gold pl-4">
        <div className="min-w-0 flex-1">
          <p id="scripture-of-the-day" className="text-[0.68rem] font-extrabold tracking-[0.18em] text-gold-deep uppercase">
            Scripture of the Day
          </p>
          <p className="mt-2 line-clamp-3 font-display text-[1.35rem] leading-snug font-semibold text-evergreen md:text-[1.6rem]">
            {verse.text}
          </p>
          <p className="mt-2 text-xs font-bold tracking-wide text-ink-soft">{verse.reference}</p>
          <Link
            to="/reflections/prayer"
            className="mt-3 inline-flex min-h-11 items-center font-bold text-evergreen underline decoration-gold decoration-2 underline-offset-4"
          >
            Read Today&apos;s Prayer
          </Link>
        </div>
        <span
          data-icon="praying-hands"
          className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f3eee0] text-evergreen"
          aria-hidden="true"
        >
          <HandsPraying size={22} weight="duotone" />
        </span>
      </div>
    </section>
  )
}
