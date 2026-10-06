FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Trains if the Olist CSVs are in ml/data/ at build time; otherwise the demo reports "unavailable".
RUN python train_olist.py || echo "Olist data not found: skipping training"
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0", "--server.port=8501", "--server.baseUrlPath=streamlit", "--server.headless=true", "--server.enableCORS=false", "--server.enableXsrfProtection=false"]
