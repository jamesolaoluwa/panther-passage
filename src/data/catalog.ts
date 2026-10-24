import { catalogSchema, type Catalog } from './schemas'
import chapters from '../../08_Demo_Data/chapters.json'
import milestones from '../../08_Demo_Data/milestones.json'
import tasks from '../../08_Demo_Data/tasks.json'
import students from '../../08_Demo_Data/students.json'
import achievements from '../../08_Demo_Data/achievements.json'
import resources from '../../08_Demo_Data/resources.json'
import events from '../../08_Demo_Data/events.json'
import scenarios from '../../08_Demo_Data/demo_scenarios.json'
import copy from '../../08_Demo_Data/content_copy.json'

const parsed = catalogSchema.safeParse({
  chapters,
  milestones,
  tasks,
  students,
  achievements,
  resources,
  events,
  scenarios,
  copy,
})

export const catalogParseError = parsed.success
  ? null
  : parsed.error.issues.map((issue) => `${issue.path.join('.') || 'catalog'}: ${issue.message}`).join('\n')

export function getCatalog(): Catalog {
  if (!parsed.success) {
    throw new Error(catalogParseError ?? 'Demo datasets failed validation.')
  }
  return parsed.data
}
