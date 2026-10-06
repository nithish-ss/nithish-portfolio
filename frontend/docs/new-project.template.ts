// Copy into src/data/projects/ when adding a project. Not compiled from here.
import type { CaseStudy } from "../src/data/types";

/** Case-study skeleton with TODO_ prompts. Spread it, then override what you know. */
export const caseStudyTemplate = (task: NonNullable<CaseStudy["evaluation"]>["task"] = "other"): CaseStudy => ({
  problem: "TODO_PROBLEM: Who has this problem, in plain language?",
  why: "TODO_WHY: What does it cost them, and why is it worth solving?",
  data: {
    source: "TODO_SOURCE: where the data came from",
    size: "TODO_SIZE: rows, columns, time span",
    features: "TODO_FEATURES: the important columns and the target",
    limitations: "TODO_LIMITATIONS: missing values, sampling issues",
    license: "TODO_LICENSE",
  },
  eda: [{ title: "TODO_FINDING", takeaway: "TODO_TAKEAWAY: one sentence on what this changed in your approach." }],
  approach: "TODO_APPROACH: the steps from raw data to the final analysis or model.",
  evaluation: {
    task,
    validation: "TODO_VALIDATION: how you checked the work (train/test split, cross-validation, reconciling totals...)",
    metrics: [], // add only measured values: { name: "F1", value: 0.0, source: "notebooks/eval.ipynb" }
  },
  tradeoffs: ["TODO_TRADEOFF: what you gave up or could not do (data limits, time, complexity)"],
  deployment: { architecture: "TODO_ARCHITECTURE: where this lives and how someone uses it", howToRun: "TODO_HOW_TO_RUN" },
  improve: ["TODO_NEXT_STEP: one concrete improvement"],
});
