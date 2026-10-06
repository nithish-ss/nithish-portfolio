FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install backend dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/ ./

# Copy trained ML artifacts
COPY ml/artifacts/ /app/ml/artifacts/

# Tell FastAPI exactly where the model artifacts are
ENV ML_ARTIFACTS_DIR=/app/ml/artifacts

# Run as non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000

# Apply database migrations, then start API
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers --forwarded-allow-ips=*"]
