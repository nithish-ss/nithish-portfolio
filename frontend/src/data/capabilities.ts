import type { Capability } from "./types";

// Only tools used in projects, the internship or coursework (matches the resume).
export const capabilities: Capability[] = [
  {
    title: "Machine Learning", icon: "sigma",
    items: [
      { name: "Python", primary: true, detail: "Pandas, NumPy, feature engineering, data cleaning" },
      { name: "Scikit-learn", primary: true, detail: "Logistic Regression, Random Forest, SMOTE for class imbalance" },
      { name: "Theory", detail: "Linear regression, cost functions, gradient descent, statistical modeling" },
    ],
  },
  {
    title: "Data & SQL", icon: "database",
    items: [
      { name: "SQL", primary: true, detail: "Multi-table joins, window functions (RANK, DENSE_RANK), CTEs, CASE WHEN" },
      { name: "MySQL", detail: "MySQL Workbench, relational schemas" },
      { name: "EDA & ETL", detail: "Cleaning, exploratory analysis, data preparation" },
    ],
  },
  {
    title: "Visualization", icon: "chart",
    items: [
      { name: "Power BI", primary: true, detail: "Interactive sales dashboards (internship)" },
      { name: "Tableau", detail: "Visual analytics" },
      { name: "Seaborn", detail: "Visual EDA in Python, with Matplotlib" },
    ],
  },
  {
    title: "Foundations & Tools", icon: "wrench",
    items: [
      { name: "Statistics", detail: "Inferential statistics, probability and distributions, linear algebra" },
      { name: "Algorithms", detail: "Design and Analysis of Algorithms (DAA)" },
      { name: "Excel", detail: "Advanced Excel: pivot tables, XLOOKUP" },
      { name: "Git", detail: "Git and GitHub; AWS cloud fundamentals" },
    ],
  },
];
