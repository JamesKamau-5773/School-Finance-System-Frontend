# Deployment Guide

## Deployment Overview

The School Financial System frontend is a static single-page application (SPA) that can be deployed to any static hosting platform.

## Pre-Deployment Checklist

- [ ] All tests passing: `npm test`
- [ ] Linting clean: `npm run lint`
- [ ] Build successful: `npm run build`
- [ ] Environment variables set correctly
- [ ] Backend API deployed and accessible
- [ ] CORS configured on backend
- [ ] Database migrations applied (backend)
- [ ] Security headers configured
- [ ] SSL/TLS certificates valid
- [ ] DNS records updated

## Build Optimization

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Build Output Analysis

```
dist/index.html                   0.43 kB
dist/assets/index-*.css          12.85 kB (gzipped)
dist/assets/index-*.js          177.87 kB (gzipped)
Total                           ~191 kB (gzipped)
```

### Build Performance

- **Duration:** 1.3-1.7 seconds
- **Cache:** Hash-based file names for long-term caching

## Deployment Platforms

### 1. Vercel (Recommended for React)

#### Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

#### Environment Variables

Set in Vercel dashboard:

```
VITE_API_URL=https://api.school.example.com
```

### 2. Netlify

#### Setup

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

#### netlify.toml Configuration

```toml
[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[env]
VITE_API_URL = "https://api.school.example.com"
```

### 3. GitHub Pages

#### Setup

1. Update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/school-financial-system/',  // Repository name
  plugins: [react()],
})
```

2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4. Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache busting for versioned files
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t school-financial-system-frontend:latest .

# Run container
docker run -p 8080:80 school-financial-system-frontend:latest
```

### 5. AWS S3 + CloudFront

#### Setup

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

### 6. Self-Hosted (Traditional Server)

#### Deployment Steps

```bash
# 1. Build locally
npm run build

# 2. Copy to server
scp -r dist/* user@server:/var/www/html/

# 3. Verify permissions
ssh user@server
chmod 755 /var/www/html
chmod 644 /var/www/html/*
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName school.example.com
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Caching headers
    <FilesMatch "\.html$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </FilesMatch>

    <FilesMatch "\.(js|css)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name school.example.com;
    root /var/www/html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    location /api {
        proxy_pass http://backend-api:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Cache versioned assets forever
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

## Environment Configuration for Production

### .env.production

```bash
VITE_API_URL=https://api.school.example.com
VITE_JWT_STORAGE_KEY=school_finance_jwt
VITE_APP_NAME=School Financial System
```

### Sensitive Variables

Store in environment/deployment platform, not in git:

```bash
# Never commit these
VITE_API_KEY=...
VITE_AUTH_TOKEN=...
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

On nginx/Apache server with Certbot:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d school.example.com

# Auto-renew (automatic with systemd)
sudo systemctl enable certbot.timer
```

Verify in configuration:

```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/school.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/school.example.com/privkey.pem;
}
```

## Security Headers

### Essential Headers

Add to web server or CDN:

**Nginx:**

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

**Apache:**

```apache
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

## Caching Strategy

### Cache Busting

Vite automatically adds hashes to asset filenames:

```
index-DpQUHuUR.css  (hash changes on each build)
index-p3jgc3yz.js   (hash changes on each build)
```

Configuration:

```nginx
# Cache versioned files forever
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Don't cache index.html
location = /index.html {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## Monitoring and Logging

### Application Monitoring

Consider services like:

- Sentry (error tracking)
- Datadog (performance monitoring)
- New Relic (application performance)
- Logrocket (session replay for debugging)

### Server Logs

```bash
# Monitor requests
tail -f /var/log/nginx/access.log

# Monitor errors
tail -f /var/log/nginx/error.log
```

### Health Check

Add health check endpoint for monitoring:

```nginx
location /health {
    access_log off;
    return 200 "ok";
}
```

## Performance Optimization

### Content Delivery Network (CDN)

Use CDN for static assets:

- Cloudflare (free tier available)
- AWS CloudFront
- Fastly
- Akamai

### Compression

Enable gzip compression:

```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript 
           application/javascript application/json
           image/svg+xml;
gzip_min_length 1000;
```

### Image Optimization

Serve optimized images:

```nginx
location ~* \.(jpg|jpeg|png|gif|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Deployment Workflow

### Continuous Deployment (Recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - name: Deploy to production
        run: ./scripts/deploy.sh
```

### Manual Deployment

```bash
# 1. Build
npm run build

# 2. Test build
npm run preview

# 3. Deploy
./scripts/deploy.sh

# 4. Verify
curl https://school.example.com
```

## Rollback Procedure

### If Deployment Fails

```bash
# Option 1: Redeploy previous version
git checkout HEAD~1
npm run build
# Deploy

# Option 2: Use CDN cache (Cloudflare)
# Purge cache if needed: Cloudflare dashboard

# Option 3: Use version management
# Keep previous releases tagged in git
git tag -l | sort -V | tail -5
```

## Post-Deployment Checklist

- [ ] Frontend accessible at production URL
- [ ] All CSS and JS loading correctly
- [ ] No console errors
- [ ] API requests working (check DevTools Network)
- [ ] Authentication working (can login)
- [ ] All features functioning
- [ ] Mobile responsive (test on device)
- [ ] Performance acceptable (Lighthouse score > 80)
- [ ] No security warnings (browser console)
- [ ] Backend connectivity verified
- [ ] Monitoring/logging enabled

## Troubleshooting Deployment

### 404 on Refresh

SPA routing issue. Ensure web server redirects all routes to `index.html`.

Nginx:

```nginx
try_files $uri $uri/ /index.html;
```

Apache:

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### CSS/JS Not Loading

Check file paths. Verify `VITE_BASE` if deploying to subdirectory.

```javascript
// vite.config.js
export default defineConfig({
  base: '/school-financial-system/',  // if under subdirectory
})
```

### CORS Errors

Verify backend CORS configuration:

```python
# Backend
CORS_ORIGINS = ['https://school.example.com']
```

### Blank Page

Check CloudFlare page rules aren't interfering. Check browser console for errors. Verify index.html is being served.

## Performance Monitoring

### Lighthouse Audit

```bash
# Run after deployment
npm run preview

# Open in browser and run Lighthouse (DevTools Audits tab)
```

Target scores:

- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## Scaling Considerations

For growth beyond current capacity:

- Static hosting can scale automatically
- Consider database optimization
- Implement API rate limiting
- Use CDN for global distribution
- Monitor infrastructure costs

## Disaster Recovery

### Backup Procedure

```bash
# Regular backup of dist directory
tar -czf dist-backup-$(date +%Y%m%d).tar.gz dist/

# Upload to backup storage
aws s3 cp dist-backup-*.tar.gz s3://backups/
```

### Recovery

```bash
# Restore from backup
aws s3 cp s3://backups/dist-backup-20240120.tar.gz .
tar -xzf dist-backup-20240120.tar.gz
./scripts/deploy.sh
```

## Further Reading

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Web.dev Deployment Best Practices](https://web.dev/deploy/)
- [OWASP Deployment Checklist](https://owasp.org/www-project-web-security-testing-guide/)
