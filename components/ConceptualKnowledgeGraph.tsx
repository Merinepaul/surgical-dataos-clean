"use client";

import { useMemo, useState } from "react";

type GraphNode = {
  id: string;
  kind: "central" | "ontology" | "workflow";
  label: string;
  sublabel?: string;
  workflowLabel?: string;
  x: number;
  y: number;
  shape: "circle" | "rect";
  r?: number;
  w?: number;
  h?: number;
};

const VB_W = 640;
const VB_H = 500;
const CX = 320;
const CY = 248;

const GRAPH_NODES: GraphNode[] = [
  {
    id: "ko",
    kind: "central",
    label: "SDOS-KO-0003",
    sublabel: "Primary Nuclear Fracture",
    x: CX,
    y: CY,
    shape: "rect",
    w: 136,
    h: 54,
  },
  {
    id: "phase",
    kind: "ontology",
    label: "Phase",
    sublabel: "Nucleus Management",
    x: CX,
    y: 58,
    shape: "rect",
    w: 108,
    h: 44,
  },
  {
    id: "stage",
    kind: "ontology",
    label: "Stage",
    sublabel: "Fragmentation",
    x: 468,
    y: 92,
    shape: "rect",
    w: 108,
    h: 44,
  },
  {
    id: "primary-instrument",
    kind: "ontology",
    label: "Primary Instrument",
    sublabel: "Phaco Tip",
    x: 528,
    y: CY,
    shape: "rect",
    w: 108,
    h: 44,
  },
  {
    id: "secondary-instrument",
    kind: "ontology",
    label: "Secondary Instrument",
    sublabel: "Nagahara Chopper",
    x: 468,
    y: 404,
    shape: "rect",
    w: 128,
    h: 44,
  },
  {
    id: "tissue",
    kind: "ontology",
    label: "Target Tissue",
    sublabel: "Lens Nucleus",
    x: CX,
    y: 438,
    shape: "rect",
    w: 108,
    h: 44,
  },
  {
    id: "outcome",
    kind: "ontology",
    label: "Outcome",
    sublabel: "Fragment Separation",
    x: 172,
    y: 404,
    shape: "rect",
    w: 108,
    h: 44,
  },
  {
    id: "action",
    kind: "ontology",
    label: "Action",
    sublabel: "Vertical Chop",
    x: 112,
    y: CY,
    shape: "rect",
    w: 108,
    h: 44,
  },
  {
    id: "event",
    kind: "ontology",
    label: "Event",
    sublabel: "Primary Nuclear Fracture",
    x: 172,
    y: 92,
    shape: "rect",
    w: 118,
    h: 44,
  },
  {
    id: "prev",
    kind: "workflow",
    workflowLabel: "Previous",
    label: "SDOS-KO-0002",
    x: 72,
    y: CY,
    shape: "rect",
    w: 96,
    h: 48,
  },
  {
    id: "next",
    kind: "workflow",
    workflowLabel: "Next",
    label: "SDOS-KO-0004",
    x: 568,
    y: CY,
    shape: "rect",
    w: 96,
    h: 48,
  },
];

const GRAPH_EDGES: [string, string][] = [
  ["phase", "ko"],
  ["stage", "ko"],
  ["primary-instrument", "ko"],
  ["secondary-instrument", "ko"],
  ["tissue", "ko"],
  ["outcome", "ko"],
  ["action", "ko"],
  ["event", "ko"],
  ["prev", "ko"],
  ["ko", "next"],
];

const PIPELINE_STEPS = ["Knowledge Graph", "Foundation Model"] as const;
const PIPELINE_OUTCOMES = [
  "Robotic Cataract Surgery",
  "Simulation",
  "Decision Support",
] as const;

function getNode(id: string) {
  return GRAPH_NODES.find((n) => n.id === id)!;
}

function nodeBoundaryPoint(node: GraphNode, targetX: number, targetY: number) {
  const dx = targetX - node.x;
  const dy = targetY - node.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  if (node.shape === "rect") {
    const hw = (node.w ?? 96) / 2;
    const hh = (node.h ?? 44) / 2;
    const tx = ux !== 0 ? hw / Math.abs(ux) : Infinity;
    const ty = uy !== 0 ? hh / Math.abs(uy) : Infinity;
    const t = Math.min(tx, ty);
    return { x: node.x + ux * t, y: node.y + uy * t };
  }

  const r = node.r ?? 24;
  return { x: node.x + ux * r, y: node.y + uy * r };
}

function edgeEndpoints(from: GraphNode, to: GraphNode) {
  const start = nodeBoundaryPoint(from, to.x, to.y);
  const end = nodeBoundaryPoint(to, from.x, from.y);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}

export default function ConceptualKnowledgeGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const connectedIds = useMemo(() => {
    if (!hoveredId) return null;
    const ids = new Set<string>([hoveredId]);
    GRAPH_EDGES.forEach(([a, b]) => {
      if (a === hoveredId) ids.add(b);
      if (b === hoveredId) ids.add(a);
    });
    return ids;
  }, [hoveredId]);

  const nodeOpacity = (id: string) => {
    if (!connectedIds) return 1;
    return connectedIds.has(id) ? 1 : 0.22;
  };

  const edgeOpacity = (a: string, b: string) => {
    if (!connectedIds) return 0.38;
    return connectedIds.has(a) && connectedIds.has(b) ? 0.9 : 0.06;
  };

  const edgeHighlighted = (a: string, b: string) =>
    !!connectedIds && connectedIds.has(a) && connectedIds.has(b);

  return (
    <div className="mt-16">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm sm:p-10">
        <div
          className="relative mx-auto aspect-[640/500] w-full max-w-3xl"
          onMouseLeave={() => setHoveredId(null)}
        >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="koe-graph-edge-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="koe-graph-hub-glow" cx="50%" cy="50%" r="45%">
              <stop offset="0%" stopColor="rgba(34,211,238,0.1)" />
              <stop offset="60%" stopColor="rgba(34,211,238,0.03)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r="168" fill="url(#koe-graph-hub-glow)" />
          <circle
            cx={CX}
            cy={CY}
            r="88"
            fill="none"
            stroke="rgba(34,211,238,0.07)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx={CX}
            cy={CY}
            r="148"
            fill="none"
            stroke="rgba(148,163,184,0.06)"
            strokeWidth="0.75"
          />

          {GRAPH_EDGES.map(([fromId, toId]) => {
            const from = getNode(fromId);
            const to = getNode(toId);
            const { x1, y1, x2, y2 } = edgeEndpoints(from, to);
            const highlighted = edgeHighlighted(fromId, toId);
            const opacity = edgeOpacity(fromId, toId);
            const isWorkflow = from.kind === "workflow" || to.kind === "workflow";

            return (
              <g key={`${fromId}-${toId}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(34,211,238,0.06)"
                  strokeWidth="1"
                />
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    highlighted
                      ? "rgba(34,211,238,0.8)"
                      : isWorkflow
                        ? "rgba(34,211,238,0.45)"
                        : "rgba(34,211,238,0.32)"
                  }
                  strokeWidth={highlighted ? 1.5 : isWorkflow ? 1.15 : 1}
                  strokeLinecap="round"
                  strokeDasharray={isWorkflow ? "5 4" : "3 5"}
                  style={{
                    opacity,
                    transition: "opacity 0.3s ease, stroke 0.3s ease",
                  }}
                  filter={highlighted ? "url(#koe-graph-edge-glow)" : undefined}
                />
              </g>
            );
          })}
        </svg>

        {GRAPH_NODES.map((node) => {
          const left = (node.x / VB_W) * 100;
          const top = (node.y / VB_H) * 100;
          const isHovered = hoveredId === node.id;
          const active = !connectedIds || connectedIds.has(node.id);
          const isCentral = node.kind === "central";
          const isWorkflow = node.kind === "workflow";
          const width = node.w ?? (node.r ?? 24) * 2;
          const height = node.h ?? (node.r ?? 24) * 2;

          const baseShadow = isCentral
            ? "0 0 32px rgba(34,211,238,0.24)"
            : isWorkflow
              ? "0 0 14px rgba(34,211,238,0.08)"
              : "0 0 12px rgba(34,211,238,0.06)";

          const hoverShadow = isCentral
            ? "0 0 44px rgba(34,211,238,0.36)"
            : "0 0 22px rgba(34,211,238,0.2)";

          return (
            <button
              key={node.id}
              type="button"
              className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border bg-slate-950/70 p-1.5 text-center backdrop-blur-md transition-all duration-300 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 ${
                isCentral
                  ? "rounded-xl border-cyan-400/45"
                  : isWorkflow
                    ? "rounded-lg border-white/15"
                    : "rounded-lg border-cyan-400/20"
              }`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width,
                height,
                opacity: nodeOpacity(node.id),
                filter: isHovered
                  ? "brightness(1.15)"
                  : active
                    ? "brightness(1)"
                    : "brightness(0.88)",
                boxShadow: isHovered ? hoverShadow : active ? baseShadow : "none",
                transform: `translate(-50%, -50%) scale(${isHovered ? 1.02 : 1})`,
              }}
              onMouseEnter={() => setHoveredId(node.id)}
              onFocus={() => setHoveredId(node.id)}
              onBlur={() => setHoveredId(null)}
            >
              {node.kind === "central" && (
                <>
                  <span className="font-mono text-[10px] leading-tight text-cyan-100">
                    {node.label}
                  </span>
                  <span className="mt-0.5 block text-[8px] leading-tight text-cyan-300/85">
                    {node.sublabel}
                  </span>
                </>
              )}
              {node.kind === "ontology" && (
                <>
                  <span className="font-mono text-[8px] tracking-widest text-cyan-400/55 uppercase">
                    {node.label}
                  </span>
                  <span className="mt-0.5 block text-[9px] leading-tight text-slate-200">
                    {node.sublabel}
                  </span>
                </>
              )}
              {node.kind === "workflow" && (
                <>
                  <span className="font-mono text-[8px] tracking-widest text-slate-500 uppercase">
                    {node.workflowLabel}
                  </span>
                  <span className="mt-0.5 font-mono text-[9px] leading-tight text-slate-300">
                    {node.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-xs flex-col items-center gap-3">
        {PIPELINE_STEPS.map((step, i, arr) => (
          <div key={step} className="flex w-full flex-col items-center gap-3">
            <div className="w-full rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] px-6 py-3.5 text-center backdrop-blur-sm">
              <span className="text-sm font-medium text-slate-200">{step}</span>
            </div>
            {i < arr.length - 1 && (
              <span className="text-lg text-cyan-500/45">↓</span>
            )}
          </div>
        ))}
        <span className="text-lg text-cyan-500/45">↓</span>
        <div className="flex w-full flex-col gap-2">
          {PIPELINE_OUTCOMES.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] px-6 py-3 text-center backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
