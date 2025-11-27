# Deployment Guide

This guide covers deploying the Bebe Portfolio application to production environments, including Vercel, custom servers, and future backend deployment.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Deploying to Vercel (Recommended)](#deploying-to-vercel-recommended)
4. [Alternative Deployment Options](#alternative-deployment-options)
5. [Custom Domain Setup](#custom-domain-setup)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Production Configuration](#production-configuration)
8. [Monitoring and Analytics](#monitoring-and-analytics)
9. [Future: Backend Deployment](#future-backend-deployment)
10. [Rollback Procedures](#rollback-procedures)
11. [Troubleshooting](#troubleshooting)

## Deployment Overview

### Current Architecture

```
┌─────────────────────────────────────────────┐
│           Vercel Edge Network               │
│  ┌───────────────────────────────────────┐  │
│  │  Next.js Application                  │  │
│  │  - Static Pages                       │  │
│  │  - API Routes (Serverless)            │  │
│  │  - Edge Functions                     │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Bunny CDN (Global)                │
│  - Media Storage                            │
│  - Image Optimization                       │
│  - Video Streaming                          │
└─────────────────────────────────────────────┘
```

### Deployment Strategy

- **Frontend:** Vercel (serverless, auto-scaling)
- **Media Storage:** Bunny CDN (global edge caching)
- **Future Backend:** Docker container on VPS/cloud

### Deployment Frequency

- **Development:** Continuous (on every push)
- **Production:** Manual or on merge to main branch
- **Hotfixes:** Immediate deployment

## Pre-Deployment Checklist

### Before Every Deployment

```bash
# 1. Run linter
npm run lint
# Fix any errors before deploying

# 2. Build locally
npm run build
# Ensure build succeeds without errors

# 3. Test production build locally
npm run start
# Open http://localhost:3000 and verify functionality

# 4. Check bundle size
npm run build
# Review .next/build-manifest.json for bundle sizes

# 5. Verify environment variables
# Ensure all required env vars are set in Vercel

# 6. Test on multiple devices
# Desktop, tablet, mobile

# 7. Check browser compatibility
# Chrome, Firefox, Safari, Edge

# 8. Review changes
git diff master
# Verify all changes are intentional
```

### Production Readiness Checklist

- [ ] All features tested
- [ ] No console errors
- [ ] Images optimized
- [ ] SEO meta tags added
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Security headers configured
- [ ] SSL/HTTPS enabled
- [ ] Backup plan ready

## Deploying to Vercel (Recommended)

### Why Vercel?

- **Optimized for Next.js:** Built by Next.js creators
- **Zero Config:** Automatic optimization
- **Global CDN:** Fast content delivery
- **Serverless Functions:** Auto-scaling API routes
- **Preview Deployments:** Test before production
- **Free Tier:** Good for MVP

### First-Time Setup

#### Step 1: Create Vercel Account

```bash
# Option 1: Use Vercel CLI
npm i -g vercel
vercel login

# Option 2: Use web dashboard
# Visit https://vercel.com/signup
# Sign up with GitLab account
```

#### Step 2: Connect Repository

**Via Vercel Dashboard:**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select **GitLab**
4. Authorize Vercel to access your GitLab
5. Select `sergii.kovalov88/bebe` repository
6. Click **Import**

**Via CLI:**

```bash
# From project directory
cd /path/to/bebe
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - What's your project's name? bebe-portfolio
# - In which directory is your code? ./
# - Want to override settings? No
```

#### Step 3: Configure Environment Variables

**Via Dashboard:**

1. Go to **Project Settings** > **Environment Variables**
2. Add each variable:

```bash
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME = your-zone-name
BUNNY_STORAGE_PASSWORD = your-password
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME = your-cdn.b-cdn.net
BUNNY_STORAGE_REGION = de
```

3. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

**Via CLI:**

```bash
# Add production environment variable
vercel env add NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME production
# Enter value when prompted

# Add to all environments
vercel env add BUNNY_STORAGE_PASSWORD production preview development
```

#### Step 4: Configure Build Settings

**Via Dashboard:**

1. Go to **Project Settings** > **Build & Development Settings**
2. Verify settings:
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Development Command: npm run dev
   ```

**Via vercel.json (Optional):**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

#### Step 5: Deploy

**Automatic Deployment:**

```bash
# Push to GitLab
git add .
git commit -m "feat: deploy to production"
git push origin master

# Vercel automatically detects push and deploys
# Check deployment status in Vercel dashboard
```

**Manual Deployment:**

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls
```

### Deployment Workflow

```
┌──────────────────────────────────────────────┐
│  Developer pushes to GitLab                  │
└──────────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Vercel detects commit via webhook           │
└──────────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Vercel clones repository                    │
└──────────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Install dependencies (npm install)          │
└──────────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Run build (npm run build)                   │
└──────────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Deploy to global edge network               │
└──────────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Generate preview URL or update production   │
└──────────────────────────────────────────────┘
```

### Preview Deployments

Every push to a non-production branch creates a preview deployment:

```bash
# Create feature branch
git checkout -b feature/new-gallery

# Make changes and push
git add .
git commit -m "feat: new gallery layout"
git push origin feature/new-gallery

# Vercel creates preview deployment
# URL: https://bebe-portfolio-abc123.vercel.app
```

Preview deployments are useful for:
- Testing features before production
- Sharing with stakeholders
- QA testing
- A/B testing

### Production Deployment

```bash
# Merge to master branch
git checkout master
git merge feature/new-gallery
git push origin master

# Vercel deploys to production
# URL: https://bebe-portfolio.vercel.app
# Or your custom domain: https://bebeportfolio.com
```

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Docker + VPS

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and deploy:**

```bash
# Build Docker image
docker build -t bebe-portfolio .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=your-zone \
  -e BUNNY_STORAGE_PASSWORD=your-password \
  bebe-portfolio

# Or use docker-compose
docker-compose up -d
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

### AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure
amplify configure

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Static Export (Limited Features)

For static hosting (no API routes):

```javascript
// next.config.mjs
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

export default nextConfig
```

```bash
# Build static files
npm run build

# Deploy to any static host (S3, GitHub Pages, etc.)
# Output in: out/
```

**Note:** Static export disables:
- API routes
- Server-side rendering
- Dynamic routes (without getStaticPaths)
- Image optimization

## Custom Domain Setup

### Vercel Custom Domain

#### Step 1: Add Domain

1. Go to **Project Settings** > **Domains**
2. Click **Add**
3. Enter domain: `bebeportfolio.com`
4. Click **Add**

#### Step 2: Configure DNS

Vercel provides DNS records to add to your domain registrar:

**Option A: Use Vercel Nameservers (Recommended)**

```
Nameservers:
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: CNAME Record**

```
Type: CNAME
Name: @ (or www)
Value: cname.vercel-dns.com
```

#### Step 3: Wait for Propagation

DNS changes can take up to 48 hours. Check status:

```bash
# Check DNS propagation
dig bebeportfolio.com

# Or use online tool
# https://www.whatsmydns.net/
```

#### Step 4: Enable SSL

Vercel automatically provisions SSL certificates via Let's Encrypt:

1. Go to **Project Settings** > **Domains**
2. Click domain name
3. Verify SSL status: **Active**

### Domain Configuration Examples

**Root domain:**

```
Domain: bebeportfolio.com
Type: A Record or CNAME
Value: cname.vercel-dns.com
```

**Subdomain:**

```
Domain: www.bebeportfolio.com
Type: CNAME
Value: cname.vercel-dns.com
```

**Both (with redirect):**

```
Primary: bebeportfolio.com
Redirect: www.bebeportfolio.com → bebeportfolio.com
```

## CI/CD Pipeline

### Vercel Built-in CI/CD

Vercel provides automatic CI/CD:

```
Git Push → Build → Test → Deploy
```

**Deployment triggers:**

- Push to `master` → Production deployment
- Push to feature branch → Preview deployment
- Pull request → Preview deployment with comment

### Custom GitHub Actions (Alternative)

**.github/workflows/deploy.yml:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitLab CI/CD

**.gitlab-ci.yml:**

```yaml
image: node:20

stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm run build

deploy_production:
  stage: deploy
  script:
    - npm i -g vercel
    - vercel --prod --token=$VERCEL_TOKEN
  only:
    - master
  environment:
    name: production
    url: https://bebeportfolio.com
```

## Production Configuration

### Environment-Specific Configuration

**next.config.mjs:**

```javascript
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // Compression
  compress: true,

  // Image optimization
  images: {
    domains: ['your-cdn.b-cdn.net'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ]
  }
}

export default nextConfig
```

### Performance Optimization

```javascript
// Enable SWC minification (default in Next.js 13+)
const nextConfig = {
  swcMinify: true,

  // Analyze bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      }
    }
    return config
  }
}
```

## Monitoring and Analytics

### Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to app/layout.js
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Google Analytics 4

```javascript
// app/layout.js
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs

# Configure
# Edit sentry.client.config.js and sentry.server.config.js
```

### Uptime Monitoring

Use services like:
- **UptimeRobot** (free)
- **Pingdom**
- **StatusCake**
- **Vercel Monitoring** (built-in)

## Future: Backend Deployment

### Go Backend Architecture (Phase 3+)

```
┌─────────────────────────────────────────────┐
│         Next.js Frontend (Vercel)           │
└─────────────────────────────────────────────┘
                    ↓ API calls
┌─────────────────────────────────────────────┐
│         Go Backend (Docker on VPS)          │
│  - Booking API                              │
│  - Calendar Integration                     │
│  - Email Service                            │
└─────────────────────────────────────────────┘
```

### Go Backend Dockerfile

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
```

### Deployment Options

**Option 1: DigitalOcean App Platform**

```bash
# Create app
doctl apps create --spec .do/app.yaml

# Deploy
doctl apps deploy <app-id>
```

**Option 2: Railway.app**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

**Option 3: Fly.io**

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch
fly launch

# Deploy
fly deploy
```

## Rollback Procedures

### Vercel Rollback

**Via Dashboard:**

1. Go to **Deployments**
2. Find previous successful deployment
3. Click **⋯** > **Promote to Production**
4. Confirm rollback

**Via CLI:**

```bash
# List deployments
vercel ls

# Promote specific deployment to production
vercel promote <deployment-url>
```

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin master

# Revert to specific commit
git revert <commit-hash>
git push origin master

# Hard reset (use with caution)
git reset --hard <commit-hash>
git push --force origin master
```

### Database Rollback (Future)

When database is added:

```bash
# Backup before deployment
pg_dump dbname > backup.sql

# Restore if needed
psql dbname < backup.sql
```

## Troubleshooting

### Build Failures

```bash
# Check build logs in Vercel dashboard
# Common issues:

# 1. Missing environment variables
# Solution: Add to Vercel project settings

# 2. npm install failures
# Solution: Delete package-lock.json and regenerate

# 3. Next.js build errors
# Solution: Run 'npm run build' locally to debug
```

### Deployment Errors

```bash
# Issue: 404 on custom domain
# Solution: Check DNS configuration
dig yourdomain.com

# Issue: SSL certificate error
# Solution: Wait for SSL provisioning (up to 24 hours)

# Issue: API routes not working
# Solution: Check app/api/ directory structure
```

### Performance Issues

```bash
# Check Vercel Analytics
# Dashboard > Analytics > Performance

# Use Lighthouse
npx lighthouse https://yourdomain.com --view

# Check Core Web Vitals
# https://pagespeed.web.dev/
```

### Environment Variable Issues

```bash
# Issue: Variables not loading
# Solution 1: Verify variables in Vercel settings
# Solution 2: Redeploy after adding variables
# Solution 3: Check variable names (NEXT_PUBLIC_ prefix)
```

## Deployment Checklist

### Pre-Launch Checklist

- [ ] All features complete and tested
- [ ] No console errors or warnings
- [ ] SEO metadata added (title, description, og:image)
- [ ] Favicon and app icons added
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Backup plan ready
- [ ] Monitoring alerts configured

### Post-Launch Checklist

- [ ] Verify site loads correctly
- [ ] Test all critical user flows
- [ ] Check analytics is tracking
- [ ] Verify custom domain works
- [ ] Test contact form (when implemented)
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test on mobile devices
- [ ] Verify SEO tags in source
- [ ] Submit sitemap to Google Search Console

## Related Documentation

- [Environment Setup](ENVIRONMENT_SETUP.md) - Environment configuration
- [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflows
- [Architecture](ARCHITECTURE.md) - System architecture

---

**Last Updated:** 2025-11-11
**Maintained by:** Bebe Portfolio Team
