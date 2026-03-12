import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Latest', to: '/' },
  { label: 'National', to: '/category/national' },
  { label: 'International', to: '/category/international' },
  { label: 'Business', to: '/category/business' },
  { label: 'Entertainment', to: '/category/entertainment' },
  { label: 'Politics', to: '/category/politics' },
  { label: 'Opportunities', to: '/opportunities' },
  { label: 'Events', to: '/events' },
]

const linkClass = ({ isActive }) =>
  [
    'text-sm font-medium tracking-wide transition-colors',
    isActive
      ? 'text-[color:var(--color-primary)]'
      : 'text-[color:var(--color-ink-700)] hover:text-[color:var(--color-primary)]',
  ].join(' ')

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-ink-100)] bg-[color:var(--color-surface)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-[0.2em] text-[color:var(--color-ink-900)]"
          onClick={() => setOpen(false)}
        >
          <span className="h-9 w-9 rounded-full border border-[color:var(--color-ink-200)] bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-secondary)] shadow-sm" />
         Apple 
        </NavLink>

        <button
          className="rounded-full border border-[color:var(--color-ink-200)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-800)] md:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {open ? (
        <div className="border-t border-[color:var(--color-ink-100)] bg-[color:var(--color-surface)] md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
