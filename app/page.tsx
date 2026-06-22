"use client";

import KnowledgeObjectExplorer from "@/components/KnowledgeObjectExplorer";
import RequestAccessModal from "@/components/RequestAccessModal";
import Link from "next/link";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type GraphNode = {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  r: number;
  shape?: "circle" | "rect";
  w?: number;
  h?: number;
};

const CX = 240;
const CY = 242;

const GRAPH_NODES: GraphNode[] = [
  { id: "graph", label: "Knowledge Graph", x: CX, y: CY, r: 55 },
  {
    id: "objects",
    label: "Knowledge Objects",
    x: CX,
    y: 148,
    r: 25,
  },
  { id: "video", label: "Surgical Video", x: CX, y: 62, r: 28 },
  { id: "phase", label: "Phase", x: 108, y: 152, r: 21 },
  {
    id: "instrument",
    label: "Instrument",
    sublabel: "Phaco Tip",
    x: 372,
    y: 152,
    r: 21,
  },
  {
    id: "anatomy",
    label: "Anatomy",
    sublabel: "Capsule",
    x: 68,
    y: CY,
    r: 21,
  },
  { id: "action", label: "Action", x: 412, y: CY, r: 21 },
  {
    id: "tissue",
    label: "Tissue",
    sublabel: "Nucleus",
    x: 118,
    y: 332,
    r: 19,
  },
  { id: "event", label: "Event", x: 362, y: 332, r: 19 },
  { id: "complication", label: "Complication", x: CX, y: 362, r: 19 },
  {
    id: "decision",
    label: "Decision Layer",
    x: CX,
    y: 432,
    r: 28,
    w: 92,
    h: 40,
    shape: "rect",
  },
  {
    id: "foundation",
    label: "AI Foundation Model",
    x: 178,
    y: 492,
    r: 24,
  },
  {
    id: "robotic",
    label: "Robotic Cataract System",
    x: 302,
    y: 492,
    r: 24,
  },
];

const GRAPH_EDGES: [string, string][] = [
  ["video", "objects"],
  ["objects", "graph"],
  ["video", "phase"],
  ["video", "instrument"],
  ["video", "event"],
  ["video", "action"],
  ["phase", "action"],
  ["phase", "event"],
  ["phase", "graph"],
  ["instrument", "action"],
  ["instrument", "anatomy"],
  ["instrument", "graph"],
  ["anatomy", "tissue"],
  ["anatomy", "graph"],
  ["event", "complication"],
  ["event", "graph"],
  ["action", "graph"],
  ["tissue", "graph"],
  ["complication", "graph"],
  ["graph", "decision"],
  ["decision", "foundation"],
  ["foundation", "robotic"],
];

const VB_W = 480;
const VB_H = 520;

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
    const hw = (node.w ?? node.r * 2) / 2;
    const hh = (node.h ?? node.r * 1.4) / 2;
    const tx = ux !== 0 ? hw / Math.abs(ux) : Infinity;
    const ty = uy !== 0 ? hh / Math.abs(uy) : Infinity;
    const t = Math.min(tx, ty);
    return { x: node.x + ux * t, y: node.y + uy * t };
  }

  return { x: node.x + ux * node.r, y: node.y + uy * node.r };
}

function edgeEndpoints(from: GraphNode, to: GraphNode) {
  const start = nodeBoundaryPoint(from, to.x, to.y);
  const end = nodeBoundaryPoint(to, from.x, from.y);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}

function HeroKnowledgeGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-6, 6]);

  const connectedIds = useMemo(() => {
    if (!hoveredId) return null;
    const ids = new Set<string>([hoveredId]);
    GRAPH_EDGES.forEach(([a, b]) => {
      if (a === hoveredId) ids.add(b);
      if (b === hoveredId) ids.add(a);
    });
    return ids;
  }, [hoveredId]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredId(null);
  };

  const nodeOpacity = (id: string) => {
    if (!connectedIds) return 1;
    return connectedIds.has(id) ? 1 : 0.15;
  };

  const edgeOpacity = (a: string, b: string) => {
    if (!connectedIds) return 0.32;
    return connectedIds.has(a) && connectedIds.has(b) ? 0.85 : 0.05;
  };

  const edgeStrokeWidth = (a: string, b: string, isHub: boolean) => {
    if (!connectedIds) return isHub ? 1.25 : 1;
    return connectedIds.has(a) && connectedIds.has(b) ? 1.6 : 0.75;
  };

  return (
    <div
      className="relative mx-auto aspect-[480/520] w-full max-w-md"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Interactive knowledge graph visualization"
    >
      <motion.div
        className="absolute inset-0"
        style={
          prefersReducedMotion ? undefined : { x: parallaxX, y: parallaxY }
        }
      >
        {/* Radial convergence field */}
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
        >
          <defs>
            <filter
              id="hero-edge-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="hero-hub-glow" cx="50%" cy="46%" r="40%">
              <stop offset="0%" stopColor="rgba(34,211,238,0.11)" />
              <stop offset="55%" stopColor="rgba(34,211,238,0.04)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r="175" fill="url(#hero-hub-glow)" />
          <circle
            cx={CX}
            cy={CY}
            r="72"
            fill="none"
            stroke="rgba(34,211,238,0.06)"
            strokeWidth="1"
          />

          {GRAPH_EDGES.map(([fromId, toId], i) => {
            const from = getNode(fromId);
            const to = getNode(toId);
            const { x1, y1, x2, y2 } = edgeEndpoints(from, to);
            const opacity = edgeOpacity(fromId, toId);
            const isHub = toId === "graph" || fromId === "graph";
            const isHighlighted =
              !!connectedIds &&
              connectedIds.has(fromId) &&
              connectedIds.has(toId);
            const strokeW = edgeStrokeWidth(fromId, toId, isHub);

            return (
              <g key={`${fromId}-${toId}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(34,211,238,0.08)"
                  strokeWidth="1"
                />
                <motion.line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    isHighlighted
                      ? "rgba(34,211,238,0.75)"
                      : isHub
                        ? "rgba(34,211,238,0.5)"
                        : "rgba(34,211,238,0.35)"
                  }
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  animate={{ opacity }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  filter="url(#hero-edge-glow)"
                />
                {!prefersReducedMotion && (
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#22d3ee"
                    strokeWidth={isHighlighted ? 1.25 : 1}
                    strokeLinecap="round"
                    strokeDasharray="2 140"
                    animate={{
                      opacity: isHighlighted ? opacity : opacity * 0.55,
                      strokeDashoffset: isHighlighted ? [0, -142] : 0,
                    }}
                    transition={{
                      opacity: { duration: 0.3, ease: "easeOut" },
                      strokeDashoffset: isHighlighted
                        ? {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                          }
                        : { duration: 0.3 },
                    }}
                  />
                )}
                {!prefersReducedMotion && !isHighlighted && (
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#22d3ee"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="2 140"
                    animate={{
                      opacity: opacity * 0.45,
                      strokeDashoffset: [0, -142],
                    }}
                    transition={{
                      opacity: { duration: 0.3, ease: "easeOut" },
                      strokeDashoffset: {
                        duration: 6 + i * 0.35,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 3 + (i % 4) * 0.8,
                      },
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {GRAPH_NODES.map((node) => {
          const left = (node.x / VB_W) * 100;
          const top = (node.y / VB_H) * 100;
          const isHovered = hoveredId === node.id;
          const active = !connectedIds || connectedIds.has(node.id);
          const isHub = node.id === "graph";
          const isObjects = node.id === "objects";
          const isRect = node.shape === "rect";
          const width = isRect ? (node.w ?? node.r * 2) : node.r * 2;
          const height = isRect ? (node.h ?? node.r * 1.4) : node.r * 2;
          const fontSize =
            node.r >= 50
              ? 9.5
              : node.r >= 28
                ? 8.5
                : node.r >= 24
                  ? 8
                  : node.r >= 21
                    ? 7.5
                    : 7;

          const baseShadow = isHub
            ? "0 0 36px rgba(34,211,238,0.22)"
            : isObjects
              ? "0 0 20px rgba(34,211,238,0.12)"
              : "0 0 14px rgba(34,211,238,0.06)";

          const hoverShadow = isHub
            ? "0 0 48px rgba(34,211,238,0.38)"
            : isObjects
              ? "0 0 28px rgba(34,211,238,0.22)"
              : "0 0 22px rgba(34,211,238,0.18)";

          return (
            <motion.button
              key={node.id}
              type="button"
              className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border bg-white/[0.04] p-1 text-center backdrop-blur-md focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 ${
                isRect ? "rounded-xl" : "rounded-full"
              } ${
                isHub
                  ? "border-cyan-400/40"
                  : isObjects
                    ? "border-cyan-400/30"
                    : "border-cyan-400/20"
              }`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width,
                height,
              }}
              animate={{
                opacity: nodeOpacity(node.id),
                filter: isHovered
                  ? "brightness(1.18)"
                  : active
                    ? "brightness(1)"
                    : "brightness(0.85)",
                boxShadow: isHovered
                  ? hoverShadow
                  : active
                    ? baseShadow
                    : "0 0 6px rgba(34,211,238,0.03)",
                scale: isHovered ? 1.03 : 1,
              }}
              transition={{
                opacity: { duration: 0.3 },
                filter: { duration: 0.3 },
                boxShadow: { duration: 0.3 },
                scale: { duration: 0.3, ease: "easeOut" },
              }}
              aria-label={node.label}
              onMouseEnter={() => setHoveredId(node.id)}
              onFocus={() => setHoveredId(node.id)}
              onBlur={() => setHoveredId(null)}
              tabIndex={0}
            >
              <span
                className={`block leading-[1.1] font-medium ${
                  isHub
                    ? "text-cyan-50"
                    : isObjects
                      ? "text-cyan-100"
                      : "text-slate-200"
                }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {node.label}
              </span>
              {node.sublabel && (
                <span
                  className="mt-0.5 block leading-none text-cyan-400/60"
                  style={{ fontSize: `${Math.max(fontSize - 1.5, 5.5)}px` }}
                >
                  {node.sublabel}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
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
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8"
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-3" aria-label="SurgicalDataOS home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500">
              <svg
                className="h-5 w-5 text-slate-950"
                aria-hidden="true"
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
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#problem"
              className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            >
              Problem
            </a>
            <a
              href="#machine-knowledge"
              className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            >
              Knowledge Model
            </a>
            <a
              href="#platform"
              className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            >
              Future Platform
            </a>
            <a
              href="#about"
              className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            >
              About
            </a>
            <a
              href="#contact"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-950 transition duration-200 hover:bg-cyan-50"
            >
              Request Access
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content" className="relative z-10">
        {/* 1. HERO */}
        <section
          className="mx-auto max-w-7xl px-6 pt-24 pb-32 lg:px-8 lg:pt-32"
          aria-label="Introduction"
        >
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <div className="reveal">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                Machine-Understandable Surgical Knowledge
              </div>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                The Missing{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Knowledge Layer
                </span>
                <br />
                for Surgical AI
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-400">
                SurgicalDataOS transforms cataract surgery videos into
                machine-readable knowledge that powers AI, robotics, simulation,
                research and next-generation ophthalmic intelligence.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <a
                  href="#machine-knowledge"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition duration-200 hover:brightness-110"
                >
                  Explore SurgicalDataOS
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
                  href="#knowledge-object-explorer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/10"
                >
                  Explore the Knowledge Object Explorer
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
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
                    />
                  </svg>
                </a>
              </div>

              <p className="mt-6 max-w-md text-xs leading-relaxed text-slate-600">
                A representation framework for machine-understandable cataract
                surgery.
              </p>
            </div>

            <div className="reveal" style={{ transitionDelay: "120ms" }}>
              <HeroKnowledgeGraph />
            </div>
          </div>
        </section>

        {/* 2. THE PROBLEM */}
        <section
          id="problem"
          className="border-t border-white/5 bg-white/[0.01] py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                The Problem
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Current Surgical AI is trained on pixels.
                <br />
                <span className="text-slate-500">
                  Not on surgical knowledge.
                </span>
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-slate-400">
                Object detection and segmentation tell a model{" "}
                <em className="text-slate-300 not-italic">where</em> things
                appear in a frame. They do not encode{" "}
                <em className="text-slate-300 not-italic">why</em> an action
                occurs,{" "}
                <em className="text-slate-300 not-italic">when</em> a phase
                transitions, or{" "}
                <em className="text-slate-300 not-italic">how</em> instrument
                motion relates to tissue response. Robotic cataract surgery
                demands causal, temporal, and intent-aware representations —
                not bounding boxes alone.
              </p>
            </div>

            <div className="reveal mt-20 grid gap-6 lg:grid-cols-2">
              {/* Pixel-based */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-xl backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-700" />
                  <span className="font-mono text-xs tracking-wider text-slate-500 uppercase">
                    Pixel-based AI
                  </span>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                  {/* Simulated pixel grid */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(148,163,184,0.3) 11px, rgba(148,163,184,0.3) 12px), repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(148,163,184,0.3) 11px, rgba(148,163,184,0.3) 12px)",
                    }}
                  />
                  {/* Bounding boxes */}
                  {[
                    { top: "20%", left: "25%", w: "35%", h: "30%" },
                    { top: "45%", left: "50%", w: "28%", h: "22%" },
                    { top: "60%", left: "15%", w: "40%", h: "25%" },
                  ].map((box, i) => (
                    <div
                      key={i}
                      className="absolute border border-red-400/40 bg-red-400/5"
                      style={{
                        top: box.top,
                        left: box.left,
                        width: box.w,
                        height: box.h,
                      }}
                    >
                      <span className="absolute -top-4 left-0 font-mono text-[9px] text-red-400/70">
                        class_{i + 1}: 0.{87 - i * 3}
                      </span>
                    </div>
                  ))}
                </div>
                <ul className="mt-6 space-y-3">
                  {[
                    "Detects objects in isolated frames",
                    "No temporal or causal structure",
                    "Cannot reason about surgical intent",
                    "Fails under domain shift and occlusion",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-500"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Knowledge-based */}
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] p-8 shadow-xl shadow-cyan-500/5 backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-cyan-500/20" />
                  <span className="font-mono text-xs tracking-wider text-cyan-400 uppercase">
                    Knowledge-based AI
                  </span>
                  <div className="h-px flex-1 bg-cyan-500/20" />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-cyan-500/10 bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-950" />
                  {/* Knowledge graph mini */}
                  <svg
                    viewBox="0 0 320 240"
                    className="absolute inset-0 h-full w-full p-6"
                  >
                    {[
                      [160, 30, 160, 70],
                      [160, 90, 160, 130],
                      [160, 150, 100, 190],
                      [160, 150, 220, 190],
                      [100, 210, 160, 230],
                      [220, 210, 160, 230],
                    ].map(([x1, y1, x2, y2], i) => (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#22d3ee"
                        strokeOpacity="0.4"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        style={{
                          animation: "edge-flow 2s linear infinite",
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                    ))}
                    {[
                      { x: 160, y: 24, label: "Phase" },
                      { x: 160, y: 84, label: "Action" },
                      { x: 160, y: 144, label: "Instrument" },
                      { x: 100, y: 200, label: "Tissue" },
                      { x: 220, y: 200, label: "Outcome" },
                      { x: 160, y: 230, label: "Decision" },
                    ].map((node) => (
                      <g key={node.label}>
                        <rect
                          x={node.x - 36}
                          y={node.y - 10}
                          width="72"
                          height="20"
                          rx="4"
                          fill="rgba(34,211,238,0.08)"
                          stroke="rgba(34,211,238,0.3)"
                          strokeWidth="0.75"
                        />
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill="#67e8f9"
                          fontSize="9"
                          fontFamily="ui-monospace, monospace"
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                <ul className="mt-6 space-y-3">
                  {[
                    "Representation of operative semantics",
                    "Temporal, causal, and intent-aware reasoning",
                    "Enables robotic planning and skill assessment",
                    "Generalizes across surgeons and equipment",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
                        <svg
                          className="h-2.5 w-2.5 text-cyan-400"
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
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FROM SURGICAL VIDEO TO MACHINE KNOWLEDGE */}
        <section id="machine-knowledge" className="py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                From Surgical Video to Machine Knowledge
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                What is SurgicalDataOS?
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Every procedure is represented as a sequence of Machine
                Knowledge Objects (MKOs)—computational representations that
                preserve what the surgeon observed, interpreted, decided and
                performed. Together these MKOs form a machine-readable Knowledge
                Graph capable of supporting explainable AI, robotics, simulation,
                education and collaborative research.
              </p>
            </div>

          </div>
        </section>

        {/* 5. BEYOND COMPUTER VISION */}
        <section id="beyond-vision" className="py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                Beyond Computer Vision
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Existing datasets describe what is visible.
                <br />
                <span className="text-slate-400">
                  SurgicalDataOS represents what is happening.
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Computer vision identifies objects in individual frames.
                Operative intelligence requires temporal events, anatomical
                relationships, instrument interactions, intent and procedural
                decision making. SurgicalDataOS transforms video into
                machine-understandable knowledge.
              </p>
            </div>

            <div className="reveal mt-20 grid gap-6 lg:grid-cols-3">
              {[
                {
                  label: "Traditional Computer Vision",
                  title: "Where is it?",
                  heading: "Visual Perception",
                  items: [
                    "Detection",
                    "Segmentation",
                    "Tracking",
                    "Classification",
                    "Bounding Boxes",
                  ],
                  note: "Describes pixels and objects within individual frames.",
                },
                {
                  label: "Knowledge Objects",
                  title: "What is happening?",
                  heading: "Surgical Understanding",
                  items: [
                    "Phase",
                    "Action",
                    "Instrument",
                    "Anatomy",
                    "Tissue",
                    "Complication",
                  ],
                  note: "Represents surgical workflow, anatomical context and procedural meaning.",
                },
                {
                  label: "Knowledge Layer",
                  title: "What should happen next?",
                  heading: "Machine Reasoning",
                  items: [
                    "Knowledge Graph",
                    "Decision Layer",
                    "Surgical Context",
                    "Robot-ready Representation",
                    "Foundation Model Input",
                  ],
                  note: "Enables reasoning, planning and robotic execution.",
                },
              ].map((card) => (
                <div
                  key={card.heading}
                  className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-xl backdrop-blur-xl transition duration-300 hover:border-cyan-500/20"
                >
                  <p className="font-mono text-[10px] tracking-widest text-cyan-400/60 uppercase">
                    {card.label}
                  </p>
                  <p className="mt-4 text-xs font-medium tracking-widest text-slate-500 uppercase">
                    {card.heading}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {card.title}
                  </h3>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-slate-300"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-cyan-400/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 border-t border-white/5 pt-6 text-xs leading-relaxed text-slate-500">
                    {card.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="reveal mt-20">
              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-max items-center justify-center gap-0 px-4 lg:min-w-0 lg:px-0">
                  {[
                    "Surgical Video",
                    "Visual Perception",
                    "Knowledge Objects",
                    "Knowledge Graph",
                    "Decision Layer",
                    "Surgical AI",
                    "Robotic Cataract Surgery",
                  ].map((step, i, arr) => (
                    <div key={step} className="flex items-center">
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-sm">
                        <span className="whitespace-nowrap text-xs font-medium text-slate-300 sm:text-sm">
                          {step}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="relative mx-1 h-px w-6 sm:w-10 lg:w-14">
                          <div className="absolute inset-0 bg-cyan-500/15" />
                          <motion.div
                            className="absolute inset-0 origin-left bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                            animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.5,
                              repeatDelay: 1.5,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <KnowledgeObjectExplorer />

        {/* 6. APPLICATIONS */}
        <section
          id="applications"
          className="border-t border-white/5 bg-white/[0.01] py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                Applications
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                One knowledge layer, many frontiers
              </h2>
            </div>

            <div className="reveal mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Research",
                  desc: "Accelerate hypothesis testing with queryable knowledge graphs instead of raw video archives.",
                },
                {
                  title: "Robotic Surgery",
                  desc: "Train manipulation policies on action-outcome pairs with temporal and causal alignment.",
                },
                {
                  title: "Foundation Models",
                  desc: "Pre-train vision-language models on semantically rich operative narratives, not pixel co-occurrence.",
                },
                {
                  title: "Simulation",
                  desc: "Drive physics-informed simulators with real procedure dynamics, instrument trajectories, and tissue response.",
                },
                {
                  title: "Skill Assessment",
                  desc: "Quantify proficiency through decision trees, complication rates, and micro-action efficiency.",
                },
                {
                  title: "Autonomous Workflow",
                  desc: "Enable phase-aware automation that understands context, not just detects objects in frame.",
                },
                {
                  title: "Clinical Decision Support",
                  desc: "Surface evidence from outcome data to inform intraoperative and postoperative decisions.",
                },
              ].map((app) => (
                <div
                  key={app.title}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04]"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {app.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {app.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. PLATFORM */}
        <section id="platform" className="py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                Future Platform
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Infrastructure for knowledge at scale
              </h2>
            </div>

            <div className="reveal mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Annotation Studio",
                  desc: "Multi-level labeling with AI assist, consensus workflows, and real-time validation against the representation schema.",
                  tag: "core",
                },
                {
                  name: "Dataset Marketplace",
                  desc: "Discover, license, and version curated cataract datasets with full provenance and quality metrics.",
                  tag: "data",
                },
                {
                  name: "Knowledge Graph Explorer",
                  desc: "Traverse surgical entities, query temporal relationships, and export subgraphs for model training.",
                  tag: "graph",
                },
                {
                  name: "Validation Dashboard",
                  desc: "Inter-annotator agreement, schema compliance, and automated quality gates before dataset release.",
                  tag: "qa",
                },
                {
                  name: "API",
                  desc: "Programmatic access to annotations, graph queries, and streaming video pipelines for research integration.",
                  tag: "dev",
                },
              ].map((product) => (
                <div
                  key={product.name}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-xl backdrop-blur-xl transition duration-300 hover:border-cyan-500/20"
                >
                  <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl transition group-hover:bg-cyan-500/10" />
                  <div className="relative">
                    <span className="font-mono text-[10px] tracking-widest text-cyan-400/60 uppercase">
                      {product.tag}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {product.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. ABOUT */}
        <section
          id="about"
          className="border-t border-white/5 bg-white/[0.01] py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                About
              </p>
              <blockquote className="mt-8 text-3xl font-bold leading-snug tracking-tight sm:text-4xl lg:text-5xl">
                &ldquo;The knowledge layer for{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  machine-understandable surgery
                </span>
                .&rdquo;
              </blockquote>
              <p className="mt-10 text-lg leading-relaxed text-slate-400">
                SurgicalDataOS is founded on a simple conviction: the next
                generation of surgical AI will not emerge from larger models
                trained on more pixels. It will emerge from representations of
                operative expertise that preserve observation, reasoning,
                decision-making and action in a machine-understandable form.
              </p>
            </div>
          </div>
        </section>

        {/* 13. COLLABORATION */}
        <section
          id="collaboration"
          className="border-t border-white/5 bg-white/[0.01] py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                Collaboration
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Building Surgical Intelligence Together
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                SurgicalDataOS is an open research initiative that welcomes
                collaboration with surgeons, AI researchers, robotics companies,
                academic laboratories and industry partners interested in
                advancing machine-understandable intelligence. We believe the
                future of surgical AI will be built through open scientific
                collaboration, shared representations and rigorous validation.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:hello@surgicaldataos.com"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 px-8 py-3.5 text-sm font-semibold text-slate-950 transition duration-200 hover:brightness-110"
                >
                  Get in Touch
                </a>
                <a
                  href="https://github.com/Merinepaul/surgical-dataos-clean"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/10"
                >
                  View GitHub
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/10"
                >
                  Read White Paper
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 9. CONTACT */}
        <section id="contact" className="mx-auto max-w-7xl px-6 pt-32 pb-32 lg:px-8">
          <div className="reveal relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/50 via-slate-900 to-teal-950/50 px-8 py-20 text-center shadow-xl sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_60%)]" />
            <div className="relative">
              <p className="text-xs font-medium tracking-widest text-cyan-400/80 uppercase">
                Contact
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Build the knowledge layer with us
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
                Whether you are advancing AI research, developing robotic
                platforms, or curating clinical datasets — we want to hear from
                you.
              </p>
              <div className="mt-10">
                <RequestAccessModal />
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:collaborate@surgicaldataos.com"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/5"
                >
                  Collaborate
                </a>
                <a
                  href="mailto:research@surgicaldataos.com"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/5"
                >
                  Research Partnerships
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t border-white/5 bg-slate-950"
        aria-label="Site footer"
      >
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500">
                <svg
                  className="h-4 w-4 text-slate-950"
                  aria-hidden="true"
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
