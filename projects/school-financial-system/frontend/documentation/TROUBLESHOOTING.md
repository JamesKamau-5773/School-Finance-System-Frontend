# Troubleshooting Guide

## Common Issues and Solutions

## Authentication Issues

### Issue: "Invalid email or password" on login

**Symptoms:**
- Login attempts fail consistently
- Email and password appear correct
- Works on another device/browser

**Solutions:**

1. Verify credentials with admin
2. Check Caps Lock is off
3. Clear browser cache: Ctrl+Shift+Delete
4. Try private/incognito mode
5. Verify backend is running: `curl http://localhost:5000`

### Issue: Redirected to login after every page refresh

**Symptoms:**
- User logs in successfully
- Page refreshes and redirected back to login
- Token not persisting

**Causes and Fixes:**

1. **localStorage disabled:**
   - Check browser privacy settings
   - Ensure cookies are allowed
   - Check if in private mode

2. **Token expired:**
   - Backend token TTL too short
   - Check backend config: `JWT_ACCESS_TOKEN_EXPIRES`

3. **CORS blocking token:**
   - Check browser console for CORS errors
   - Verify backend CORS headers

```javascript
// Debug: Check token in browser
// Open DevTools > Console
console.log(localStorage.getItem('school_finance_jwt'))
```

### Issue: "Password does not meet requirements"

**Symptoms:**
- Password change fails
- Requirements message shows

**Solution:**

Password must contain:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

**Valid examples:**
```
SecurePass123!
MyPassword2024@
Finance$2024K
```

### Issue: Stuck on "Forced Password Change" screen

**Symptoms:**
- Temporary password screen won't close
- Can't proceed to dashboard

**Solutions:**

1. Verify password requirements met
2. Check password doesn't match previous
3. Ensure new and confirm match
4. Clear browser cache and try again
5. Contact admin for password reset

## Network and API Issues

### Issue: API requests failing (Network tab shows 404)

**Symptoms:**
- Data not loading
- "Failed to fetch" errors
- Empty transaction list

**Solutions:**

1. **Check Backend Running:**

```bash
# Terminal 1: Check backend status
cd backend
flask run

# Terminal 2: Test API
curl http://localhost:5000/api/finance/transactions
```

2. **Verify API URL:**

```javascript
// DevTools > Console
console.log(import.meta.env.VITE_API_URL)
```

Should show: `http://localhost:5000`

3. **Check .env file:**

```bash
# In frontend directory
cat .env.local  # Check VITE_API_URL value
```

### Issue: CORS Error (blocked by browser)

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

1. **Frontend (.env):**

```bash
VITE_API_URL=http://localhost:5000
```

2. **Backend (app.py):**

```python
from flask_cors import CORS

CORS(app, resources={
  r"/api/*": {
    "origins": "http://localhost:5173",
    "allow_headers": ["Content-Type", "Authorization"]
  }
})
```

3. **Production:**

Update both frontend and backend with production URLs.

### Issue: 401 Unauthorized on API calls

**Symptoms:**
- API returns 401
- User appears logged in
- Network tab shows Authorization header missing

**Solutions:**

```javascript
// DevTools > Console
const token = localStorage.getItem('school_finance_jwt');
console.log('Token:', token);  // Should not be null

// Check if interceptor is working
// Network tab: should see Authorization: Bearer eyJ...
```

If token is null:
1. Re-login
2. Check localStorage isn't disabled
3. Verify backend returns token on login

### Issue: 403 Forbidden on specific endpoints

**Symptoms:**
- API returns 403 Forbidden
- Error: "This endpoint requires one of..."
- Bursar can't access inventory

**Analysis:**

Currently known issues:

- Bursar role missing from `/api/inventory/status` endpoint
- Backend decorator doesn't include bursar

**Workarounds:**

1. Use admin account temporarily
2. Request backend RBAC fix
3. Check RBAC.md for current permissions

**Permanent Fix (Backend):**

```python
# File: app/controllers/inventory_controller.py
@roles_required('admin', 'principal', 'bursar', 'clerk', 'storekeeper')
def get_inventory_status():
    pass
```

### Issue: Network timeout (request takes too long)

**Symptoms:**
- Page loading forever
- Spinner won't stop
- Eventually shows timeout error

**Solutions:**

1. **Check network speed:**

Open DevTools > Network tab
Look at Time column - should be < 200ms for most requests

2. **If slow on mobile:**

- Check mobile data connection
- Try WiFi instead
- Reduce page size by implementing filtering

3. **Increase timeout (development):**

```javascript
// src/api/apiClient.js
const apiClient = axios.create({
  timeout: 30000  // 30 seconds
});
```

4. **Check backend performance:**

```bash
# Monitor backend logs
# Look for slow SQL queries
# Check database connection
```

## UI/Display Issues

### Issue: Page layout broken on mobile

**Symptoms:**
- Content overlaps
- Text too small
- Can't tap buttons

**Solutions:**

1. **Check viewport meta tag:**

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

2. **Clear browser cache:**

DevTools > Application > Clear Site Data

3. **Test in different browser:**

Chrome vs Safari vs Firefox

4. **Check screen size:**

DevTools > Device Toggle (F12)

### Issue: Hamburger menu not appearing on mobile

**Symptoms:**
- Menu icon not visible
- Can't navigate on mobile

**Solutions:**

1. Check viewport width:

```javascript
// DevTools > Console
console.log(window.innerWidth)  // Should be < 768 for mobile
```

2. Clear cache:

Ctrl+Shift+Delete > Clear persistent data

3. Test with actual mobile device (not just resized browser)

### Issue: Components not rendering

**Symptoms:**
- Blank page or missing elements
- No console errors
- Page loads but empty

**Solutions:**

1. **Check console for errors:**

Press F12 > Console tab

2. **Check network requests:**

DevTools > Network tab
Verify all CSS and JS files loading successfully

3. **Debug component:**

```javascript
// Add debug logging
export default function YourComponent() {
  console.log('Component rendering');
  return <div>Content</div>;
}
```

4. **Check if hidden:**

```javascript
// DevTools > Console
const element = document.querySelector('.your-element');
const style = window.getComputedStyle(element);
console.log('Visibility:', style.visibility);
console.log('Display:', style.display);
```

### Issue: Styles not loading (unstyled page)

**Symptoms:**
- Page appears without colors
- Buttons not styled
- Only plain HTML rendered

**Solutions:**

1. Check CSS loaded:

DevTools > Network > Filter by CSS

2. Verify Tailwind config:

```bash
# Check tailwind.config.js exists
ls -la tailwind.config.js

# Rebuild CSS
npm run dev
```

3. Check if using class names correctly:

```javascript
// Good: Tailwind class names
className="p-4 bg-blue-500 text-white"

// Bad: Made-up class names
className="mycustomstyle"
```

## Performance Issues

### Issue: Page loads slowly

**Symptoms:**
- Takes > 3 seconds to load
- Lighthouse score low
- Resources taking long time

**Solutions:**

1. **Analyze build size:**

```bash
npm run build

# Check dist folder size
du -sh dist/
ls -lh dist/assets/
```

2. **Identify large assets:**

Move large components to lazy load:

```javascript
const HeavyComponent = lazy(() => import('./heavy'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

3. **Enable compression:**

Web server should gzip responses (nginx/Apache configured)

4. **Optimize images:**

Use image optimization tools before committing

## Development Server Issues

### Issue: "npm run dev" fails to start

**Symptoms:**
```
Error: EADDRINUSE: address already in use :::5173
```

**Solutions:**

```bash
# Kill process using port 5173
lsof -i :5173
kill -9 PID

# Or use different port
npm run dev -- --port 3000
```

### Issue: Hot Module Replacement (HMR) not working

**Symptoms:**
- Code changes require full refresh
- State resets on every save

**Solutions:**

1. **Check vite.config.js:**

```javascript
export default defineConfig({
  server: {
    middlewareMode: false,
    hmr: {
      protocol: 'http',
      host: 'localhost',
      port: 5173
    }
  }
})
```

2. **Clear .vite cache:**

```bash
rm -rf node_modules/.vite
npm run dev
```

### Issue: Module not found during dev

**Symptoms:**
```
[vite] Internal server error: Failed to resolve module
```

**Solutions:**

```bash
# Check file exists
ls src/auth/roleAccess.js

# Check spelling matches
# JavaScript is case-sensitive

# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Build Issues

### Issue: "npm run build" fails

**Symptoms:**
```
error during build: ...
```

**Solutions:**

```bash
# Check linting errors first
npm run lint

# Fix errors
npm run lint -- --fix

# Try building again
npm run build
```

### Issue: Build succeeds but doesn't run

**Symptoms:**
- Build finishes
- dist folder created
- But app won't load

**Solutions:**

```bash
# Preview build locally
npm run preview

# Open http://localhost:4173
# Check console for errors
# Verify all assets loading
```

## Git Issues

### Issue: Uncommitted changes

**Symptoms:**
```
On branch master
Changes not staged for commit:
```

**Solutions:**

```bash
# View changes
git status

# Add and commit
git add .
git commit -m "Description of changes"

# Or stash if not ready
git stash
```

### Issue: Merge conflicts

**Symptoms:**
```
CONFLICT (content merge): ...
```

**Solutions:**

```bash
# View conflicts
git status

# Edit conflicted files
# Search for: <<<<<<, ======, >>>>>>

# Remove conflict markers
# Keep desired version

# Complete merge
git add .
git commit -m "Resolve merge conflicts"
```

## Browser-Specific Issues

### Chrome

**Issue:** "Unsafe JavaScript attempt to access frame"

**Solution:**

This is CORS issue. Check backend CORS configuration.

### Firefox

**Issue:** Storage quota exceeded

**Solution:**

Clear browser storage:

1. Right-click > Inspect
2. Storage tab
3. Local Storage > Delete All

### Safari

**Issue:** "WebStorage is disabled"

**Solution:**

Enable in Settings > Privacy > Prevent Cross-site tracking (disable this)

## Testing Credentials Not Working

### Issue: Can't login with test credentials

**Credentials provided:**
- Admin: admin / admin123
- Bursar: bursar / bursar123

**Solutions:**

1. **Check backend seed data:**

```bash
# Recreate test accounts
cd backend
python scripts/seed_data.py
```

2. **Database connection:**

```bash
# Verify database running
# Check backend logs for connection errors
```

3. **Use actual credentials:**

Ask admin for working test account

## Reporting Issues

### When to report

- Reproducible error
- Specific error message
- Steps to reproduce
- Environment (browser, OS)

### How to report

1. Check TROUBLESHOOTING.md first
2. Check open issues on GitHub
3. Search closed issues
4. Report with:

```
Title: [Issue] Brief description

Environment:
- OS: macOS/Windows/Linux
- Browser: Chrome/Firefox/Safari
- Version: 1.0.0

Steps to reproduce:
1. ...
2. ...

Expected: ...
Actual: ...

Error message:
[Paste from console if available]

Screenshots: [if applicable]
```

## Getting Help

1. Check relevant documentation:
   - ARCHITECTURE.md - How things work
   - API_INTEGRATION.md - API issues
   - AUTHENTICATION.md - Login issues
   - RBAC.md - Permission issues

2. Check browser console (F12)

3. Check backend logs

4. Ask team members

5. Create GitHub issue if bug

## Emergency Contacts

- Backend Issues: backend-team@school.edu
- Deployment Issues: devops@school.edu
- General Support: support@school.edu
