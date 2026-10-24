import { cleanup, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { getCatalog } from '../data/catalog'
import { activateScenario, createMemoryStore } from '../domain/persistence'
import { PRESENTER_TODAY } from '../domain/passageCalendar'

const now = PRESENTER_TODAY

function renderJourney(scenario: 'new' | 'in-progress' | 'almost-graduated' = 'new') {
  const store = createMemoryStore()
  activateScenario(store, getCatalog(), scenario, now)
  render(<App store={store} router="memory" initialPath="/journey" now={now} />)
  return store
}

describe('journey map', () => {
  it('uses catalog titles and shows fifteen interactive nodes for Jordan', () => {
    renderJourney('new')
    expect(screen.getByRole('heading', { name: 'Your Journey' })).toBeInTheDocument()
    expect(screen.getByText('Your Panther Passage')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Discover Your Pathway/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Build Your Graduation Readiness Plan/ })).toBeInTheDocument()
    expect(screen.queryByText(/Philander Smith College/i)).not.toBeInTheDocument()

    const map = screen.getByTestId('journey-path')
    expect(map.querySelector('img')).toHaveAttribute(
      'src',
      '/assets/panther-passage/04_Journey_Map/Mobile/Journey_Map_Campus_Artwork.png',
    )
    expect(map.querySelectorAll('a')).toHaveLength(0)
    expect(map.querySelectorAll('[data-milestone]')).toHaveLength(15)
    expect(map.querySelector('[data-slot="0"]')).toHaveAttribute('data-milestone', 'M01')
    expect(map.querySelector('[data-slot="1"]')).toHaveAttribute('data-milestone', 'M02')
    expect(map.querySelector('[data-slot="2"]')).toHaveAttribute('data-milestone', 'M03')
    const list = screen.getByRole('heading', { name: 'All fifteen steps' }).closest('section')!
    const listLinks = within(list).getAllByRole('link')
    expect(listLinks.filter((link) => link.hasAttribute('data-milestone'))).toHaveLength(15)
    expect(listLinks).toHaveLength(20)
    expect(list.querySelector('[data-milestone="M01"]')).toHaveAttribute('data-status', 'active')
    expect(list.querySelector('[data-milestone="M02"]')).toHaveAttribute('data-status', 'locked')
    expect(screen.getByTestId('journey-next')).toHaveTextContent('Discover Your Pathway')
    const progress = screen.getByLabelText('Graduation progress')
    expect(progress).toHaveTextContent(/42 days until Baccalaureate/)
    expect(progress).not.toHaveTextContent(/Preparation/)
  })

  it('marks Avery’s completed first milestones and keeps later nodes locked or available', () => {
    renderJourney('in-progress')
    const list = screen.getByRole('heading', { name: 'All fifteen steps' }).closest('section')!
    expect(list.querySelector('[data-milestone="M01"]')).toHaveAttribute('data-status', 'completed')
    expect(list.querySelector('[data-milestone="M02"]')).toHaveAttribute('data-status', 'completed')
    expect(list.querySelector('[data-milestone="M08"]')).toHaveAttribute('data-status', 'active')
    const map = screen.getByTestId('journey-path')
    expect(map.querySelector('[data-slot="0"]')).toHaveAttribute('data-milestone', 'M01')
    expect(map.querySelector('[data-milestone="M04"]')).not.toBeNull()
    expect(map.querySelector('[data-milestone="M08"]')).toHaveAttribute('data-status', 'active')
    expect(list.querySelector('[data-milestone="M15"]')).toHaveAttribute('data-status', 'locked')
    expect(screen.getByTestId('journey-next')).toHaveTextContent('Choose a Next Opportunity')
  })

  it('keeps Morgan one required step from the threshold', () => {
    const store = renderJourney('almost-graduated')
    const list = screen.getByRole('heading', { name: 'All fifteen steps' }).closest('section')!
    expect(list.querySelector('[data-milestone="M14"]')).toHaveAttribute('data-status', 'completed')
    expect(list.querySelector('[data-milestone="M15"]')).toHaveAttribute('data-status', 'active')
    cleanup()
    render(<App store={store} router="memory" initialPath="/readiness" now={now} />)
    expect(screen.getByText(/10 of 11 required steps are complete/)).toBeInTheDocument()
    expect(screen.getByText(/42 days until Baccalaureate/)).toBeInTheDocument()
  })

  it('opens the step pop-up for that milestone and starts it, not a résumé fallback', async () => {
    const user = userEvent.setup()
    renderJourney('new')
    await user.click(screen.getByRole('button', { name: /Discover Your Pathway/ }))
    const popover = screen.getByTestId('node-popover')
    await user.click(within(popover).getByRole('button', { name: /Start step/ }))
    expect(screen.getByRole('heading', { name: 'Discover Your Pathway' })).toBeInTheDocument()
  })

  it('opens milestone detail from the structured list and persists after remount', async () => {
    const user = userEvent.setup()
    const store = createMemoryStore()
    activateScenario(store, getCatalog(), 'in-progress', now)
    const first = render(<App store={store} router="memory" initialPath="/journey" now={now} />)
    const list = screen.getByRole('heading', { name: 'All fifteen steps' }).closest('section')!
    await user.click(within(list).getByRole('link', { name: /Discover Your Pathway/ }))
    expect(screen.getByRole('heading', { name: 'Discover Your Pathway' })).toBeInTheDocument()
    expect(screen.getByText(/Completed/)).toBeInTheDocument()
    first.unmount()

    render(<App store={store} router="memory" initialPath="/journey" now={now} />)
    const restored = screen.getByRole('heading', { name: 'All fifteen steps' }).closest('section')!
    expect(restored.querySelector('[data-milestone="M01"]')).toHaveAttribute(
      'data-status',
      'completed',
    )
  })

  it('shows an unlock message for a locked node and closes the pop-up with Escape', async () => {
    const user = userEvent.setup()
    renderJourney('new')
    const lockedNode = screen
      .getByTestId('journey-path')
      .querySelector('[data-milestone="M02"]') as HTMLButtonElement
    expect(lockedNode).not.toBeNull()
    await user.click(lockedNode)
    const popover = screen.getByTestId('node-popover')
    expect(within(popover).getByText(/Opens after M01/)).toBeInTheDocument()
    expect(within(popover).queryByRole('button', { name: /Start step/ })).toBeNull()
    await user.keyboard('{Escape}')
    await waitForElementToBeRemoved(() => screen.queryByTestId('node-popover'))
  })

  it('keeps the official four-item navigation and a keyboard profile control', () => {
    renderJourney('new')
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(nav).toHaveTextContent('Home')
    expect(nav).toHaveTextContent('My Passage')
    expect(nav).toHaveTextContent('Explore')
    expect(nav).toHaveTextContent('My Chapter')
    const profiles = screen.getAllByRole('link', { name: 'Profile' })
    expect(profiles.length).toBeGreaterThan(0)
    for (const link of profiles) expect(link).toHaveAttribute('href', '/profile')
  })
})
