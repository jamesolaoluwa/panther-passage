import {
  Briefcase,
  ChartLineUp,
  Coins,
  Compass,
  FlowerLotus,
  GraduationCap,
  House,
  Lightbulb,
  UsersThree,
  type Icon,
} from '@phosphor-icons/react'

export const PATHWAY_ICONS: Record<string, Icon> = {
  career: Briefcase,
  'graduate-school': GraduationCap,
  entrepreneurship: Lightbulb,
  exploring: Compass,
}

/** Tone follows the approved Step 3 reference: evergreen or gold icon on a matching tinted well. */
export const PRIORITY_ICONS: Record<string, { icon: Icon; tone: 'evergreen' | 'gold' }> = {
  'career-readiness': { icon: Briefcase, tone: 'evergreen' },
  'financial-independence': { icon: Coins, tone: 'gold' },
  'networking-mentorship': { icon: UsersThree, tone: 'evergreen' },
  'wellness-balance': { icon: FlowerLotus, tone: 'gold' },
  'life-after-graduation': { icon: House, tone: 'gold' },
  'leadership-legacy': { icon: ChartLineUp, tone: 'gold' },
}
