#!/usr/bin/env bash
# Starts API, Streamlit demo and website. Ctrl+C stops all three.
cd "$(dirname "$0")"
trap 'kill 0' EXIT
(cd backend && . .venv/bin/activate && uvicorn app.main:app --reload) &
(cd ml && . .venv/bin/activate && streamlit run app.py --server.port=8501 --server.baseUrlPath=streamlit --server.headless=true --server.enableCORS=false --server.enableXsrfProtection=false) &
(cd frontend && npm run dev) &
echo "Website: http://localhost:5173"
wait
