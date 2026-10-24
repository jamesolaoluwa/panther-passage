import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { getCatalog } from '../data/catalog'
import type { UserProgress } from '../data/schemas'
import { scriptureForDate, secularReflectionKey, verseReflectionKey } from '../domain/dailyScripture'
import { PRESENTER_TODAY } from '../domain/passageCalendar'
import { activateScenario, createMemoryStore, studentStorageKey } from '../domain/persistence'

const now = PRESENTER_TODAY

function renderAt(path: string, scenario: 'new' | 'in-progress' = 'in-progress', clock = now) {
  const store = createMemoryStore()
  activateScenario(store, getCatalog(), scenario, clock)
  render(<App store={store} router="memory" initialPath={path} now={clock} />)
  return store
}

describe('scripture header', () => {
  it('replaces the shell statistics with a scripture preview and keeps the logo and profile', () => {
    renderAt('/home')
    const banner = screen.getByRole('banner')
    expect(within(banner).getByRole('link', { name: 'Panther Passage' })).toBeInTheDocument()
    expect(within(banner).getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
    expect(banner).toHaveTextContent('Scripture of the Day')
    expect(banner).toHaveTextContent(scriptureForDate(now).text)
    expect(banner).toHaveTextContent(scriptureForDate(now).reference)
    expect(banner.querySelector('[data-icon="praying-hands"]')).toBeTruthy()
    expect(within(banner).getByRole('link', { name: "Read Today's Prayer" })).toHaveAttribute('href', '/reflections/prayer')
    expect(within(banner).queryByRole('link', { name: 'Reflect on This' })).not.toBeInTheDocument()
    expect(banner).not.toHaveTextContent('Avery Brooks')
    expect(banner).not.toHaveTextContent(/days until graduation/)
    expect(banner).not.toHaveTextContent(/Preparation/)
    expect(banner).not.toHaveTextContent(/Readiness/)
  })

  it('keeps the graduation countdown on Home, larger inside the last hundred days', () => {
    renderAt('/home', 'in-progress')
    expect(screen.getByText('42 days until Baccalaureate')).toBeInTheDocument()
    expect(screen.getByText('The last hundred days')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See your readiness' })).toHaveAttribute('href', '/readiness')
    expect(screen.queryByRole('progressbar', { name: 'Preparation, all 15 steps' })).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar', { name: 'Readiness, 11 required steps' })).not.toBeInTheDocument()

    renderAt('/home', 'in-progress', new Date(2027, 0, 1))
    expect(screen.getByRole('heading', { name: 'Your passage opens soon.' })).toBeInTheDocument()
    expect(screen.getByText(/Your passage opens January 29/)).toBeInTheDocument()
  })

  it('opens today’s prayer and saves a reflection without changing progress', async () => {
    const user = userEvent.setup()
    const store = renderAt('/home')
    const before = JSON.parse(store.getItem(studentStorageKey('S-B'))!) as UserProgress
    await user.click(screen.getByRole('link', { name: "Read Today's Prayer" }))
    expect(screen.getByRole('heading', { name: "Today's prayer" })).toBeInTheDocument()
    expect(screen.getByText(scriptureForDate(now).prayer)).toBeInTheDocument()
    await user.click(within(screen.getByRole('main')).getByRole('link', { name: 'Reflect on This' }))
    await user.type(screen.getByRole('textbox', { name: 'Your thoughts' }), 'I want the next season to be honest.')
    await user.click(screen.getByRole('button', { name: 'Save this reflection' }))
    expect(screen.getByRole('status')).toHaveTextContent(/does not change your passage progress/)
    const after = JSON.parse(store.getItem(studentStorageKey('S-B'))!) as UserProgress
    expect(after.completedMilestoneIds).toEqual(before.completedMilestoneIds)
    expect(after.reflections[verseReflectionKey(scriptureForDate(now).id)]?.text).toContain('honest')
    await user.type(screen.getByRole('textbox', { name: 'Your reflection' }), 'I will name one next action.')
    await user.click(screen.getByRole('button', { name: 'Save the nonreligious reflection' }))
    const secular = JSON.parse(store.getItem(studentStorageKey('S-B'))!) as UserProgress
    expect(secular.reflections[secularReflectionKey(scriptureForDate(now).id)]?.text).toContain('next action')
    expect(secular.completedMilestoneIds).toEqual(before.completedMilestoneIds)
  })
})
