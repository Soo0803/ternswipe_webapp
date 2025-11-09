# Backend Setup Instructions

This is a Django REST Framework backend for the TernSwipe application.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup Steps

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)

```bash
# On macOS/Linux
python3 -m venv env
source env/bin/activate

# On Windows
python -m venv env
env\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install manually:

```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
```

### 4. Run Migrations

**IMPORTANT:** After updating models, you need to create and run migrations:

```bash
python manage.py makemigrations user
python manage.py migrate
```

This will add the new algorithm-required fields to the database:
- Student fields: headline, summary, courses, skills, gpa, hrs_per_week, availability dates
- Project fields: required_skills, hrs_per_week, start_date, end_date, capacity

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Start the Development Server

```bash
python manage.py runserver
```

The server will start on `http://localhost:8000`

## API Endpoints

- **Login**: `POST /api/user/login/`
- **Student Registration**: `POST /api/user/register/student/`
- **Professor Registration**: `POST /api/user/register/professor/`
- **Professor Jobs**: `GET /api/user/professor/jobs/`
- **Professor Projects**: `GET /api/user/professor/projects/`

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, you can specify a different port:

```bash
python manage.py runserver 8001
```

Then update the API URL in `app.json` or set `EXPO_PUBLIC_API_URL` environment variable.

### CORS Errors

The backend is configured to allow all origins in development. If you encounter CORS errors:

1. Check that `corsheaders` is in `INSTALLED_APPS`
2. Check that `CorsMiddleware` is in `MIDDLEWARE`
3. Verify `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py`

### Database Issues

If you need to reset the database:

```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## Environment Variables

You can set the API URL in your frontend by:

1. Setting `EXPO_PUBLIC_API_URL` environment variable
2. Updating `app.json` extra.apiUrl
3. The default is `http://localhost:8000`

## Testing the Backend

You can test if the backend is running by visiting:

- `http://localhost:8000/admin/` - Django admin panel
- `http://localhost:8000/api/user/login/` - Should return a method not allowed error (this is normal)

## Production Notes

⚠️ **Warning**: The current settings are for development only. For production:

1. Set `DEBUG = False`
2. Configure specific `ALLOWED_HOSTS`
3. Set up proper CORS origins
4. Use environment variables for sensitive data
5. Use a production database (PostgreSQL, MySQL, etc.)
6. Set up proper authentication and security

