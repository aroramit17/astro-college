import type { TemplateDefinition } from '../types/operation';

interface TemplatePickerProps {
  templates: TemplateDefinition[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export function TemplatePicker({
  templates,
  selectedTemplateId,
  onSelect,
}: TemplatePickerProps) {
  return (
    <section id="templates" className="space-y-6">
      <div className="max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
          Template Picker
        </div>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-canvas-ink sm:text-4xl">
          Start with a shape that already knows how AI ops usually go wrong.
        </h2>
        <p className="mt-3 text-base leading-7 text-canvas-muted">
          Choose a template to prefill the mission, agent team, pipeline, and budget rules. You can revise everything afterward.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {templates.map((template) => {
          const selected = template.id === selectedTemplateId;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={`group rounded-3xl border p-5 text-left shadow-card transition ${
                selected
                  ? 'border-accent bg-canvas-panel ring-2 ring-accent/30'
                  : 'border-canvas-border bg-canvas-panel/80 hover:-translate-y-1 hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                  {template.accentLabel}
                </span>
                <span className="text-xs text-canvas-muted">
                  {template.agentCount} agent{template.agentCount === 1 ? '' : 's'}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-canvas-ink">
                {template.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-canvas-muted">{template.description}</p>
              <div className="mt-5 text-sm font-medium text-canvas-ink">
                {selected ? 'Selected template' : 'Use this template'}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
