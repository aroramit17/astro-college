import type {
  Agent,
  ConsistencyStatus,
  MarkdownDocument,
  MarkdownFileKey,
  Operation,
} from '../types/operation';

export const defaultMarkdownOverrides: Record<MarkdownFileKey, string> = {
  'SOUL.md': '',
  'TEAM.md': '',
  'PIPELINE.md': '',
  'BUDGET.md': '',
  'PLAYBOOK.md': '',
};

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n');
}

function checklist(items: { text: string; checked: boolean }[]) {
  return items.map((item) => `- [${item.checked ? 'x' : ' '}] ${item.text}`).join('\n');
}

function renderTools(operation: Operation) {
  if (!operation.targetTools.length) {
    return '- None specified yet';
  }

  return operation.targetTools
    .map((tool) => {
      const suffix = tool.githubUrl ? ` ([GitHub](${tool.githubUrl}))` : '';
      return `- ${tool.name}${suffix}`;
    })
    .join('\n');
}

function renderAgent(agent: Agent) {
  return `## ${agent.name}
Role: ${agent.roleLabel}
Platform: ${agent.platform}
Category: ${agent.category === 'qa' ? 'QA review' : 'Worker'}

### Soul
${agent.soulDescription}

### Skills
${list(agent.skills)}

### Deliverable Format
${agent.deliverableFormat}

### Definition of Done
${checklist(agent.definitionOfDone)}

### Self-check
${checklist(agent.selfCheckItems)}`;
}

function budgetSubjectLabels(operation: Operation) {
  return [
    { key: 'ceo', label: `${operation.ceoName || 'CEO'} (CEO)` },
    ...operation.agents.map((agent) => ({
      key: agent.id,
      label: `${agent.name} (${agent.roleLabel})`,
    })),
  ];
}

function buildSoul(operation: Operation) {
  return `# SOUL.md

## Operation Identity
- Operation name: ${operation.operationName || 'Untitled operation'}
- CEO agent: ${operation.ceoName || 'Unassigned'}
- Communication style: ${operation.communicationStyle}

## Mission
${operation.missionStatement || 'Define the mission statement in Step 1.'}

## Founder Perspective
${operation.founderDescription || 'Add founder guidance so the team knows the decision-maker context.'}

## Target Tools
${renderTools(operation)}

## Core Behaviors
- Stay current on information with explicit recency labels.
- Separate verified facts from interpretation in every handoff.
- Escalate early when evidence is weak or requirements conflict.
- Keep updates compact, operational, and decision-oriented.

## Anti-patterns
- Do not pass along hype without evidence.
- Do not hide uncertainty behind polished writing.
- Do not duplicate work across agents when a prior handoff exists.
- Do not ship outputs that fail QA review for dates, sources, or contradictions.

## Escalation Protocol
1. Workers flag blockers with evidence and suggested next action.
2. QA agent either clears the work or returns a concrete fix list.
3. CEO agent resolves tradeoffs and requests founder input when stakes are high.
4. Founder decides on risk acceptance, tool changes, or mission changes.`;
}

function buildTeam(operation: Operation) {
  const qaExists = operation.agents.some((agent) => agent.category === 'qa');

  return `# TEAM.md

## Leadership
- Founder: mission sponsor and final escalation point
- CEO agent: ${operation.ceoName || 'Unassigned'} drives prioritization, sequencing, and final synthesis

## Team Shape
- Total agents: ${operation.agents.length}
- QA coverage: ${qaExists ? 'Present' : 'Missing, add a QA agent before export'}

${operation.agents.length ? operation.agents.map(renderAgent).join('\n\n') : '## No agents yet\nAdd agents in Step 2 to define roles, skills, and quality bars.'}

## Team-wide Rules
- Every agent writes with the selected communication style: ${operation.communicationStyle}.
- Naming should stay consistent across files and summaries.
- Deliverables must be reviewable without opening extra context first.`;
}

function buildPipeline(operation: Operation) {
  const qaAgents = operation.agents.filter((agent) => agent.category === 'qa');
  const workerAgents = operation.agents.filter((agent) => agent.category === 'worker');

  return `# PIPELINE.md

## Flow
Founder -> ${operation.ceoName || 'CEO'} -> ${qaAgents[0]?.name || 'QA Agent'} -> ${workerAgents.map((agent) => agent.name).join(', ') || 'Workers'}

## Pre-Creation Gate
${list(operation.pipeline.preCreationGate)}

## QC Gate
${list(operation.pipeline.qcGate)}

## Recency Rules
- Working window: ${operation.pipeline.recencyWindowDays} days
- Hard cutoff: ${operation.pipeline.hardCutoffDays} days
- Information older than the hard cutoff needs explicit founder approval.

## Idle State
- Idle mode: ${operation.pipeline.idleStateEnabled ? 'Enabled' : 'Disabled'}
- When enabled, agents pause instead of generating speculative filler when no fresh signals exist.

## Handoff Protocol
1. Founder defines the mission and success condition.
2. CEO decomposes work and assigns agents.
3. Workers gather evidence, produce deliverables, and note open questions.
4. QA checks consistency, completeness, and recency before release.
5. CEO publishes the final decision-ready brief.`;
}

function buildBudget(operation: Operation) {
  const tableRows = budgetSubjectLabels(operation)
    .map(({ key, label }) => `| ${label} | ${operation.budget.perAgentBudgets[key] || 'Not set'} |`)
    .join('\n');

  return `# BUDGET.md

## Budget Mode
- Enabled: ${operation.budget.enabled ? 'Yes' : 'No'}
- Warning threshold: ${operation.budget.warningThreshold}%
- Behavior: ${operation.budget.behavior}

## Per-Agent Budgets
| Agent | Budget |
| --- | --- |
${tableRows}

## Cost Controls
- Reserve headroom for QA and final synthesis.
- Trigger alerts before crossing the warning threshold.
- Prefer smaller, role-fit agents for monitoring and triage tasks.
- Hard-stop conditions should force founder review before budget reset.`;
}

function buildPlaybook(operation: Operation) {
  const workerNames = operation.agents
    .filter((agent) => agent.category === 'worker')
    .map((agent) => agent.name)
    .join(', ');

  return `# PLAYBOOK.md

## Naming Convention
- Founder remains "Founder" in diagrams and markdown.
- CEO agent name: ${operation.ceoName || 'Unassigned'}.
- Worker roster: ${workerNames || 'No workers added yet'}.

## Cross-Agent Rules
- Use the same source naming, dates, and labels in every file.
- If two agents disagree, QA documents the conflict before the CEO decides.
- Escalate any source older than ${operation.pipeline.hardCutoffDays} days.
- Any operation change should update all five markdown files before export.

## Anti-Patterns to Avoid
- Hidden assumptions in summaries
- Platform mismatch for the task
- Budget-heavy work with low decision value
- Shipping without a named owner for the next action

## Founder Review Triggers
- Missing QA coverage
- Empty mission statement
- Missing budgets while budget mode is enabled
- Pipeline cutoffs that make the recency policy contradictory

## Export Pack
- SOUL.md defines mission and behavior
- TEAM.md defines responsibilities
- PIPELINE.md defines flow and gates
- BUDGET.md defines spend controls
- PLAYBOOK.md keeps cross-file rules aligned`;
}

export function buildMarkdownDocuments(
  operation: Operation,
  overrides: Record<MarkdownFileKey, string>,
): MarkdownDocument[] {
  const generated: Record<MarkdownFileKey, string> = {
    'SOUL.md': buildSoul(operation),
    'TEAM.md': buildTeam(operation),
    'PIPELINE.md': buildPipeline(operation),
    'BUDGET.md': buildBudget(operation),
    'PLAYBOOK.md': buildPlaybook(operation),
  };

  return [
    {
      key: 'SOUL.md',
      title: 'Mission & Personality',
      description: 'Mission, founder context, communication style, and anti-patterns.',
      content: overrides['SOUL.md'] || generated['SOUL.md'],
    },
    {
      key: 'TEAM.md',
      title: 'Agent Team',
      description: 'Agent roster, skills, deliverables, and review coverage.',
      content: overrides['TEAM.md'] || generated['TEAM.md'],
    },
    {
      key: 'PIPELINE.md',
      title: 'Pipeline Flow',
      description: 'Gates, recency policy, and handoff logic.',
      content: overrides['PIPELINE.md'] || generated['PIPELINE.md'],
    },
    {
      key: 'BUDGET.md',
      title: 'Budget Rules',
      description: 'Warning thresholds, behaviors, and agent caps.',
      content: overrides['BUDGET.md'] || generated['BUDGET.md'],
    },
    {
      key: 'PLAYBOOK.md',
      title: 'Cross-agent Playbook',
      description: 'Naming, escalation, anti-patterns, and consistency rules.',
      content: overrides['PLAYBOOK.md'] || generated['PLAYBOOK.md'],
    },
  ];
}

export function buildConsistencyStatuses(
  operation: Operation,
  documents: MarkdownDocument[],
): Record<MarkdownFileKey, ConsistencyStatus> {
  const qaExists = operation.agents.some((agent) => agent.category === 'qa');
  const budgetMissing =
    operation.budget.enabled &&
    [operation.budget.perAgentBudgets.ceo, ...operation.agents.map((agent) => operation.budget.perAgentBudgets[agent.id])]
      .some((value) => !value);
  const contradictoryRecency =
    operation.pipeline.hardCutoffDays <= operation.pipeline.recencyWindowDays;

  const issuesByFile: Record<MarkdownFileKey, string[]> = {
    'SOUL.md': [
      !operation.operationName ? 'Operation name is still missing.' : '',
      !operation.missionStatement ? 'Mission statement is still missing.' : '',
      !operation.targetTools.length ? 'Add at least one target tool for better defaults.' : '',
    ].filter(Boolean),
    'TEAM.md': [
      !operation.agents.length ? 'Add at least one worker agent.' : '',
      !qaExists ? 'QA coverage is missing.' : '',
    ].filter(Boolean),
    'PIPELINE.md': [
      contradictoryRecency ? 'Hard cutoff should be greater than the working window.' : '',
      operation.pipeline.preCreationGate.length < 4 ? 'Pre-creation gate should keep four prompts.' : '',
    ].filter(Boolean),
    'BUDGET.md': [
      budgetMissing ? 'Budget mode is enabled but one or more agent budgets are empty.' : '',
    ].filter(Boolean),
    'PLAYBOOK.md': [
      !qaExists ? 'Cross-file rule set expects a QA agent.' : '',
      !operation.missionStatement ? 'Founder review triggers will be noisy until the mission exists.' : '',
      contradictoryRecency ? 'Recency rules conflict across files.' : '',
    ].filter(Boolean),
  };

  return documents.reduce(
    (accumulator, document) => {
      const issues = issuesByFile[document.key];
      accumulator[document.key] = {
        label: issues.length ? 'Needs attention' : 'Aligned',
        level: issues.length ? 'warn' : 'ok',
        issues,
      };
      return accumulator;
    },
    {} as Record<MarkdownFileKey, ConsistencyStatus>,
  );
}
