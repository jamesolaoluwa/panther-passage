export type AssetStanding = 'approved' | 'provisional' | 'reference' | 'missing' | 'excluded'

export interface AssetRecord {
  id: string
  standing: AssetStanding
  publicPath: string | null
  sourcePath: string
  note: string
}

const publicRoot = '/assets/panther-passage'

export const logoPath = `${publicRoot}/01_Branding/Logos/Panther_Passage_APPROVED_Logo_Original.png`

export const welcomeScreenImage = {
  path: `${publicRoot}/03_Welcome/Welcome_Approved_Frameless.png`,
  width: 576,
  height: 1024,
  /** Get Started pill including its gold border, measured from the image pixels. */
  getStartedPixels: { x: 122, y: 858, width: 330, height: 62 },
}

/** Full-bleed campus photograph for the redesigned welcome screen. */
export const welcomeHero = {
  path: `${publicRoot}/03_Welcome/Philander_Campus_Hero.png`,
  width: 1280,
  height: 807,
}

/** Third-party brand marks shown together as a co-brand lockup on the welcome screen. */
export const philanderSmithLogo = `${publicRoot}/01_Branding/Partners/Philander_Smith_University.png`
export const disneyOnTheYardLogo = `${publicRoot}/01_Branding/Partners/Disney_On_The_Yard.png`

export const journeyMapArtwork = {
  path: `${publicRoot}/04_Journey_Map/Mobile/Journey_Map_Campus_Artwork.png`,
  width: 576,
  height: 683,
}

export const onboardingCampusFooter = {
  path: `${publicRoot}/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png`,
  width: 1774,
  height: 577,
}

export const onboardingJourneyPath = {
  path: `${publicRoot}/03_Onboarding/Onboarding_Journey_Path.png`,
  width: 257,
  height: 121,
}

export const assetRegistry: AssetRecord[] = [
  {
    id: 'journey-map-artwork',
    standing: 'approved',
    publicPath: journeyMapArtwork.path,
    sourcePath: 'docs/reference/Journey_Map_Approved_Reference.png, rows 249–931',
    note: 'Campus scene cropped from the supplied journey screenshot. Pixels are unchanged. Header, progress rail, and bottom navigation were left out so the app does not draw them twice. SHA-256 of the full reference F8171C59…1A6E9B3A.',
  },
  {
    id: 'onboarding-campus-footer',
    standing: 'approved',
    publicPath: onboardingCampusFooter.path,
    sourcePath: '09_Assets/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png',
    note: 'Official decorative campus footer for all four onboarding screens. Copied without modifying image data. SHA-256 016C0D05…54D147E9.',
  },
  {
    id: 'welcome-screen',
    standing: 'approved',
    publicPath: welcomeScreenImage.path,
    sourcePath: 'User upload, 2026-10-23 (frameless export of the approved welcome design)',
    note: 'Approved baked welcome composition. Retained as an asset and error-fallback reference; the live welcome screen was redesigned (2026-10-24) at user direction into a full-bleed hero layout.',
  },
  {
    id: 'welcome-hero',
    standing: 'approved',
    publicPath: welcomeHero.path,
    sourcePath: 'avatars_images/PhilanderHeroImg.png (user upload, 2026-10-24)',
    note: 'User-supplied Philander Smith campus photograph used full-bleed on the redesigned welcome screen. Pixels unchanged.',
  },
  {
    id: 'partner-lockup',
    standing: 'reference',
    publicPath: philanderSmithLogo,
    sourcePath: 'avatars_images/{PSULogo,DisneyLogo}.png (user upload, 2026-10-24)',
    note: 'Third-party brand marks (Philander Smith University and the Disney on the Yard program) supplied by the user for a Disney on the Yard submission context. Shown as a co-brand credit lockup at the user’s direction. Not an invented partnership asserted by the app, and not modified.',
  },
  {
    id: 'wordmark',
    standing: 'approved',
    publicPath: logoPath,
    sourcePath: '09_Assets/01_Branding/Logos/Panther_Passage_APPROVED_Logo_Original.png',
    note: 'Use the pixels intact. The file is opaque and byte-identical to the previous-reference copy.',
  },
  {
    id: 'student-avatars',
    standing: 'provisional',
    publicPath: `${publicRoot}/avatars/jordan-ellis.png`,
    sourcePath: 'avatars_images/{MaleImg,Female Image,2ndFemaleImage}.png (user upload, 2026-10-24)',
    note: 'User-supplied fictional demo portraits for Jordan Ellis, Avery Brooks, and Morgan Reed. Face-centered square crops. Not real students. The earlier illustrated SVGs remain as an onError fallback.',
  },
  {
    id: 'path-emblem',
    standing: 'provisional',
    publicPath: `${publicRoot}/01_Branding/Brand_Motifs/Path_Emblem.svg`,
    sourcePath: '09_Assets/01_Branding/Brand_Motifs/Path_Emblem.svg',
    note: 'Abstract passage mark. Not the approved logo.',
  },
  {
    id: 'arch-motif',
    standing: 'provisional',
    publicPath: `${publicRoot}/02_Campus/Arch/Arch_Motif.svg`,
    sourcePath: '09_Assets/02_Campus/Arch/Arch_Motif.svg',
    note: 'Abstract arch. Not a verified campus building.',
  },
  {
    id: 'ivory-scrim',
    standing: 'provisional',
    publicPath: `${publicRoot}/03_Welcome/Foreground_Layers/Ivory_Text_Scrim.svg`,
    sourcePath: '09_Assets/03_Welcome/Foreground_Layers/Ivory_Text_Scrim.svg',
    note: 'Text scrim for a later welcome composition.',
  },
  {
    id: 'mobile-route',
    standing: 'provisional',
    publicPath: `${publicRoot}/04_Journey_Map/Pathways/mobile_route.svg`,
    sourcePath: '09_Assets/04_Journey_Map/Pathways/mobile_route.svg',
    note: 'Vertical path geometry, 900 by 2400. Not milestone coordinates.',
  },
  {
    id: 'desktop-route',
    standing: 'provisional',
    publicPath: `${publicRoot}/04_Journey_Map/Pathways/desktop_route.svg`,
    sourcePath: '09_Assets/04_Journey_Map/Pathways/desktop_route.svg',
    note: 'Wide path geometry. Do not stretch the phone path.',
  },
  {
    id: 'milestone-states',
    standing: 'provisional',
    publicPath: `${publicRoot}/06_Milestones/Active/Milestone_Active.svg`,
    sourcePath: '09_Assets/06_Milestones',
    note: 'Shared state medallions for locked, available, active, in progress, and completed. Not unique milestone art.',
  },
  {
    id: 'brick-linework',
    standing: 'provisional',
    publicPath: `${publicRoot}/10_Textures_And_Motifs/Architectural/Brick_Linework.svg`,
    sourcePath: '09_Assets/10_Textures_And_Motifs/Architectural/Brick_Linework.svg',
    note: 'Subtle architectural texture.',
  },
  {
    id: 'welcome-mockup',
    standing: 'reference',
    publicPath: null,
    sourcePath: '09_Assets/03_Welcome/Mobile/Welcome_Updated_Landscaping_Phone_Mockup.png',
    note: 'Composition reference only. Baked text and controls stay out of the running screen.',
  },
  {
    id: 'journey-reference',
    standing: 'reference',
    publicPath: null,
    sourcePath: '09_Assets/04_Journey_Map/Desktop/Photoreal_Journey_Map_PREFERRED_REFERENCE.png',
    note: 'Atmosphere reference only. Baked nodes and signage are not the interactive map.',
  },
  {
    id: 'chapter-art',
    standing: 'missing',
    publicPath: null,
    sourcePath: '09_Assets/Chapters/chapter-01.svg',
    note: 'chapter-01.svg through chapter-05.svg are not in the workspace.',
  },
  {
    id: 'achievement-crests',
    standing: 'missing',
    publicPath: null,
    sourcePath: '09_Assets/Achievements/crest-1.svg',
    note: 'crest-1.svg through crest-5.svg are referenced by achievements.json and are absent.',
  },
  {
    id: 'finale-art',
    standing: 'missing',
    publicPath: null,
    sourcePath: '09_Assets/Graduation',
    note: 'No verified graduation destination artwork is available.',
  },
  {
    id: 'campus-photo-01',
    standing: 'excluded',
    publicPath: null,
    sourcePath: '09_Assets/02_Campus/References/Campus_Photo_01.png',
    note: 'Mislabeled wordmark. Not a campus photograph. Do not use.',
  },
  {
    id: 'campus-photo-02',
    standing: 'excluded',
    publicPath: null,
    sourcePath: '09_Assets/02_Campus/References/Campus_Photo_02.png',
    note: 'Unrelated invitation artwork. Do not use.',
  },
  {
    id: 'institutional-logo-reference',
    standing: 'excluded',
    publicPath: null,
    sourcePath: '09_Assets/02_Campus/References/Institutional_Logo_Reference.png',
    note: 'Unrelated ID-card artwork. Not a university seal. Do not use.',
  },
]

export function assetsByStanding(standing: AssetStanding): AssetRecord[] {
  return assetRegistry.filter((asset) => asset.standing === standing)
}
