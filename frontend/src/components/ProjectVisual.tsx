import type { VisualKind } from "../data/types";

const stroke = "stroke-line";
const txt = "fill-muted font-mono";

function Confusion() {
  const cells = [0.85, 0.15, 0.2, 0.8];
  return (
    <g>
      {cells.map((v, i) => (
        <rect key={i} x={120 + (i % 2) * 84} y={50 + Math.floor(i / 2) * 84} width="80" height="80" rx="6"
          className="fill-accent" fillOpacity={0.12 + v * 0.55} />
      ))}
      <text x="160" y="40" textAnchor="middle" fontSize="10" className={txt}>pred 0</text>
      <text x="244" y="40" textAnchor="middle" fontSize="10" className={txt}>pred 1</text>
      <text x="104" y="94" textAnchor="end" fontSize="10" className={txt}>true 0</text>
      <text x="104" y="178" textAnchor="end" fontSize="10" className={txt}>true 1</text>
    </g>
  );
}

function Features() {
  const bars = [170, 140, 110, 84, 60, 40];
  return (
    <g>
      {bars.map((w, i) => (
        <g key={i}>
          <rect x="90" y={38 + i * 30} width="230" height="14" rx="3" className="fill-line" fillOpacity="0.5" />
          <rect x="90" y={38 + i * 30} width={w * 1.35} height="14" rx="3" className="fill-accent" fillOpacity={0.9 - i * 0.12} />
          <rect x="40" y={41 + i * 30} width="40" height="8" rx="2" className="fill-muted" fillOpacity="0.4" />
        </g>
      ))}
    </g>
  );
}

function Pipeline() {
  const nodes = ["Data", "Train", "API", "App"];
  return (
    <g>
      {nodes.map((n, i) => (
        <g key={n}>
          <rect x={26 + i * 92} y="92" width="68" height="56" rx="8" className={`fill-card ${stroke}`} strokeWidth="1.5" />
          <text x={60 + i * 92} y="125" textAnchor="middle" fontSize="12" className="fill-fg font-mono">{n}</text>
          {i < nodes.length - 1 && <path d={`M${96 + i * 92} 120h20`} className="stroke-accent" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />}
        </g>
      ))}
      <defs>
        <marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8z" className="fill-accent" />
        </marker>
      </defs>
    </g>
  );
}

function Dashboard() {
  const pts = [150, 138, 142, 120, 126, 100, 108, 84, 70];
  const d = pts.map((y, i) => `${i ? "L" : "M"}${40 + i * 40} ${y + 20}`).join("");
  return (
    <g>
      {[0, 1, 2].map((i) => <rect key={i} x={40 + i * 112} y="30" width="100" height="36" rx="6" className={`fill-card ${stroke}`} />)}
      <path d={d} fill="none" className="stroke-accent" strokeWidth="2" strokeLinejoin="round" transform="translate(0 40)" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M40 ${100 + i * 28}H360`} className={stroke} strokeWidth="1" strokeDasharray="3 4" />)}
    </g>
  );
}

/** Abstract SVG illustration for a project card. Not real results. */
export function ProjectVisual({ kind, className = "" }: { kind: VisualKind; className?: string }) {
  return (
    <figure className={`relative overflow-hidden rounded-lg border border-line bg-bg ${className}`}>
      <svg viewBox="0 0 400 240" role="img" aria-label={`Abstract ${kind} illustration`} className="block h-auto w-full">
        {kind === "confusion" && <Confusion />}
        {kind === "features" && <Features />}
        {kind === "pipeline" && <Pipeline />}
        {kind === "dashboard" && <Dashboard />}
      </svg>
      <figcaption className="meta absolute bottom-2 left-3">illustration, not real results</figcaption>
    </figure>
  );
}
