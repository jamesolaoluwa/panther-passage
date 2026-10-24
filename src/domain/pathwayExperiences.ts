/**
 * After M01 and M02, each direction emphasizes different existing milestones.
 * These are not new required milestones and they do not replace the catalog graph.
 * Independent living and purpose are priority tracks already in onboarding, shown here
 * so each direction can be reviewed without changing a student's saved progress.
 */

export interface PathwayTrack {
  id: string
  title: string
  approvedName: string
  summary: string
  milestoneIds: string[]
  activityId: string
  prompts: string[]
}

export const PATHWAY_TRACKS: PathwayTrack[] = [
  {
    id: 'graduate-school',
    title: 'Continue My Education',
    approvedName: 'Continue My Education',
    summary: 'Compare further study, name what an application actually requires, and choose one scholarly next step.',
    milestoneIds: ['M07', 'M12', 'M13'],
    activityId: 'M07',
    prompts: [
      'Name two programs or fields you are seriously considering.',
      'Write one real requirement for each.',
      'Save the application step you will take next.',
    ],
  },
  {
    id: 'career',
    title: 'Start My Career',
    approvedName: 'Start My Career',
    summary: 'Clarify the contribution you want to make, the people who can advise you, and one opportunity to understand. This path does not include a résumé or an interview.',
    milestoneIds: ['M04', 'M05', 'M06'],
    activityId: 'M04',
    prompts: [
      'Name the kind of work you want to grow toward.',
      'List the strengths you already bring to it.',
      'Write one opportunity you want to understand before you pursue it.',
    ],
  },
  {
    id: 'entrepreneurship',
    title: 'Start a Business',
    approvedName: 'Start a Business',
    summary: 'Shape an offer, a first customer, and the money the idea needs. The approved pathway name is Start a Business.',
    milestoneIds: ['M07', 'M10', 'M13'],
    activityId: 'M10',
    prompts: [
      'Name the offer you would make in the first month.',
      'List the costs that offer cannot ignore.',
      'Save one money decision you will make before you launch.',
    ],
  },
  {
    id: 'independent-living',
    title: 'Independent Living & Financial Readiness',
    approvedName: 'Life After Graduation and Financial Independence',
    summary: 'Plan housing, a first budget, and the practical move into a life you can sustain.',
    milestoneIds: ['M10', 'M12', 'M13'],
    activityId: 'M10',
    prompts: [
      'Name the housing or relocation choice in front of you.',
      'List the monthly costs that choice creates.',
      'Save the money boundary you will not cross.',
    ],
  },
  {
    id: 'purpose-wellness',
    title: 'Purpose, Wellness & Personal Growth',
    approvedName: 'Wellness & Balance, with Leadership & Legacy',
    summary: 'Protect your energy, name what matters, and leave something useful for the people who follow.',
    milestoneIds: ['M03', 'M11', 'M14'],
    activityId: 'M11',
    prompts: [
      'Name the pressure you do not want to carry into the next season.',
      'Write the rest or support you will actually schedule.',
      'Save one practice that keeps you well while things change.',
    ],
  },
]

export function pathwayTrack(id: string): PathwayTrack | undefined {
  return PATHWAY_TRACKS.find((track) => track.id === id)
}

export function pathwayNote(pathwayId: string, milestoneId: string): string | null {
  const track = PATHWAY_TRACKS.find((item) => item.id === pathwayId && item.milestoneIds.includes(milestoneId))
  if (!track) return null
  return track.summary
}
