import { site } from "../site";
import type { Project } from "../types";

export const project: Project = {
  slug: "olist-customer-satisfaction",
  title: "E-Commerce Customer Satisfaction System (Olist)",
  category: "Machine learning",
  year: "2026",
  summary: "A classification pipeline that predicts customer satisfaction from 20,000+ merged order, payment and review records.",
  bullets: [
    "Delivery went from early to high delay: average review fell from 4.2 to 1.7",
    "SMOTE balanced the classes so the model stopped favoring satisfied customers",
    "Peak accuracy of 66.5% across Logistic Regression and Random Forest",
  ],
  tags: ["Python", "Pandas", "Scikit-learn", "SMOTE", "Seaborn"],
  featured: true,
  visual: "confusion",
  links: { github: "" }, // add the repo URL
  // The slug matches the model registered in backend/app/services/demos/registry.py.
  demo: {
    type: "streamlit",
    url: import.meta.env.VITE_STREAMLIT_URL || "http://localhost:8501", // full Streamlit version, used by "Open full demo"
    note: "The demo model is trained on the public Olist dataset by ml/train_olist.py. The figures in Model information come from that run, so they can differ from the headline numbers on this page.",
  },
  caseStudy: {
    problem: "Predict whether a customer on a Brazilian online marketplace will be satisfied with an order, using order, payment and review data.",
    why: "Low reviews hurt seller reputation and repeat purchases. Finding what drives them shows where a marketplace can act.",
    data: {
      source: "Olist Brazilian E-Commerce public dataset: orders, payments, reviews and items tables, merged with Pandas.",
      size: "20,000+ relational consumer records after merging.",
      features: "Engineered features: delivery time, expected delivery window, and cost per installment. Target: binary satisfaction.",
      limitations: "Satisfied customers were the large majority, so the classes were heavily imbalanced.",
    },
    eda: [
      { title: "Delivery delay against review score", takeaway: "Moving from early delivery to a high shipping delay cut the average review from 4.2 to 1.7." },
    ],
    approach: "Merged the orders, payments, reviews and items tables, engineered delivery and payment features, balanced the classes with SMOTE, then trained and compared two classifiers.",
    model: {
      baseline: "Logistic Regression",
      alternatives: "Random Forest",
      final: "Random Forest",
      rationale: "It gave the highest accuracy of the two models tested.",
    },
    evaluation: {
      task: "classification",
      validation: "Logistic Regression and Random Forest compared on the binary satisfaction target, with SMOTE used to balance the classes.",
      metrics: [{ name: "Accuracy (%)", value: 66.5, source: "Olist project evaluation (resume, Projects)" }],
      note: "Accuracy alone can hide weak results on the minority class. Per-class precision, recall and F1 are the next numbers to report.",
    },
    tradeoffs: [
      "SMOTE reduces bias toward the majority class, but synthetic samples can differ from real customers.",
      "An accuracy of 66.5% leaves clear room for improvement.",
    ],
    deployment: { architecture: "Notebook-based analysis. Not deployed as a service or demo yet." },
    results: [
      "Peak classification accuracy of 66.5% on the binary satisfaction task.",
      "Average review fell from 4.2 with early delivery to 1.7 with high shipping delay.",
      "SMOTE avoided model bias toward the majority class of satisfied customers.",
    ],
    improve: [
      "Report precision, recall, F1 and ROC-AUC per class next to accuracy.",
      "Try gradient boosting and tune hyperparameters with cross-validation.",
      "Wrap the model in a Streamlit demo.",
    ],
  },
};
