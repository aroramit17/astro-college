import type {
  AgentCategory,
  AgentRoleId,
  ChecklistItem,
  Platform,
} from '../types/operation';
import { createId } from '../utils/ids';

export interface RolePreset {
  id: AgentRoleId;
  label: string;
  category: AgentCategory;
  suggestedPlatform: Platform;
  descriptionPlaceholder: string;
  defaultSkills: string[];
  deliverableFormat: string;
  definitionOfDone: ChecklistItem[];
  selfCheckItems: ChecklistItem[];
}

function makeChecklist(items: string[]) {
  return items.map((text) => ({
    id: createId('check'),
    text,
    checked: true,
  }));
}

export const rolePresets: RolePreset[] = [
  {
    id: 'research-analyst',
    label: 'Research Analyst',
    category: 'worker',
    suggestedPlatform: 'Perplexity',
    descriptionPlaceholder:
      'Synthesizes the clearest evidence, timestamps every source, and keeps summaries decision-ready.',
    defaultSkills: ['source verification', 'summarization', 'trend extraction'],
    deliverableFormat:
      '## Weekly Findings\n- Ranked signals\n- Evidence with links\n- Recommendation',
    definitionOfDone: makeChecklist([
      'Primary sources are linked',
      'Findings are ranked by importance',
      'Recency is clearly noted',
    ]),
    selfCheckItems: makeChecklist([
      'Did I separate facts from inference?',
      'Would the CEO know the next move in 30 seconds?',
      'Did I remove soft, repetitive wording?',
    ]),
  },
  {
    id: 'signal-monitor',
    label: 'Signal Monitor',
    category: 'worker',
    suggestedPlatform: 'OpenAI',
    descriptionPlaceholder:
      'Watches fast-moving surfaces, triages new activity, and escalates only when thresholds are crossed.',
    defaultSkills: ['feed monitoring', 'pattern detection', 'alert triage'],
    deliverableFormat:
      '## Signal Log\n- Trigger\n- Severity\n- Evidence\n- Escalation path',
    definitionOfDone: makeChecklist([
      'Signals are grouped by severity',
      'False positives are filtered out',
      'Each alert includes next action',
    ]),
    selfCheckItems: makeChecklist([
      'Is this truly new information?',
      'Did I avoid forwarding noise?',
      'Would a founder care today?',
    ]),
  },
  {
    id: 'qa-guardian',
    label: 'QA Guardian',
    category: 'qa',
    suggestedPlatform: 'Claude',
    descriptionPlaceholder:
      'Audits assumptions, checks completeness, and blocks low-confidence work from being shipped.',
    defaultSkills: ['quality assurance', 'consistency review', 'risk spotting'],
    deliverableFormat:
      '## QA Verdict\n- Pass or block\n- Missing evidence\n- Fix recommendations',
    definitionOfDone: makeChecklist([
      'Every claim is supported',
      'Formatting is consistent across files',
      'Action items are testable',
    ]),
    selfCheckItems: makeChecklist([
      'Did I challenge hidden assumptions?',
      'Did I verify names, dates, and links?',
      'Did I state what remains uncertain?',
    ]),
  },
  {
    id: 'brief-writer',
    label: 'Brief Writer',
    category: 'worker',
    suggestedPlatform: 'Claude',
    descriptionPlaceholder:
      'Turns raw analysis into crisp, executive-ready briefs with clear decisions and low fluff.',
    defaultSkills: ['executive writing', 'decision framing', 'briefing design'],
    deliverableFormat:
      '## Executive Brief\n### What changed\n### Why it matters\n### Recommended move',
    definitionOfDone: makeChecklist([
      'The brief can be skimmed in under two minutes',
      'Every section drives a decision',
      'No duplicated evidence remains',
    ]),
    selfCheckItems: makeChecklist([
      'Would this survive a CEO skim?',
      'Did I keep only essential context?',
      'Did I state the recommendation plainly?',
    ]),
  },
  {
    id: 'launch-operator',
    label: 'Launch Operator',
    category: 'worker',
    suggestedPlatform: 'Hybrid',
    descriptionPlaceholder:
      'Coordinates launch calendars, dependencies, and public-facing milestones across channels.',
    defaultSkills: ['timeline management', 'launch tracking', 'dependency mapping'],
    deliverableFormat:
      '## Launch Tracker\n- Milestone\n- Owner\n- Status\n- Risk\n- Next checkpoint',
    definitionOfDone: makeChecklist([
      'All milestone owners are named',
      'Risks include mitigation plans',
      'Deadlines are explicit',
    ]),
    selfCheckItems: makeChecklist([
      'Are blockers visible before they become urgent?',
      'Did I link launch evidence?',
      'Did I keep status terms consistent?',
    ]),
  },
  {
    id: 'developer-scout',
    label: 'Developer Scout',
    category: 'worker',
    suggestedPlatform: 'Codex',
    descriptionPlaceholder:
      'Monitors developer tools, release notes, repositories, and breaking changes with practical impact.',
    defaultSkills: ['release note parsing', 'GitHub scanning', 'developer tooling'],
    deliverableFormat:
      '## Dev Tool Digest\n- Release\n- Breaking changes\n- Migration notes\n- Recommended response',
    definitionOfDone: makeChecklist([
      'Release notes are interpreted in plain language',
      'Breaking changes include affected workflows',
      'Upgrade urgency is labeled',
    ]),
    selfCheckItems: makeChecklist([
      'Did I verify the source of the release?',
      'Is the migration advice actionable?',
      'Did I flag uncertainty clearly?',
    ]),
  },
  {
    id: 'competitive-intel',
    label: 'Competitive Intel',
    category: 'worker',
    suggestedPlatform: 'Gemini',
    descriptionPlaceholder:
      'Builds concise competitive snapshots that separate messaging moves from durable strategic shifts.',
    defaultSkills: ['competitor tracking', 'messaging analysis', 'market comparison'],
    deliverableFormat:
      '## Competitive Snapshot\n- Competitor move\n- Impact\n- Strategic read\n- Recommended response',
    definitionOfDone: makeChecklist([
      'The move is compared to prior behavior',
      'Evidence is attached to each claim',
      'Implications are concrete',
    ]),
    selfCheckItems: makeChecklist([
      'Did I avoid hype and speculation?',
      'Did I note what is still unknown?',
      'Would this change our plan?',
    ]),
  },
  {
    id: 'knowledge-curator',
    label: 'Knowledge Curator',
    category: 'worker',
    suggestedPlatform: 'OpenAI',
    descriptionPlaceholder:
      'Maintains clean operational memory so recurring work stays consistent, searchable, and reusable.',
    defaultSkills: ['documentation', 'taxonomy design', 'knowledge base hygiene'],
    deliverableFormat:
      '## Memory Update\n- New facts\n- Retired facts\n- Reusable prompts\n- Follow-up gaps',
    definitionOfDone: makeChecklist([
      'Notes are structured for reuse',
      'Old facts are archived or updated',
      'Terminology matches the operation',
    ]),
    selfCheckItems: makeChecklist([
      'Can another agent find this later?',
      'Did I remove stale guidance?',
      'Are labels consistent with the playbook?',
    ]),
  },
];

export function getRolePreset(roleId: AgentRoleId) {
  return rolePresets.find((preset) => preset.id === roleId) ?? rolePresets[0];
}
