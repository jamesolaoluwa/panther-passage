import type { Catalog, ScenarioId, Student, Task, UserProgress } from '../data/schemas'
import { retireRejectedActivities } from './progression'

export function studentForScenario(catalog: Catalog, scenarioId: ScenarioId): Student {
  const student = catalog.students.find((item) => item.scenario === scenarioId)
  if (!student) {
    throw new Error(`No fictional student is defined for ${scenarioId}.`)
  }
  return student
}

export function entryPathForScenario(scenarioId: ScenarioId): '/' | '/home' {
  return scenarioId === 'new' ? '/' : '/home'
}

export function seedProgress(student: Student, tasks: Task[], now = new Date()): UserProgress {
  const completed = new Set(student.completedMilestoneIds)
  const taskChecks: Record<string, boolean> = {}
  const answers: Record<string, string> = {}

  for (const task of tasks) {
    const done = completed.has(task.milestoneId)
    taskChecks[task.id] = done
    if (done) {
      answers[task.id] = 'Seeded demonstration response.'
    }
  }

  return retireRejectedActivities({
    schemaVersion: 1,
    studentId: student.id,
    scenarioId: student.scenario,
    onboardingComplete: student.scenario !== 'new',
    completedMilestoneIds: [...student.completedMilestoneIds],
    honoredMilestoneIds: [],
    contentRevision: 1,
    taskChecks,
    answers,
    reflections: {},
    rsvpEventIds: [],
    savedResourceIds: [],
    planNotes: '',
    goals: [],
    preferences: { largerText: false },
    updatedAt: now.toISOString(),
  })
}

export function seedForScenario(catalog: Catalog, scenarioId: ScenarioId, now = new Date()): UserProgress {
  return seedProgress(studentForScenario(catalog, scenarioId), catalog.tasks, now)
}
