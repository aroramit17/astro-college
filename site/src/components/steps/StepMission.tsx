import { useState } from 'react';
import { useOperation } from '../../context/OperationContext';

const communicationStyles = ['Structured', 'Collaborative', 'Executive'] as const;

export function StepMission() {
  const {
    operation,
    updateMissionField,
    suggestCelestialName,
    addTargetTool,
    updateTargetTool,
    removeTargetTool,
  } = useOperation();
  const [toolInput, setToolInput] = useState('');
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Step 1</div>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-canvas-ink">
          Define the mission
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-canvas-muted">
          Shape the operating brief that will seed `SOUL.md`, keep the CEO aligned, and give the rest of the team a clear reason to exist.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5 rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-canvas-ink">Operation name</span>
            <input
              value={operation.operationName}
              onChange={(event) => updateMissionField('operationName', event.target.value)}
              className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
              placeholder="Signal Watchtower"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-canvas-ink">CEO agent name</span>
            <div className="flex gap-2">
              <input
                value={operation.ceoName}
                onChange={(event) => updateMissionField('ceoName', event.target.value)}
                className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                placeholder="Lyra"
              />
              <button
                type="button"
                onClick={() => updateMissionField('ceoName', suggestCelestialName())}
                className="rounded-2xl border border-canvas-border px-4 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
              >
                Suggest name
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-canvas-ink">Mission statement</span>
            <textarea
              value={operation.missionStatement}
              onChange={(event) => updateMissionField('missionStatement', event.target.value)}
              rows={7}
              className="w-full rounded-3xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
              placeholder="Explain what the operation should notice, why it matters, and how success will feel for the founder."
            />
          </label>

          <div className="rounded-3xl border border-canvas-border bg-canvas-soft p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium text-canvas-ink">Target tools</div>
                <p className="mt-1 text-sm text-canvas-muted">
                  Add tools, platforms, or surfaces the operation should monitor. Expand any tag to attach a GitHub URL.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={toolInput}
                onChange={(event) => setToolInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && toolInput.trim()) {
                    event.preventDefault();
                    addTargetTool(toolInput.trim());
                    setToolInput('');
                  }
                }}
                className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                placeholder="GitHub, YouTube, Linear, OpenAI..."
              />
              <button
                type="button"
                onClick={() => {
                  if (!toolInput.trim()) {
                    return;
                  }

                  addTargetTool(toolInput.trim());
                  setToolInput('');
                }}
                className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {operation.targetTools.length ? (
                operation.targetTools.map((tool) => {
                  const expanded = expandedToolId === tool.id;

                  return (
                    <div key={tool.id} className="rounded-3xl border border-canvas-border bg-canvas-panel p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedToolId(expanded ? null : tool.id)}
                          className="rounded-full bg-accent/10 px-3 py-2 text-sm font-medium text-accent"
                        >
                          {tool.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTargetTool(tool.id)}
                          className="rounded-full px-3 py-2 text-xs text-canvas-muted transition hover:bg-canvas-soft hover:text-canvas-ink"
                        >
                          Remove
                        </button>
                      </div>

                      {expanded ? (
                        <div className="mt-3">
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-canvas-ink">
                              GitHub URL
                            </span>
                            <input
                              value={tool.githubUrl}
                              onChange={(event) =>
                                updateTargetTool(tool.id, { githubUrl: event.target.value })
                              }
                              className="w-full rounded-2xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
                              placeholder="https://github.com/..."
                            />
                          </label>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-canvas-border bg-canvas-panel px-4 py-5 text-sm text-canvas-muted">
                  No target tools yet. Add the platforms this operation should track or use.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-canvas-ink">Founder description</span>
            <textarea
              value={operation.founderDescription}
              onChange={(event) => updateMissionField('founderDescription', event.target.value)}
              rows={9}
              className="w-full rounded-3xl border border-canvas-border bg-canvas-base px-4 py-3 outline-none transition focus:border-accent"
              placeholder="Describe how the founder thinks, what they care about, and what kind of communication keeps them calm."
            />
          </label>

          <fieldset className="rounded-3xl border border-canvas-border bg-canvas-soft p-5">
            <legend className="px-2 text-sm font-medium text-canvas-ink">Communication style</legend>
            <div className="mt-3 space-y-3">
              {communicationStyles.map((style) => (
                <label
                  key={style}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-canvas-border bg-canvas-panel px-4 py-3 transition hover:border-accent/50"
                >
                  <div>
                    <div className="text-sm font-medium text-canvas-ink">{style}</div>
                    <div className="text-sm text-canvas-muted">
                      {style === 'Structured'
                        ? 'Clear formats, concise lists, and stable naming.'
                        : style === 'Collaborative'
                          ? 'Warmer handoffs with context and options.'
                          : 'Short, decisive updates built for executives.'}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="communication-style"
                    checked={operation.communicationStyle === style}
                    onChange={() => updateMissionField('communicationStyle', style)}
                    className="h-4 w-4 border-canvas-border text-accent focus:ring-accent"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-3xl border border-canvas-border bg-[linear-gradient(135deg,rgba(20,184,166,0.12),rgba(59,130,246,0.07))] p-5">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-accent">SOUL.md Preview cues</div>
            <ul className="mt-3 space-y-2 text-sm text-canvas-ink">
              <li>Mission and founder perspective become the opening sections.</li>
              <li>Tool tags turn into the operation’s target surface list.</li>
              <li>Communication style influences all generated defaults across the pack.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
