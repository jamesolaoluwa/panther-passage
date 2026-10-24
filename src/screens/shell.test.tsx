import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { PRESENTER_TODAY } from '../domain/passageCalendar'
import { createMemoryStore } from '../domain/persistence'
import { WELCOME_DESCRIPTION } from './WelcomeScreen'

const now = PRESENTER_TODAY

function renderShell(path = '/') {
  return render(<App store={createMemoryStore()} router="memory" initialPath={path} now={now} />)
}

describe('mobile shell', () => {
  it('starts Jordan on the image-only welcome screen with nothing drawn over it', () => {
    renderShell()
    expect(screen.getByRole('img', { name: WELCOME_DESCRIPTION })).toHaveAttribute(
      'src',
      '/assets/panther-passage/03_Welcome/Welcome_Approved_Frameless.png',
    )
    const getStarted = screen.getByRole('button', { name: 'Get Started' })
    expect(getStarted).toBeEmptyDOMElement()
    expect(screen.queryByRole('navigation', { name: 'Primary' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Profile' })).not.toBeInTheDocument()
    expect(screen.queryByText(/days until graduation/)).not.toBeInTheDocument()
  })

  it('reaches onboarding from the keyboard with Tab and Enter', async () => {
    const user = userEvent.setup()
    renderShell()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Get Started' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Tell us about yourself.' })).toBeInTheDocument()
  })

  it('falls back to a readable welcome if the image fails to load', async () => {
    const user = userEvent.setup()
    renderShell()
    fireEvent.error(screen.getByRole('img', { name: WELCOME_DESCRIPTION }))
    expect(screen.getByRole('heading', { name: 'Panther Passage' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Get Started' }))
    expect(screen.getByRole('heading', { name: 'Tell us about yourself.' })).toBeInTheDocument()
  })

  it('shows the four destinations on the in-app screens', () => {
    renderShell('/home')
    expect(screen.getByRole('heading', { name: 'Your next step is ready.' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(nav).toHaveTextContent('Home')
    expect(nav).toHaveTextContent('My Passage')
    expect(nav).toHaveTextContent('Explore')
    expect(nav).toHaveTextContent('My Chapter')
  })

  it('lists fifteen milestone statuses without pretending the map is finished', async () => {
    const user = userEvent.setup()
    renderShell('/journey')
    expect(screen.getByTestId('journey-path').querySelector('img')).toHaveAttribute(
      'src',
      '/assets/panther-passage/04_Journey_Map/Mobile/Journey_Map_Campus_Artwork.png',
    )
    expect(screen.getAllByRole('link', { name: /M0|M1/ })).toHaveLength(15)
    await user.click(screen.getByRole('link', { name: /Discover Your Pathway/ }))
    expect(screen.getByRole('heading', { name: 'Discover Your Pathway' })).toBeInTheDocument()
  })
})
