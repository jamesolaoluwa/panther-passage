import {
  emptyProfile,
  firstIncompleteStep,
  normalizeProfile,
  selectedPriorities,
  togglePriority,
  validateProfile,
} from './onboarding'

const valid = {
  ...emptyProfile,
  firstName: 'Taylor',
  lastName: 'Demo',
  studentId: '000123',
  graduationTerm: 'spring-2027',
}

describe('onboarding step 1 validation', () => {
  it('requires names, student ID and graduation term but not a major', () => {
    expect(validateProfile(emptyProfile)).toEqual({
      firstName: 'Enter your first name.',
      lastName: 'Enter your last name.',
      studentId: 'Enter your student ID number.',
      graduationTerm: 'Choose when you are graduating.',
    })
    expect(validateProfile(valid)).toEqual({})
  })

  it('rejects whitespace-only names, names without letters, and unknown options', () => {
    const errors = validateProfile({ ...valid, firstName: '   ', lastName: '12', major: 'astrology', graduationTerm: '2031' })
    expect(errors.firstName).toBe('Enter your first name.')
    expect(errors.lastName).toBe('Your last name needs at least one letter.')
    expect(errors.major).toBe('Choose a major from the list.')
    expect(errors.graduationTerm).toBe('Choose a graduation term from the list.')
  })

  it('keeps the student ID as a string with its leading zeros', () => {
    expect(normalizeProfile({ ...valid, studentId: '  000123 ' }).studentId).toBe('000123')
    expect(validateProfile({ ...valid, studentId: '00 12' }).studentId).toBe('Use only letters, numbers, and hyphens.')
    expect(validateProfile({ ...valid, studentId: '1'.repeat(21) }).studentId).toBe('Use 20 characters or fewer.')
  })
})

describe('onboarding steps 2–4', () => {
  const step1 = { ...emptyProfile, ...valid, step1Complete: true }

  it('keeps step 1 incomplete until the profile is valid and marked complete', () => {
    expect(firstIncompleteStep(emptyProfile)).toBe(1)
    expect(firstIncompleteStep({ ...step1, step1Complete: false })).toBe(1)
    expect(firstIncompleteStep(step1)).toBe(2)
  })

  it('requires a known pathway before priorities, and at least one priority before confirmation', () => {
    expect(firstIncompleteStep({ ...step1, pathway: 'career' })).toBe(3)
    expect(firstIncompleteStep({ ...step1, pathway: 'career', priorities: ['career-readiness'] })).toBe(4)
    expect(firstIncompleteStep({ ...step1, pathway: 'astrology' })).toBe(2)
  })

  it('toggles priorities without inventing unknown ids', () => {
    expect(togglePriority([], 'career-readiness')).toEqual(['career-readiness'])
    expect(togglePriority(['career-readiness'], 'career-readiness')).toEqual([])
    expect(togglePriority(['career-readiness'], 'not-a-priority')).toEqual(['career-readiness'])
    expect(selectedPriorities(['career-readiness', 'wellness-balance']).map((item) => item.title)).toEqual([
      'Career Readiness',
      'Wellness & Balance',
    ])
  })
})
