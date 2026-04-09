# Environment Setup and Configuration

## Environment Variables

### Development Environment (.env.development)

Create a `.env.development` file in the project root:

```bash
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
VITE_JWT_STORAGE_KEY=school_finance_jwt
VITE_JWT_HEADER_NAME=Authorization
VITE_APP_NAME=School Financial System
```

### Production Environment (.env.production)

```bash
VITE_API_URL=https://api.school.example.com
VITE_API_BASE_URL=https://api.school.example.com
VITE_JWT_STORAGE_KEY=school_finance_jwt
VITE_JWT_HEADER_NAME=Authorization
VITE_APP_NAME=School Financial System
```

### Testing Environment (.env.test)

```bash
VITE_API_URL=http://localhost:5000
VITE_JWT_STORAGE_KEY=school_finance_test_jwt
```

## Required Node.js Version

```bash
Node.js: 18.0.0 or higher
npm: 9.0.0 or higher
```

Check your version:

```bash
node --version    # v18.x.x
npm --version     # 9.x.x
```

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/your-org/school-financial-system.git
cd school-financial-system/frontend
```

### 2. Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`:

- React and plugins
- Vite and dev tools
- TailwindCSS and PostCSS
- Axios for HTTP
- React Router for navigation
- React Query for server state
- Lucide React for icons

### 3. Environment Configuration

Create `.env.local` for local development overrides:

```bash
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
```

This file is git-ignored and won't be committed.

### 4. Verify Installation

```bash
npm run build
```

Should complete without errors and generate `dist/` directory.

## Development Tools Setup

### Visual Studio Code Extensions (Recommended)

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
   - ID: dsznajder.es7-react-js-snippets
   - Provides quick code snippets

2. **Tailwind CSS IntelliSense**
   - ID: bradlc.vscode-tailwindcss
   - CSS class autocomplete

3. **Prettier - Code formatter**
   - ID: esbenp.prettier-vscode
   - Auto-format code on save

4. **ESLint**
   - ID: dbaeumer.vscode-eslint
   - Real-time linting

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsx]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.emmetCompletions": true
}
```

## Backend Configuration

### API Endpoint

The frontend expects the backend API at `VITE_API_BASE_URL` (or fallback `VITE_API_URL`):

- Development: `http://localhost:5000`
- Production: `https://api.school.example.com`

### Vercel Production Configuration

In Vercel Project Settings → Environment Variables, set:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com
```

Then redeploy the frontend. Without this variable, `/api/*` requests in production may return 404 from Vercel.

### CORS Configuration

Backend must allow CORS from frontend origin:

```python
# Flask backend (app.py)
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
  r"/api/*": {
    "origins": "http://localhost:5173",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
  }
})
```

### JWT Configuration

Ensure backend sends JWT in response:

```python
@app.route('/api/auth/login', methods=['POST'])
def login():
    # ... authentication logic
    return {
        'token': jwt_token,
        'user': user_data,
        'mustChangePassword': False
    }
```

## Database Setup

### Migration (Backend Responsibility)

The frontend connects to backend API. Database setup is handled by backend:

```bash
# In backend directory
flask db upgrade
```

Verify database connectivity by checking backend logs.

### Seed Data

Optional seed data for development:

```bash
# In backend directory
python scripts/seed_data.py
```

Creates test users and sample financial data.

## Local Development Workflow

### 1. Start Backend Service

```bash
cd ../backend
export FLASK_ENV=development
flask run
# Backend runs at http://localhost:5000
```

### 2. Start Frontend Dev Server

```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:5173
```

### 3. Open Browser

Navigate to [http://localhost:5173](http://localhost:5173)

### Test Credentials

Use default test accounts:

| Role | Username | Password | Purpose |
|------|----------|----------|---------|
| Admin | admin | admin123 | Full access |
| Bursar | bursar | bursar123 | Financial management |
| Principal | principal | principal123 | Reports and oversight |
| Storekeeper | storekeeper | store123 | Inventory management |

Note: These are for development only. Change for production.

## Docker Setup (Optional)

### Development with Docker Compose

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: development
      DATABASE_URL: postgresql://user:pass@db:5432/school_finance
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://backend:5000
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: school_finance
    ports:
      - "5432:5432"
```

Run all services:

```bash
docker-compose up
```

## Production Build Setup

### Build for Deployment

```bash
npm run build
```

Creates optimized `dist/` directory.

### Environment for Production

Create `.env.production`:

```bash
VITE_API_URL=https://api.school.example.com
VITE_JWT_STORAGE_KEY=school_finance_jwt
```

### Deployment Package

Compress build output:

```bash
tar -czf school-financial-system-frontend.tar.gz dist/
```

Transfer to server and extract.

## Proxying Requests (Development)

If backend is on different port, configure Vite proxy in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
```

Then use relative paths in API calls:

```javascript
const response = await apiClient.get('/api/fees');
```

## Troubleshooting Setup Issues

### Port Already in Use

```bash
# Find and stop process using port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Cannot Connect to Backend

1. Verify backend is running on correct port
2. Check VITE_API_URL in .env file
3. Verify CORS is enabled in backend
4. Check browser console for specific errors

### Import Errors

```bash
# Verify path exists and spelling matches
ls src/auth/roleAccess.js

# Check for circular imports
npm run lint
```

## Dependency Management

### Checking for Updates

```bash
npm outdated
```

Shows available updates for packages.

### Updating Dependencies

```bash
npm update
```

Updates packages within major version.

### Security Audit

```bash
npm audit
```

Identifies known vulnerabilities.

### Fixing Vulnerabilities

```bash
npm audit fix
```

Automatically fixes critical issues.

## Configuration File Reference

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser'
  }
})
```

### tailwind.config.js

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    colors: {
      'structural-navy': '#1e3a5f',
      'app-background': '#f5f7fa',
      'action-mint': '#10b981',
      'alert-crimson': '#dc2626',
    }
  }
}
```

### package.json

Scripts available:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src",
    "preview": "vite preview"
  }
}
```

## IDE Configuration

### Recommended Extensions

- ESLint for code quality
- Prettier for code formatting
- Thunder Client or REST Client for API testing
- Git Graph for git visualization

### Editor Configuration

Set up auto-save and formatting:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
