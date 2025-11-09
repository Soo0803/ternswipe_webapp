# Troubleshooting Web App Connection Issues

## ✅ Backend is Running!

The backend server has been started and is running on **http://localhost:8000**

## Quick Fixes

### 1. Refresh Your Browser
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to hard refresh
- This clears cached errors and reloads the page

### 2. Restart Frontend
If you're still seeing connection errors:
```bash
# Stop the current frontend (Ctrl+C)
# Then restart it:
npm run web
```

### 3. Check Backend Status
```bash
./check_backend.sh
```

Should show: "✅ Backend server is RUNNING on port 8000"

### 4. Verify Backend is Responding
Open in browser: `http://localhost:8000/admin/`

Should see Django admin login page (or redirect).

## Common Issues

### Issue: "Cannot connect to backend server"

**Solution:**
1. Verify backend is running: `./check_backend.sh`
2. Check if port 8000 is in use: `lsof -ti:8000`
3. If not running, start it: `cd backend && ./start_backend.sh`

### Issue: CORS Errors in Browser Console

**Solution:**
The CORS middleware has been fixed. If you still see errors:
1. Restart the backend server
2. Clear browser cache (hard refresh)
3. Check browser console for specific error

### Issue: "Network Error" or "Connection Refused"

**Solution:**
1. **Backend not running** - Start it: `cd backend && ./start_backend.sh`
2. **Wrong port** - Check `app.json` has `extra.apiUrl: "http://localhost:8000"`
3. **Firewall blocking** - Check if firewall is blocking port 8000

### Issue: Backend Starts Then Stops

**Solution:**
1. Check for errors in the terminal where backend is running
2. Check database migrations: `cd backend && python manage.py migrate`
3. Check if port is already in use: `lsof -ti:8000`

## Step-by-Step Verification

### Step 1: Check Backend is Running
```bash
./check_backend.sh
```

Expected output:
```
✅ Backend server is RUNNING on port 8000
✅ Backend is responding to requests
```

### Step 2: Test Backend in Browser
Open: `http://localhost:8000/admin/`

Should see: Django admin page or login redirect

### Step 3: Test API Endpoint
```bash
curl http://localhost:8000/api/user/login/ -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

Should return: `{"error":"Invalid credentials"}` (this is correct!)

### Step 4: Check Frontend Connection
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try to login or register
4. Check if requests are going to `http://localhost:8000/api/user/login/`

## Browser-Specific Issues

### Chrome/Edge
- Clear cache: `Ctrl+Shift+Delete`
- Disable cache in DevTools: Network tab → "Disable cache" checkbox
- Check Console for CORS errors

### Firefox
- Clear cache: `Ctrl+Shift+Delete`
- Check Console for errors
- Check Network tab for failed requests

### Safari
- Clear cache: `Cmd+Option+E`
- Enable Developer menu: Preferences → Advanced → "Show Develop menu"
- Check Console for errors

## Restart Everything

If nothing works, restart everything:

### 1. Stop Backend
```bash
lsof -ti:8000 | xargs kill
```

### 2. Stop Frontend
Press `Ctrl+C` in the terminal running the frontend

### 3. Start Backend
```bash
cd backend
./start_backend.sh
```

Keep this terminal open!

### 4. Start Frontend (in new terminal)
```bash
npm run web
```

### 5. Test Connection
Try logging in or registering in the web app

## Still Not Working?

### Check These:

1. **Backend logs** - Look at the terminal where backend is running
2. **Browser console** - Check for JavaScript errors
3. **Network tab** - Check if requests are being made
4. **API URL** - Verify it's `http://localhost:8000`

### Get More Info:

```bash
# Check backend process
ps aux | grep "manage.py runserver"

# Check port 8000
lsof -ti:8000

# Test backend directly
curl -v http://localhost:8000/api/user/login/

# Check frontend API config
cat app.json | grep apiUrl
```

## Contact/Support

If you're still having issues:
1. Check the backend terminal for error messages
2. Check browser console for JavaScript errors
3. Verify both backend and frontend are running
4. Make sure you're using the latest code

## Expected Behavior

When everything is working:
- ✅ Backend runs on `http://localhost:8000`
- ✅ Frontend runs on `http://localhost:8081`
- ✅ Frontend can make requests to backend
- ✅ No CORS errors in browser console
- ✅ Login/Registration works

