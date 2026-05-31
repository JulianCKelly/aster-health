// Design tokens and color mappings used across the Aster demo.

export const C = {
  bg:       "#08101c",
  sidebar:  "#060c16",
  surface:  "#0f1929",
  s2:       "#162032",
  border:   "#1e2d42",
  borderHi: "#2a3d5a",
  text:     "#e2e8f0",
  textDim:  "#7ba3cc",
  muted:    "#4a6080",
  faint:    "#2d4a6a",
  accent:   "#2563eb",
  accentHi: "#3b82f6",
};

// Severity definitions with colours for badges and warnings.
export const SEV = {
  CRITICAL: { label: "Critical", text: "#fca5a5", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.28)",  dot: "#dc2626" },
  HIGH:     { label: "High",     text: "#fdba74", bg: "rgba(234,88,12,0.08)",   border: "rgba(234,88,12,0.28)",   dot: "#ea580c" },
  MEDIUM:   { label: "Medium",   text: "#fde047", bg: "rgba(202,138,4,0.08)",   border: "rgba(202,138,4,0.28)",   dot: "#ca8a04" },
  LOW:      { label: "Low",      text: "#86efac", bg: "rgba(22,163,74,0.08)",   border: "rgba(22,163,74,0.28)",   dot: "#16a34a" },
} as const;

// Colour mapping for timeline event types.
export const EVENT_COLORS: Record<string, string> = {
  ENCOUNTER:    "#94a3b8",
  DIAGNOSIS:    "#38bdf8",
  MEDICATION:   "#34d399",
  PROCEDURE:    "#fb923c",
  LAB:          "#f472b6",
  IMMUNIZATION: "#fbbf24",
};

// Colour mapping for audit categories.
export const CAT_COLORS: Record<string, string> = {
  HIPAA:            "#a78bfa",
  "DATA QUALITY":     "#38bdf8",
  INTEROPERABILITY: "#34d399",
};

// Colour mapping for code systems used in the coding assistant.
export const CODE_SYSTEMS: Record<string, string> = {
  "ICD-10":  "#38bdf8",
  CPT:     "#fb923c",
  LOINC:   "#f472b6",
  RxNorm:  "#34d399",
};