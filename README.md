# Nithish S — Data Science & Machine Learning Portfolio

A personal portfolio showcasing my work in **Data Science, Machine Learning, Analytics, and full-stack ML applications**.

I build projects that go beyond model training — from data preparation and analysis to model evaluation, API development, interactive demos, and production deployment.

---

## 🌐 Links

- **Portfolio:** https://nithish-portfolio-black-xi.vercel.app/
- **GitHub:** https://github.com/nithish-ss
- **LinkedIn:** 
https://www.linkedin.com/in/nithish-s-403b41299/
- **Resume:** Available on my portfolio

---

## 👋 About Me

I am a Data Science student interested in **Machine Learning, Data Analytics, and applied AI**.

My focus is on building practical, end-to-end projects that combine:

- Data analysis
- Statistical thinking
- Machine learning
- SQL
- Python
- Model evaluation
- API development
- Interactive applications
- Deployment

I am particularly interested in opportunities where data can be used to understand users, improve products, and support better business decisions.

---

## 🚀 Featured Projects

### 1. E-Commerce Customer Satisfaction — Olist

An end-to-end machine learning project using the Brazilian E-Commerce Public Dataset by Olist.

**Problem:**  
Can customer satisfaction be predicted using order, delivery, payment, and review information?

**Approach:**

- Cleaned and merged multiple relational datasets
- Filtered delivered orders
- Engineered delivery and payment features
- Defined a binary customer-satisfaction target
- Handled class imbalance using SMOTE
- Compared Logistic Regression and Random Forest
- Evaluated the classification pipeline using cross-validation
- Built a FastAPI prediction API
- Integrated the model into the React portfolio
- Created a separate Streamlit application for the full interactive experience

**Tech:**  
Python, Pandas, Scikit-learn, SMOTE, FastAPI, React, TypeScript, Streamlit

**Live Demo:**  
https://nithish-portfolio-deexcmekpqsazrrubh5np7.streamlit.app/

**Interactive Demo:**  
Available directly on the portfolio project card.

**Case Study:**  
Available on the portfolio.

---

### 2. Danny's Diner — SQL & Data Analytics

A SQL-based analytics project focused on extracting business insights from customer purchasing behaviour.

**Focus areas:**

- Customer purchase analysis
- Product performance
- Customer spending behaviour
- Joining relational datasets
- Aggregations and analytical SQL
- Business-oriented insights

**Tech:**  
SQL, Data Analysis

**Case Study:**  
Available on the portfolio.

---

## 🧠 Technical Skills

### Programming & Data

- Python
- SQL
- JavaScript
- TypeScript
- Pandas
- NumPy

### Machine Learning

- Scikit-learn
- Classification
- Feature engineering
- Model evaluation
- Cross-validation
- SMOTE
- Logistic Regression
- Random Forest

### Analytics

- Exploratory Data Analysis
- Statistical analysis
- Customer analysis
- Segmentation
- Business metrics
- Data-driven decision making

### Full-Stack & Deployment

- React
- TypeScript
- Vite
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- PostgreSQL
- Streamlit
- Docker
- Vercel
- Render

### Tools

- Git
- GitHub
- VS Code

---

## 🏗️ Portfolio Architecture

The portfolio itself is built as a full-stack application.

```text
                    ┌──────────────────────┐
                    │      Vercel          │
                    │   React + TypeScript │
                    └──────────┬───────────┘
                               │
                               │ API requests
                               ▼
                    ┌──────────────────────┐
                    │       Render         │
                    │       FastAPI        │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────┘       └─────────────┐
                 ▼                                ▼
        ┌─────────────────┐              ┌─────────────────┐
        │   PostgreSQL    │              │  ML Artifacts   │
        │ Contact Storage │              │  scikit-learn   │
        └─────────────────┘              └─────────────────┘

                         ┌──────────────────────┐
                         │ Streamlit Community  │
                         │       Cloud          │
                         │    Full ML Demo      │
                         └──────────────────────┘