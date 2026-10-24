import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoNote, ScreenFrame, StatusPill } from '../components/ui/ScreenFrame'
import { usePassage } from '../state/PassageContext'

export function AchievementsScreen() {
  const { catalog, views, crests } = usePassage()
  const [openId, setOpenId] = useState(catalog.achievements[0]?.id ?? '')
  const open = catalog.achievements.find((item) => item.id === openId) ?? catalog.achievements[0]

  return (
    <ScreenFrame
      title="Look how far you have come."
      lede="A chapter crest is earned once, when every required milestone in that chapter is complete. Optional steps do not block it."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {catalog.achievements.map((achievement) => {
          const earned = crests.includes(achievement.id)
          const chapter = catalog.chapters.find((item) => item.id === achievement.chapterId)
          return (
            <li key={achievement.id}>
              <button
                type="button"
                aria-pressed={open?.id === achievement.id}
                onClick={() => setOpenId(achievement.id)}
                className="flex min-h-28 w-full flex-col items-start rounded-[1.5rem] border border-gold/50 bg-paper px-4 py-3 text-left"
              >
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-full border-2 border-gold font-display text-lg text-evergreen"
                >
                  {achievement.chapterId}
                </span>
                <span className="mt-2 font-display text-xl leading-tight text-evergreen">{achievement.name}</span>
                <span className="mt-1 text-xs text-ink-soft">{chapter?.title}</span>
                <span className="mt-2">
                  <StatusPill tone={earned ? 'done' : 'locked'}>{earned ? 'Earned' : 'Not yet earned'}</StatusPill>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {open ? (
        <article className="rounded-[1.6rem] bg-evergreen px-4 py-4 text-ivory" aria-live="polite">
          <h2 className="font-display text-3xl leading-tight">{open.name}</h2>
          <p className="mt-2 text-sm text-ivory/90">{open.description}</p>
          <p className="mt-2 text-sm">Criteria: {open.criteria}</p>
          <p className="mt-2 text-sm text-ivory/80">
            {crests.includes(open.id)
              ? 'Earned in this passage. No award date is shown.'
              : 'Locked until the required milestones in this chapter are complete.'}
          </p>
          <p className="mt-2 text-xs text-gold">The chapter mark above is the crest for this step.</p>
          <ul className="mt-3 flex flex-col gap-1">
            {views
              .filter((item) => item.chapterId === open.chapterId && item.required && item.status !== 'completed')
              .map((item) => (
                <li key={item.id}>
                  <Link to={`/journey/${item.id}`} className="inline-flex min-h-11 items-center font-bold text-gold">
                    Still open: {item.title}
                  </Link>
                </li>
              ))}
          </ul>
        </article>
      ) : null}
      <DemoNote>Crests are recalculated from milestone progress. They are not awarded twice.</DemoNote>
    </ScreenFrame>
  )
}
