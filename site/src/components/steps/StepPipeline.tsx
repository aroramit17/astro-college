import { useOperation } from '../../context/OperationContext';

function FlowChip({ label, tone }: { label: string; tone: string }) {
  return (
    <div className={`rounded-3xl px-4 py-4 text-sm font-medium ${tone}`}>{label}</div>
  );
}

export function StepPipeline() {
  const { operation, updatePipelineField } = useOperation();
  const qaAgent = operation.agents.find((agent) => agent.category === 'qa');
  const workers = operation.agents.filter((agent) => agent.category === 'worker');

  function updateList(field: 'preCreationGate' | 'qcGate', index: number, value: string) {
    const next = [...operation.pipeline[field]];
    next[index] = value;
    updatePipelineField(field, next);
  }

  function removeListItem(field: 'preCreationGate' | 'qcGate', index: number) {
    updatePipelineField(
      field,
      operation.pipeline[field].filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function addListItem(field: 'preCreationGate' | 'qcGate') {
    updatePipelineField(field, [...operation.pipeline[field], '']);
  }

  return (
    <section className="space-y-6">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Step 3</div>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-canvas-ink">
          Configure the pipeline
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-canvas-muted">
          Define the handoff logic, review gates, and freshness rules that keep outputs useful instead of merely busy.
        </p>
      </div>

      <div className="rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Live flow</div>
        <div className="mt-5 flex flex-col gap-4">
          <FlowChip label="Founder" tone="bg-founder/10 text-founder" />
          <div className="ml-7 h-12 w-px bg-canvas-border" />
          <FlowChip label={operation.ceoName || 'CEO'} tone="bg-ceo/10 text-ceo" />
          <div className="ml-7 h-12 w-px bg-canvas-border" />
          <FlowChip
            label={qaAgent?.name || 'QA agent pending'}
            tone="bg-qa/10 text-qa"
          />
          <div className="ml-7 h-12 w-px bg-canvas-border" />
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {workers.length ? (
              workers.map((worker) => (
                <FlowChip
                  key={worker.id}
                  label={`${worker.name} · ${worker.roleLabel}`}
                  tone="bg-worker/10 text-worker"
                />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-canvas-border bg-canvas-soft px-4 py-5 text-sm text-canvas-muted">
                Add worker agents to complete the pipeline.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="space-y-4 rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-canvas-ink">Pre-Creation Gate</div>
              <p className="mt-1 text-sm text-canvas-muted">
                The founder or CEO must answer these before new work starts.
              </p>
            </div>
          </div>
          {operation.pipeline.preCreationGate.map((question, index) => (
            <div key={`pre-${index}`} className="flex items-start gap-3">
              <span className="mt-3 rounded-full bg-canvas-soft px-3 py-1 text-xs text-canvas-muted">
                {index + 1}
              </span>
              <textarea
                value={question}
                onChange={(event) => updateList('preCreationGate', index, event.target.value)}
                rows={3}
                className="w-full rounded-3xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
              />
              <button
                type="button"
                onClick={() => removeListItem('preCreationGate', index)}
                className="mt-2 rounded-full px-3 py-2 text-xs text-canvas-muted transition hover:bg-canvas-soft hover:text-canvas-ink"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('preCreationGate')}
            className="rounded-full border border-canvas-border px-4 py-2 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
          >
            Add question
          </button>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <div>
            <div className="text-lg font-semibold text-canvas-ink">QC Gate</div>
            <p className="mt-1 text-sm text-canvas-muted">
              QA uses this checklist to block low-confidence work before release.
            </p>
          </div>
          {operation.pipeline.qcGate.map((item, index) => (
            <div key={`qc-${index}`} className="flex items-start gap-3">
              <span className="mt-3 rounded-full bg-canvas-soft px-3 py-1 text-xs text-canvas-muted">
                {index + 1}
              </span>
              <textarea
                value={item}
                onChange={(event) => updateList('qcGate', index, event.target.value)}
                rows={2}
                className="w-full rounded-3xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
              />
              <button
                type="button"
                onClick={() => removeListItem('qcGate', index)}
                className="mt-2 rounded-full px-3 py-2 text-xs text-canvas-muted transition hover:bg-canvas-soft hover:text-canvas-ink"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('qcGate')}
            className="rounded-full border border-canvas-border px-4 py-2 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
          >
            Add QC item
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <span className="mb-2 block text-sm font-medium text-canvas-ink">Recency threshold</span>
          <input
            type="number"
            min={1}
            value={operation.pipeline.recencyWindowDays}
            onChange={(event) =>
              updatePipelineField('recencyWindowDays', Number(event.target.value) || 1)
            }
            className="mt-3 w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
          />
          <p className="mt-3 text-sm text-canvas-muted">
            Preferred freshness window in days for research and monitoring.
          </p>
        </label>

        <label className="rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <span className="mb-2 block text-sm font-medium text-canvas-ink">Hard cutoff</span>
          <input
            type="number"
            min={1}
            value={operation.pipeline.hardCutoffDays}
            onChange={(event) =>
              updatePipelineField('hardCutoffDays', Number(event.target.value) || 1)
            }
            className="mt-3 w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
          />
          <p className="mt-3 text-sm text-canvas-muted">
            Anything older than this requires explicit founder sign-off.
          </p>
        </label>

        <div className="rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-canvas-ink">Idle state behavior</div>
              <p className="mt-2 text-sm text-canvas-muted">
                When enabled, agents pause instead of inventing work when no fresh signals appear.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-canvas-soft px-3 py-2">
              <span className="text-xs font-medium text-canvas-muted">idle</span>
              <input
                type="checkbox"
                checked={operation.pipeline.idleStateEnabled}
                onChange={(event) => updatePipelineField('idleStateEnabled', event.target.checked)}
                className="h-4 w-4 rounded border-canvas-border text-accent focus:ring-accent"
                title="Pause the pipeline when nothing meaningful has changed."
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
