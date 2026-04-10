# Frontend Deployment Guide

## Docker Deployment

This frontend application is containerized with **Node.js** for building and **Nginx** for serving in production.

### Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)

### Quick Start

1. **Build and run with Docker Compose:**

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

2. **Stop the service:**

```bash
docker-compose down
```

### Manual Docker Commands

#### Build the image:
```bash
docker build -t school-finance-frontend:latest .
```

#### Run the container:
```bash
docker run -d \
  --name school-finance-frontend \
  -p 3000:80 \
  school-finance-frontend:latest
```

#### View logs:
```bash
docker logs -f school-finance-frontend
```

#### Stop the container:
```bash
docker stop school-finance-frontend
docker rm school-finance-frontend
```

### Image Details

- **Base Images:** 
  - Builder: `node:20-alpine` (for build step)
  - Runtime: `nginx:alpine` (for serving)
- **Final Size:** ~94 MB (26.2 MB compressed)
- **Exposed Port:** 80
- **Health Check:** Enabled (checks `/index.html` every 30s)

### Build Optimization

The multi-stage build:
1. **Stage 1 (Builder):** Compiles React app with Vite
2. **Stage 2 (Runtime):** Copies only the built files into Nginx

This approach:
- Reduces final image size (excludes node_modules, source code)
- Improves security (no build tools in production)
- Optimizes boot time

### Nginx Configuration

The included `nginx.conf` provides:
- **Gzip Compression:** Enabled for JS, CSS, JSON
- **Security Headers:** CORS, XSS Protection, Content Type Sniffing
- **Caching Strategy:**
  - Static assets (JS, CSS, images): 1-year cache
  - HTML files: No cache (revalidate on request)
- **SPA Routing:** All unmatched routes serve `index.html`

### Production Deployment

#### Option 1: Kubernetes (K8s)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: school-finance-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: school-finance-frontend
  template:
    metadata:
      labels:
        app: school-finance-frontend
    spec:
      containers:
      - name: frontend
        image: school-finance-frontend:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /index.html
            port: 80
          initialDelaySeconds: 40
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /index.html
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi
---
apiVersion: v1
kind: Service
metadata:
  name: school-finance-frontend-service
spec:
  selector:
    app: school-finance-frontend
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

#### Option 2: Docker Swarm

```bash
docker service create \
  --name school-finance-frontend \
  --publish 3000:80 \
  --replicas 3 \
  school-finance-frontend:latest
```

#### Option 3: Docker Compose with Backend

Uncomment the backend service in `docker-compose.yml` to run both frontend and backend:

```yaml
docker-compose up -d
```

### Environment Variables

The frontend is built with environment variables at compile time. To use different APIs in different environments, rebuild with:

```bash
VITE_API_BASE_URL=https://api.production.com docker build -t school-finance-frontend:prod .
```

Or update `.env` before building:

```bash
echo "VITE_API_BASE_URL=https://api.production.com" > .env
docker build -t school-finance-frontend:prod .
```

### Monitoring & Logs

#### View container stats:
```bash
docker stats school-finance-frontend
```

#### Check health status:
```bash
docker inspect --format='{{.State.Health.Status}}' school-finance-frontend
```

#### Stream logs:
```bash
docker-compose logs -f frontend
```

### Registry Push

Push to Docker Hub or private registry:

```bash
# Tag image
docker tag school-finance-frontend:latest myregistry.azurecr.io/school-finance-frontend:latest

# Push
docker push myregistry.azurecr.io/school-finance-frontend:latest
```

### Troubleshooting

**Container exits immediately:**
```bash
docker logs school-finance-frontend
# Check for Nginx config errors or health check failures
```

**Port already in use:**
```bash
docker-compose down
# Or use different port:
docker run -p 8080:80 school-finance-frontend:latest
```

**Performance issues:**
- Increase Nginx worker processes in `nginx.conf`
- Adjust container resource limits in `docker-compose.yml`
- Enable HTTP/2 in nginx.conf for better performance

### Updating the Application

1. Edit source code
2. Rebuild the image:
   ```bash
   docker build -t school-finance-frontend:latest .
   ```
3. Restart the container:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

Or use blue-green deployment for zero downtime:

```bash
# Build v2
docker build -t school-finance-frontend:v2 .

# Start new container
docker run -d --name school-finance-frontend-v2 -p 3001:80 school-finance-frontend:v2

# Test v2
curl http://localhost:3001

# Switch traffic
docker-compose down
docker run -d --name school-finance-frontend -p 3000:80 school-finance-frontend:v2
```

---

**Last Updated:** April 10, 2026  
**Maintainer:** School Finance System Team
