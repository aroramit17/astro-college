import type { Agent, Operation } from '../types/operation';

interface SidebarDiagramProps {
  operation: Operation;
  mobile?: boolean;
}

function DiagramNode({
  title,
  subtitle,
  colorClass,
  badge,
}: {
  title: string;
  subtitle: string;
  colorClass: string;
  badge: string;
}) {
  return (
    <div className={`relative rounded-3xl border border-canvas-border bg-canvas-panel p-4 ${colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg font-semibold text-canvas-ink">{title}</div>
          <div className="mt-1 text-sm text-canvas-muted">{subtitle}</div>
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-700 dark:bg-slate-950/40 dark:text-slate-100">
          {badge}
        </span>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="relative ml-7 h-14 w-px bg-canvas-border">
      <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_6px_rgba(20,184,166,0.08)] animate-pulseTrack" />
    </div>
  );
}

function WorkerList({ workers }: { workers: Agent[] }) {
  if (!workers.length) {
    return (
      <div className="rounded-3xl border border-dashed border-canvas-border bg-canvas-soft px-4 py-5 text-sm text-canvas-muted">
        Add worker agents to populate the live hierarchy.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workers.map((worker) => (
        <DiagramNode
          key={worker.id}
          title={worker.name}
          subtitle={worker.roleLabel}
          badge={worker.platform}
          colorClass="before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-3xl before:bg-worker"
        />
      ))}
    </div>
  );
}

export function SidebarDiagram({ operation, mobile = false }: SidebarDiagramProps) {
  const qaAgents = operation.agents.filter((agent) => agent.category === 'qa');
  const workers = operation.agents.filter((agent) => agent.category === 'worker');
  const qaAgent = qaAgents[0];

  return (
    <aside
      className={`rounded-[2rem] border border-canvas-border bg-canvas-panel/90 p-5 shadow-card ${
        mobile ? '' : 'lg:sticky lg:top-24'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Live Architecture</div>
          <h3 className="mt-2 font-display text-2xl font-semibold text-canvas-ink">Signal flow</h3>
        </div>
        <div className="rounded-full bg-canvas-soft px-3 py-1 text-xs text-canvas-muted">
          {operation.agents.length + 2} nodes
        </div>
      </div>

      <div className="mt-6 space-y-0">
        <DiagramNode
          title="Founder"
          subtitle={operation.founderDescription || 'Mission owner'}
          badge="Founder"
          colorClass="before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-3xl before:bg-founder"
        />
        <Connector />
        <DiagramNode
          title={operation.ceoName || 'CEO'}
          subtitle="Chief coordinating agent"
          badge="CEO"
          colorClass="before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-3xl before:bg-ceo"
        />
        <Connector />
        <DiagramNode
          title={qaAgent?.name || 'QA Agent'}
          subtitle={qaAgent?.roleLabel || 'Add a QA reviewer to strengthen exports'}
          badge={qaAgent?.platform || 'QA'}
          colorClass="before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-3xl before:bg-qa"
        />
        <Connector />
        <WorkerList workers={workers} />
      </div>
    </aside>
  );
}
