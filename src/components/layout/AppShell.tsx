import { Outlet, Link, useLocation } from 'react-router-dom'
import { m } from 'motion/react'
import { logoPath } from '../../assets/registry'
import { ProfileAvatar } from '../profile/ProfileAvatar'
import { usePassage } from '../../state/PassageContext'
import { BottomNav } from './BottomNav'
import { ScripturePrayerBanner } from './ScripturePrayerBanner'

function isQuietRoute(pathname: string) {
  return pathname === '/' || pathname === '/onboarding' || pathname.startsWith('/onboarding/')
}

function isMilestoneDetail(pathname: string) {
  return /^\/journey\/M(0[1-9]|1[0-5])$/.test(pathname)
}

function isJourneyMap(pathname: string) {
  return pathname === '/journey'
}

export function AppShell() {
  const location = useLocation()
  const { warning, progress, student } = usePassage()
  const showNav = !isQuietRoute(location.pathname)
  const milestoneDetail = isMilestoneDetail(location.pathname)
  const journeyMap = isJourneyMap(location.pathname)
  const ownHeader = milestoneDetail || journeyMap

  if (isQuietRoute(location.pathname)) {
    return (
      <m.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        <Outlet />
      </m.div>
    )
  }

  return (
    <div className="min-h-dvh bg-evergreen">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div
        className={`mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-ivory text-slate shadow-[0_24px_80px_rgba(0,0,0,0.28)] min-[680px]:max-w-[680px] md:max-w-[760px] lg:max-w-[1040px] ${
          progress.preferences.largerText ? 'text-[18px]' : ''
        }`}
      >
        {ownHeader ? null : (
          <header className="pt-[max(0.85rem,env(safe-area-inset-top))]">
            <div className="flex items-center justify-between gap-3 px-5">
              <Link to="/" aria-label="Panther Passage" className="block max-w-[13rem] rounded-sm">
                <img src={logoPath} alt="" className="h-16 w-auto object-contain object-left" />
              </Link>
              <Link
                to="/profile"
                aria-label="Profile"
                className="inline-flex size-11 overflow-hidden rounded-full ring-2 ring-gold no-underline"
              >
                <ProfileAvatar studentId={student.id} />
              </Link>
            </div>
            {location.pathname === '/home' ? <ScripturePrayerBanner /> : null}
          </header>
        )}
        {warning ? (
          <p role="status" className="mx-5 mt-3 rounded-2xl bg-paper px-3 py-2 text-sm text-evergreen">
            {warning}
          </p>
        ) : null}
        <main id="main" className={ownHeader ? 'flex-1 px-0 pt-0 pb-28' : 'flex-1 px-5 pt-6 pb-28'}>
          {/* Opacity-only crossfade on route change. Avoids a transform containing-block so
              the passage path's fixed popover and toast stay anchored to the viewport. */}
          <m.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </m.div>
        </main>
        {showNav ? <BottomNav /> : <div className="h-[env(safe-area-inset-bottom)]" />}
      </div>
    </div>
  )
}
