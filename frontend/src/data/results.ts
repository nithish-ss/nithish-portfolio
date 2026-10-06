import type { Result } from "./types";

// Every number has a source you can point to in an interview.
export const results: Result[] = [
  { icon: "trend", value: "1.7", label: "Average review under high delivery delay",
    description: "In the Olist data, moving from early delivery to a high shipping delay dropped the average review from 4.2 to 1.7.",
    source: "Olist project, visual EDA with Seaborn (resume, Projects)" },
  { icon: "target", value: "66.5%", label: "Peak classification accuracy",
    description: "Best accuracy from Logistic Regression and Random Forest on the binary satisfaction task, after balancing classes with SMOTE.",
    source: "Olist project, model evaluation (resume, Projects)" },
  { icon: "users", value: "940", label: "Highest customer points in the loyalty scheme",
    description: "Top total under the simulated points-based reward system built with CASE WHEN in the Danny's Diner analysis.",
    source: "Danny's Diner SQL queries (MySQL Workbench)" },
  { icon: "chart", value: "8.6", label: "B.Sc. CGPA out of 10",
    description: "Graduated with First Class distinction in Computer Science and Statistics, Vijaya College.",
    source: "Resume, Education" },
];
