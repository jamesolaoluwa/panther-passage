import { Link, useParams } from 'react-router-dom'
import { ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { statusLabel } from '../domain/progression'
import { usePassage } from '../state/PassageContext'

export function ChapterScreen() {
  const { chapterId = '' } = useParams()
  const { catalog, views } = usePassage()
  const chapter = catalog.chapters.find((item) => item.id === chapterId)
  const milestones = views.filter((item) => item.chapterId === chapterId)

  if (!chapter || milestones.length === 0) {
    return (
      <ScreenFrame
        title="That chapter is not on this passage."
        lede="The chapter id does not match Find Your Footing through Carry It Forward."
      >
        <Link to="/journey" className={passageButton}>
          Return to My Passage
        </Link>
      </ScreenFrame>
    )
  }

  return (
    <ScreenFrame eyebrow={chapter.daysRemaining} title={chapter.title} lede={chapter.summary}>
      <p className="text-sm text-ink-soft">Theme: {chapter.theme}</p>
      <ol aria-label="Steps in this chapter" className="flex flex-col gap-2">
        {milestones.map((item) => (
          <li key={item.id}>
            <Link
              to={`/journey/${item.id}`}
              data-milestone={item.id}
              data-status={item.status}
              className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-paper px-3 py-2 text-ink no-underline"
            >
              <span>
                <span className="block text-xs font-bold tracking-wide text-evergreen uppercase">
                  {item.id}
                  {item.required ? '' : ' · Optional'}
                </span>
                <span className="font-display text-lg leading-tight text-evergreen">{item.title}</span>
              </span>
              <span className="shrink-0 text-sm font-bold">{statusLabel(item.status)}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link to="/journey" className="inline-flex min-h-11 items-center font-bold text-evergreen">
        All fifteen steps
      </Link>
    </ScreenFrame>
  )
}
