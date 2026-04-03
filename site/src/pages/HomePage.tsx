import { Link } from 'react-router-dom';
import { SidebarDiagram } from '../components/SidebarDiagram';
import { StepProgress } from '../components/StepProgress';
import { TemplatePicker } from '../components/TemplatePicker';
import { StepAgents } from '../components/steps/StepAgents';
import { StepBudget } from '../components/steps/StepBudget';
import { StepMission } from '../components/steps/StepMission';
import { StepPipeline } from '../components/steps/StepPipeline';
import { StepPreview } from '../components/steps/StepPreview';
import { useOperation } from '../context/OperationContext';

const stepDescriptions = {
  1: 'Mission details flow into SOUL.md.',
  2: 'Agent roles, skills, and deliverables populate TEAM.md.',
  3: 'Handoffs and review gates shape PIPELINE.md.',
  4: 'Token guardrails and per-agent caps shape BUDGET.md.',
  5: 'Review every file, edit raw markdown, and export.',
};

function ActiveStepPanel() {
  const { activeStep } = useOperation();

  switch (activeStep) {
    case 1:
      return <StepMission />;
    case 2:
      return <StepAgents />;
    case 3:
      return <StepPipeline />;
    case 4:
      return <StepBudget />;
    case 5:
      return <StepPreview />;
    default:
      return <StepMission />;
  }
}

export function HomePage() {
  const { operation, activeStep, setActiveStep, applyTemplate, templateOptions } = useOperation();
  const selectedTemplate =
    templateOptions.find((template) => template.id === operation.templateId) ??
    templateOptions[templateOptions.length - 1];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="space-y-6">
        <div className="max-w-4xl rounded-[2.25rem] border border-canvas-border bg-canvas-panel/95 p-6 shadow-card sm:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Guided AI Operations Builder
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-canvas-ink sm:text-5xl">
              Create the full markdown operating system behind your next agent team.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-canvas-muted">
              betterskillsmd.com helps you define the mission, assemble the team, wire the pipeline, set spend rules, and export five polished markdown files that actually agree with each other.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-canvas-border bg-canvas-soft p-4">
                <div className="font-display text-3xl font-semibold text-canvas-ink">5</div>
                <div className="mt-1 text-sm text-canvas-muted">live-generated markdown files</div>
              </div>
              <div className="rounded-3xl border border-canvas-border bg-canvas-soft p-4">
                <div className="font-display text-3xl font-semibold text-canvas-ink">
                  {operation.agents.length + 2}
                </div>
                <div className="mt-1 text-sm text-canvas-muted">agents and leadership nodes in the architecture map</div>
              </div>
              <div className="rounded-3xl border border-canvas-border bg-canvas-soft p-4">
                <div className="font-display text-3xl font-semibold text-canvas-ink">{activeStep}/5</div>
                <div className="mt-1 text-sm text-canvas-muted">{stepDescriptions[activeStep as keyof typeof stepDescriptions]}</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#templates"
                className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                Choose template
              </a>
              <a
                href="#builder"
                className="rounded-full border border-canvas-border px-5 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
              >
                Jump to builder
              </a>
              <Link
                to="/privacy-policy"
                className="rounded-full border border-canvas-border px-5 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
              >
                Privacy policy
              </Link>
            </div>
        </div>

        <TemplatePicker
          templates={templateOptions}
          selectedTemplateId={selectedTemplate.id}
          onSelect={(templateId) => {
            applyTemplate(templateId);
            window.setTimeout(() => {
              document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
          }}
        />

        <div
          id="builder"
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
        >
          <div className="space-y-6">
            <StepProgress activeStep={activeStep} onStepChange={setActiveStep} />
            <ActiveStepPanel />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                disabled={activeStep === 1}
                className="rounded-full border border-canvas-border px-5 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-45"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                disabled={activeStep === 5}
                className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next step
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <SidebarDiagram operation={operation} mobile />
          </div>
          <div className="hidden lg:block">
            <SidebarDiagram operation={operation} />
          </div>
        </div>
      </section>
    </div>
  );
}
