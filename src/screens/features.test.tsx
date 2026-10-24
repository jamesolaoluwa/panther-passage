import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { getCatalog } from '../data/catalog'
import { PRESENTER_TODAY } from '../domain/passageCalendar'
import { activateScenario, createMemoryStore } from '../domain/persistence'

const now = PRESENTER_TODAY

function renderAt(path: string, scenario: 'new' | 'in-progress' | 'almost-graduated' = 'new') {
  const store = createMemoryStore()
  activateScenario(store, getCatalog(), scenario, now)
  const view = render(<App store={store} router="memory" initialPath={path} now={now} />)
  return { store, ...view }
}

describe('completed passage features', () => {
  it('completes Jordan’s first milestone and unlocks the next required step', async () => {
    const user = userEvent.setup()
    renderAt('/journey/M01')
    await user.click(screen.getByRole('button', { name: 'Continue Milestone' }))
    await user.click(screen.getByRole('button', { name: 'Mark this step complete' }))
    await user.click(screen.getByRole('button', { name: 'Continue Milestone' }))
    await user.type(screen.getByRole('textbox', { name: 'Write the goals and interests you want to keep' }), 'Keep a steady start.')
    await user.click(screen.getByRole('button', { name: 'Mark this step complete' }))
    await user.click(screen.getByRole('button', { name: 'Continue Milestone' }))
    await user.click(screen.getByRole('button', { name: 'Mark this step complete' }))
    expect(screen.getByText(/Discover Your Pathway complete/)).toBeInTheDocument()
    expect(screen.getByText('3 of 3 tasks completed')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Back to My Passage' }))
    const list = screen.getByRole('heading', { name: 'All fifteen steps' }).closest('section')!
    expect(list.querySelector('[data-milestone="M01"]')).toHaveAttribute('data-status', 'completed')
    expect(list.querySelector('[data-milestone="M02"]')).toHaveAttribute('data-status', 'active')
  })

  it('filters resources, saves a guide, and keeps the bookmark after remount', async () => {
    const user = userEvent.setup()
    const { store, unmount } = renderAt('/resources', 'in-progress')
    await user.type(screen.getByRole('textbox', { name: 'Search guides' }), 'no-such-guide')
    expect(screen.getByRole('status')).toHaveTextContent(/No simulated guides match/)
    await user.clear(screen.getByRole('textbox', { name: 'Search guides' }))
    await user.click(screen.getByRole('button', { name: /Professional direction notes/ }))
    await user.click(screen.getByRole('button', { name: 'Save guide' }))
    expect(screen.getByRole('button', { name: 'Remove saved guide' })).toBeInTheDocument()
    unmount()
    render(<App store={store} router="memory" initialPath="/resources" now={now} />)
    await user.click(screen.getByRole('checkbox', { name: 'Saved guides only' }))
    expect(screen.getByRole('button', { name: /Professional direction notes/ })).toBeInTheDocument()
  })

  it('saves and cancels a simulated RSVP', async () => {
    const user = userEvent.setup()
    renderAt('/events')
    const rsvp = screen.getAllByRole('button', { name: 'RSVP' })[0]
    await user.click(rsvp)
    expect(screen.getByRole('status')).toHaveTextContent(/RSVP saved/)
    await user.click(screen.getByRole('button', { name: 'Cancel RSVP' }))
    expect(screen.getByRole('status')).toHaveTextContent(/RSVP cancelled/)
  })

  it('saves a private reflection and restores it', async () => {
    const user = userEvent.setup()
    const { store, unmount } = renderAt('/reflections', 'in-progress')
    const writing = screen.getAllByRole('textbox', { name: 'Your writing' })[0]
    await user.type(writing, 'I finished the first hard conversation.')
    await user.click(screen.getAllByRole('button', { name: 'Save reflection' })[0])
    expect(screen.getByRole('status')).toHaveTextContent(/Personal accomplishments saved/)
    unmount()
    render(<App store={store} router="memory" initialPath="/reflections" now={now} />)
    expect(screen.getAllByRole('textbox', { name: 'Your writing' })[0]).toHaveValue(
      'I finished the first hard conversation.',
    )
  })

  it('requires a goal title, then saves the goal', async () => {
    const user = userEvent.setup()
    renderAt('/next-chapter/goals', 'in-progress')
    await user.click(screen.getByRole('button', { name: 'Save goal' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/Give the goal a title/)
    await user.type(screen.getByRole('textbox', { name: 'Goal title' }), 'Draft a first budget')
    await user.click(screen.getByRole('button', { name: 'Save goal' }))
    expect(screen.getByRole('status')).toHaveTextContent(/Goal saved/)
    expect(screen.getByText('Draft a first budget')).toBeInTheDocument()
  })

  it('keeps the finale closed for Morgan until the last required milestone is complete', async () => {
    const user = userEvent.setup()
    const store = createMemoryStore()
    activateScenario(store, getCatalog(), 'almost-graduated', now)
    const closed = render(<App store={store} router="memory" initialPath="/destination" now={now} />)
    expect(screen.getByRole('heading', { name: 'The threshold is still ahead.' })).toBeInTheDocument()
    closed.unmount()

    const detail = render(<App store={store} router="memory" initialPath="/journey/M15" now={now} />)
    for (const label of ['Review completed work', 'Select one promise to yourself', 'Activate graduation celebration']) {
      await user.click(screen.getByRole('button', { name: new RegExp(label) }))
      await user.click(screen.getByRole('button', { name: 'Mark this step complete' }))
    }
    expect(screen.getByText(/Cross the Threshold complete/)).toBeInTheDocument()
    detail.unmount()

    render(<App store={store} router="memory" initialPath="/destination" now={now} />)
    expect(screen.getByRole('heading', { name: 'Baccalaureate.' })).toBeInTheDocument()
    expect(screen.getByText(/not an official ceremony record/)).toBeInTheDocument()
  })
})
