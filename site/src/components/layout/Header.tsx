import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-canvas-border/70 bg-canvas-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="rounded-full border border-canvas-border bg-canvas-panel px-5 py-3 shadow-card transition hover:-translate-y-0.5">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            Astronomy
          </div>
          <div className="mt-1 font-display text-lg font-semibold text-canvas-ink">
            College Research
          </div>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
