import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DemoNote, ScreenFrame, StatusPill } from '../components/ui/ScreenFrame'
import { usePassage } from '../state/PassageContext'

export function ResourcesScreen() {
  const { catalog, progress, toggleSavedResource } = usePassage()
  const categories = useMemo(
    () => ['all', ...Array.from(new Set(catalog.resources.map((resource) => resource.category)))],
    [catalog.resources],
  )
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [savedOnly, setSavedOnly] = useState(false)
  const [params] = useSearchParams()
  const requested = params.get('open')
  const [openId, setOpenId] = useState<string | null>(
    catalog.resources.some((resource) => resource.id === requested) ? requested : null,
  )

  const filtered = catalog.resources.filter((resource) => {
    if (category !== 'all' && resource.category !== category) return false
    if (savedOnly && !progress.savedResourceIds.includes(resource.id)) return false
    const haystack = `${resource.title} ${resource.summary} ${resource.tags.join(' ')} ${resource.category}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })
  const open = filtered.find((resource) => resource.id === openId) ?? null

  return (
    <ScreenFrame
      title="Tools for the road ahead."
      lede="Search the simulated guides in this passage. Nothing here is a university service or a live website."
    >
      <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm font-bold text-ink">
          Search guides
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-1 min-h-12 w-full rounded-2xl border border-field-border bg-field px-3 text-base"
          />
        </label>
        <label className="block text-sm font-bold text-ink">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1 min-h-12 w-full rounded-2xl border border-field-border bg-field px-3 text-base"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'All categories' : item}
              </option>
            ))}
          </select>
        </label>
      </form>
      <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-ink">
        <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
        Saved guides only
      </label>

      {filtered.length === 0 ? (
        <p role="status" className="rounded-2xl bg-field px-3 py-4 text-sm">
          No simulated guides match that search.{' '}
          <button type="button" className="font-bold text-evergreen underline" onClick={() => { setQuery(''); setCategory('all'); setSavedOnly(false) }}>
            Clear filters
          </button>
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ul className="flex flex-col gap-2">
            {filtered.map((resource) => {
              const saved = progress.savedResourceIds.includes(resource.id)
              return (
                <li key={resource.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(resource.id)}
                    aria-pressed={open?.id === resource.id}
                    className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left ${
                      open?.id === resource.id ? 'bg-evergreen text-ivory' : 'bg-paper text-ink'
                    }`}
                  >
                    <span>
                      <span className="block text-xs font-bold uppercase">{resource.category}</span>
                      <span className="font-display text-lg leading-tight">{resource.title}</span>
                    </span>
                    {saved ? <StatusPill tone={open?.id === resource.id ? 'gold' : 'done'}>Saved</StatusPill> : null}
                  </button>
                </li>
              )
            })}
          </ul>
          {open ? (
            <article className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-4" aria-live="polite">
              <p className="text-xs font-extrabold tracking-[0.14em] text-gold-deep uppercase">{open.category}</p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-evergreen">{open.title}</h2>
              <p className="mt-3 text-sm leading-relaxed">{open.summary}</p>
              <p className="mt-3 text-xs text-ink-soft">Simulated. {open.provider}</p>
              {open.url ? (
                <a href={open.url} className="mt-3 inline-flex min-h-11 items-center font-bold text-evergreen">
                  Open external link
                </a>
              ) : (
                <p className="mt-3 text-sm">No external link is included for this guide.</p>
              )}
              <h3 className="mt-4 font-bold">Related steps</h3>
              <ul className="mt-2 flex flex-col gap-1">
                {open.associatedMilestones.map((id) => {
                  const milestone = catalog.milestones.find((item) => item.id === id)
                  return (
                    <li key={id}>
                      <Link to={`/journey/${id}`} className="inline-flex min-h-11 items-center font-bold text-evergreen">
                        {id} {milestone?.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <button
                type="button"
                className="mt-3 inline-flex min-h-12 items-center rounded-full border border-evergreen px-4 font-bold text-evergreen"
                onClick={() => toggleSavedResource(open.id)}
              >
                {progress.savedResourceIds.includes(open.id) ? 'Remove saved guide' : 'Save guide'}
              </button>
            </article>
          ) : (
            <p className="rounded-[1.6rem] border border-gold/40 bg-paper px-4 py-4 text-sm text-ink">
              Choose a guide. Each one stays inside this simulated library.
            </p>
          )}
        </div>
      )}
      <DemoNote>Saving a guide keeps it on this device. It is not sent to a university office.</DemoNote>
    </ScreenFrame>
  )
}
