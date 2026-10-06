@echo off
REM Starts the API, the Streamlit demo and the website, each in its own window.
cd /d "%~dp0"
start "Backend API" cmd /k "cd /d %~dp0backend && call .venv\Scripts\activate.bat && uvicorn app.main:app --reload"
start "ML demo (Streamlit)" cmd /k "cd /d %~dp0ml && call .venv\Scripts\activate.bat && streamlit run app.py --server.port=8501 --server.baseUrlPath=streamlit --server.headless=true --server.enableCORS=false --server.enableXsrfProtection=false"
start "Website" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 10 >nul
start http://localhost:5173
echo Website: http://localhost:5173   (close the three windows to stop everything)
