import { z } from 'zod'

export const chapterIdSchema = z.enum(['P1', 'P2', 'P3', 'P4', 'P5'])
export const scenarioIdSchema = z.enum(['new', 'in-progress', 'almost-graduated'])
export const milestoneIdSchema = z.string().regex(/^M(0[1-9]|1[0-5])$/)

export const chapterSchema = z.object({
  id: chapterIdSchema,
  title: z.string().min(1),
  daysRemaining: z.string().min(1),
  summary: z.string().min(1),
  theme: z.string().min(1),
  order: z.number().int(),
})

export const milestoneSchema = z.object({
  id: milestoneIdSchema,
  chapterId: chapterIdSchema,
  sequence: z.number().int().min(1).max(15),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  purpose: z.string().min(1),
  emotionalObjective: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  required: z.boolean(),
  dependsOn: z.array(milestoneIdSchema),
  taskIds: z.array(z.string().regex(/^T\d{3}$/)).length(3),
  completionRule: z.string().min(1),
  rewardId: z.string().nullable(),
  points: z.number(),
  successCopy: z.string().min(1),
  cta: z.string().min(1),
  demoAsset: z.string().min(1),
  status: z.string().min(1),
})

export const taskSchema = z.object({
  id: z.string().regex(/^T\d{3}$/),
  milestoneId: milestoneIdSchema,
  order: z.number().int().min(1).max(3),
  label: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
  validation: z.string().min(1),
})

export const studentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  year: z.string().min(1),
  graduationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pathway: z.string().min(1),
  interests: z.array(z.string()),
  avatarInitials: z.string().min(1),
  currentChapter: chapterIdSchema,
  completedMilestoneIds: z.array(milestoneIdSchema),
  scenario: scenarioIdSchema,
  fictional: z.literal(true),
})

export const achievementSchema = z.object({
  id: z.string().regex(/^A0[1-5]$/),
  chapterId: chapterIdSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  criteria: z.string().min(1),
  iconAsset: z.string().min(1),
})

export const resourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  summary: z.string().min(1),
  provider: z.string().min(1),
  url: z.string().nullable(),
  tags: z.array(z.string()),
  associatedMilestones: z.array(milestoneIdSchema),
  status: z.literal('simulated'),
})

export const eventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  location: z.string().min(1),
  category: z.string().min(1),
  capacity: z.number().int().positive(),
  rsvpCount: z.number().int().nonnegative(),
  status: z.literal('simulated'),
  description: z.string().min(1),
})

export const demoScenarioSchema = z.object({
  id: scenarioIdSchema,
  studentId: z.string().min(1),
  startRoute: z.string().min(1),
  narrative: z.string().min(1),
  resetMethod: z.string().min(1),
})

export const contentCopySchema = z.object({
  brand: z.string().min(1),
  tagline: z.string().min(1),
  welcomeTitle: z.string().min(1),
  welcomeDescription: z.string().min(1),
  primaryCTA: z.string().min(1),
  journeyTitle: z.string().min(1),
  destinationTitle: z.string().min(1),
  progressLabel: z.string().min(1),
  daysLabel: z.string().min(1),
  privacy: z.string().min(1),
})

export const catalogSchema = z.object({
  chapters: z.array(chapterSchema).length(5),
  milestones: z.array(milestoneSchema).length(15),
  tasks: z.array(taskSchema).length(45),
  students: z.array(studentSchema).length(3),
  achievements: z.array(achievementSchema).length(5),
  resources: z.array(resourceSchema),
  events: z.array(eventSchema),
  scenarios: z.array(demoScenarioSchema).length(3),
  copy: contentCopySchema,
})

/** Values typed on the onboarding form. Kept apart from the fictional seed student and never verified. */
export const onboardingProfileSchema = z.object({
  firstName: z.string().max(80),
  lastName: z.string().max(80),
  studentId: z.string().max(40),
  major: z.string().max(80),
  graduationTerm: z.string().max(40),
  step1Complete: z.boolean(),
  pathway: z.string().max(80).default(''),
  priorities: z.array(z.string()).default([]),
})

export const planGoalSchema = z.object({
  id: z.string().min(1).max(40),
  area: z.string().min(1).max(80),
  title: z.string().min(1).max(160),
  notes: z.string().max(1000),
  done: z.boolean(),
})

export const preferencesSchema = z.object({
  largerText: z.boolean(),
})

export const progressSchema = z.object({
  schemaVersion: z.literal(1),
  studentId: z.string().min(1),
  scenarioId: scenarioIdSchema,
  onboardingComplete: z.boolean(),
  onboardingProfile: onboardingProfileSchema.optional().catch(undefined),
  completedMilestoneIds: z.array(milestoneIdSchema),
  honoredMilestoneIds: z.array(milestoneIdSchema).default([]),
  contentRevision: z.number().int().min(1).max(2).default(1),
  taskChecks: z.record(z.string(), z.boolean()),
  answers: z.record(z.string(), z.string().max(500)),
  reflections: z.record(
    z.string(),
    z.object({
      text: z.string().max(5000),
      visibility: z.enum(['private', 'demo-visible']),
    }),
  ),
  rsvpEventIds: z.array(z.string()),
  savedResourceIds: z.array(z.string()),
  planNotes: z.string().max(5000),
  goals: z.array(planGoalSchema).max(24).default([]),
  preferences: preferencesSchema.default({ largerText: false }),
  updatedAt: z.string().min(1),
})

export type Chapter = z.infer<typeof chapterSchema>
export type Milestone = z.infer<typeof milestoneSchema>
export type Task = z.infer<typeof taskSchema>
export type Student = z.infer<typeof studentSchema>
export type Achievement = z.infer<typeof achievementSchema>
export type Resource = z.infer<typeof resourceSchema>
export type DemoEvent = z.infer<typeof eventSchema>
export type DemoScenario = z.infer<typeof demoScenarioSchema>
export type ContentCopy = z.infer<typeof contentCopySchema>
export type Catalog = z.infer<typeof catalogSchema>
export type ScenarioId = z.infer<typeof scenarioIdSchema>
export type UserProgress = z.infer<typeof progressSchema>
export type OnboardingProfile = z.infer<typeof onboardingProfileSchema>
export type PlanGoal = z.infer<typeof planGoalSchema>
export type Preferences = z.infer<typeof preferencesSchema>
