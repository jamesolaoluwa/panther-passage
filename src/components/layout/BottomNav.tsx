import { Books, Flag, House, Path } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import { m } from 'motion/react'

const items = [
  { to: '/home', label: 'Home', icon: House },
  { to: '/journey', label: 'My Passage', icon: Path },
  { to: '/resources', label: 'Explore', icon: Books },
  { to: '/next-chapter', label: 'My Chapter', icon: Flag },
] as const

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-10 border-t border-gold/50 bg-ivory/95 px-2 pt-1 backdrop-blur-sm pb-[max(0.4rem,env(safe-area-inset-bottom))]"
    >
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-[0.68rem] font-bold tracking-wide no-underline ${
                    isActive ? 'text-evergreen' : 'text-slate/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative h-1 w-7" aria-hidden="true">
                      {isActive ? (
                        <m.span
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-full bg-gold"
                          transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                        />
                      ) : null}
                    </span>
                    <m.span
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 460, damping: 24 }}
                      className="inline-flex"
                    >
                      <Icon size={24} weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
                    </m.span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
