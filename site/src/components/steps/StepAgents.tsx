import { useState } from 'react';
import { AgentModal } from '../AgentModal';
import { useOperation } from '../../context/OperationContext';
import { rolePresets } from '../../data/rolePresets';
import type { Agent } from '../../types/operation';

const roleBadgeClasses: Record<string, string> = {
  qa: 'bg-qa/15 text-qa',
  worker: 'bg-worker/15 text-worker',
};

export function StepAgents() {
  const { operation, hydrateAgentDraft, saveAgent, deleteAgent } = useOperation();
  const [draft, setDraft] = useState<Agent | null>(null);
  const [open, setOpen] = useState(false);

  function openNewAgent() {
    setDraft(hydrateAgentDraft(rolePresets[0].id));
    setOpen(true);
  }

  function editAgent(agent: Agent) {
    setDraft(JSON.parse(JSON.stringify(agent)) as Agent);
    setOpen(true);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Step 2</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-canvas-ink">
            Build the agent team
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-canvas-muted">
            Create agents with role-fit defaults, platform guidance, and explicit quality bars so the operation can scale without drifting.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewAgent}
          className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
        >
          + Add Agent
        </button>
      </div>

      {!operation.agents.some((agent) => agent.category === 'qa') ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 dark:border-amber-950 dark:bg-amber-950/35 dark:text-amber-100">
          A QA agent is still missing. The builder can continue, but exports will warn until a reviewer is added.
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {operation.agents.length ? (
          operation.agents.map((agent) => (
            <article
              key={agent.id}
              className="rounded-[2rem] border border-canvas-border bg-canvas-panel p-5 shadow-card transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-2xl font-semibold text-canvas-ink">{agent.name}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${roleBadgeClasses[agent.category]}`}
                    >
                      {agent.category === 'qa' ? 'QA' : 'Worker'}
                    </span>
                    <span className="rounded-full bg-canvas-soft px-3 py-1 text-xs font-medium text-canvas-muted">
                      {agent.platform}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editAgent(agent)}
                    className="rounded-full border border-canvas-border px-3 py-2 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAgent(agent.id)}
                    className="rounded-full border border-canvas-border px-3 py-2 text-sm text-canvas-muted transition hover:border-rose-300 hover:text-rose-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 text-sm font-medium text-canvas-ink">{agent.roleLabel}</div>
              <p className="mt-2 text-sm leading-6 text-canvas-muted">{agent.soulDescription}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {agent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-canvas-border bg-canvas-soft px-3 py-1 text-xs text-canvas-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-canvas-border bg-canvas-panel p-8 text-center text-canvas-muted lg:col-span-2">
            No agents yet. Add a few specialists, then tighten the pipeline in the next step.
          </div>
        )}
      </div>

      <AgentModal
        agent={draft}
        open={open}
        onClose={() => {
          setOpen(false);
          setDraft(null);
        }}
        onSave={(agent) => {
          saveAgent(agent);
          setOpen(false);
          setDraft(null);
        }}
        onDelete={(agentId) => {
          deleteAgent(agentId);
          setOpen(false);
          setDraft(null);
        }}
      />
    </section>
  );
}
