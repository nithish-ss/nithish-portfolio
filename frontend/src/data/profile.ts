export const profile = {
  headline: "M.Sc. Data Science student at Christ University | B.Sc. Computer Science & Statistics graduate",
  tagline: "Focused on machine learning validation and clean relational data design, with projects in classification and SQL analytics.",
  aboutTitle: ["Data Science Student Focused on ", "Machine Learning"] as const,
  about:
    "I'm an M.Sc. Data Science student with a B.Sc. in Computer Science and Statistics (8.6 CGPA). I like connecting machine learning validation with clean relational data design, and I've applied both in an e-commerce customer-satisfaction classifier and a SQL loyalty analysis.",
  pillars: [
    { icon: "sigma", title: "Statistics first", text: "My coursework covers inferential statistics, probability, linear algebra and algorithm analysis. I use it to question a result before I trust it." },
    { icon: "database", title: "Clean data foundations", text: "I merged orders, payments and reviews tables into 20,000+ Olist records with Pandas, and write SQL with CTEs and window functions in MySQL." },
    { icon: "target", title: "Honest evaluation", text: "I balance classes with SMOTE, compare models, and report the numbers I measure, including modest ones like 66.5% accuracy." },
  ] as const,
};
