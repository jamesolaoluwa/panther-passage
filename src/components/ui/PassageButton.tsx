import type { ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

const className =
  'inline-flex min-h-12 w-full items-center justify-center rounded-full bg-evergreen px-5 text-center text-[0.95rem] font-bold text-ivory transition-colors hover:bg-evergreen-bright'

export function PassageButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

export function PassageLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}
