const stepLabels = [
  'Define Mission',
  'Build Team',
  'Configure Pipeline',
  'Set Budget Rules',
  'Preview & Export',
];

interface StepProgressProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export function StepProgress({ activeStep, onStepChange }: StepProgressProps) {
  return (
    <div className="rounded-3xl border border-canvas-border bg-canvas-panel p-4 shadow-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {stepLabels.map((label, index) => {
          const step = index + 1;
          const isActive = step === activeStep;
          const isComplete = step < activeStep;

          return (
            <button
              key={label}
              type="button"
              onClick={() => onStepChange(step)}
              className={`flex flex-1 items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                isActive
                  ? 'bg-accent text-white'
                  : isComplete
                    ? 'bg-accent/10 text-canvas-ink hover:bg-accent/15'
                    : 'bg-canvas-soft text-canvas-muted hover:text-canvas-ink'
              }`}
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                  isActive
                    ? 'border-white/40 bg-white/10'
                    : isComplete
                      ? 'border-accent/20 bg-accent/15 text-accent'
                      : 'border-canvas-border bg-canvas-base text-canvas-muted'
                }`}
              >
                {step}
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.24em] opacity-70">Step {step}</span>
                <span className="block text-sm font-medium">{label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
