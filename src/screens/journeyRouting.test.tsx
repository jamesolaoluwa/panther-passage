import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { getCatalog } from '../data/catalog'
import { studentStorageKey, writeProgress } from '../domain/persistence'
import { activateScenario, createMemoryStore } from '../domain/persistence'
import { PRESENTER_TODAY } from '../domain/passageCalendar'
import { withTaskUpdate } from '../domain/progression'
import type { OnboardingProfile, UserProgress } from '../data/schemas'

const now = PRESENTER_TODAY
const catalog = getCatalog()

function renderAt(path: string, scenario: 'new' | 'in-progress' | 'almost-graduated' = 'new', progress?: UserProgress) {
  const store = createMemoryStore()
  if (progress) writeProgress(store, progress)
  else activateScenario(store, catalog, scenario, now)
  const view = render(<App store={store} router="memory" initialPath={path} now={now} />)
  return { store, ...view }
}

function profile(pathway: string, priorities: string[]): OnboardingProfile {
  return {
    firstName: 'Ada',
    lastName: 'Demo',
    studentId: 'S-000',
    major: '',
    graduationTerm: 'spring-2027',
    step1Complete: true,
    pathway,
    priorities,
  }
}

describe('milestone routes', () => {
  it('opens each milestone on its own title, chapter, tasks, and resources', () => {
    for (const milestone of catalog.milestones) {
      const { unmount } = renderAt(`/journey/${milestone.id}`, 'new')
      expect(screen.getByRole('heading', { level: 1, name: milestone.title })).toBeInTheDocument()
      expect(screen.getByText(new RegExp(`Chapter ${milestone.chapterId}`))).toBeInTheDocument()
      expect(screen.getByText(new RegExp(`Milestone ${milestone.id}`))).toBeInTheDocument()
      expect(screen.getByText(milestone.required ? /Required/ : /Optional/)).toBeInTheDocument()
      const tasks = catalog.tasks.filter((task) => task.milestoneId === milestone.id)
      expect(tasks).toHaveLength(3)
      for (const task of tasks) {
        expect(screen.getByRole('button', { name: new RegExp(task.label) })).toBeInTheDocument()
      }
      const resources = catalog.resources.filter((resource) => resource.associatedMilestones.includes(milestone.id))
      for (const resource of resources) {
        expect(screen.getByRole('link', { name: new RegExp(resource.title) })).toHaveAttribute(
          'href',
          `/resources?open=${resource.id}`,
        )
      }
      if (milestone.id !== 'M04') {
        expect(screen.queryByRole('heading', { name: 'A person reviews this resume' })).not.toBeInTheDocument()
      }
      unmount()
    }
  }, 30000)

  it('opens the requested task and refuses a task from another milestone', async () => {
    const exact = renderAt('/journey/M01?task=T012')
    expect(screen.getByRole('dialog')).toHaveTextContent('Write the goals and interests you want to keep')
    exact.unmount()

    renderAt('/journey/M02?task=T043')
    expect(screen.getByRole('heading', { name: 'Build Your Graduation Readiness Plan' })).toBeInTheDocument()
    expect(screen.getByText('That action is not part of this step.')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Build Your Resume/ })).not.toBeInTheDocument()
  })

  it('sends an unknown milestone back to the passage overview', () => {
    renderAt('/journey/M99')
    expect(screen.getByRole('heading', { name: 'That step is not on this passage.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to My Passage' })).toHaveAttribute('href', '/journey')
    expect(screen.queryByRole('link', { name: /Build Your Resume/ })).not.toBeInTheDocument()
  })
})

describe('chapter entry points', () => {
  it('opens each chapter on its own milestones', async () => {
    const user = userEvent.setup()
    renderAt('/journey', 'in-progress')
    const toolkit = screen.getAllByRole('link').find((link) => link.getAttribute('href') === '/journey/chapter/P2')
    await user.click(toolkit!)
    expect(screen.getByRole('heading', { name: 'Build Your Toolkit' })).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'Steps in this chapter' })
    expect(within(list).getByRole('link', { name: /M04/ })).toHaveAttribute('href', '/journey/M04')
    expect(within(list).getByRole('link', { name: /M05/ })).toHaveAttribute('href', '/journey/M05')
    expect(within(list).getByRole('link', { name: /M06/ })).toHaveAttribute('href', '/journey/M06')
    expect(within(list).queryByRole('link', { name: /M01/ })).not.toBeInTheDocument()
  })

  it('does not turn a locked chapter dot into the résumé milestone', async () => {
    const user = userEvent.setup()
    renderAt('/journey')
    const chapter = screen.getAllByRole('link').find((link) => link.getAttribute('href') === '/journey/chapter/P4')
    await user.click(chapter!)
    expect(screen.getByRole('heading', { name: /Ready for What/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Build Your Resume' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Map Your Money/ })).toHaveAttribute('href', '/journey/M10')
  })
})

describe('goal personalization', () => {
  it('keeps an entrepreneurship dashboard off the résumé milestone and preserves completed work', () => {
    const store = createMemoryStore()
    activateScenario(store, catalog, 'new', now)
    const saved = JSON.parse(store.getItem(studentStorageKey('S-A'))!) as UserProgress
    let progress = saved
    for (const task of catalog.tasks.filter((item) => item.milestoneId === 'M01' || item.milestoneId === 'M02')) {
      progress = withTaskUpdate(progress, catalog.milestones, catalog.tasks, task.id, true, 'A saved note', now)
    }
    const completedBefore = [...progress.completedMilestoneIds]
    progress = {
      ...progress,
      onboardingProfile: profile('entrepreneurship', ['financial-independence', 'life-after-graduation']),
    }
    writeProgress(store, progress)
    render(<App store={store} router="memory" initialPath="/home" now={now} />)
    expect(screen.getByRole('link', { name: 'Continue the passage' })).toHaveAttribute('href', '/journey/M03')
    expect(screen.queryByRole('link', { name: 'Open this step' })).not.toBeInTheDocument()
    expect(screen.queryByText('Resume quality checklist')).not.toBeInTheDocument()
    const reread = JSON.parse(store.getItem(studentStorageKey('S-A'))!) as UserProgress
    expect(reread.completedMilestoneIds).toEqual(completedBefore)
    expect(reread.onboardingProfile?.pathway).toBe('entrepreneurship')
  })

  it('recommends career preparation when that is the selected pathway', () => {
    const store = createMemoryStore()
    activateScenario(store, catalog, 'new', now)
    let progress = JSON.parse(store.getItem(studentStorageKey('S-A'))!) as UserProgress
    for (const task of catalog.tasks.filter((item) => item.milestoneId === 'M01' || item.milestoneId === 'M02')) {
      progress = withTaskUpdate(progress, catalog.milestones, catalog.tasks, task.id, true, 'A saved note', now)
    }
    progress = { ...progress, onboardingProfile: profile('career', ['career-readiness']) }
    writeProgress(store, progress)
    render(<App store={store} router="memory" initialPath="/home" now={now} />)
    expect(screen.getByRole('link', { name: 'Open this step' })).toHaveAttribute('href', '/journey/M04')
  })

  it('points My Chapter preparation at life planning for a graduate-school student', () => {
    renderAt('/next-chapter/prepare', 'in-progress')
    expect(screen.getByRole('heading', { name: 'What you need to prepare' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Create Your 30-Day Launch Plan/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Build Your Resume/ })).not.toBeInTheDocument()
  })
})

describe('optional faith', () => {
  it('saves a prayer without changing milestone progress', async () => {
    const user = userEvent.setup()
    const { store } = renderAt('/reflections/faith?focus=M11', 'in-progress')
    const before = JSON.parse(store.getItem(studentStorageKey('S-B'))!) as UserProgress
    await user.type(screen.getAllByRole('textbox', { name: 'Your writing' })[1], 'Keep me steady this month.')
    await user.click(screen.getAllByRole('button', { name: 'Save reflection' })[1])
    expect(screen.getByRole('status')).toHaveTextContent(/does not change your passage progress/)
    const after = JSON.parse(store.getItem(studentStorageKey('S-B'))!) as UserProgress
    expect(after.completedMilestoneIds).toEqual(before.completedMilestoneIds)
    expect(after.reflections.prayer?.text).toContain('Keep me steady')
  })
})
