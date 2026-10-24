import { getCatalog } from './catalog'
import { OPTIONAL_MILESTONE_IDS, validateCatalogIntegrity } from './validateCatalog'
import { assetsByStanding } from '../assets/registry'

describe('demo datasets', () => {
  const catalog = getCatalog()

  it('parses five chapters, fifteen milestones, and forty-five tasks', () => {
    expect(catalog.chapters).toHaveLength(5)
    expect(catalog.milestones).toHaveLength(15)
    expect(catalog.tasks).toHaveLength(45)
    expect(validateCatalogIntegrity(catalog)).toEqual([])
  })

  it('keeps eleven required milestones and the four optional ones', () => {
    expect(catalog.milestones.filter((milestone) => milestone.required)).toHaveLength(11)
    expect(catalog.milestones.filter((milestone) => !milestone.required).map((milestone) => milestone.id)).toEqual([
      ...OPTIONAL_MILESTONE_IDS,
    ])
  })

  it('makes M15 depend on M13 rather than M14', () => {
    expect(catalog.milestones.find((milestone) => milestone.id === 'M15')?.dependsOn).toEqual(['M13'])
  })

  it('records the crest files as missing artwork', () => {
    expect(assetsByStanding('missing').some((asset) => asset.id === 'achievement-crests')).toBe(true)
    expect(assetsByStanding('excluded')).toHaveLength(3)
    expect(assetsByStanding('approved').map((asset) => asset.id)).toEqual([
      'journey-map-artwork',
      'onboarding-campus-footer',
      'welcome-screen',
      'welcome-hero',
      'wordmark',
    ])
  })
})
