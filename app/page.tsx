export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-teal-500/8 blur-[100px]" />
        <div className="absolute bottom-0 -left-32 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500">
              <svg
                className="h-5 w-5 text-slate-950"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Surgical<span className="text-cyan-400">Data</span>OS
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Platform
            </a>
            <a
              href="#capabilities"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Capabilities
            </a>
            <a
              href="#workflow"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Workflow
            </a>
            <a
              href="#contact"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-50"
            >
              Request Access
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 lg:px-8 lg:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                AI-Powered Ophthalmic Intelligence
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Precision data for{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  cataract surgery
                </span>{" "}
                and robotic AI
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                SurgicalDataOS unifies surgical video annotation, curated
                ophthalmic datasets, and robotic training pipelines — built for
                researchers, clinicians, and AI teams advancing the future of
                vision care.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                >
                  Start Annotating
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
                <a
                  href="#capabilities"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                >
                  Explore Datasets
                </a>
              </div>

              <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/5 pt-10">
                {[
                  { value: "2M+", label: "Frames Annotated" },
                  { value: "500+", label: "Surgical Cases" },
                  { value: "99.2%", label: "Label Accuracy" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                    <div className="h-3 w-3 rounded-full bg-green-400/60" />
                  </div>
                  <span className="ml-2 text-xs text-slate-500">
                    surgical-dataos / annotation-studio
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-0">
                  <div className="col-span-3 border-r border-white/5 p-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-24 w-24 rounded-full border-2 border-cyan-400/40">
                          <div className="absolute inset-2 rounded-full border border-teal-400/30" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                        PHACO · Frame 1,847
                      </div>
                      <div className="absolute right-3 bottom-3 flex gap-1">
                        {["Capsulorhexis", "Phaco", "IOL"].map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] text-cyan-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1 flex-1 rounded-full bg-slate-700">
                        <div className="h-1 w-3/5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" />
                      </div>
                      <span className="text-[10px] text-slate-500">12:34 / 18:02</span>
                    </div>
                  </div>

                  <div className="col-span-2 p-4">
                    <div className="mb-3 text-xs font-medium text-slate-400">
                      Active Labels
                    </div>
                    {[
                      { name: "Capsulorhexis", conf: "98.7%", color: "bg-cyan-400" },
                      { name: "Phacoemulsification", conf: "96.2%", color: "bg-teal-400" },
                      { name: "IOL Implantation", conf: "99.1%", color: "bg-blue-400" },
                      { name: "Viscoelastic", conf: "94.8%", color: "bg-emerald-400" },
                    ].map((label) => (
                      <div
                        key={label.name}
                        className="mb-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${label.color}`} />
                          <span className="text-[11px] text-slate-300">
                            {label.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {label.conf}
                        </span>
                      </div>
                    ))}
                    <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                      <div className="text-[10px] font-medium text-cyan-300">
                        AI Assist Active
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400">
                        3 suggestions pending review
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-y border-white/5 bg-white/[0.02] py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="mb-6 text-center text-xs font-medium tracking-widest text-slate-500 uppercase">
              Trusted by leading ophthalmic research institutions
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              {[
                "Vision Research Lab",
                "Ophthalmic AI Institute",
                "Robotic Surgery Center",
                "Clinical Data Consortium",
              ].map((name) => (
                <span
                  key={name}
                  className="text-sm font-medium tracking-wide text-slate-600"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              One platform, three pillars of surgical AI
            </h2>
            <p className="mt-4 text-slate-400">
              From raw surgical footage to production-ready training data — every
              step optimized for ophthalmic precision.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                  />
                ),
                title: "Surgical Annotation",
                description:
                  "Frame-accurate labeling of cataract procedures with AI-assisted tools, phase detection, and instrument tracking built for ophthalmic workflows.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75"
                  />
                ),
                title: "Curated Datasets",
                description:
                  "Versioned, auditable surgical datasets with standardized schemas, quality metrics, and export formats ready for ML pipelines.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                  />
                ),
                title: "Robotic AI Training",
                description:
                  "Train and validate robotic ophthalmic models with temporal alignment, multi-modal fusion, and deployment-ready evaluation benchmarks.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition hover:border-cyan-500/20 hover:bg-white/[0.04]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 text-cyan-400 transition group-hover:from-cyan-500/30 group-hover:to-teal-500/20">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section
          id="capabilities"
          className="border-t border-white/5 bg-white/[0.01] py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Built for the complexity of ophthalmic surgery
                </h2>
                <p className="mt-4 text-slate-400">
                  Every capability is designed around the unique demands of
                  cataract and robotic eye surgery — from sub-millimeter
                  precision to real-time inference at the OR edge.
                </p>

                <ul className="mt-10 space-y-5">
                  {[
                    "Multi-phase cataract procedure segmentation",
                    "Instrument and anatomical landmark detection",
                    "Temporal consistency across video sequences",
                    "FHIR-compatible export and DICOM integration",
                    "Collaborative review with audit trails",
                    "Edge deployment for robotic systems",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
                        <svg
                          className="h-3 w-3 text-cyan-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    metric: "< 50ms",
                    label: "Inference Latency",
                    desc: "Real-time at 60fps",
                  },
                  {
                    metric: "12",
                    label: "Surgical Phases",
                    desc: "Cataract taxonomy",
                  },
                  {
                    metric: "4K",
                    label: "Video Support",
                    desc: "Microscope feeds",
                  },
                  {
                    metric: "SOC 2",
                    label: "Compliance",
                    desc: "HIPAA-ready infra",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl border border-white/5 bg-slate-900/50 p-6"
                  >
                    <div className="text-2xl font-bold text-cyan-300">
                      {card.metric}
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">
                      {card.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From OR footage to trained model
            </h2>
            <p className="mt-4 text-slate-400">
              A streamlined pipeline that accelerates your research without
              compromising clinical rigor.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="absolute top-8 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent md:block" />
            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Ingest",
                  desc: "Upload surgical videos from microscope systems, robotic platforms, or existing archives.",
                },
                {
                  step: "02",
                  title: "Annotate",
                  desc: "Label with AI-assisted tools, expert review queues, and consensus workflows.",
                },
                {
                  step: "03",
                  title: "Curate",
                  desc: "Version datasets, run quality checks, and generate standardized exports.",
                },
                {
                  step: "04",
                  title: "Train",
                  desc: "Feed robotic AI pipelines with validated, temporally-aligned training data.",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center md:text-left">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-slate-900 text-sm font-bold text-cyan-400 md:mx-0">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/50 via-slate-900 to-teal-950/50 px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_60%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to accelerate your surgical AI research?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Join leading ophthalmic institutions using SurgicalDataOS to
                build the next generation of cataract and robotic vision systems.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:hello@surgicaldataos.com"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
                >
                  Request Early Access
                </a>
                <a
                  href="mailto:research@surgicaldataos.com"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Contact Research Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500">
                <svg
                  className="h-4 w-4 text-slate-950"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="font-semibold">
                Surgical<span className="text-cyan-400">Data</span>OS
              </span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} SurgicalDataOS. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
