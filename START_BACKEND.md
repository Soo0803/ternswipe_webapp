# Quick Start - Backend Server

## The Problem
The backend server is **not running**. You need to start it before the web app can connect.

## Quick Fix (Copy and paste these commands)

### Step 1: Navigate to backend directory
```bash
cd backend
```

### Step 2: Activate virtual environment
```bash
# macOS/Linux:
source env/bin/activate

# Windows:
env\Scripts\activate
```

### Step 3: Run migrations (if needed)
```bash
python manage.py makemigrations user
python manage.py migrate
```

### Step 4: Start the server
```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Step 5: Keep it running
**Keep this terminal window open!** The backend must stay running while you use the web app.

## Using the Start Script (Easier)

### macOS/Linux:
```bash
cd backend
./start_backend.sh
```

### Windows:
```bash
cd backend
start_backend.bat
```

## Verify Backend is Running

Open a new terminal and test:
```bash
curl http://localhost:8000/admin/
```

Or visit in browser: `http://localhost:8000/admin/`

## Troubleshooting

### "No module named django"
Install dependencies:
```bash
cd backend
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
```

### "Port 8000 already in use"
Stop the other service or use a different port:
```bash
python manage.py runserver 8001
```
Then update `app.json` extra.apiUrl to `http://localhost:8001`

### "ModuleNotFoundError"
Make sure you're in the backend directory and virtual environment is activated.

## Next Steps

1. **Start backend** (see above) - Keep terminal open!
2. **Start frontend** in a new terminal:
   ```bash
   npm run web
   ```
3. **Test connection** - Try logging in or registering

## Important Notes

- The backend must be running **before** you start the frontend
- Keep the backend terminal window open while using the app
- If you close the backend, the app will lose connection
- Start backend in one terminal, frontend in another terminal

