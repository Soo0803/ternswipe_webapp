# Quick Start Guide - TernSwipe

## Starting the Backend

### Option 1: Using Start Script (Easiest)

**macOS/Linux:**
```bash
cd backend
./start_backend.sh
```

**Windows:**
```bash
cd backend
start_backend.bat
```

### Option 2: Manual Start

```bash
cd backend
source env/bin/activate  # macOS/Linux
# OR
env\Scripts\activate     # Windows

python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

The backend will start on `http://localhost:8000`

## Starting the Frontend

### For Web:
```bash
npm run web
# OR
npx expo start --web
```

### For Mobile:
```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

## Verifying Connection

1. **Check Backend is Running:**
   - Open `http://localhost:8000/admin/` in browser
   - Or check terminal for "Starting development server at http://127.0.0.1:8000/"

2. **Check Frontend Connection:**
   - The app will automatically try to connect to `http://localhost:8000`
   - If you see connection errors, ensure backend is running first

## Troubleshooting

### "Network error - check if backend is running"

1. **Start the backend server** (see above)
2. **Verify backend is running:**
   - Check terminal for Django server output
   - Visit `http://localhost:8000/admin/` in browser

3. **Check API URL:**
   - Default: `http://localhost:8000`
   - Can be changed in `app.json` under `extra.apiUrl`
   - Or set `EXPO_PUBLIC_API_URL` environment variable

### Port Already in Use

If port 8000 is busy:
```bash
python manage.py runserver 8001
```
Then update `app.json` extra.apiUrl to `http://localhost:8001`

### CORS Errors

The backend is configured to allow all origins in development. If you see CORS errors:
1. Check `corsheaders` is installed: `pip install django-cors-headers`
2. Verify `CorsMiddleware` is in `MIDDLEWARE` in `settings.py`

## Database Migrations

After updating models, run:
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Need Help?

See `backend/README.md` for detailed backend setup instructions.
See `BACKEND_SETUP.md` for troubleshooting guide.

