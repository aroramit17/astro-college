import { useEffect, useState } from 'react';

const THEME_KEY = 'betterskillsmd.theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return (window.localStorage.getItem(THEME_KEY) as 'light' | 'dark') ?? 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      className="inline-flex items-center gap-2 rounded-full border border-canvas-border bg-canvas-panel px-3 py-2 text-sm font-medium text-canvas-ink transition hover:-translate-y-0.5"
    >
      <span className="font-mono text-xs uppercase tracking-[0.24em]">{theme}</span>
      <span>{theme === 'light' ? 'Moon' : 'Sun'}</span>
    </button>
  );
}
