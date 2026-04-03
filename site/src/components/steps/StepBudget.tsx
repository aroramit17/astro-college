import { useOperation } from '../../context/OperationContext';

export function StepBudget() {
  const { operation, updateBudgetField, updateAgentBudget } = useOperation();
  const subjects = [
    { key: 'ceo', label: `${operation.ceoName || 'CEO'} (CEO)` },
    ...operation.agents.map((agent) => ({
      key: agent.id,
      label: `${agent.name} (${agent.roleLabel})`,
    })),
  ];

  return (
    <section className="space-y-6">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Step 4</div>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-canvas-ink">
          Set budget rules
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-canvas-muted">
          Decide how the operation should behave when token usage starts climbing, then give each agent a clear working allowance.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5 rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <label className="flex items-center justify-between rounded-3xl border border-canvas-border bg-canvas-soft px-5 py-4">
            <div>
              <div className="text-sm font-medium text-canvas-ink">Enable token budgets</div>
              <div className="mt-1 text-sm text-canvas-muted">
                Turn on budget monitoring and export the guardrails into `BUDGET.md`.
              </div>
            </div>
            <input
              type="checkbox"
              checked={operation.budget.enabled}
              onChange={(event) => updateBudgetField('enabled', event.target.checked)}
              className="h-5 w-5 rounded border-canvas-border text-accent focus:ring-accent"
            />
          </label>

          <div className="rounded-3xl border border-canvas-border bg-canvas-soft p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-canvas-ink">Warning threshold</div>
                <div className="mt-1 text-sm text-canvas-muted">
                  Alert the team before the budget is fully exhausted.
                </div>
              </div>
              <div className="rounded-full bg-canvas-panel px-3 py-1 font-mono text-sm text-accent">
                {operation.budget.warningThreshold}%
              </div>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              value={operation.budget.warningThreshold}
              onChange={(event) =>
                updateBudgetField('warningThreshold', Number(event.target.value))
              }
              className="mt-5 w-full accent-accent"
            />
          </div>

          <fieldset className="rounded-3xl border border-canvas-border bg-canvas-soft p-5">
            <legend className="px-2 text-sm font-medium text-canvas-ink">Budget behavior</legend>
            <div className="mt-3 space-y-3">
              {(['Auto-pause', 'Notify & continue', 'Hard stop'] as const).map((behavior) => (
                <label
                  key={behavior}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-canvas-border bg-canvas-panel px-4 py-3 transition hover:border-accent/50"
                >
                  <div>
                    <div className="text-sm font-medium text-canvas-ink">{behavior}</div>
                    <div className="text-sm text-canvas-muted">
                      {behavior === 'Auto-pause'
                        ? 'Pause execution and require a review before resuming.'
                        : behavior === 'Notify & continue'
                          ? 'Warn the team but let the pipeline finish.'
                          : 'Stop immediately when the cap is hit.'}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="budget-behavior"
                    checked={operation.budget.behavior === behavior}
                    onChange={() => updateBudgetField('behavior', behavior)}
                    className="h-4 w-4 border-canvas-border text-accent focus:ring-accent"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <div>
            <div className="text-lg font-semibold text-canvas-ink">Per-agent budget table</div>
            <p className="mt-1 text-sm text-canvas-muted">
              Use simple token caps like `120k`, `350k`, or `1.2M`. Leave values blank if you plan to finalize later.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-canvas-border">
            <table className="min-w-full divide-y divide-canvas-border text-left">
              <thead className="bg-canvas-soft">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.24em] text-canvas-muted">
                    Agent
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.24em] text-canvas-muted">
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-border bg-canvas-panel">
                {subjects.map((subject) => (
                  <tr key={subject.key}>
                    <td className="px-4 py-4 text-sm font-medium text-canvas-ink">{subject.label}</td>
                    <td className="px-4 py-4">
                      <input
                        value={operation.budget.perAgentBudgets[subject.key] ?? ''}
                        onChange={(event) => updateAgentBudget(subject.key, event.target.value)}
                        className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                        placeholder="120k"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
