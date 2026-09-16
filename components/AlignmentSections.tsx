import {
  APPLICATIONS,
  APPLICATIONS_SUBHEADING,
  KNOWLEDGE_GRAPH_SECTION,
  KO_RELATIONSHIP_EXAMPLES,
  SCOPE_DISCLAIMER,
  WORKFLOW_STAGES,
} from "@/lib/alignment-content";

export function KnowledgeGraphRelationshipsSection() {
  const s = KNOWLEDGE_GRAPH_SECTION;
  return (
    <section
      id="knowledge-graph"
      className="border-t border-white/5 bg-white/[0.01] py-32"
      aria-labelledby="knowledge-graph-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
            {s.label}
          </p>
          <h2
            id="knowledge-graph-heading"
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {s.headline}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">{s.caption}</p>
          <ul
            className="mt-8 flex flex-wrap justify-center gap-2"
            aria-label="Typed relationship categories in a full Knowledge Object graph"
          >
            {s.relationshipTypes.map((label) => (
              <li key={label}>
                <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                  {label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-slate-500">{s.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

export function KoRelationshipsSection() {
  return (
    <section
      id="ko-relationships"
      className="py-32"
      aria-labelledby="ko-relationships-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <h2
            id="ko-relationships-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            What Relationships Preserve
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Relationships between Knowledge Objects carry procedural, causal, and
            clinical meaning — not labels alone.
          </p>
        </div>
        <ul className="reveal mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KO_RELATIONSHIP_EXAMPLES.map((ex) => (
            <li
              key={`${ex.from}-${ex.to}`}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
            >
              <p className="text-sm text-slate-200">
                <span className="text-cyan-300">{ex.from}</span>
                <span className="mx-2 text-slate-500" aria-hidden>
                  →
                </span>
                <span className="text-cyan-300">{ex.to}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {ex.meaning}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SurgeonValidatedWorkflowSection() {
  return (
    <section
      id="workflow"
      className="border-t border-white/5 bg-white/[0.01] py-32"
      aria-labelledby="workflow-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <h2
            id="workflow-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            AI-Assisted, Surgeon-Validated Capture
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Knowledge is proposed by AI, confirmed by surgeons, and stored as linked
            Knowledge Objects — not generated autonomously.
          </p>
        </div>
        <ol className="reveal mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STAGES.map((stage) => (
            <li
              key={stage.step}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
            >
              <p className="font-mono text-xs tracking-widest text-cyan-400/80">
                {stage.step}
              </p>
              <p className="mt-3 text-lg font-semibold text-white">{stage.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ScopeDisclaimerSection() {
  return (
    <section
      id="scope"
      className="border-t border-white/5 py-24"
      aria-labelledby="scope-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl">
          <h2
            id="scope-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Scope
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-400">
            {SCOPE_DISCLAIMER}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ApplicationsGrid() {
  return (
    <>
      <p className="reveal mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-slate-400">
        {APPLICATIONS_SUBHEADING}
      </p>
      <div className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {APPLICATIONS.map((app) => (
          <div
            key={app.title}
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04]"
          >
            <h3 className="text-lg font-semibold text-white">{app.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{app.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
