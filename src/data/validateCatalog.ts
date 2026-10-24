import type { Catalog } from './schemas'

export const OPTIONAL_MILESTONE_IDS = ['M03', 'M06', 'M09', 'M12'] as const

export function validateCatalogIntegrity(catalog: Catalog): string[] {
  const errors: string[] = []
  const chapterIds = new Set(catalog.chapters.map((chapter) => chapter.id))
  const milestones = [...catalog.milestones].sort((a, b) => a.sequence - b.sequence)
  const milestoneIds = new Set(milestones.map((milestone) => milestone.id))
  const tasksById = new Map(catalog.tasks.map((task) => [task.id, task]))

  if (new Set(milestones.map((milestone) => milestone.sequence)).size !== 15) {
    errors.push('Milestone sequences must be unique.')
  }

  const required = milestones.filter((milestone) => milestone.required)
  if (required.length !== 11) {
    errors.push(`Expected 11 required milestones, found ${required.length}.`)
  }

  const optional = milestones.filter((milestone) => !milestone.required).map((milestone) => milestone.id)
  if (optional.join(',') !== OPTIONAL_MILESTONE_IDS.join(',')) {
    errors.push(`Optional milestones must be ${OPTIONAL_MILESTONE_IDS.join(', ')}.`)
  }

  for (const milestone of milestones) {
    if (!chapterIds.has(milestone.chapterId)) {
      errors.push(`${milestone.id} points at missing chapter ${milestone.chapterId}.`)
    }
    if (milestone.taskIds.length !== new Set(milestone.taskIds).size) {
      errors.push(`${milestone.id} repeats a task id.`)
    }
    for (const taskId of milestone.taskIds) {
      const task = tasksById.get(taskId)
      if (!task) {
        errors.push(`${milestone.id} lists missing task ${taskId}.`)
      } else if (task.milestoneId !== milestone.id) {
        errors.push(`${taskId} belongs to ${task.milestoneId}, not ${milestone.id}.`)
      }
    }
    for (const dependency of milestone.dependsOn) {
      const prior = milestones.find((item) => item.id === dependency)
      if (!prior) {
        errors.push(`${milestone.id} depends on missing ${dependency}.`)
      } else if (prior.sequence >= milestone.sequence) {
        errors.push(`${milestone.id} depends on ${dependency}, which is not an earlier milestone.`)
      }
    }
  }

  const fifteen = milestones.find((milestone) => milestone.id === 'M15')
  if (!fifteen || fifteen.dependsOn.join(',') !== 'M13') {
    errors.push('M15 must depend on M13 only.')
  }

  for (const task of catalog.tasks) {
    if (!milestoneIds.has(task.milestoneId)) {
      errors.push(`${task.id} points at missing milestone ${task.milestoneId}.`)
    }
  }

  for (const student of catalog.students) {
    if (student.graduationDate !== '2027-05-15') {
      errors.push(`${student.name} must keep the shared fictional graduation date.`)
    }
    for (const milestoneId of student.completedMilestoneIds) {
      if (!milestoneIds.has(milestoneId)) {
        errors.push(`${student.id} completes unknown milestone ${milestoneId}.`)
      }
    }
  }

  const byScenario = Object.fromEntries(catalog.students.map((student) => [student.scenario, student]))
  if (byScenario.new?.completedMilestoneIds.length !== 0) {
    errors.push('Jordan must start with no completed milestones.')
  }
  if (byScenario['in-progress']?.completedMilestoneIds.join(',') !== 'M01,M02,M03,M04,M05,M06,M07') {
    errors.push('Avery must be seeded through M07.')
  }
  if (
    byScenario['almost-graduated']?.completedMilestoneIds.join(',') !==
    'M01,M02,M03,M04,M05,M06,M07,M08,M09,M10,M11,M12,M13,M14'
  ) {
    errors.push('Morgan must be seeded through M14.')
  }

  for (const achievement of catalog.achievements) {
    if (!chapterIds.has(achievement.chapterId)) {
      errors.push(`${achievement.id} points at missing chapter ${achievement.chapterId}.`)
    }
  }

  for (const resource of catalog.resources) {
    for (const milestoneId of resource.associatedMilestones) {
      if (!milestoneIds.has(milestoneId)) {
        errors.push(`${resource.id} points at missing milestone ${milestoneId}.`)
      }
    }
  }

  for (const scenario of catalog.scenarios) {
    if (!catalog.students.some((student) => student.id === scenario.studentId && student.scenario === scenario.id)) {
      errors.push(`Scenario ${scenario.id} does not match its student record.`)
    }
  }

  return errors
}
