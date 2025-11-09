# Backend Connection Setup Guide

## Quick Start

### Option 1: Using the Start Script (Recommended)

**On macOS/Linux:**
```bash
cd backend
./start_backend.sh
```

**On Windows:**
```bash
cd backend
start_backend.bat
```

### Option 2: Manual Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment (if exists):**
   ```bash
   # macOS/Linux
   source env/bin/activate
   
   # Windows
   env\Scripts\activate
   ```

3. **Install dependencies (if not already installed):**
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Start the server:**
   ```bash
   python manage.py runserver
   ```

The backend will start on `http://localhost:8000`

## Verifying Backend is Running

Once the backend is running, you should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

You can test it by visiting:
- `http://localhost:8000/admin/` - Django admin (if superuser created)
- `http://localhost:8000/api/user/login/` - Should return method not allowed (this is normal)

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, you can:
1. Stop the other service using port 8000
2. Or run on a different port:
   ```bash
   python manage.py runserver 8001
   ```
   Then update `app.json` extra.apiUrl to `http://localhost:8001`

### Connection Refused Error

If you see "Connection refused" or "Network error":
1. **Check if backend is running:**
   - Look for the Django server output in your terminal
   - Should see "Starting development server at http://127.0.0.1:8000/"

2. **Check the API URL:**
   - Default is `http://localhost:8000`
   - Can be changed via `EXPO_PUBLIC_API_URL` environment variable
   - Or update `app.json` extra.apiUrl

3. **For Web Development:**
   - Make sure CORS is enabled (already configured in settings.py)
   - Backend should accept requests from `http://localhost:8081` (Expo web)

4. **For Mobile Development:**
   - **iOS Simulator**: Use `http://localhost:8000`
   - **Android Emulator**: Use `http://10.0.2.2:8000`
   - **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.100:8000`)

### CORS Errors

If you see CORS errors:
1. Check that `corsheaders` is installed: `pip install django-cors-headers`
2. Verify `CorsMiddleware` is in `MIDDLEWARE` in `settings.py`
3. Check `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py`

### Database Issues

If you need to reset the database:
```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser  # Optional
```

## Environment Configuration

### Setting Custom API URL

**Option 1: Environment Variable**
```bash
export EXPO_PUBLIC_API_URL=http://your-backend-url:8000
npm run web
```

**Option 2: Update app.json**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://your-backend-url:8000"
    }
  }
}
```

## API Endpoints

- **Login**: `POST /api/user/login/`
- **Student Registration**: `POST /api/user/register/student/`
- **Professor Registration**: `POST /api/user/register/professor/`
- **Professor Jobs**: `GET /api/user/professor/jobs/`
- **Professor Projects**: `GET /api/user/professor/projects/`

## Next Steps

1. Start the backend server using one of the methods above
2. Start the frontend: `npm run web` or `npm start`
3. The app should now connect to the backend automatically

If you still see connection errors, check:
- Backend server is running
- Correct port number
- CORS is enabled
- Firewall isn't blocking the connection

