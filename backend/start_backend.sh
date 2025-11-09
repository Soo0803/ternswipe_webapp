#!/bin/bash

# Script to start the Django backend server

echo "Starting TernSwipe Backend Server..."
echo "======================================"

# Check if virtual environment exists
if [ -d "env" ]; then
    echo "Activating virtual environment..."
    source env/bin/activate
else
    echo "⚠️  Virtual environment not found. Creating one..."
    python3 -m venv env
    source env/bin/activate
    echo "Installing dependencies..."
    pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
fi

# Check if migrations are up to date
echo "Checking migrations..."
python manage.py makemigrations user
python manage.py migrate

# Start the server
echo ""
echo "🚀 Starting Django development server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""
python manage.py runserver

