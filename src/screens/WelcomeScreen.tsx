import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'motion/react'
import { welcomeHero, philanderSmithLogo, disneyOnTheYardLogo } from '../assets/registry'

export const WELCOME_DESCRIPTION =
  'Panther Passage. Your last 100 days start here. Plan your next steps, discover resources, and move confidently toward graduation and beyond.'

const TAGLINE = 'Your last 100 days start here.'
const SUBLINE =
  'Plan your next steps, discover resources, and move confidently toward graduation and beyond.'

// The gradient's solid stop is the exact screen background (ivory) so the photo melts
// into the page instead of ending at a visible band. The photo stays fully visible for
// most of the screen and only dissolves near the bottom, where the text stack sits.
const IVORY = '247, 244, 235'
const heroFade = `linear-gradient(to bottom, rgba(${IVORY},0) 0%, rgba(${IVORY},0) 52%, rgba(${IVORY},0.45) 68%, rgba(${IVORY},0.85) 80%, rgba(${IVORY},1) 88%)`

// Entrance cascade: the photo settles first, then the stack rises in, one element at a time.
const STAGGER = 0.08
const AFTER_IMAGE = 0.8
const rise = (index: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, ease: 'easeOut' as const, delay: AFTER_IMAGE + STAGGER * index },
})

export function WelcomeScreen() {
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)
  const start = () => navigate('/onboarding')

  if (failed) {
    return (
      <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-ivory px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-evergreen">Panther Passage</h1>
        <p className="max-w-xs text-slate">{`${TAGLINE} ${SUBLINE}`}</p>
        <button
          type="button"
          onClick={start}
          className="min-h-12 w-full max-w-xs rounded-full bg-gold-bright px-5 font-bold text-evergreen"
        >
          Get Started
        </button>
      </main>
    )
  }

  return (
    <main id="main" className="relative h-dvh w-full overflow-hidden bg-ivory">
      {/* Full-bleed campus photograph behind everything. */}
      <m.img
        src={welcomeHero.path}
        alt={WELCOME_DESCRIPTION}
        width={welcomeHero.width}
        height={welcomeHero.height}
        draggable={false}
        onError={() => setFailed(true)}
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />

      {/* Bottom fade that dissolves the photo into the ivory page. */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: heroFade }} />

      {/* Co-brand credit lockup, pinned to the top over the bright sky. */}
      <m.div
        {...rise(0)}
        className="absolute inset-x-0 top-0 flex items-center justify-center gap-4 px-6 pt-[max(1rem,env(safe-area-inset-top))] sm:gap-6"
      >
        <img
          src={disneyOnTheYardLogo}
          alt="Disney on the Yard"
          className="h-11 w-auto object-contain object-right drop-shadow-sm sm:h-14"
        />
        <span aria-hidden className="h-12 w-px bg-evergreen/25 sm:h-16" />
        <img
          src={philanderSmithLogo}
          alt="Philander Smith University"
          className="h-16 w-auto object-contain object-left drop-shadow-sm sm:h-20"
        />
      </m.div>

      {/* Quiet bottom stack: wordmark, tagline, subline, single CTA. */}
      <div className="absolute inset-x-0 bottom-0 flex h-[46%] flex-col justify-end px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
          <m.div
            {...rise(1)}
            aria-label="Panther Passage"
            role="img"
            className="select-none text-center leading-[0.9] [text-shadow:0_1px_1px_rgba(23,63,53,0.12)]"
          >
            <span className="block font-display text-[clamp(2.4rem,8vw,3.6rem)] font-black uppercase tracking-tight text-evergreen">
              Panther
            </span>
            <span className="block font-display text-[clamp(2.4rem,8vw,3.6rem)] font-black uppercase tracking-tight text-gold-deep">
              Passage
            </span>
          </m.div>
          <m.h1
            {...rise(2)}
            className="mt-3 font-display text-[clamp(1.6rem,4.6vw,2.25rem)] font-medium leading-tight text-evergreen"
          >
            {TAGLINE}
          </m.h1>
          <m.p {...rise(3)} className="mt-3 max-w-[30rem] font-body text-[clamp(0.95rem,2.6vw,1.05rem)] leading-relaxed text-slate">
            {SUBLINE}
          </m.p>
          <m.button
            {...rise(4)}
            type="button"
            aria-label="Get Started"
            onClick={start}
            data-testid="welcome-get-started"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-gold-bright font-body text-base font-semibold text-evergreen shadow-[0_12px_30px_rgba(23,63,53,0.18)]"
          >
            Get Started
          </m.button>
        </div>
      </div>
    </main>
  )
}
