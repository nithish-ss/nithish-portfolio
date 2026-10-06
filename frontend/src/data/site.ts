// Site-wide settings. Edit here; no component changes needed.
export const site = {
  /** Deployed URL, set via VITE_SITE_URL at build time. Empty is fine locally. */
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) ?? "").replace(/\/$/, ""),
  name: "Nithish S",
  title: "Data Science & Machine Learning",
  description: "Data science student at Christ University focused on machine learning, SQL and statistics. Projects in classification and SQL analytics, with full case studies.",
  status: "Open to Data Science / ML internships",
  location: "Bengaluru, Karnataka, India",
  social: {
    github: "https://github.com/nithish-ss",
    linkedin: "https://www.linkedin.com/in/nithish-s-403b41299/",
    email: "nithishnithish82966@gmail.com",
  },
  resume: "/resume.pdf",
  /** Streamlit demo shown on /demo. Same-origin path by default; set VITE_STREAMLIT_URL for an external deployment. */
  demoUrl: (import.meta.env.VITE_STREAMLIT_URL as string | undefined) || "/streamlit/",
  /** Hero stat strip. Each entry must be checkable against the resume or a project. */
  stats: [
    { value: "2", label: "Projects with case studies" },
    { value: "20k+", label: "Rows engineered (Olist)" },
    { value: "1", label: "Analytics internship" },
  ],
};
