import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { ACTIVE_STUDENT_KEY, createMemoryStore, studentStorageKey, type KeyValueStore } from '../domain/persistence'

const now = new Date(2026, 9, 23)
const footerSrc = '/assets/panther-passage/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png'

function renderApp(store: KeyValueStore, path = '/onboarding') {
  render(<App store={store} router="memory" initialPath={path} now={now} />)
}

function savedProgress(store: KeyValueStore) {
  const id = store.getItem(ACTIVE_STUDENT_KEY)!
  return JSON.parse(store.getItem(studentStorageKey(id))!)
}

async function completeStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'First name' }), 'Taylor')
  await user.type(screen.getByRole('textbox', { name: 'Last name' }), 'Demo')
  await user.type(screen.getByRole('textbox', { name: 'Student ID number' }), '000123')
  await user.selectOptions(screen.getByRole('combobox', { name: 'When are you graduating?' }), 'spring-2027')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('onboarding steps 2–4', () => {
  it('uses one approved footer on every step and keeps it behind the controls', async () => {
    const user = userEvent.setup()
    renderApp(createMemoryStore())
    await completeStep1(user)

    const footer = screen.getByTestId('onboarding-campus-footer')
    expect(footer.querySelector('img')).toHaveAttribute('src', footerSrc)
    expect(footer.querySelector('img')).toHaveAttribute('alt', '')
    expect(footer).toHaveClass('pointer-events-none')

    await user.click(screen.getByRole('radio', { name: /Start My Career/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByTestId('onboarding-campus-footer').querySelector('img')).toHaveAttribute('src', footerSrc)

    await user.click(screen.getByRole('checkbox', { name: /Career Readiness/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByTestId('onboarding-campus-footer').querySelector('img')).toHaveAttribute('src', footerSrc)
  })

  it('treats step 2 as a single choice and remembers it after a refresh', async () => {
    const user = userEvent.setup()
    const store = createMemoryStore()
    const first = render(<App store={store} router="memory" initialPath="/onboarding" now={now} />)
    await completeStep1(user)
    await user.click(screen.getByRole('radio', { name: /Start a Business/ }))
    expect(screen.getByRole('radio', { name: /Start a Business/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Start My Career/ })).not.toBeChecked()
    first.unmount()

    renderApp(store, '/onboarding/direction')
    expect(screen.getByRole('radio', { name: /Start a Business/ })).toBeChecked()
    expect(savedProgress(store).onboardingProfile.pathway).toBe('entrepreneurship')
  })

  it('requires a direction and at least one priority, then shows the actual answers on step 4', async () => {
    const user = userEvent.setup()
    renderApp(createMemoryStore())
    await completeStep1(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Choose the direction you’re considering to continue.')

    await user.click(screen.getByRole('radio', { name: /Continue My Education/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: 'What matters most to you?' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Choose at least one area to focus on.')

    await user.click(screen.getByRole('checkbox', { name: /Wellness & Balance/ }))
    await user.click(screen.getByRole('checkbox', { name: /Leadership & Legacy/ }))
    await user.click(screen.getByRole('checkbox', { name: /Wellness & Balance/ }))
    expect(screen.getByRole('checkbox', { name: /Wellness & Balance/ })).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your journey')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('starts here.')
    expect(screen.getByRole('heading', { name: 'Your pathway' }).parentElement).toHaveTextContent('Continue My Education')
    expect(screen.getByRole('list')).toHaveTextContent('Leadership & Legacy')
    expect(screen.getByRole('list')).not.toHaveTextContent('Career Readiness')
  })

  it('returns through the steps without losing answers and sends skipped URLs back', async () => {
    const user = userEvent.setup()
    renderApp(createMemoryStore(), '/onboarding/confirmation')
    expect(screen.getByRole('heading', { name: 'Tell us about yourself.' })).toBeInTheDocument()

    await completeStep1(user)
    await user.click(screen.getByRole('radio', { name: /Still Exploring/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('checkbox', { name: /Life After Graduation/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('link', { name: 'Back to step 3' }))
    expect(screen.getByRole('checkbox', { name: /Life After Graduation/ })).toBeChecked()
    await user.click(screen.getByRole('link', { name: 'Back to step 2' }))
    expect(screen.getByRole('radio', { name: /Still Exploring/ })).toBeChecked()
  })

  it('marks onboarding complete without changing fictional milestone progress', async () => {
    const user = userEvent.setup()
    const store = createMemoryStore()
    renderApp(store)
    await completeStep1(user)
    await user.click(screen.getByRole('radio', { name: /Start My Career/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('checkbox', { name: /Career Readiness/ }))
    await user.click(screen.getByRole('checkbox', { name: /Financial Independence/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Enter My Journey' }))

    expect(screen.getByRole('heading', { name: 'Your passage opens soon.' })).toBeInTheDocument()
    const progress = savedProgress(store)
    expect(progress.onboardingComplete).toBe(true)
    expect(progress.completedMilestoneIds).toEqual([])
    expect(progress.onboardingProfile.pathway).toBe('career')
    expect(progress.onboardingProfile.priorities).toEqual(['career-readiness', 'financial-independence'])
    expect(progress.studentId).toBe('S-A')
  })
})
