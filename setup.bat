@echo off
REM One-time setup for Windows: installs frontend, backend and ML demo dependencies.
cd /d "%~dp0"

if not exist .env (
  copy .env.example .env >nul
  powershell -NoProfile -Command "(Get-Content .env) -replace '^DATABASE_URL=.*','DATABASE_URL=sqlite:///./local.db' | Set-Content .env"
  echo Created .env using a local SQLite database.
)

echo === Frontend ===
cd frontend && call npm install || goto :fail
cd ..

echo === Backend ===
cd backend
python -m venv .venv || goto :fail
call .venv\Scripts\activate.bat
pip install -r requirements.txt || goto :fail
alembic upgrade head || goto :fail
call deactivate
cd ..

echo === ML demo ===
cd ml
python -m venv .venv || goto :fail
call .venv\Scripts\activate.bat
pip install -r requirements.txt || goto :fail
python train_olist.py
if errorlevel 1 echo.& echo NOTE: the demo model is not trained yet. See the message above, then run ml\train_olist.py again.
call deactivate
cd ..

echo.
echo Setup finished. Now run start.bat
exit /b 0

:fail
echo.
echo Setup failed. Read the error above and fix it, then run setup.bat again.
exit /b 1
