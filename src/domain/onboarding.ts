import type { OnboardingProfile } from '../data/schemas'

export type ProfileField = 'firstName' | 'lastName' | 'studentId' | 'major' | 'graduationTerm'
export type ProfileErrors = Partial<Record<ProfileField, string>>

export interface SelectOption {
  value: string
  label: string
}

/** Provisional sample list. No verified Philander Smith University program list is in the workspace. */
export const MAJOR_OPTIONS_GROUP_LABEL = 'Sample majors (demo list, not official programs)'
export const MAJOR_OPTIONS: SelectOption[] = [
  { value: 'biology', label: 'Biology' },
  { value: 'business-administration', label: 'Business Administration' },
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'criminal-justice', label: 'Criminal Justice' },
  { value: 'education', label: 'Education' },
  { value: 'english', label: 'English' },
  { value: 'mass-communication', label: 'Mass Communication' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'social-work', label: 'Social Work' },
  { value: 'undeclared', label: 'Undeclared' },
  { value: 'other', label: 'Other or not listed' },
]

/**
 * Terms only. The demo seed graduation date (2027-05-15) is the single documented date,
 * so a selected term is never converted into an exact graduation date here.
 */
export const GRADUATION_OPTIONS_GROUP_LABEL = 'Demo terms'
export const GRADUATION_OPTIONS: SelectOption[] = [
  { value: 'fall-2026', label: 'Fall 2026' },
  { value: 'spring-2027', label: 'Spring 2027' },
  { value: 'summer-2027', label: 'Summer 2027' },
  { value: 'fall-2027', label: 'Fall 2027' },
  { value: 'spring-2028', label: 'Spring 2028' },
  { value: 'not-sure', label: 'Not sure yet' },
]

export const NAME_MAX = 50
export const STUDENT_ID_MAX = 20

export const emptyProfile: OnboardingProfile = {
  firstName: '',
  lastName: '',
  studentId: '',
  major: '',
  graduationTerm: '',
  step1Complete: false,
  pathway: '',
  priorities: [],
}

export function hydrateProfile(profile?: OnboardingProfile | null): OnboardingProfile {
  return {
    ...emptyProfile,
    ...profile,
    priorities: profile?.priorities ?? [],
  }
}

export type OnboardingStep = 1 | 2 | 3 | 4

export const ONBOARDING_ROUTES: Record<OnboardingStep, string> = {
  1: '/onboarding',
  2: '/onboarding/direction',
  3: '/onboarding/priorities',
  4: '/onboarding/confirmation',
}

/** Aligns with the fictional student `pathway` values already in students.json, plus exploring. */
export const PATHWAY_OPTIONS = [
  {
    id: 'career',
    title: 'Start My Career',
    description: 'Find opportunities and prepare for professional life.',
  },
  {
    id: 'graduate-school',
    title: 'Continue My Education',
    description: 'Explore graduate school and further studies.',
  },
  {
    id: 'entrepreneurship',
    title: 'Start a Business',
    description: 'Turn your ideas into something of your own.',
  },
  {
    id: 'exploring',
    title: 'Still Exploring',
    description: 'Discover possibilities and figure out your next steps.',
  },
] as const

export const PRIORITY_OPTIONS = [
  {
    id: 'career-readiness',
    title: 'Career Readiness',
    description: 'Professional direction, mentorship, and purposeful work.',
  },
  {
    id: 'financial-independence',
    title: 'Financial Independence',
    description: 'Budgeting, savings, and managing money.',
  },
  {
    id: 'networking-mentorship',
    title: 'Networking & Mentorship',
    description: 'Building meaningful professional connections.',
  },
  {
    id: 'wellness-balance',
    title: 'Wellness & Balance',
    description: 'Managing stress and preparing for change.',
  },
  {
    id: 'life-after-graduation',
    title: 'Life After Graduation',
    description: 'Housing, relocation, and independent living.',
  },
  {
    id: 'leadership-legacy',
    title: 'Leadership & Legacy',
    description: 'Making an impact and staying connected.',
  },
] as const

export function pathwayOption(id: string) {
  return PATHWAY_OPTIONS.find((option) => option.id === id)
}

export function selectedPriorities(ids: string[]) {
  return PRIORITY_OPTIONS.filter((option) => ids.includes(option.id))
}

export function togglePriority(ids: string[], id: string): string[] {
  if (!PRIORITY_OPTIONS.some((option) => option.id === id)) return ids
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

export function firstIncompleteStep(profile?: OnboardingProfile | null): OnboardingStep {
  const current = hydrateProfile(profile)
  if (Object.keys(validateProfile(current)).length > 0 || !current.step1Complete) return 1
  if (!pathwayOption(current.pathway)) return 2
  if (selectedPriorities(current.priorities).length === 0) return 3
  return 4
}

const hasLetter = /\p{L}/u
const studentIdPattern = /^[A-Za-z0-9-]+$/

function validateName(value: string, label: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return `Enter your ${label}.`
  if (trimmed.length > NAME_MAX) return `Use ${NAME_MAX} characters or fewer.`
  if (!hasLetter.test(trimmed)) return `Your ${label} needs at least one letter.`
  return undefined
}

export function validateProfile(profile: OnboardingProfile): ProfileErrors {
  const errors: ProfileErrors = {}
  const firstName = validateName(profile.firstName, 'first name')
  if (firstName) errors.firstName = firstName
  const lastName = validateName(profile.lastName, 'last name')
  if (lastName) errors.lastName = lastName

  const studentId = profile.studentId.trim()
  if (!studentId) errors.studentId = 'Enter your student ID number.'
  else if (studentId.length > STUDENT_ID_MAX) errors.studentId = `Use ${STUDENT_ID_MAX} characters or fewer.`
  else if (!studentIdPattern.test(studentId)) errors.studentId = 'Use only letters, numbers, and hyphens.'

  if (profile.major && !MAJOR_OPTIONS.some((option) => option.value === profile.major)) {
    errors.major = 'Choose a major from the list.'
  }
  if (!profile.graduationTerm) errors.graduationTerm = 'Choose when you are graduating.'
  else if (!GRADUATION_OPTIONS.some((option) => option.value === profile.graduationTerm)) {
    errors.graduationTerm = 'Choose a graduation term from the list.'
  }
  return errors
}

export function normalizeProfile(profile: OnboardingProfile): OnboardingProfile {
  return {
    ...profile,
    firstName: profile.firstName.trim(),
    lastName: profile.lastName.trim(),
    studentId: profile.studentId.trim(),
  }
}

export const PROFILE_FIELD_ORDER: ProfileField[] = ['firstName', 'lastName', 'studentId', 'major', 'graduationTerm']
