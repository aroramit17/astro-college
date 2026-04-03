import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { blankOperation, getTemplateById, templates } from '../data/templates';
import { celestialNamePool } from '../data/celestialNames';
import { getRolePreset } from '../data/rolePresets';
import {
  buildConsistencyStatuses,
  buildMarkdownDocuments,
  defaultMarkdownOverrides,
} from '../utils/markdown';
import { createId } from '../utils/ids';
import type {
  Agent,
  AgentRoleId,
  ChecklistItem,
  MarkdownDocument,
  MarkdownFileKey,
  Operation,
  ToolTarget,
} from '../types/operation';

interface OperationContextValue {
  operation: Operation;
  activeStep: number;
  markdownDocuments: MarkdownDocument[];
  markdownOverrides: Record<MarkdownFileKey, string>;
  consistencyStatuses: ReturnType<typeof buildConsistencyStatuses>;
  templateOptions: typeof templates;
  applyTemplate: (templateId: string) => void;
  setActiveStep: (step: number) => void;
  updateOperation: (updates: Partial<Operation>) => void;
  updateMissionField: <K extends keyof Operation>(field: K, value: Operation[K]) => void;
  suggestCelestialName: () => string;
  addTargetTool: (toolName: string) => void;
  updateTargetTool: (toolId: string, updates: Partial<ToolTarget>) => void;
  removeTargetTool: (toolId: string) => void;
  addAgent: (roleId: AgentRoleId) => Agent;
  saveAgent: (agent: Agent) => void;
  deleteAgent: (agentId: string) => void;
  createChecklistItem: (text?: string) => ChecklistItem;
  updatePipelineField: <K extends keyof Operation['pipeline']>(
    field: K,
    value: Operation['pipeline'][K],
  ) => void;
  updateBudgetField: <K extends keyof Operation['budget']>(
    field: K,
    value: Operation['budget'][K],
  ) => void;
  updateAgentBudget: (key: string, value: string) => void;
  setMarkdownOverride: (key: MarkdownFileKey, content: string) => void;
  resetMarkdownOverrides: () => void;
  hydrateAgentDraft: (roleId: AgentRoleId, existing?: Agent) => Agent;
}

const STORAGE_KEY = 'betterskillsmd.operation';
const STEP_COUNT = 5;

const OperationContext = createContext<OperationContextValue | null>(null);

function loadPersistedOperation() {
  if (typeof window === 'undefined') {
    return blankOperation;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return blankOperation;
  }

  try {
    return JSON.parse(raw) as Operation;
  } catch {
    return blankOperation;
  }
}

function cloneOperation(operation: Operation) {
  return JSON.parse(JSON.stringify(operation)) as Operation;
}

function ensureBudgetKeys(operation: Operation) {
  const budgetMap = { ...operation.budget.perAgentBudgets };

  if (!budgetMap.ceo) {
    budgetMap.ceo = '';
  }

  for (const agent of operation.agents) {
    if (!(agent.id in budgetMap)) {
      budgetMap[agent.id] = '';
    }
  }

  for (const key of Object.keys(budgetMap)) {
    if (key !== 'ceo' && !operation.agents.some((agent) => agent.id === key)) {
      delete budgetMap[key];
    }
  }

  return {
    ...operation,
    budget: {
      ...operation.budget,
      perAgentBudgets: budgetMap,
    },
  };
}

function normalizeOperation(operation: Operation) {
  return ensureBudgetKeys({
    ...blankOperation,
    ...operation,
    pipeline: {
      ...blankOperation.pipeline,
      ...operation.pipeline,
    },
    budget: {
      ...blankOperation.budget,
      ...operation.budget,
      perAgentBudgets: operation.budget?.perAgentBudgets ?? {},
    },
  });
}

export function OperationProvider({ children }: PropsWithChildren) {
  const [operation, setOperation] = useState<Operation>(() =>
    normalizeOperation(loadPersistedOperation()),
  );
  const [activeStep, setActiveStepState] = useState(1);
  const [markdownOverrides, setMarkdownOverrides] = useState(defaultMarkdownOverrides);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(operation));
  }, [operation]);

  const markdownDocuments = useMemo(
    () => buildMarkdownDocuments(operation, markdownOverrides),
    [operation, markdownOverrides],
  );
  const consistencyStatuses = useMemo(
    () => buildConsistencyStatuses(operation, markdownDocuments),
    [operation, markdownDocuments],
  );

  function setActiveStep(step: number) {
    setActiveStepState(Math.max(1, Math.min(STEP_COUNT, step)));
  }

  function updateOperation(updates: Partial<Operation>) {
    setOperation((current) => normalizeOperation({ ...current, ...updates }));
  }

  function updateMissionField<K extends keyof Operation>(field: K, value: Operation[K]) {
    setOperation((current) => normalizeOperation({ ...current, [field]: value }));
  }

  function suggestCelestialName() {
    const pick = celestialNamePool[Math.floor(Math.random() * celestialNamePool.length)];
    return pick.name;
  }

  function addTargetTool(toolName: string) {
    const nextTool = { id: createId('tool'), name: toolName, githubUrl: '' };

    setOperation((current) =>
      normalizeOperation({
        ...current,
        targetTools: [...current.targetTools, nextTool],
      }),
    );
  }

  function updateTargetTool(toolId: string, updates: Partial<ToolTarget>) {
    setOperation((current) =>
      normalizeOperation({
        ...current,
        targetTools: current.targetTools.map((tool) =>
          tool.id === toolId ? { ...tool, ...updates } : tool,
        ),
      }),
    );
  }

  function removeTargetTool(toolId: string) {
    setOperation((current) =>
      normalizeOperation({
        ...current,
        targetTools: current.targetTools.filter((tool) => tool.id !== toolId),
      }),
    );
  }

  function createChecklistItem(text = ''): ChecklistItem {
    return {
      id: createId('item'),
      text,
      checked: true,
    };
  }

  function hydrateAgentDraft(roleId: AgentRoleId, existing?: Agent) {
    const preset = getRolePreset(roleId);

    return (
      existing ?? {
        id: createId('agent'),
        name: suggestCelestialName(),
        roleId,
        roleLabel: preset.label,
        category: preset.category,
        platform: preset.suggestedPlatform,
        soulDescription: preset.descriptionPlaceholder,
        skills: [...preset.defaultSkills],
        deliverableFormat: preset.deliverableFormat,
        definitionOfDone: preset.definitionOfDone.map((item) => ({
          ...item,
          id: createChecklistItem(item.text).id,
        })),
        selfCheckItems: preset.selfCheckItems.map((item) => ({
          ...item,
          id: createChecklistItem(item.text).id,
        })),
      }
    );
  }

  function addAgent(roleId: AgentRoleId) {
    const nextAgent = hydrateAgentDraft(roleId);
    saveAgent(nextAgent);
    return nextAgent;
  }

  function saveAgent(agent: Agent) {
    setOperation((current) => {
      const exists = current.agents.some((item) => item.id === agent.id);
      const nextAgents = exists
        ? current.agents.map((item) => (item.id === agent.id ? agent : item))
        : [...current.agents, agent];

      return normalizeOperation({
        ...current,
        agents: nextAgents,
      });
    });
  }

  function deleteAgent(agentId: string) {
    setOperation((current) =>
      normalizeOperation({
        ...current,
        agents: current.agents.filter((agent) => agent.id !== agentId),
      }),
    );
  }

  function updatePipelineField<K extends keyof Operation['pipeline']>(
    field: K,
    value: Operation['pipeline'][K],
  ) {
    setOperation((current) =>
      normalizeOperation({
        ...current,
        pipeline: {
          ...current.pipeline,
          [field]: value,
        },
      }),
    );
  }

  function updateBudgetField<K extends keyof Operation['budget']>(
    field: K,
    value: Operation['budget'][K],
  ) {
    setOperation((current) =>
      normalizeOperation({
        ...current,
        budget: {
          ...current.budget,
          [field]: value,
        },
      }),
    );
  }

  function updateAgentBudget(key: string, value: string) {
    setOperation((current) =>
      normalizeOperation({
        ...current,
        budget: {
          ...current.budget,
          perAgentBudgets: {
            ...current.budget.perAgentBudgets,
            [key]: value,
          },
        },
      }),
    );
  }

  function applyTemplate(templateId: string) {
    const template = getTemplateById(templateId);
    const freshOperation = cloneOperation(template.defaults);

    setOperation(normalizeOperation(freshOperation));
    setMarkdownOverrides(defaultMarkdownOverrides);
    setActiveStepState(1);
  }

  function setMarkdownOverride(key: MarkdownFileKey, content: string) {
    setMarkdownOverrides((current) => ({
      ...current,
      [key]: content,
    }));
  }

  function resetMarkdownOverrides() {
    setMarkdownOverrides(defaultMarkdownOverrides);
  }

  const value: OperationContextValue = {
    operation,
    activeStep,
    markdownDocuments,
    markdownOverrides,
    consistencyStatuses,
    templateOptions: templates,
    applyTemplate,
    setActiveStep,
    updateOperation,
    updateMissionField,
    suggestCelestialName,
    addTargetTool,
    updateTargetTool,
    removeTargetTool,
    addAgent,
    saveAgent,
    deleteAgent,
    createChecklistItem,
    updatePipelineField,
    updateBudgetField,
    updateAgentBudget,
    setMarkdownOverride,
    resetMarkdownOverrides,
    hydrateAgentDraft,
  };

  return <OperationContext.Provider value={value}>{children}</OperationContext.Provider>;
}

export function useOperation() {
  const context = useContext(OperationContext);

  if (!context) {
    throw new Error('useOperation must be used within OperationProvider');
  }

  return context;
}
