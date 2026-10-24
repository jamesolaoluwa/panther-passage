import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { ACTIVE_STUDENT_KEY, createMemoryStore, studentStorageKey, type KeyValueStore } from '../domain/persistence'
import { WELCOME_DESCRIPTION } from './WelcomeScreen'

const now = new Date(2026, 9, 23)

function renderOnboarding(store: KeyValueStore = createMemoryStore()) {
  render(<App store={store} router="memory" initialPath="/onboarding" now={now} />)
  return store
}

function savedProgress(store: KeyValueStore) {
  const id = store.getItem(ACTIVE_STUDENT_KEY)!
  return JSON.parse(store.getItem(studentStorageKey(id))!)
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'First name' }), 'Taylor')
  await user.type(screen.getByRole('textbox', { name: 'Last name' }), 'Demo')
  await user.type(screen.getByRole('textbox', { name: 'Student ID number' }), '000123')
  await user.selectOptions(screen.getByRole('combobox', { name: 'What are you studying?' }), 'computer-science')
  await user.selectOptions(screen.getByRole('combobox', { name: 'When are you graduating?' }), 'spring-2027')
}

describe('onboarding step 1', () => {
  it('matches the approved copy and field order with labelled, required controls', () => {
    renderOnboarding()
    expect(screen.getByRole('heading', { level: 1, name: 'Tell us about yourself.' })).toBeInTheDocument()
    expect(
      screen.getByText('A few details will help us personalize your Panther Passage experience.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()

    const first = screen.getByRole('textbox', { name: 'First name' })
    expect(first).toBeRequired()
    expect(first).toHaveAttribute('placeholder', 'Enter your first name')
    expect(first).toHaveAttribute('autocomplete', 'given-name')
    expect(screen.getByRole('textbox', { name: 'Last name' })).toHaveAttribute('autocomplete', 'family-name')
    expect(screen.getByRole('textbox', { name: 'Student ID number' })).toBeRequired()
    expect(screen.getByRole('combobox', { name: 'What are you studying?' })).not.toBeRequired()
    expect(screen.getByRole('combobox', { name: 'When are you graduating?' })).toBeRequired()
    expect(screen.getByRole('group', { name: /not official programs/ })).toBeInTheDocument()

    expect(screen.queryByRole('navigation', { name: 'Primary' })).not.toBeInTheDocument()
    expect(screen.queryByText(/You can update these details later/i)).not.toBeInTheDocument()
  })

  it('uses the approved campus footer as decorative artwork and stays usable without it', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <App store={createMemoryStore()} router="memory" initialPath="/onboarding" now={now} />,
    )
    const footer = container.querySelector('[data-testid="onboarding-campus-footer"]')!
    const art = footer.querySelector('img')!
    expect(art).toHaveAttribute('src', '/assets/panther-passage/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png')
    expect(art).toHaveAttribute('alt', '')
    expect(footer).toHaveAttribute('aria-hidden', 'true')
    fireEvent.error(art)
    expect(container.querySelector('[data-testid="onboarding-campus-footer"] img')).toBeNull()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: 'What’s next for you?' })).toBeInTheDocument()
  })

  it('shows field errors, marks them invalid, and focuses the first problem', async () => {
    const user = userEvent.setup()
    renderOnboarding()
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    const first = screen.getByRole('textbox', { name: 'First name' })
    expect(first).toHaveFocus()
    expect(first).toHaveAttribute('aria-invalid', 'true')
    expect(first).toHaveAccessibleDescription('Enter your first name.')
    expect(screen.getByRole('textbox', { name: 'Student ID number' })).toHaveAccessibleDescription(
      'Enter your student ID number.',
    )
    expect(screen.getByRole('combobox', { name: 'When are you graduating?' })).toHaveAccessibleDescription(
      'Choose when you are graduating.',
    )
    expect(screen.getByRole('combobox', { name: 'What are you studying?' })).toHaveAttribute('aria-invalid', 'false')

    await user.type(first, 'Taylor')
    expect(first).toHaveAttribute('aria-invalid', 'false')
    expect(screen.queryByText('Enter your first name.')).not.toBeInTheDocument()
  })

  it('saves valid answers separately from the fictional student and opens step 2', async () => {
    const user = userEvent.setup()
    const store = renderOnboarding()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByRole('heading', { name: 'What’s next for you?' })).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()

    const progress = savedProgress(store)
    expect(progress.onboardingProfile).toEqual({
      firstName: 'Taylor',
      lastName: 'Demo',
      studentId: '000123',
      major: 'computer-science',
      graduationTerm: 'spring-2027',
      step1Complete: true,
      pathway: '',
      priorities: [],
    })
    expect(progress.onboardingComplete).toBe(false)
    expect(progress.studentId).toBe('S-A')
  })

  it('restores entered answers after a refresh', async () => {
    const user = userEvent.setup()
    const store = createMemoryStore()
    const first = render(<App store={store} router="memory" initialPath="/onboarding" now={now} />)
    await user.type(screen.getByRole('textbox', { name: 'First name' }), 'Taylor')
    await user.type(screen.getByRole('textbox', { name: 'Student ID number' }), '0042')
    first.unmount()

    renderOnboarding(store)
    expect(screen.getByRole('textbox', { name: 'First name' })).toHaveValue('Taylor')
    expect(screen.getByRole('textbox', { name: 'Student ID number' })).toHaveValue('0042')
  })

  it('follows the visual order with the keyboard and returns to welcome from the back arrow', async () => {
    const user = userEvent.setup()
    renderOnboarding()
    const order = [
      screen.getByRole('link', { name: 'Back to welcome' }),
      screen.getByRole('textbox', { name: 'First name' }),
      screen.getByRole('textbox', { name: 'Last name' }),
      screen.getByRole('textbox', { name: 'Student ID number' }),
      screen.getByRole('combobox', { name: 'What are you studying?' }),
      screen.getByRole('combobox', { name: 'When are you graduating?' }),
      screen.getByRole('button', { name: 'Continue' }),
    ]
    for (const element of order) {
      await user.tab()
      expect(element).toHaveFocus()
    }

    await user.click(order[0])
    expect(screen.getByRole('img', { name: WELCOME_DESCRIPTION })).toBeInTheDocument()
  })
})
