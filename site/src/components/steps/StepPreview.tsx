import { useState } from 'react';
import JSZip from 'jszip';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useOperation } from '../../context/OperationContext';
import type { MarkdownFileKey } from '../../types/operation';

type TabMode = 'preview' | 'edit';

export function StepPreview() {
  const {
    markdownDocuments,
    markdownOverrides,
    consistencyStatuses,
    setMarkdownOverride,
    resetMarkdownOverrides,
  } = useOperation();
  const [activeTab, setActiveTab] = useState<MarkdownFileKey>('SOUL.md');
  const [modes, setModes] = useState<Record<MarkdownFileKey, TabMode>>({
    'SOUL.md': 'preview',
    'TEAM.md': 'preview',
    'PIPELINE.md': 'preview',
    'BUDGET.md': 'preview',
    'PLAYBOOK.md': 'preview',
  });
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [zipState, setZipState] = useState<'idle' | 'working' | 'done'>('idle');
  const prefersDark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const activeDocument =
    markdownDocuments.find((document) => document.key === activeTab) ?? markdownDocuments[0];
  const activeStatus = consistencyStatuses[activeTab];

  async function downloadAll() {
    setZipState('working');
    const zip = new JSZip();

    markdownDocuments.forEach((document) => {
      zip.file(document.key, document.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'betterskillsmd-operation.zip';
    anchor.click();
    URL.revokeObjectURL(url);
    setZipState('done');
    window.setTimeout(() => setZipState('idle'), 1400);
  }

  function downloadSingle() {
    const blob = new Blob([activeDocument.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = activeDocument.key;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyCurrent() {
    await navigator.clipboard.writeText(activeDocument.content);
    setCopiedKey(activeDocument.key);
    window.setTimeout(() => setCopiedKey(''), 1500);
  }

  return (
    <section id="files" className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Step 5</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-canvas-ink">
            Preview and export the markdown pack
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-canvas-muted">
            Review every file, switch between rendered and raw views, then export the whole operation as a zip or copy files one by one.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadAll}
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            {zipState === 'working'
              ? 'Building zip...'
              : zipState === 'done'
                ? 'Zip ready'
                : 'Download All (.zip)'}
          </button>
          <button
            type="button"
            onClick={downloadSingle}
            className="rounded-full border border-canvas-border px-5 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
          >
            Download Individual
          </button>
          <button
            type="button"
            onClick={copyCurrent}
            className="rounded-full border border-canvas-border px-5 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
          >
            {copiedKey === activeDocument.key ? 'Copied' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-3 rounded-[2rem] border border-canvas-border bg-canvas-panel p-4 shadow-card">
          {markdownDocuments.map((document) => {
            const status = consistencyStatuses[document.key];
            const active = activeTab === document.key;

            return (
              <button
                key={document.key}
                type="button"
                onClick={() => setActiveTab(document.key)}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  active
                    ? 'border-accent bg-accent/5'
                    : 'border-canvas-border bg-canvas-soft hover:border-accent/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-[0.24em] text-canvas-muted">
                      {document.key}
                    </div>
                    <div className="mt-2 text-base font-semibold text-canvas-ink">{document.title}</div>
                    <div className="mt-1 text-sm text-canvas-muted">{document.description}</div>
                  </div>
                  <span
                    className={`mt-1 inline-flex h-3 w-3 rounded-full ${
                      status.level === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={resetMarkdownOverrides}
            className="w-full rounded-full border border-canvas-border px-4 py-3 text-sm text-canvas-ink transition hover:border-accent hover:text-accent"
          >
            Reset edited markdown
          </button>
        </div>

        <div className="rounded-[2rem] border border-canvas-border bg-canvas-panel p-6 shadow-card">
          <div className="flex flex-col gap-4 border-b border-canvas-border pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-canvas-muted">
                {activeDocument.key}
              </div>
              <div className="mt-2 font-display text-2xl font-semibold text-canvas-ink">
                {activeDocument.title}
              </div>
            </div>

            <div className="flex gap-2 rounded-full bg-canvas-soft p-1">
              {(['preview', 'edit'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setModes((current) => ({ ...current, [activeTab]: mode }))}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    modes[activeTab] === mode ? 'bg-canvas-panel text-canvas-ink shadow-card' : 'text-canvas-muted'
                  }`}
                >
                  {mode === 'preview' ? 'Preview' : 'Edit'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-canvas-border bg-canvas-soft p-4">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-3 w-3 rounded-full ${
                  activeStatus.level === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <div className="text-sm font-medium text-canvas-ink">{activeStatus.label}</div>
            </div>
            {activeStatus.issues.length ? (
              <ul className="mt-3 space-y-2 text-sm text-canvas-muted">
                {activeStatus.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 text-sm text-canvas-muted">
                This file is aligned with the current mission, team, and pipeline setup.
              </div>
            )}
          </div>

          {modes[activeTab] === 'preview' ? (
            <div className="markdown-body mt-6 rounded-[1.75rem] border border-canvas-border bg-canvas-base p-6">
              <Markdown>{activeDocument.content}</Markdown>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <textarea
                value={markdownOverrides[activeTab] || activeDocument.content}
                onChange={(event) => setMarkdownOverride(activeTab, event.target.value)}
                rows={18}
                className="w-full rounded-[1.75rem] border border-canvas-border bg-canvas-base px-5 py-4 font-mono text-sm outline-none transition focus:border-accent"
              />

              <div className="overflow-hidden rounded-[1.75rem] border border-canvas-border">
                <div className="border-b border-canvas-border bg-canvas-soft px-4 py-3 text-sm font-medium text-canvas-ink">
                  Syntax lens
                </div>
                <SyntaxHighlighter
                  language="markdown"
                  style={prefersDark ? oneDark : oneLight}
                  customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.85rem' }}
                >
                  {markdownOverrides[activeTab] || activeDocument.content}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
