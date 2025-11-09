#!/bin/bash

# Script to check if backend is running

echo "Checking backend server status..."
echo "================================"

# Check if port 8000 is in use
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "✅ Backend server is RUNNING on port 8000"
    
    # Test if it's responding
    if curl -s http://localhost:8000/admin/ > /dev/null 2>&1; then
        echo "✅ Backend is responding to requests"
        echo ""
        echo "Backend URL: http://localhost:8000"
        echo "Admin panel: http://localhost:8000/admin/"
        echo "API endpoint: http://localhost:8000/api/user/login/"
    else
        echo "⚠️  Port 8000 is in use but backend may not be responding"
    fi
else
    echo "❌ Backend server is NOT running"
    echo ""
    echo "To start the backend:"
    echo "  cd backend"
    echo "  ./start_backend.sh"
    echo ""
    echo "Or manually:"
    echo "  cd backend"
    echo "  source env/bin/activate"
    echo "  python manage.py runserver"
fi

