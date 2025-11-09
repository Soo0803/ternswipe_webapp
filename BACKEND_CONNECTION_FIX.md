# Backend Connection Fix - Summary

## What Was Fixed

### 1. **Centralized API Configuration**
- Created `utils/apiConfig.ts` - Centralized API URL management
- Automatically detects platform (web/mobile) and sets correct URL
- Supports environment variables and app.json configuration

### 2. **Updated All API Calls**
- ✅ `app/log_in_page.tsx` - Now uses `getApiUrl()`
- ✅ `app/(student_sign_up)/page_3.tsx` - Now uses `getApiUrl()`
- ✅ `app/(company_sign_up)/page_3.tsx` - Now uses `getApiUrl()`
- ✅ `hooks/useCompanyJobs.ts` - Now uses `getApiUrl()`

### 3. **Improved Error Handling**
- Better error messages that guide users to fix connection issues
- Specific messages for connection refused vs other errors
- Helpful instructions in error dialogs

### 4. **Backend Configuration Updates**
- ✅ Updated `backend/main/settings.py` - Added web origins to CSRF_TRUSTED_ORIGINS
- ✅ Updated `backend/user/models.py` - Added algorithm-required fields
- ✅ Updated `backend/user/serializers.py` - Added new fields to serializers
- ✅ Updated `backend/user/views.py` - Handles new fields from frontend

### 5. **Backend Setup Scripts**
- ✅ Created `backend/start_backend.sh` (macOS/Linux)
- ✅ Created `backend/start_backend.bat` (Windows)
- ✅ Created `backend/requirements.txt`
- ✅ Created `backend/README.md` with detailed instructions

## How to Start Backend

### Quick Start (Recommended)

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

### Manual Start

```bash
cd backend
source env/bin/activate  # macOS/Linux
# OR
env\Scripts\activate     # Windows

# Create migrations for new fields
python manage.py makemigrations user
python manage.py migrate

# Start server
python manage.py runserver
```

## Important: Run Migrations First!

The backend models have been updated with new fields. You **must** run migrations:

```bash
cd backend
source env/bin/activate  # Activate virtual environment
python manage.py makemigrations user
python manage.py migrate
```

This will add the new database fields needed for the algorithm.

## Verifying Backend is Running

1. **Check Terminal Output:**
   - Should see: "Starting development server at http://127.0.0.1:8000/"

2. **Test in Browser:**
   - Visit: `http://localhost:8000/admin/`
   - Should see Django admin login (or create superuser first)

3. **Test API Endpoint:**
   - Visit: `http://localhost:8000/api/user/login/`
   - Should return method not allowed (this is normal - it's a POST endpoint)

## Troubleshooting

### "Network error - check if backend is running"

1. **Start the backend server** (see above)
2. **Verify it's running:**
   - Check terminal for Django server output
   - Visit `http://localhost:8000/admin/` in browser

3. **Check the API URL:**
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
3. Check `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py`

## New Database Fields

After running migrations, the following fields will be added:

### StudentProfile:
- headline, summary, courses (JSON), skills (JSON), skills_text
- gpa, hrs_per_week, avail_start, avail_end, reliability

### ProfessorProject:
- required_skills (JSON), hrs_per_week, start_date, end_date
- capacity, is_open

## Next Steps

1. **Start Backend:**
   ```bash
   cd backend
   ./start_backend.sh  # or start_backend.bat on Windows
   ```

2. **Start Frontend:**
   ```bash
   npm run web
   ```

3. **Test Connection:**
   - Try logging in or registering
   - Should connect to backend automatically

## Files Changed

### Frontend:
- `utils/apiConfig.ts` (NEW)
- `app/log_in_page.tsx`
- `app/(student_sign_up)/page_3.tsx`
- `app/(company_sign_up)/page_3.tsx`
- `hooks/useCompanyJobs.ts`
- `app.json` (added apiUrl config)

### Backend:
- `backend/main/settings.py` (CORS updates)
- `backend/user/models.py` (new fields)
- `backend/user/serializers.py` (new fields)
- `backend/user/views.py` (handles new fields)
- `backend/start_backend.sh` (NEW)
- `backend/start_backend.bat` (NEW)
- `backend/requirements.txt` (NEW)
- `backend/README.md` (NEW)

