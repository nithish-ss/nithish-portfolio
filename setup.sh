#!/usr/bin/env bash
# One-time setup for macOS/Linux.
set -e
cd "$(dirname "$0")"
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i.bak 's#^DATABASE_URL=.*#DATABASE_URL=sqlite:///./local.db#' .env && rm -f .env.bak
fi
(cd frontend && npm install)
(cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && alembic upgrade head)
(cd ml && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && python train_olist.py || echo "NOTE: the demo model is not trained yet. See the message above, then run ml/train_olist.py again.")
echo "Setup finished. Now run ./start.sh"
