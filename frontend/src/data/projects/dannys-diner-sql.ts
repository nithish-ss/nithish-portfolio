import type { Project } from "../types";

export const project: Project = {
  slug: "dannys-diner-sql",
  title: "Danny's Diner: Loyalty Insights in SQL",
  category: "SQL analytics",
  year: "2025",
  summary: "Customer visit, spending and item-popularity analysis for a fictional Japanese restaurant, used to design a loyalty points scheme.",
  bullets: [
    "Ranked customers and menu items with DENSE_RANK() and RANK()",
    "Built a points-based loyalty reward system with CASE WHEN",
    "Extracted top spenders, visit frequency and item popularity for inventory planning",
  ],
  tags: ["MySQL", "SQL", "Window functions", "CTEs"],
  featured: true,
  visual: "features",
  links: { github: "" }, // add the repo URL
  caseStudy: {
    problem: "Acting as a remote data analyst for a fictional Japanese restaurant, work out how customers visit, what they spend and which items sell, then use it to shape a loyalty reward structure and inventory targets.",
    why: "A loyalty scheme and an inventory plan both depend on knowing who visits, how often, and what they order.",
    data: { source: "Multi-table restaurant schema queried in MySQL Workbench." },
    approach: "Joined the tables with inner joins, used CTEs to structure each question, ranked customers and items with DENSE_RANK() and RANK(), and used conditional aggregation with CASE WHEN to compute loyalty points.",
    results: [
      "Extracted top spenders, visit frequencies and item popularity.",
      "Built a simulated points-based reward system; the highest customer total was 940 points.",
    ],
    improve: ["Add a Power BI or Tableau layer over the query results so the findings are easier to scan."],
  },
};
