"use client";

import ConceptualKnowledgeGraph from "@/components/ConceptualKnowledgeGraph";
import { useEffect, useRef, useState } from "react";
import dataset from "@/data/knowledgeObjects/SDOS-REF-001.json";

type KnowledgeObject = (typeof dataset.knowledgeObjects)[number];

const KO_DISPLAY_FIELDS: {
  label: string;
  getValue: (ko: KnowledgeObject) => string | number | null;
  mono?: boolean;
}[] = [
  { label: "Title", getValue: (ko) => ko.title },
  {
    label: "Representative Frame",
    getValue: (ko) => ko.metadata.representativeFrame,
    mono: true,
  },
  {
    label: "Frame Range",
    getValue: (ko) => `${ko.metadata.startFrame}–${ko.metadata.endFrame}`,
  },
  {
    label: "Timestamp Range",
    getValue: (ko) =>
      `${ko.metadata.startTime}–${ko.metadata.endTime} seconds`,
  },
  { label: "Phase", getValue: (ko) => ko.metadata.phase },
  { label: "Stage", getValue: (ko) => ko.metadata.stage },
  { label: "Thumbnail", getValue: (ko) => ko.metadata.thumbnail },
  { label: "Observation", getValue: (ko) => ko.state.observation },
  { label: "Interpretation", getValue: (ko) => ko.state.interpretation },
  { label: "Decision", getValue: (ko) => ko.state.decision },
  { label: "Action", getValue: (ko) => ko.state.action },
  { label: "Event", getValue: (ko) => ko.state.event },
  { label: "Outcome", getValue: (ko) => ko.state.outcome },
  { label: "Cognitive Intent", getValue: (ko) => ko.state.cognitiveIntent },
  { label: "Knowledge Extract", getValue: (ko) => ko.state.knowledgeExtract },
];

const DATASET_FIELDS: {
  label: string;
  key: "title" | "procedure" | "technique" | "duration" | "fps";
}[] = [
  { label: "Title", key: "title" },
  { label: "Procedure", key: "procedure" },
  { label: "Technique", key: "technique" },
  { label: "Duration", key: "duration" },
  { label: "FPS", key: "fps" },
];

function frameToSeconds(frame: number, fps: number) {
  return frame / fps;
}

function FieldBlock({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
        {label}
      </p>
      <p
        className={`mt-1 text-sm leading-relaxed ${mono ? "font-mono text-cyan-400/90" : "text-slate-300"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function KnowledgeObjectExplorer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const stillRef = useRef<HTMLVideoElement>(null);
  const { knowledgeObjects } = dataset;
  const total = knowledgeObjects.length;
  const current = knowledgeObjects[currentIndex];

  useEffect(() => {
    setIsVisible(false);
    const timer = window.setTimeout(() => setIsVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const video = stillRef.current;
    if (!video) return;

    const seekToFrame = () => {
      video.currentTime = frameToSeconds(
        current.metadata.representativeFrame,
        dataset.fps,
      );
    };

    if (video.readyState >= 1) {
      seekToFrame();
    } else {
      video.addEventListener("loadedmetadata", seekToFrame, { once: true });
      return () => video.removeEventListener("loadedmetadata", seekToFrame);
    }
  }, [current.metadata.representativeFrame]);

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(total - 1, index)));
  };

  return (
    <section
      id="knowledge-object-explorer"
      className="border-t border-white/5 bg-white/[0.01] py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
            Knowledge Object Explorer
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Knowledge Object Explorer
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            See how SurgicalDataOS transforms a single surgical event into
            structured machine-readable knowledge.
          </p>
        </div>

        <div className="reveal mt-20 grid gap-6 lg:grid-cols-3">
          {/* Left — overview video */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="aspect-video h-auto w-full object-cover"
                src={dataset.video}
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Reference Video
            </p>
          </div>

          {/* Centre — knowledge object card */}
          <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              {knowledgeObjects.map((ko, index) => {
                const active = index === currentIndex;
                return (
                  <button
                    key={ko.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={active ? "step" : undefined}
                    className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                      active
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.25)]"
                        : "border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"
                    }`}
                  >
                    {ko.id}
                  </button>
                );
              })}
            </div>

            <div
              className={`relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-8 shadow-xl shadow-cyan-500/5 backdrop-blur-xl transition-opacity duration-500 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
                  <video
                    ref={stillRef}
                    muted
                    playsInline
                    preload="auto"
                    className="aspect-video h-auto w-full object-cover"
                    src={dataset.video}
                  />
                </div>

                <div className="space-y-4">
                  {KO_DISPLAY_FIELDS.map(({ label, getValue, mono }) => {
                    const raw = getValue(current);
                    if (raw === null) return null;
                    return (
                      <FieldBlock
                        key={label}
                        label={label}
                        value={raw}
                        mono={mono}
                      />
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goTo(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(currentIndex + 1)}
                    disabled={currentIndex === total - 1}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right — dataset summary */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-xl backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl" />
              <div className="relative space-y-5">
                <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                  Reference Dataset
                </p>

                {DATASET_FIELDS.map(({ label, key }) => (
                  <FieldBlock
                    key={key}
                    label={label}
                    value={dataset[key]}
                  />
                ))}

                <FieldBlock
                  label="Current Knowledge Object Number"
                  value={`Knowledge Object ${currentIndex + 1} of ${total}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Graph */}
        <div className="reveal mx-auto mt-20 max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
              Knowledge Graph
            </p>
            <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              From Knowledge Objects to Knowledge Graphs
            </h3>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
              Every Knowledge Object becomes a connected node within the
              SurgicalDataOS ontology, linking surgical observations, decisions,
              actions, tissues, instruments and outcomes into a machine-readable
              graph for AI, robotics and simulation.
            </p>
          </div>
          <ConceptualKnowledgeGraph />
        </div>
      </div>
    </section>
  );
}
