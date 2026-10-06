import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Metric } from "../data/types";

/** Loaded lazily, only on case study pages that have real metrics. */
export default function MetricsChart({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label={`Bar chart of ${metrics.map((m) => `${m.name} ${m.value}`).join(", ")}`}>
      <ResponsiveContainer>
        <BarChart data={metrics} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="rgb(var(--line))" vertical={false} />
          <XAxis dataKey="name" stroke="rgb(var(--muted))" tickLine={false} fontSize={12} />
          <YAxis stroke="rgb(var(--muted))" tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            cursor={{ fill: "rgb(var(--fg) / 0.05)" }}
            contentStyle={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--line))", borderRadius: 8, color: "rgb(var(--fg))" }}
          />
          <Bar dataKey="value" fill="rgb(var(--accent))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
