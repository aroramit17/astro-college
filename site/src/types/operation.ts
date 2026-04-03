export const markdownFileOrder = [
  'SOUL.md',
  'TEAM.md',
  'PIPELINE.md',
  'BUDGET.md',
  'PLAYBOOK.md',
] as const;

export type MarkdownFileKey = (typeof markdownFileOrder)[number];

export type CommunicationStyle = 'Structured' | 'Collaborative' | 'Executive';

export type Platform =
  | 'OpenAI'
  | 'Claude'
  | 'Gemini'
  | 'Perplexity'
  | 'Codex'
  | 'Hybrid';

export type AgentRoleId =
  | 'research-analyst'
  | 'signal-monitor'
  | 'qa-guardian'
  | 'brief-writer'
  | 'launch-operator'
  | 'developer-scout'
  | 'competitive-intel'
  | 'knowledge-curator';

export type AgentCategory = 'qa' | 'worker';

export interface ToolTarget {
  id: string;
  name: string;
  githubUrl: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Agent {
  id: string;
  name: string;
  roleId: AgentRoleId;
  roleLabel: string;
  category: AgentCategory;
  platform: Platform;
  soulDescription: string;
  skills: string[];
  deliverableFormat: string;
  definitionOfDone: ChecklistItem[];
  selfCheckItems: ChecklistItem[];
}

export interface PipelineConfig {
  preCreationGate: string[];
  qcGate: string[];
  recencyWindowDays: number;
  hardCutoffDays: number;
  idleStateEnabled: boolean;
}

export type BudgetBehavior = 'Auto-pause' | 'Notify & continue' | 'Hard stop';

export interface BudgetConfig {
  enabled: boolean;
  warningThreshold: number;
  behavior: BudgetBehavior;
  perAgentBudgets: Record<string, string>;
}

export interface Operation {
  templateId: string;
  operationName: string;
  ceoName: string;
  missionStatement: string;
  targetTools: ToolTarget[];
  founderDescription: string;
  communicationStyle: CommunicationStyle;
  agents: Agent[];
  pipeline: PipelineConfig;
  budget: BudgetConfig;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  accentLabel: string;
  agentCount: number;
  defaults: Operation;
}

export interface MarkdownDocument {
  key: MarkdownFileKey;
  title: string;
  description: string;
  content: string;
}

export interface ConsistencyStatus {
  label: string;
  level: 'ok' | 'warn';
  issues: string[];
}
