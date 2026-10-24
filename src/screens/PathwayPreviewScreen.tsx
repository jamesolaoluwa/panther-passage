import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DemoNote, ScreenFrame, passageButton } from '../components/ui/ScreenFrame'
import { getCatalog } from '../data/catalog'
import { PATHWAY_TRACKS, pathwayTrack } from '../domain/pathwayExperiences'

export function PathwayPreviewIndex() {
  return (
    <ScreenFrame
      eyebrow="Pathways"
      title="See each passage."
      lede="Each direction below is a working preview. Nothing you check here is saved to a student passage."
    >
      <p className="text-sm text-ink">
        <button
          type="button"
          className="inline-flex min-h-11 items-center font-bold text-evergreen"
          onClick={() => {
            sessionStorage.setItem('panther-passage:clock', 'before')
            window.location.assign('/journey')
          }}
        >
          See the passage before it opens
        </button>
      </p>
      <ul className="flex flex-col gap-3">
        {PATHWAY_TRACKS.map((track) => (
          <li key={track.id}>
            <Link
              to={`/preview/${track.id}`}
              className="block rounded-[1.4rem] border border-gold/40 bg-paper px-4 py-4 text-evergreen no-underline"
            >
              <span className="font-display text-2xl">{track.title}</span>
              <span className="mt-1 block text-sm text-ink">{track.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </ScreenFrame>
  )
}

export function PathwayPreviewScreen() {
  const { trackId = '' } = useParams()
  const track = pathwayTrack(trackId)
  const catalog = getCatalog()
  const [checks, setChecks] = useState<boolean[]>([false, false, false])
  const [notice, setNotice] = useState('')

  if (!track) {
    return (
      <ScreenFrame title="That pathway is not in this preview.">
        <Link to="/preview" className="inline-flex min-h-11 items-center font-bold text-evergreen">
          Back to the pathways
        </Link>
      </ScreenFrame>
    )
  }

  const milestones = track.milestoneIds.map((id) => catalog.milestones.find((item) => item.id === id))
  const activity = catalog.milestones.find((item) => item.id === track.activityId)
  const done = checks.filter(Boolean).length

  return (
    <ScreenFrame eyebrow={track.approvedName} title={track.title} lede={track.summary}>
      <section aria-labelledby="preview-journey">
        <h2 id="preview-journey" className="font-display text-2xl text-evergreen">
          Pathway journey
        </h2>
        <ol className="mt-3 flex flex-col gap-2">
          {milestones.map((milestone) =>
            milestone ? (
              <li key={milestone.id} className="rounded-2xl bg-paper px-3 py-3">
                <span className="text-xs font-bold tracking-wide text-gold-deep uppercase">{milestone.id}</span>
                <span className="mt-1 block font-bold text-ink">{milestone.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">{milestone.description}</span>
              </li>
            ) : null,
          )}
        </ol>
      </section>

      <section aria-labelledby="preview-activity">
        <h2 id="preview-activity" className="font-display text-2xl text-evergreen">
          {activity?.title ?? 'Activity'}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {done} of {track.prompts.length} preview steps. This progress stays on this page.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {track.prompts.map((prompt, index) => (
            <li key={prompt}>
              <label className="flex min-h-14 items-start gap-3 rounded-2xl bg-paper px-3 py-3 text-ink">
                <input
                  type="checkbox"
                  className="mt-1 size-5"
                  checked={checks[index]}
                  onChange={() =>
                    setChecks((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)))
                  }
                />
                <span>{prompt}</span>
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${passageButton} mt-3`}
          onClick={() =>
            setNotice(
              done === track.prompts.length
                ? 'This preview is complete. Your student passage was not changed.'
                : 'Save the remaining steps when you are ready. Your student passage was not changed.',
            )
          }
        >
          Save preview progress
        </button>
        {notice ? (
          <p role="status" className="mt-3 text-sm text-evergreen">
            {notice}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="preview-next">
        <h2 id="preview-next" className="font-display text-2xl text-evergreen">
          {done === track.prompts.length ? 'What this passage opens next' : 'Still ahead'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {done === track.prompts.length
            ? `${track.title} can move from this activity toward ${milestones[1]?.title ?? 'the next step'} and then toward Baccalaureate.`
            : 'Finish the activity above to see the next-chapter summary for this direction.'}
        </p>
      </section>
      <Link to="/preview" className="inline-flex min-h-11 items-center font-bold text-evergreen">
        All pathways
      </Link>
      <DemoNote>Preview checks are kept only in this page visit. They are not written to the student record.</DemoNote>
    </ScreenFrame>
  )
}
