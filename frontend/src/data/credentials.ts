import type { Credential } from "./types";

export const credentials: Credential[] = [
  { kind: "work", title: "Data Analysis Intern", org: "Imarticus Learning, Bengaluru", date: "May 2026 – June 2026",
    description: "One-month internship covering dashboards, data cleaning and baseline models.",
    highlights: [
      "Developed interactive Power BI dashboards for sales analysis, isolating major regional revenue drivers.",
      "Ran automated data cleaning and exploratory analysis with SQL and Python to extract clean behavioral attributes from raw datasets.",
      "Built baseline predictive workflows with Logistic Regression and Random Forest to identify factors behind shifting user trends.",
    ] },
  { kind: "education", title: "M.Sc. in Data Science", org: "Christ University, Bengaluru", date: "Expected May 2028",
    description: "Coursework: Design and Analysis of Algorithms, Inferential Statistics, Linear Algebra, Probability & Distributions, Cloud Computing, Full-Stack Development Foundations." },
  { kind: "education", title: "B.Sc. in Computer Science & Statistics", org: "Vijaya College, Bengaluru", date: "Graduated May 2026",
    description: "Overall CGPA 8.6/10.0. Graduated with First Class Exemplary distinction." },
  { kind: "certification", title: "Machine Learning Specialization", org: "Stanford University & DeepLearning.AI · Instructor: Andrew Ng", date: "", badge: "In progress",
    description: "Supervised learning, advanced algorithms, recommender systems, and applied machine learning workflows." },
  { kind: "certification", title: "Google Data Analytics Professional Certificate", org: "Google / Coursera", date: "2026",
    description: "Data cleaning, analysis and visualization." },
  { kind: "training", title: "Advanced Data Science Training", org: "Besant Technologies", date: "",
    description: "Python automation and data pipeline cleaning." },
  { kind: "leadership", title: "Organizing Team Member", org: "CCA Club, Christ University", date: "",
    description: "Event coordinator on the organizing team: led technical peer workshops and managed student initiatives." },
];
