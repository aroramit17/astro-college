import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-canvas-border/80 bg-canvas-soft">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="font-display text-lg font-semibold text-canvas-ink">betterskillsmd.com</div>
          <p className="mt-2 max-w-xl text-sm text-canvas-muted">
            A guided workspace for turning mission ideas into consistent AI operation markdown packs.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-canvas-muted">
          <Link to="/astronomy-colleges" className="transition hover:text-canvas-ink">
            Astronomy
          </Link>
          <a href="/#templates" className="transition hover:text-canvas-ink">
            Templates
          </a>
          <a href="/#builder" className="transition hover:text-canvas-ink">
            Builder
          </a>
          <a href="/#files" className="transition hover:text-canvas-ink">
            Preview & Export
          </a>
          <Link to="/privacy-policy" className="transition hover:text-canvas-ink">
            Privacy Policy
          </Link>
          <Link to="/terms" className="transition hover:text-canvas-ink">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
