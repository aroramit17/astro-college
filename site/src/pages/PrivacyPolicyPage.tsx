export function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.25rem] border border-canvas-border bg-canvas-panel p-8 shadow-card">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Privacy Policy</div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-canvas-ink">
          Privacy policy for betterskillsmd.com
        </h1>
        <div className="markdown-body mt-8">
          <h2>Overview</h2>
          <p>
            betterskillsmd.com is designed as a client-side workspace for drafting AI operation markdown files. We keep the experience lightweight and avoid collecting unnecessary personal data.
          </p>
          <h2>Information we process</h2>
          <p>
            The content you enter into the builder, such as mission statements, agent names, pipeline settings, and budget rules, is stored locally in your browser to preserve progress between visits.
          </p>
          <h2>How data is used</h2>
          <p>
            Your configuration data is used only to generate previews and downloadable markdown files. The site does not require account creation to use the builder.
          </p>
          <h2>Downloads and clipboard</h2>
          <p>
            When you export files or copy content to the clipboard, those actions happen at your request in the browser. Please handle exported files according to your own internal security policies.
          </p>
          <h2>Third-party services</h2>
          <p>
            If the site is later connected to analytics, payment, or hosting tools, this policy should be updated to reflect those services and their practices before launch.
          </p>
          <h2>Contact</h2>
          <p>
            For questions about privacy expectations or operational security, publish a clear contact channel before production launch.
          </p>
        </div>
      </div>
    </div>
  );
}
