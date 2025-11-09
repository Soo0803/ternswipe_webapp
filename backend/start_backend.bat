@echo off
REM Script to start the Django backend server on Windows

echo Starting TernSwipe Backend Server...
echo ======================================

REM Check if virtual environment exists
if exist "env" (
    echo Activating virtual environment...
    call env\Scripts\activate.bat
) else (
    echo ⚠️  Virtual environment not found. Creating one...
    python -m venv env
    call env\Scripts\activate.bat
    echo Installing dependencies...
    pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
)

REM Check if migrations are up to date
echo Checking migrations...
python manage.py makemigrations user
python manage.py migrate

REM Start the server
echo.
echo 🚀 Starting Django development server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python manage.py runserver

pause

