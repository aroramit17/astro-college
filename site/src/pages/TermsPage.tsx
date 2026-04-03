export function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.25rem] border border-canvas-border bg-canvas-panel p-8 shadow-card">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Terms</div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-canvas-ink">
          Terms of service for betterskillsmd.com
        </h1>
        <div className="markdown-body mt-8">
          <h2>Use of the builder</h2>
          <p>
            betterskillsmd.com provides planning and drafting tools for AI operation documents. You are responsible for reviewing generated content before deploying it in a production workflow.
          </p>
          <h2>No warranty</h2>
          <p>
            The site and generated markdown files are provided on an as-is basis. They are intended to accelerate configuration work, not replace human review, legal review, or security review.
          </p>
          <h2>Acceptable use</h2>
          <p>
            Do not use the builder to create harmful, deceptive, or unlawful workflows. Keep credentials, secrets, and protected information out of shared configuration files unless you have proper safeguards in place.
          </p>
          <h2>Changes</h2>
          <p>
            Terms can evolve as the product matures. If payment, user accounts, or hosted processing are added later, revise this page before release.
          </p>
        </div>
      </div>
    </div>
  );
}
