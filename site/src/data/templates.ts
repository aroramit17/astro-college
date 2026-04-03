import { celestialNamePool } from './celestialNames';
import { getRolePreset } from './rolePresets';
import type {
  Agent,
  AgentRoleId,
  Operation,
  PipelineConfig,
  TemplateDefinition,
} from '../types/operation';
import { createId } from '../utils/ids';

function createAgent(name: string, roleId: AgentRoleId): Agent {
  const preset = getRolePreset(roleId);

  return {
    id: createId('agent'),
    name,
    roleId,
    roleLabel: preset.label,
    category: preset.category,
    platform: preset.suggestedPlatform,
    soulDescription: preset.descriptionPlaceholder,
    skills: [...preset.defaultSkills],
    deliverableFormat: preset.deliverableFormat,
    definitionOfDone: preset.definitionOfDone.map((item) => ({ ...item, id: createId('dod') })),
    selfCheckItems: preset.selfCheckItems.map((item) => ({ ...item, id: createId('self') })),
  };
}

function buildPipeline(overrides?: Partial<PipelineConfig>): PipelineConfig {
  return {
    preCreationGate: [
      'What single decision should this operation unlock?',
      'Which sources are authoritative enough to trust?',
      'What would make the output unusable even if it looks polished?',
      'Who should be alerted if the team gets blocked?',
    ],
    qcGate: [
      'Evidence links are present',
      'Dates and recency labels are explicit',
      'The QA agent reviewed high-impact sections',
      'The CEO summary includes a recommendation',
      'No duplicate tasks remain across agents',
      'Escalation conditions are clearly stated',
    ],
    recencyWindowDays: 30,
    hardCutoffDays: 90,
    idleStateEnabled: true,
    ...overrides,
  };
}

function buildOperation(partial: Partial<Operation>): Operation {
  return {
    templateId: partial.templateId ?? 'scratch',
    operationName: partial.operationName ?? '',
    ceoName: partial.ceoName ?? celestialNamePool[0].name,
    missionStatement: partial.missionStatement ?? '',
    targetTools: partial.targetTools ?? [],
    founderDescription:
      partial.founderDescription ??
      'Founder sets the mission, approves escalations, and uses concise written updates.',
    communicationStyle: partial.communicationStyle ?? 'Structured',
    agents: partial.agents ?? [],
    pipeline: partial.pipeline ?? buildPipeline(),
    budget: partial.budget ?? {
      enabled: false,
      warningThreshold: 75,
      behavior: 'Auto-pause',
      perAgentBudgets: {},
    },
  };
}

export const blankOperation = buildOperation({
  templateId: 'scratch',
  operationName: '',
  missionStatement: '',
  targetTools: [],
});

export const templates: TemplateDefinition[] = [
  {
    id: 'youtube-research',
    name: 'YouTube Research',
    description:
      'Track channels, summarize fresh videos, and route only the most decision-worthy creator insights.',
    accentLabel: 'Audience Signals',
    agentCount: 3,
    defaults: buildOperation({
      templateId: 'youtube-research',
      operationName: 'Creator Insight Engine',
      ceoName: 'Lyra',
      missionStatement:
        'Continuously identify the most relevant YouTube shifts, audience patterns, and creator moves for weekly strategy calls.',
      targetTools: [
        { id: createId('tool'), name: 'YouTube', githubUrl: '' },
        { id: createId('tool'), name: 'Notion', githubUrl: 'https://github.com/makenotion/notion-sdk-js' },
      ],
      founderDescription:
        'Founder wants concise, evidence-backed creator intelligence with strong timestamps and no filler.',
      communicationStyle: 'Collaborative',
      agents: [
        createAgent('Comet', 'signal-monitor'),
        createAgent('Selene', 'brief-writer'),
        createAgent('Draco', 'qa-guardian'),
      ],
      budget: {
        enabled: true,
        warningThreshold: 72,
        behavior: 'Notify & continue',
        perAgentBudgets: {
          ceo: '140k',
        },
      },
    }),
  },
  {
    id: 'competitor-monitor',
    name: 'Competitor Monitor',
    description:
      'Watch competitive launches, messaging changes, and market posture without letting noise flood the team.',
    accentLabel: 'Market Watch',
    agentCount: 4,
    defaults: buildOperation({
      templateId: 'competitor-monitor',
      operationName: 'Competitive Radar Room',
      ceoName: 'Atlas',
      missionStatement:
        'Surface meaningful competitor moves, explain why they matter, and recommend whether we respond, ignore, or investigate deeper.',
      targetTools: [
        { id: createId('tool'), name: 'Google Alerts', githubUrl: '' },
        { id: createId('tool'), name: 'Ahrefs', githubUrl: '' },
        { id: createId('tool'), name: 'GitHub', githubUrl: 'https://github.com' },
      ],
      founderDescription:
        'Founder needs structured competitive updates that are skeptical, consistent, and easy to scan.',
      communicationStyle: 'Executive',
      agents: [
        createAgent('Nova', 'competitive-intel'),
        createAgent('Ariel', 'research-analyst'),
        createAgent('Selene', 'brief-writer'),
        createAgent('Draco', 'qa-guardian'),
      ],
    }),
  },
  {
    id: 'product-launch-tracker',
    name: 'Product Launch Tracker',
    description:
      'Run launch preparation with milestone clarity, stakeholder reporting, and cross-checks before public release.',
    accentLabel: 'Launch Control',
    agentCount: 4,
    defaults: buildOperation({
      templateId: 'product-launch-tracker',
      operationName: 'Launch Readiness Desk',
      ceoName: 'Helios',
      missionStatement:
        'Coordinate launch milestones, risks, and public-facing deliverables so stakeholders always know readiness and blockers.',
      targetTools: [
        { id: createId('tool'), name: 'Linear', githubUrl: 'https://github.com/linear/linear' },
        { id: createId('tool'), name: 'Figma', githubUrl: '' },
        { id: createId('tool'), name: 'Slack', githubUrl: 'https://github.com/slackapi/node-slack-sdk' },
      ],
      founderDescription:
        'Founder prefers proactive status reporting with obvious risks, owners, and deadlines.',
      communicationStyle: 'Structured',
      agents: [
        createAgent('Eos', 'launch-operator'),
        createAgent('Rhea', 'knowledge-curator'),
        createAgent('Selene', 'brief-writer'),
        createAgent('Draco', 'qa-guardian'),
      ],
    }),
  },
  {
    id: 'developer-tool-monitor',
    name: 'Developer Tool Monitor',
    description:
      'Track tool updates, repo activity, and breaking changes across the developer stack before they turn into surprises.',
    accentLabel: 'Dev Signals',
    agentCount: 3,
    defaults: buildOperation({
      templateId: 'developer-tool-monitor',
      operationName: 'Dev Stack Watchtower',
      ceoName: 'Kepler',
      missionStatement:
        'Monitor critical developer tools, release notes, and API shifts, then translate them into concrete actions for the team.',
      targetTools: [
        { id: createId('tool'), name: 'GitHub', githubUrl: 'https://github.com' },
        { id: createId('tool'), name: 'npm', githubUrl: 'https://github.com/npm/cli' },
        { id: createId('tool'), name: 'OpenAI', githubUrl: 'https://github.com/openai/openai-node' },
      ],
      founderDescription:
        'Founder wants fast alerting on breaking changes, plus plain-language migration advice.',
      communicationStyle: 'Executive',
      agents: [
        createAgent('Titan', 'developer-scout'),
        createAgent('Callisto', 'research-analyst'),
        createAgent('Draco', 'qa-guardian'),
      ],
      budget: {
        enabled: true,
        warningThreshold: 80,
        behavior: 'Auto-pause',
        perAgentBudgets: {
          ceo: '180k',
        },
      },
    }),
  },
  {
    id: 'scratch',
    name: 'Start from Scratch',
    description:
      'Begin with a clean slate and shape every part of the operation yourself.',
    accentLabel: 'Custom Build',
    agentCount: 0,
    defaults: blankOperation,
  },
];

export function getTemplateById(templateId: string) {
  return templates.find((template) => template.id === templateId) ?? templates[4];
}
