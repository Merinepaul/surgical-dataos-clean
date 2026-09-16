export const KNOWLEDGE_GRAPH_SECTION = {
  label: "Relational Knowledge Model",
  headline: "Knowledge Objects Connected by Typed Relationships",
  caption:
    "Operative video informs structured Knowledge Objects. In a full representation, each object links to others through typed relationships — temporal, causal, hierarchical, and more — preserving procedural and clinical reasoning.",
  disclaimer:
    "Interactive graphs on this site are conceptual illustrations only. They are not complete clinical knowledge graphs or validated operative models.",
  relationshipTypes: [
    "Temporal",
    "Causal",
    "State-transition",
    "Hierarchical",
    "Dependency",
    "Alternative-strategy",
    "Corrective / revision",
    "Evidence / provenance",
  ],
} as const;

export const KO_RELATIONSHIP_EXAMPLES = [
  {
    from: "Observation",
    to: "Interpretation",
    meaning: "What is seen is assigned clinical significance.",
  },
  {
    from: "Interpretation",
    to: "Decision",
    meaning: "Meaning informs the chosen operative strategy.",
  },
  {
    from: "Decision",
    to: "Action",
    meaning: "Strategy becomes an executed intervention.",
  },
  {
    from: "Action",
    to: "Outcome",
    meaning: "The immediate operative state produced by the act.",
  },
  {
    from: "Event",
    to: "Corrective action",
    meaning: "A transition triggers a deliberate surgical response.",
  },
  {
    from: "Knowledge Object",
    to: "Evidence / provenance",
    meaning: "Each object remains traceable to video, author, and review history.",
  },
  {
    from: "Alternative action",
    to: "Decision context",
    meaning: "Clinically valid branches can coexist from the same state.",
  },
] as const;

export const WORKFLOW_STAGES = [
  {
    step: "01",
    title: "AI proposes",
    description:
      "AI analyzes operative video and proposes structured annotations and candidate Knowledge Objects.",
  },
  {
    step: "02",
    title: "Surgeon reviews",
    description:
      "The operating surgeon reviews, corrects, and enriches proposals with clinical context and meaning.",
  },
  {
    step: "03",
    title: "Knowledge Object validated",
    description:
      "Confirmed information is organized into a Knowledge Object with observation, interpretation, decision, action, and outcome.",
  },
  {
    step: "04",
    title: "Graph enriched",
    description:
      "Validated objects connect through typed relationships, preserving sequence, causality, and surgical reasoning.",
  },
] as const;

export const SCOPE_DISCLAIMER =
  "SurgicalDataOS is a conceptual and technical demonstrator for converting operative video into structured, surgeon-validated Knowledge Objects. References to robotics, autonomous surgery, foundation models, or clinical decision support describe potential downstream uses of structured knowledge — not current validated clinical products, autonomous control, or regulatory-ready systems. These capabilities would require independent technical, clinical, safety, and governance evidence.";

export const APPLICATIONS_SUBHEADING =
  "Structured Knowledge Objects may support downstream uses across education, research, and future computational systems — the platform is not an annotation product.";

export const APPLICATIONS = [
  {
    title: "Artificial Intelligence",
    desc: "Validated Knowledge Objects may supply clinically grounded material for computer vision, multimodal models, and surgical reasoning research.",
  },
  {
    title: "Robotic Surgery",
    desc: "Structured knowledge may inform future research into assistance and shared autonomy — not autonomous or regulatory-ready systems on its own.",
  },
  {
    title: "Simulation",
    desc: "Simulation environments may incorporate procedural sequence together with documented interpretation and decision context.",
  },
  {
    title: "Surgical Education",
    desc: "Teaching and peer learning from linked observation, interpretation, decision, action, and outcome.",
  },
  {
    title: "Research",
    desc: "A common Knowledge Object framework for reproducible studies of technique, workflow, and outcomes.",
  },
  {
    title: "Clinical Decision Support",
    desc: "Future systems may draw on structured surgical knowledge for explanation and traceability — subject to clinical validation.",
  },
] as const;
