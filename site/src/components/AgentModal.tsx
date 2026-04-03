import { useEffect, useState } from 'react';
import { celestialNamePool } from '../data/celestialNames';
import { getRolePreset, rolePresets } from '../data/rolePresets';
import type { Agent, AgentRoleId, ChecklistItem, Platform } from '../types/operation';

const platforms: Platform[] = ['OpenAI', 'Claude', 'Gemini', 'Perplexity', 'Codex', 'Hybrid'];

interface AgentModalProps {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  onDelete?: (agentId: string) => void;
}

function ChecklistEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}) {
  return (
    <div className="space-y-3 rounded-3xl border border-canvas-border bg-canvas-soft p-4">
      <div className="text-sm font-medium text-canvas-ink">{title}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(event) =>
                onChange(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, checked: event.target.checked } : entry,
                  ),
                )
              }
              className="h-4 w-4 rounded border-canvas-border text-accent focus:ring-accent"
            />
            <input
              value={item.text}
              onChange={(event) =>
                onChange(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, text: event.target.value } : entry,
                  ),
                )
              }
              className="flex-1 rounded-2xl border border-canvas-border bg-canvas-base px-3 py-2 text-sm outline-none ring-0 transition focus:border-accent"
              placeholder="Checklist item"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
              className="rounded-full px-3 py-2 text-xs text-canvas-muted transition hover:bg-canvas-base hover:text-canvas-ink"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...items,
            {
              id: `item-${Math.random().toString(36).slice(2, 10)}`,
              text: '',
              checked: true,
            },
          ])
        }
        className="rounded-full border border-canvas-border px-4 py-2 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
      >
        Add item
      </button>
    </div>
  );
}

export function AgentModal({ agent, open, onClose, onSave, onDelete }: AgentModalProps) {
  const [draft, setDraft] = useState<Agent | null>(agent);
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    setDraft(agent);
  }, [agent]);

  if (!open || !draft) {
    return null;
  }

  function applyPreset(roleId: AgentRoleId) {
    const preset = getRolePreset(roleId);

    setDraft((current) =>
      current
        ? {
            ...current,
            roleId,
            roleLabel: preset.label,
            category: preset.category,
            platform: preset.suggestedPlatform,
            soulDescription: preset.descriptionPlaceholder,
            skills: [...preset.defaultSkills],
            deliverableFormat: preset.deliverableFormat,
            definitionOfDone: preset.definitionOfDone.map((item) => ({
              ...item,
              id: `dod-${Math.random().toString(36).slice(2, 10)}`,
            })),
            selfCheckItems: preset.selfCheckItems.map((item) => ({
              ...item,
              id: `self-${Math.random().toString(36).slice(2, 10)}`,
            })),
          }
        : current,
    );
  }

  function suggestName() {
    const pick = celestialNamePool[Math.floor(Math.random() * celestialNamePool.length)];
    setDraft((current) => (current ? { ...current, name: pick.name } : current));
  }

  function addCustomSkill() {
    const value = customSkill.trim();

    if (!value) {
      return;
    }

    setDraft((current) =>
      current
        ? {
            ...current,
            skills: current.skills.includes(value) ? current.skills : [...current.skills, value],
          }
        : current,
    );
    setCustomSkill('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Agent Builder</div>
            <h3 className="mt-2 font-display text-2xl font-semibold text-canvas-ink">
              {agent ? `Configure ${agent.name}` : 'Configure agent'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-canvas-border px-3 py-2 text-sm text-canvas-muted transition hover:text-canvas-ink"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-canvas-ink">Agent name</span>
              <div className="flex gap-2">
                <input
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                  placeholder="Lyra"
                />
                <button
                  type="button"
                  onClick={suggestName}
                  className="rounded-2xl border border-canvas-border px-4 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
                >
                  Suggest
                </button>
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-canvas-ink">Role</span>
                <select
                  value={draft.roleId}
                  onChange={(event) => applyPreset(event.target.value as AgentRoleId)}
                  className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                >
                  {rolePresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-canvas-ink">Platform</span>
                <select
                  value={draft.platform}
                  onChange={(event) =>
                    setDraft({ ...draft, platform: event.target.value as Platform })
                  }
                  className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-canvas-ink">Soul description</span>
              <textarea
                value={draft.soulDescription}
                onChange={(event) => setDraft({ ...draft, soulDescription: event.target.value })}
                rows={5}
                className="w-full rounded-3xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                placeholder={getRolePreset(draft.roleId).descriptionPlaceholder}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-canvas-ink">
                Deliverable format (Markdown)
              </span>
              <textarea
                value={draft.deliverableFormat}
                onChange={(event) => setDraft({ ...draft, deliverableFormat: event.target.value })}
                rows={6}
                className="w-full rounded-3xl border border-canvas-border bg-canvas-base px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-canvas-border bg-canvas-soft p-4">
              <div className="text-sm font-medium text-canvas-ink">Skills</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.skills.map((skill) => (
                  <label
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-canvas-border bg-canvas-base px-3 py-2 text-sm text-canvas-ink"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() =>
                        setDraft({
                          ...draft,
                          skills: draft.skills.filter((item) => item !== skill),
                        })
                      }
                      className="h-4 w-4 rounded border-canvas-border text-accent focus:ring-accent"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  value={customSkill}
                  onChange={(event) => setCustomSkill(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                  placeholder="Add custom skill"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="rounded-2xl border border-canvas-border px-4 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
                >
                  Add
                </button>
              </div>
            </div>

            <ChecklistEditor
              title="Definition of Done"
              items={draft.definitionOfDone}
              onChange={(definitionOfDone) => setDraft({ ...draft, definitionOfDone })}
            />

            <ChecklistEditor
              title="Self-check items"
              items={draft.selfCheckItems}
              onChange={(selfCheckItems) => setDraft({ ...draft, selfCheckItems })}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-canvas-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(draft.id)}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600 transition hover:bg-rose-50 dark:border-rose-950 dark:text-rose-300 dark:hover:bg-rose-950/30"
              >
                Delete agent
              </button>
            ) : (
              <div className="text-sm text-canvas-muted">Build roles that own a clear output and review loop.</div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-canvas-border px-4 py-2 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(draft)}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Save agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
