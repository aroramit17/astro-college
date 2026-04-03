import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 border-b border-canvas-border/70 bg-canvas-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="rounded-2xl border border-canvas-border bg-canvas-panel px-3 py-2 shadow-card transition group-hover:-translate-y-0.5">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              better::skills::md
            </div>
            <div className="font-display text-lg font-semibold text-canvas-ink">
              betterskillsmd.com
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-canvas-muted md:flex">
          <NavLink
            to="/astronomy-colleges"
            className={({ isActive }) =>
              `transition hover:text-canvas-ink ${isActive ? 'text-canvas-ink' : ''}`
            }
          >
            Astronomy
          </NavLink>
          <a href={isHome ? '#templates' : '/#templates'} className="transition hover:text-canvas-ink">
            Templates
          </a>
          <a href={isHome ? '#builder' : '/#builder'} className="transition hover:text-canvas-ink">
            Builder
          </a>
          <a href={isHome ? '#files' : '/#files'} className="transition hover:text-canvas-ink">
            Files
          </a>
          <NavLink
            to="/privacy-policy"
            className={({ isActive }) =>
              `transition hover:text-canvas-ink ${isActive ? 'text-canvas-ink' : ''}`
            }
          >
            Privacy
          </NavLink>
          <NavLink
            to="/terms"
            className={({ isActive }) =>
              `transition hover:text-canvas-ink ${isActive ? 'text-canvas-ink' : ''}`
            }
          >
            Terms
          </NavLink>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
