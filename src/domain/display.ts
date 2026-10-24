import type { OnboardingProfile, Student } from '../data/schemas'

export function givenName(student: Student, profile?: OnboardingProfile): string {
  const typed = profile?.firstName?.trim()
  if (typed) return typed
  return student.name.split(' ')[0] || student.name
}
