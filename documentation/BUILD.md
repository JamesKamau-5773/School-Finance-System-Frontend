# Build Process and Optimization

## Build Overview

The project uses Vite for development and production builds. Vite provides:

- Lightning-fast dev server with Hot Module Replacement (HMR)
- Optimized production builds with code splitting
- Native ES module support

## Development Build

### Starting Dev Server

```bash
npm run dev
```

**Output:**
```
  VITE v8.0.1  ready in 245 ms

  Local:        http://localhost:5173/
  press h to show help
```

**Features:**
- Hot Module Replacement - Edit files and see changes instantly
- Fast refresh - Preserves React component state
- Full source maps for debugging
- ESLint validation on save

### Development Configuration

See `vite.config.js` for dev server settings:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: false
  }
})
```

## Production Build

### Building for Production

```bash
npm run build
```

**Build Output:**
```
vite v8.0.1 building client environment for production...
2279 modules transformed.

dist/index.html                   0.43 kB | gzip:   0.27 kB
dist/assets/index-DpQUHuUR.css   80.95 kB | gzip:  12.85 kB
dist/assets/index-p3jgc3yz.js   636.09 kB | gzip: 177.87 kB

built in 1.76s
```

**Artifacts:**
- `dist/index.html` - Single-page application entry point
- `dist/assets/index-*.css` - Compiled and minified styles
- `dist/assets/index-*.js` - Bundled and minified JavaScript

### Production Configuration

Vite automatically optimizes for production:

- Code minification (TerserPlugin)
- TailwindCSS purging (removes unused styles)
- Tree-shaking (removes unused code)
- Hash-based cache busting

## Performance Metrics

### Build Performance

| Metric | Value |
|--------|-------|
| Build Duration | 1.3-1.7 seconds |
| CSS Bundle | 12.85 kB gzipped |
| JS Bundle | 177.87 kB gzipped |
| Total Size | ~191 kB gzipped |
| Module Count | 2,279 modules |

### Asset Optimization

**CSS Optimization:**
- TailwindCSS purging (only used classes)
- PostCSS minification
- Removes unused CSS from dependencies

**JavaScript Optimization:**
- Tree-shaking removes dead code
- Minification with Terser
- Vendor code splitting (optional)

**Image Optimization:**
- Small images inlined as data URIs
- Large images processed and hashed

### Runtime Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint (FCP) | < 2s | On track |
| Time to Interactive (TTI) | < 3.5s | On track |
| Largest Contentful Paint (LCP) | < 2.5s | On track |
| Cumulative Layout Shift (CLS) | < 0.1 | On track |

## Build Optimization Strategies

### 1. Code Splitting

Currently, the build generates a single main bundle. Future optimizations could include:

```javascript
// Lazy-load feature modules
const FeeMaster = lazy(() => import('./features/fees/FeeMaster'));
const Inventory = lazy(() => import('./features/inventory/StorekeeperDashboard'));
```

### 2. CSS-in-JS Optimization

TailwindCSS is configured with content purging:

```javascript
content: [
  "./index.html",
  "./src/**/*.{js,jsx}"
],
```

This removes all unused utility classes from the final build.

### 3. Asset Chunking

Vite automatically chunks:
- Vendor dependencies into separate bundles
- Shared modules across routes
- React and core libraries

### 4. Module Resolution

Currently monolithic. Can optimize with route-based code splitting:

```javascript
// Before: All code in one bundle
// After: Each route loads on demand
const routes = [
  { path: '/cashbook', element: lazy(() => import('./features/cashbook')) },
  { path: '/fees', element: lazy(() => import('./features/fees')) }
]
```

## Monitoring Build Warnings

### Current Warnings

```
(!) Some chunks are larger than 500 kB after minification.
```

**Analysis:**
- Main bundle is 636.09 kB (before gzip)
- This includes React, Router, Query, all features
- Acceptable for SPAs with route-based code splitting in future

**Mitigation Options:**

1. Enable code splitting by route (recommended for future)
2. Lazy-load heavy features (dashboard reports, analytics)
3. Implement Service Worker for caching

## Build Verification

### Pre-Build Checks

```bash
npm run lint
```

Validates code against ESLint rules before building.

### Post-Build Verification

```bash
# Check dist directory exists
ls -la dist/

# Verify bundle content
ls -lh dist/assets/
```

## Environment-Specific Builds

### Development Build (default)

```bash
npm run dev
```

- Source maps enabled
- HMR active
- No minification

### Production Build

```bash
npm run build
```

- Minified
- Source maps generated
- Optimized CSS
- Tree-shaken

## Deployment Build

After building, deploy the `dist/` directory:

```bash
# Copy to production server
scp -r dist/* user@server:/var/www/app/

# Or with Docker
docker run -v ./dist:/usr/share/nginx/html nginx:alpine
```

## Build Troubleshooting

### Build Fails with "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build Too Slow

```bash
# Check for large dependencies
npm ls

# Use npm audit to find outdated packages
npm audit
```

### Memory Issues During Build

```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

## Caching Strategy

### Package Cache

```bash
npm ci  # Clean install, respects package-lock.json
```

### Build Cache

Vite caches dependencies in `.vite/` for faster rebuilds in development.

## Next Steps for Optimization

1. Implement route-based code splitting
2. Add Service Worker for offline support
3. Configure image optimization pipeline
4. Set up build performance monitoring
5. Implement dynamic imports for heavy features
