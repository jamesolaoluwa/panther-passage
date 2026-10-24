/**
 * Provisional Panther Passage color and type tokens.
 * These hex values follow the supplied wordmark and milestone artwork.
 * They are not official Philander Smith University colors.
 * The unused plum/maroon set in 05_Design_System/Design_Tokens.json stays out of the UI.
 * Fraunces and Manrope are licensed stand-ins. They are not Recoleta.
 */
export const tokens = {
  approval: 'provisional' as const,
  color: {
    ivory: '#F7F4EB',
    paper: '#FFFFFF',
    evergreen: '#173F35',
    evergreenBright: '#146B50',
    gold: '#D7AD56',
    goldBright: '#F2BD49',
    slate: '#263641',
    mint: '#B8D9C9',
    focus: '#214ED5',
    danger: '#A72B40',
  },
  font: {
    display: '"Fraunces", Georgia, serif',
    body: '"Manrope", Arial, sans-serif',
    note: 'Fraunces (SIL OFL) stands in for the Recoleta-inspired display face. Manrope (SIL OFL) is the interface face. Recoleta files are not included.',
  },
  layout: {
    phoneMin: 375,
    phoneReferenceWidth: 390,
    phoneReferenceHeight: 844,
    phoneMax: 430,
    touchMin: 44,
  },
} as const
