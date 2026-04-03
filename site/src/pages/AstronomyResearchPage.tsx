import { useState } from 'react';
import {
  actionableShortlist,
  risks,
  schools,
  sourceGroups,
  studentProfiles,
  topObjectiveRankings,
  type School,
  type SchoolId,
} from '../data/astronomyResearch';

type WeightKey = 'research' | 'curriculum' | 'affordability' | 'observatory';
type FundingMode = 'balanced' | 'high-need' | 'merit';
type ResidencyMode = 'neutral' | 'public-lean';

const weightLabels: Record<WeightKey, string> = {
  research: 'Research intensity',
  curriculum: 'Curriculum rigor',
  affordability: 'Affordability',
  observatory: 'Hands-on observing',
};

const profileDefaults: Record<string, Record<WeightKey, number>> = {
  'broad-fit': { research: 4, curriculum: 4, affordability: 3, observatory: 4 },
  'elite-research': { research: 5, curriculum: 4, affordability: 2, observatory: 3 },
  'affordability-first': { research: 3, curriculum: 3, affordability: 5, observatory: 2 },
  observatory: { research: 3, curriculum: 4, affordability: 2, observatory: 5 },
};

function schoolById(id: SchoolId) {
  return schools.find((school) => school.id === id);
}

function formatScore(score: number) {
  return score.toFixed(1);
}

function strengthLabel(value: number) {
  if (value >= 4.7) {
    return 'Exceptional';
  }

  if (value >= 4) {
    return 'Strong';
  }

  if (value >= 3) {
    return 'Solid';
  }

  return 'Situational';
}

export function AstronomyResearchPage() {
  const [selectedProfileId, setSelectedProfileId] = useState(studentProfiles[0].id);
  const [weights, setWeights] = useState<Record<WeightKey, number>>(profileDefaults[studentProfiles[0].id]);
  const [fundingMode, setFundingMode] = useState<FundingMode>('balanced');
  const [residencyMode, setResidencyMode] = useState<ResidencyMode>('neutral');
  const [focusedSchoolId, setFocusedSchoolId] = useState<SchoolId>('arizona');

  const selectedProfile =
    studentProfiles.find((profile) => profile.id === selectedProfileId) ?? studentProfiles[0];

  const rankedSchools = [...schools].sort((left, right) => {
    const leftScore = scoreSchool(left, weights, fundingMode, residencyMode);
    const rightScore = scoreSchool(right, weights, fundingMode, residencyMode);
    return rightScore - leftScore;
  });

  const focusedSchool = schoolById(focusedSchoolId) ?? rankedSchools[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-canvas-border bg-canvas-panel shadow-card">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:px-10 lg:py-10">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Interactive artifact from PDF
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight text-canvas-ink sm:text-5xl">
              Astronomy college research, turned into a shortlist builder.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-canvas-muted">
              This page converts the April 3, 2026 synthesis into something you can explore: switch
              student profiles, tune your priorities, and see how the recommended schools reshuffle.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard label="Source pages" value="3" detail="Compact synthesis converted into structured data" />
              <StatCard label="Workstreams combined" value="4" detail="Ranking, curriculum, aid, and observatory pipeline" />
              <StatCard label="Core schools modeled" value={String(schools.length)} detail="Interactive shortlist candidates from the report" />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-soft p-6">
            <div className="text-sm font-medium text-canvas-ink">Document snapshot</div>
            <dl className="mt-5 space-y-4 text-sm">
              <MetaRow label="Prepared for" value="PLA-6" />
              <MetaRow label="Report date" value="2026-04-03" />
              <MetaRow label="Bottom-line trio" value="Arizona, Caltech, UC Berkeley" />
              <MetaRow label="Aid leaders" value="Princeton, Harvard, MIT, Caltech" />
              <MetaRow label="Observing leaders" value="Arizona and UT Austin" />
            </dl>
            <p className="mt-5 text-xs leading-6 text-canvas-muted">
              The direct ranking scores come from the PDF. The planner scores below are an
              interpretive layer built from the report&apos;s conclusions so you can interact with them.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Profile view</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {studentProfiles.map((profile) => {
              const isActive = profile.id === selectedProfileId;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => {
                    setSelectedProfileId(profile.id);
                    setWeights(profileDefaults[profile.id]);
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? 'bg-canvas-ink text-canvas-base'
                      : 'border border-canvas-border bg-canvas-soft text-canvas-muted hover:border-accent hover:text-canvas-ink'
                  }`}
                >
                  {profile.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-canvas-border bg-canvas-soft p-5">
            <div className="text-sm font-medium text-canvas-ink">{selectedProfile.summary}</div>
            <p className="mt-3 text-sm leading-7 text-canvas-muted">{selectedProfile.rationale}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {selectedProfile.recommended.map((schoolId, index) => {
                const school = schoolById(schoolId);
                if (!school) {
                  return null;
                }

                return (
                  <button
                    key={school.id}
                    type="button"
                    onClick={() => setFocusedSchoolId(school.id)}
                    className="rounded-2xl border border-canvas-border bg-canvas-panel px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-accent"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                      #{index + 1} recommendation
                    </div>
                    <div className="mt-2 text-sm font-semibold text-canvas-ink">{school.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Actionable shortlist</div>
          <div className="mt-5 space-y-4">
            <ShortlistBand label="Reach" schools={actionableShortlist.reach} tone="bg-canvas-ink text-canvas-base" />
            <ShortlistBand label="Target" schools={actionableShortlist.target} tone="bg-accent text-white" />
            <ShortlistBand label="Value hedge" schools={actionableShortlist.hedge} tone="bg-canvas-soft text-canvas-ink" />
          </div>
          <p className="mt-5 text-sm leading-7 text-canvas-muted">
            The report&apos;s own application starter list is preserved here so the interactive planner
            never drifts too far from the original recommendations.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Custom planner</div>
          <h2 className="mt-3 font-display text-2xl font-semibold text-canvas-ink">
            Tune your priorities and rerank the shortlist.
          </h2>
          <p className="mt-3 text-sm leading-7 text-canvas-muted">
            Move the sliders to rebalance what matters most. Funding and residency toggles add
            extra weight to the aid and public-value conclusions from the PDF.
          </p>

          <div className="mt-6 space-y-5">
            {(Object.keys(weightLabels) as WeightKey[]).map((key) => (
              <label key={key} className="block">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-canvas-ink">{weightLabels[key]}</span>
                  <span className="font-mono text-canvas-muted">{weights[key]}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={weights[key]}
                  onChange={(event) =>
                    setWeights((current) => ({
                      ...current,
                      [key]: Number(event.target.value),
                    }))
                  }
                  className="mt-3 w-full accent-[rgb(var(--color-accent))]"
                />
              </label>
            ))}
          </div>

          <div className="mt-8">
            <div className="text-sm font-medium text-canvas-ink">Funding lens</div>
            <div className="mt-3 flex flex-wrap gap-3">
              <ModePill active={fundingMode === 'balanced'} onClick={() => setFundingMode('balanced')}>
                Balanced
              </ModePill>
              <ModePill active={fundingMode === 'high-need'} onClick={() => setFundingMode('high-need')}>
                High need
              </ModePill>
              <ModePill active={fundingMode === 'merit'} onClick={() => setFundingMode('merit')}>
                Merit seeking
              </ModePill>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-canvas-ink">Residency lens</div>
            <div className="mt-3 flex flex-wrap gap-3">
              <ModePill active={residencyMode === 'neutral'} onClick={() => setResidencyMode('neutral')}>
                Neutral
              </ModePill>
              <ModePill active={residencyMode === 'public-lean'} onClick={() => setResidencyMode('public-lean')}>
                Public value matters
              </ModePill>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Live shortlist</div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-canvas-ink">
                Your current top matches
              </h2>
            </div>
            <div className="rounded-full border border-canvas-border px-4 py-2 text-xs text-canvas-muted">
              Sorted by planner score
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {rankedSchools.slice(0, 5).map((school, index) => {
              const total = scoreSchool(school, weights, fundingMode, residencyMode);
              const isFocused = school.id === focusedSchool.id;

              return (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => setFocusedSchoolId(school.id)}
                  className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                    isFocused
                      ? 'border-accent bg-canvas-soft'
                      : 'border-canvas-border bg-white/60 hover:-translate-y-0.5 hover:border-accent'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                        #{index + 1} fit score
                      </div>
                      <div className="mt-2 text-lg font-semibold text-canvas-ink">{school.name}</div>
                      <div className="mt-1 text-sm text-canvas-muted">{school.location}</div>
                    </div>
                    <div className="rounded-2xl border border-canvas-border bg-canvas-panel px-4 py-3 text-center">
                      <div className="font-display text-2xl font-semibold text-canvas-ink">
                        {formatScore(total)}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.25em] text-canvas-muted">
                        planner
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {school.badges.slice(0, 3).map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-canvas-border bg-canvas-panel px-3 py-1 text-xs text-canvas-muted"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">School detail</div>
          <h2 className="mt-3 font-display text-2xl font-semibold text-canvas-ink">{focusedSchool.name}</h2>
          <p className="mt-2 text-sm text-canvas-muted">{focusedSchool.location}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {focusedSchool.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-canvas-border bg-canvas-soft px-3 py-1 text-xs text-canvas-muted"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <StrengthBar label="Research" value={focusedSchool.strengths.research} />
            <StrengthBar label="Curriculum" value={focusedSchool.strengths.curriculum} />
            <StrengthBar label="Affordability" value={focusedSchool.strengths.affordability} />
            <StrengthBar label="Observatory" value={focusedSchool.strengths.observatory} />
          </div>

          <div className="mt-8">
            <div className="text-sm font-medium text-canvas-ink">Why it stands out</div>
            <div className="mt-4 space-y-3">
              {focusedSchool.highlights.map((highlight) => (
                <div key={highlight} className="rounded-2xl border border-canvas-border bg-canvas-soft p-4 text-sm leading-7 text-canvas-muted">
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-caution/30 bg-caution/10 p-4 text-sm leading-7 text-canvas-muted">
            <span className="font-medium text-canvas-ink">Keep in mind:</span> {focusedSchool.caution}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Objective ranking</div>
            <div className="mt-5 space-y-3">
              {topObjectiveRankings.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-canvas-border bg-canvas-soft px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas-panel font-mono text-sm text-accent">
                      {index + 1}
                    </div>
                    <div className="text-sm font-medium text-canvas-ink">{entry.name}</div>
                  </div>
                  <div className="font-mono text-sm text-canvas-muted">{entry.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Risk and sources</div>
            <div className="mt-5 space-y-3">
              {risks.map((risk) => (
                <div key={risk} className="rounded-2xl border border-canvas-border bg-canvas-soft p-4 text-sm leading-7 text-canvas-muted">
                  {risk}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {sourceGroups.map((group) => (
                <details key={group.label} className="rounded-2xl border border-canvas-border bg-canvas-soft p-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-canvas-ink">
                    {group.label}
                  </summary>
                  <div className="mt-3 space-y-2 text-sm leading-7 text-canvas-muted">
                    {group.items.map((item) => (
                      <div key={item}>{item}</div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-canvas-border bg-canvas-panel p-6 shadow-card sm:p-8">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Comparison matrix</div>
        <h2 className="mt-3 font-display text-2xl font-semibold text-canvas-ink">
          How the leading schools differ
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-canvas-muted">
          These labels are derived from the report&apos;s conclusions. As your planner settings change,
          the table reorders so you can see which schools rise for your specific priorities.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-canvas-muted">
                <th className="px-4 py-2">School</th>
                <th className="px-4 py-2">Research</th>
                <th className="px-4 py-2">Curriculum</th>
                <th className="px-4 py-2">Affordability</th>
                <th className="px-4 py-2">Observatory</th>
                <th className="px-4 py-2">Fit</th>
              </tr>
            </thead>
            <tbody>
              {rankedSchools.map((school) => (
                <tr key={school.id} className="rounded-2xl border border-canvas-border bg-canvas-soft">
                  <td className="rounded-l-3xl px-4 py-4 text-sm font-medium text-canvas-ink">{school.name}</td>
                  <td className="px-4 py-4 text-sm text-canvas-muted">{strengthLabel(school.strengths.research)}</td>
                  <td className="px-4 py-4 text-sm text-canvas-muted">{strengthLabel(school.strengths.curriculum)}</td>
                  <td className="px-4 py-4 text-sm text-canvas-muted">{strengthLabel(school.strengths.affordability)}</td>
                  <td className="px-4 py-4 text-sm text-canvas-muted">{strengthLabel(school.strengths.observatory)}</td>
                  <td className="rounded-r-3xl px-4 py-4 text-sm font-mono text-canvas-ink">
                    {formatScore(scoreSchool(school, weights, fundingMode, residencyMode))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function scoreSchool(
  school: School,
  weights: Record<WeightKey, number>,
  fundingMode: FundingMode,
  residencyMode: ResidencyMode,
) {
  let total =
    school.strengths.research * weights.research +
    school.strengths.curriculum * weights.curriculum +
    school.strengths.affordability * weights.affordability +
    school.strengths.observatory * weights.observatory;

  if (fundingMode === 'high-need') {
    total += school.strengths.affordability * 2.2;
  }

  if (fundingMode === 'merit') {
    total += school.strengths.merit * 2.2;
  }

  if (residencyMode === 'public-lean') {
    total += school.strengths.publicValue * 1.8;
  }

  return total / 4;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-canvas-border/70 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-canvas-muted">{label}</dt>
      <dd className="max-w-[12rem] text-right font-medium text-canvas-ink">{value}</dd>
    </div>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.5rem] border border-canvas-border bg-canvas-soft p-4">
      <div className="font-display text-3xl font-semibold text-canvas-ink">{value}</div>
      <div className="mt-1 text-sm font-medium text-canvas-ink">{label}</div>
      <div className="mt-2 text-sm leading-6 text-canvas-muted">{detail}</div>
    </div>
  );
}

function ModePill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active
          ? 'bg-canvas-ink text-canvas-base'
          : 'border border-canvas-border bg-canvas-soft text-canvas-muted hover:border-accent hover:text-canvas-ink'
      }`}
    >
      {children}
    </button>
  );
}

function StrengthBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-canvas-border bg-canvas-soft p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-canvas-ink">{label}</div>
        <div className="font-mono text-sm text-canvas-muted">{formatScore(value)}/5</div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-canvas-border/60">
        <div
          className="h-2 rounded-full bg-accent transition-all"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-canvas-muted">{strengthLabel(value)}</div>
    </div>
  );
}

function ShortlistBand({
  label,
  schools: schoolNames,
  tone,
}: {
  label: string;
  schools: string[];
  tone: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-canvas-border bg-canvas-soft p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-canvas-muted">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {schoolNames.map((school) => (
          <span key={school} className={`rounded-full px-3 py-2 text-sm ${tone}`}>
            {school}
          </span>
        ))}
      </div>
    </div>
  );
}
