/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          base: 'rgb(var(--color-canvas-base) / <alpha-value>)',
          soft: 'rgb(var(--color-canvas-soft) / <alpha-value>)',
          panel: 'rgb(var(--color-canvas-panel) / <alpha-value>)',
          border: 'rgb(var(--color-canvas-border) / <alpha-value>)',
          ink: 'rgb(var(--color-canvas-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-canvas-muted) / <alpha-value>)',
        },
        founder: 'rgb(var(--color-founder) / <alpha-value>)',
        ceo: 'rgb(var(--color-ceo) / <alpha-value>)',
        qa: 'rgb(var(--color-qa) / <alpha-value>)',
        worker: 'rgb(var(--color-worker) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        caution: 'rgb(var(--color-caution) / <alpha-value>)',
      },
      boxShadow: {
        card: '0 24px 48px -28px rgba(15, 23, 42, 0.18)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        pulseTrack: 'pulseTrack 2.2s linear infinite',
        floatIn: 'floatIn 0.55s ease-out both',
      },
      keyframes: {
        pulseTrack: {
          '0%': { transform: 'translateY(0)', opacity: '0.15' },
          '40%': { opacity: '0.85' },
          '100%': { transform: 'translateY(56px)', opacity: '0.15' },
        },
        floatIn: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
