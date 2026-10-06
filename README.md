# Data Science Portfolio

Dark, bento-style portfolio for data science and analytics roles: hero with stats, about, capabilities, project cards with full case studies, results, certifications and experience, and a contact form that saves to PostgreSQL.

| Layer | Tech |
|---|---|
| UI | React, TypeScript, Vite |
| Styling | Tailwind CSS (Space Grotesk, DM Sans, JetBrains Mono, all self-hosted) |
| Animation | Framer Motion (LazyMotion, subtle, respects reduced motion) |
| Charts | Recharts on case-study pages (lazy-loaded); Plotly inside the Streamlit demo |
| Backend | FastAPI, Pydantic, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| ML | Python, scikit-learn (PyTorch optional) in `ml/` |
| ML demos | Interactive demo modal (React + FastAPI model endpoint); Streamlit as the full-demo option |

## Start here: content is filled in

All content for Nithish S is in `frontend/src/data/`, taken from the resume. `npm run build` blocks any leftover `TODO_` placeholder (none remain), so unfinished content cannot ship.

**Still to add when you have them** (each is hidden until set, nothing is faked):

| What | Where |
|---|---|
| GitHub repo URL for each project | `github: ""` in `projects/olist-customer-satisfaction.ts` and `projects/dannys-diner-sql.ts` |
| Streamlit demo hosted elsewhere | `VITE_STREAMLIT_URL` (only if not using Docker) |
| Project screenshots | put in `frontend/public/projects/`, then set `image: "/projects/name.png"` |
| Your site URL | set `VITE_SITE_URL` when building, for canonical links and the sitemap |
| Social preview image | replace `public/og.svg` with a 1200x630 PNG |
| Resume | `frontend/public/resume.pdf` (currently your uploaded resume) |

**Check before publishing:** the `940` points figure (Danny's Diner) and the accuracy of every number in `results.ts`, each of which lists its source. `public/resume.pdf` contains your phone number, since it is your resume file.

### Adding a project

Copy `frontend/docs/new-project.template.ts` into `src/data/projects/`, fill it in, and register it in `projects/index.ts`. Add metrics only if you measured them, each with a `source`. Empty links are hidden.

## Run locally: one setup, one start

Requirements: Node.js 20+ (LTS) and Python 3.10+.

**Windows**
```
setup.bat      (once: installs everything, creates the database, trains the demo model if the Olist files are in `ml/data/`)
start.bat      (every time: starts the API, the ML demo and the website, then opens the browser)
```

**macOS / Linux**
```
./setup.sh
./start.sh
```

Then open **http://localhost:5173**. Everything is on that one address:

| Address | What |
|---|---|
| `/` | The portfolio |
| `/demo` | Old URL: redirects to the home page and opens the demo modal |
| `/streamlit/` | The Streamlit app itself (the "Open full demo" button) |
| `/api/...` | The FastAPI backend (contact form) |

`setup.bat` uses a local SQLite file so you do not need PostgreSQL to try the site. For PostgreSQL, set `DATABASE_URL` in `.env` (see `.env.example`) and run `alembic upgrade head` in `backend/`.

Prefer to run the parts yourself?
```bash
cd frontend && npm install && npm run dev                      # website
cd backend && pip install -r requirements.txt && alembic upgrade head && uvicorn app.main:app --reload
cd ml && pip install -r requirements.txt && python train_olist.py && \
  streamlit run app.py --server.baseUrlPath=streamlit           # demo, served under /streamlit/
```
Backend tests: `cd backend && pytest`.

## Interactive demos

A project card with a demo shows an **Interactive demo** button. It opens a modal on top of the page: no navigation, no separate site. Projects without a demo do not show the button.

```
Project card -> [Interactive demo] -> modal -> inputs -> Run prediction -> FastAPI -> model -> result
```

Where the button appears: on the project card, near the title on the project's case-study page, in the hero ("Live ML demo"), in the navbar ("ML Demo") and in the "Try a Model Live" section. All of them open the same modal. The old `/demo` URL redirects to the home page with the modal open. Any page also opens a demo from a link like `/?demo=olist-customer-satisfaction`.

The modal code is a separate JavaScript chunk, downloaded only when someone clicks. The iframe (for Streamlit demos) is created only after the modal opens, so the home page stays fast.

### The two demo types

| `demo.type` | What visitors get | Needs |
|---|---|---|
| `"api"` | A native form (sliders, dropdowns, multi-select) built from the model's definition, a result with confidence and explanation, and model information | A model registered in the FastAPI backend |
| `"streamlit"` | The Streamlit app inside the modal | A running Streamlit app (`url`) |

For `"api"` demos, `demo.url` is optional and is used by the **Open full demo** button (for example the Streamlit version of the same model). Both types always show **Open full demo**, **GitHub** and **View case study** in the modal footer.

### Adding an Interactive Demo to another project

1. **Project data.** In `frontend/src/data/projects/<project>.ts` add:
   ```ts
   demo: { type: "api" },                                   // native form + FastAPI
   // or
   demo: { type: "streamlit", url: "https://you.streamlit.app", intro: "Try it here." },
   ```
   (`hasDemo` is simply "`demo` is set". `demoType` is `demo.type`, `demoUrl` is `demo.url`.) The project's `slug` must match the backend key in step 2.
2. **Only for `"api"`: register the model in the backend** (next section). Nothing else to change: the button, modal and form appear automatically.

### Connecting a new ML model (FastAPI)

Create `backend/app/services/demos/<name>_demo.py` with a class that has `schema()` and `predict()`, then add one line to `registry.py`. The form is built from `schema()`, so you never write form code.

```python
from app.schemas.demo import DemoField, DemoOption, DemoSchema, ModelInfo, PredictResponse
from app.services.demos.base import DemoInputError, DemoUnavailable

class CareerPathDemo:
    slug = "careerpath-ai"

    def schema(self) -> DemoSchema:
        return DemoSchema(
            slug=self.slug, title="CareerPath AI", intro="Enter your information to get a recommendation.",
            submit_label="Get recommendation",
            fields=[
                DemoField(key="education", label="Education level", kind="select",
                          options=[DemoOption(value="bsc", label="B.Sc."), DemoOption(value="msc", label="M.Sc.")], default="bsc"),
                DemoField(key="skills", label="Skills", kind="multiselect",
                          options=[DemoOption(value="python", label="Python"), DemoOption(value="sql", label="SQL")]),
                DemoField(key="years", label="Years of experience", kind="number", min=0, max=10, step=1, default=1),
            ],
            model=ModelInfo(name="...", dataset="...", metrics={}),   # only metrics your training script measured
        )

    def predict(self, inputs) -> PredictResponse:
        ...  # validate inputs (raise DemoInputError("message") for bad ones), load your model, predict
        return PredictResponse(prediction="...", confidence=0.0, explanation="...")
```

```python
# registry.py
_DEMOS = {OlistDemo.slug: OlistDemo(), CareerPathDemo.slug: CareerPathDemo()}
```

Endpoints (already in the backend): `GET /api/projects/{slug}/demo` returns the form definition and model information, and `POST /api/projects/{slug}/predict` takes `{"inputs": {...}}` and returns `{"prediction", "confidence", "explanation", "details"}`. Load models lazily and raise `DemoUnavailable` if files are missing: visitors then see "Interactive demo is temporarily unavailable." instead of an error. The shipped example is `olist_demo.py`. Keep model files and secrets out of the frontend; set paths with `ML_ARTIFACTS_DIR` and the rate limit with `DEMO_RATE_LIMIT` in `.env`.

Do not put numbers in `ModelInfo.metrics` that your training script did not measure.

### The Streamlit fallback

- `type: "streamlit"` embeds the app. Before framing a same-site app (`/streamlit/`) the page checks that Streamlit really answers, so a stopped server shows the friendly "unavailable" message instead of a broken frame. For an app on another domain (Streamlit Community Cloud) the browser cannot check, so the frame is shown and the **Open full demo** button is always there as the fallback if the host blocks embedding.
- For `type: "api"`, errors (server down, model files missing, bad response) show "Interactive demo is temporarily unavailable." with **Open full demo** and **View GitHub** buttons. Raw errors are never shown.

### Analytics

Nothing is sent anywhere by default. `frontend/src/demo/analytics.ts` fires `demo_opened`, `demo_prediction_started`, `demo_prediction_completed` and `demo_error` through one function, `trackDemo`. Either forward them to your analytics tool inside that function, or listen from anywhere:
```js
window.addEventListener("portfolio:demo", (e) => console.log(e.detail));
```

### The Olist demo: train it on your data

The Interactive demo on the Olist project is a real model, but it needs the dataset, which is not included (it is a public Kaggle dataset with its own license).

1. Download **Brazilian E-Commerce Public Dataset by Olist** from Kaggle (free account) and put these three files in `ml/data/`:
   `olist_orders_dataset.csv`, `olist_order_payments_dataset.csv`, `olist_order_reviews_dataset.csv`.
2. In the `ml` folder run `python train_olist.py`. For a quick test on a sample, add `--max-rows 20000`.
3. Restart the backend and the Streamlit app (they load the model once). Open the demo.

Until step 2 is done the demo button shows "Interactive demo is temporarily unavailable."

What the training script does (all in `ml/train_olist.py` and `ml/olist_features.py`, so you can read it and explain it):
- Keeps delivered orders and merges orders, payments and reviews. Features: delivery time, promised delivery window, delay against the estimate, installments, order value, cost per installment.
- **Target:** `satisfied = review score of 4 or 5`. If your project used a different rule, change `SATISFIED_MIN_SCORE` in `olist_features.py`.
- Stratified 80/20 split. Logistic regression and random forest are compared with 5-fold cross-validation on the training split. **SMOTE runs inside the training folds only**, so it never leaks into validation or test data. The test split is used once.
- Writes `artifacts/model.joblib` and `artifacts/metrics.json`. The demo shows only those measured numbers, including the accuracy of an "always satisfied" baseline.

**Your results may not match your resume.** The demo reports what this script measures. If its accuracy differs from the 66.5% on your resume or in `results.ts`, either make the project consistent with what you can reproduce, or point `ml/` at the exact setup you used before. Accuracy after SMOTE can be lower than the "always satisfied" baseline when most reviews are 4 or 5 stars, so be ready to explain balanced accuracy and ROC-AUC.

The backend tests use **synthetic** data in the Olist file layout, only to prove the pipeline works. Never use numbers from synthetic data anywhere on your site.

## Docker

```bash
docker compose up --build     # db + backend + Streamlit demo + website, all at http://localhost:8080
```
The frontend image runs the strict `npm run build`.

## Architecture

```
portfolio/
├── frontend/   React app. Content is static typed data in src/data/ (works with the backend offline)
├── backend/    FastAPI: /api/health, POST /api/contact, plus /api/projects and /api/blog for later
├── ml/         scikit-learn training script + Streamlit demo (template)
└── docker-compose.yml
```
The API is used for the contact form only; the site renders fully without it. The contact form is validated with Zod in the browser and Pydantic on the server, and has a honeypot field and per-IP rate limiting. If the API is down, the form shows a message with an email fallback.

**Keeping types in sync:** `frontend/src/data/types.ts` and `backend/app/schemas/` describe the same shapes. The contact payload exists in both `sections/Contact.tsx` (Zod) and `schemas/contact.py`; change both together.

## Environment variables

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | backend | `postgresql+psycopg://user:pass@host:5432/db` |
| `ML_ARTIFACTS_DIR` | backend | Folder with `model.joblib` and `metrics.json` (default `../ml/artifacts`) |
| `DEMO_RATE_LIMIT` | backend | Per IP, e.g. `60/minute` |
| `CORS_ORIGINS` | backend | Comma-separated frontend origins |
| `CONTACT_RATE_LIMIT` | backend | Per IP, e.g. `5/hour` |
| `GITHUB_USERNAME`, `GITHUB_TOKEN` | backend | Optional, server-side only |
| `POSTGRES_*` | docker compose | Database container credentials |
| `VITE_API_URL` | frontend (build time) | Empty in dev; your API URL in production |
| `VITE_SITE_URL` | frontend (build time) | Your public site URL |

## Deploy

1. **Database:** managed Postgres (Neon, Supabase, Render, Railway). Use the `postgresql+psycopg://` scheme.
2. **Backend:** deploy `backend/` (Dockerfile included) to Render, Railway or Fly.io. Set `DATABASE_URL` and `CORS_ORIGINS`. Migrations run on start.
3. **Frontend:** Vercel, Netlify or Cloudflare Pages. Build `npm run build`, output `dist`, env `VITE_API_URL=<backend URL>`. SPA fallbacks are in `vercel.json` and `public/_redirects`.
4. **Streamlit demo:** with Docker it is served at `/streamlit/` behind nginx. On Vercel/Netlify, use Streamlit Community Cloud and set `VITE_STREAMLIT_URL`.
5. Set `VITE_SITE_URL` to your domain. `npm run build` then generates `sitemap.xml` and `robots.txt`.

## Publish to GitHub

```bash
git init && git add . && git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<you>/portfolio.git
git push -u origin main
```
Check `git status` first: `.env` must not be listed.

## Known limits

- Client-rendered SPA: per-page titles and meta tags are set in the browser. Some link-preview bots (LinkedIn, Slack) read only the static HTML. Add pre-rendering (e.g. `vite-react-ssg`) if previews matter.
- The social preview image is an SVG placeholder; most platforms want a PNG (1200x630).
- Dark theme only, matching the design.
- The GitHub service in the backend is not wired to any page yet.
