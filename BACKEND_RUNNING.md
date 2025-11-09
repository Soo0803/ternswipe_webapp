# ✅ Backend Server is Now Running!

## Status
The backend server has been started and is running on **http://localhost:8000**

## What Was Done

1. ✅ **Fixed CORS middleware order** - Moved to top of middleware stack for proper CORS handling
2. ✅ **Ran database migrations** - Added new algorithm-required fields to database
3. ✅ **Started backend server** - Server is now running in the background

## Verify Backend is Running

Run this command to check:
```bash
./check_backend.sh
```

Or test manually:
```bash
curl http://localhost:8000/admin/
```

Should return a response (likely a redirect to login, which is normal).

## Using the Web App

1. **Backend is running** ✅ (already started)
2. **Start the frontend** in a new terminal:
   ```bash
   npm run web
   ```
3. **Open browser** - The app should now connect to the backend

## Backend Management

### Check if Backend is Running
```bash
./check_backend.sh
```

### Stop Backend
```bash
# Find the process
lsof -ti:8000

# Kill it (replace PID with the number from above)
kill <PID>
```

### Restart Backend
```bash
cd backend
./start_backend.sh
```

## Troubleshooting

### "Still can't connect"
1. Verify backend is running: `./check_backend.sh`
2. Check browser console for errors
3. Make sure you're using the correct URL (http://localhost:8000)

### "CORS errors"
The CORS middleware has been fixed and moved to the top. If you still see CORS errors:
1. Restart the backend server
2. Clear browser cache
3. Check browser console for specific error messages

### Backend Stopped Working
If the backend stops:
1. Check the terminal where it's running
2. Look for error messages
3. Restart: `cd backend && ./start_backend.sh`

## API Endpoints

- **Login**: `POST http://localhost:8000/api/user/login/`
- **Student Registration**: `POST http://localhost:8000/api/user/register/student/`
- **Professor Registration**: `POST http://localhost:8000/api/user/register/professor/`
- **Professor Jobs**: `GET http://localhost:8000/api/user/professor/jobs/`

## Next Steps

1. ✅ Backend is running
2. Start frontend: `npm run web`
3. Test the connection by logging in or registering

## Important Notes

- **Keep the backend running** - Don't close the terminal where it's running
- **Backend runs on port 8000** - Frontend on port 8081
- **CORS is enabled** - Web app can connect to backend
- **Database migrations applied** - New fields are available

## If You Need to Restart

```bash
# Stop backend (if needed)
lsof -ti:8000 | xargs kill

# Start backend
cd backend
./start_backend.sh
```

