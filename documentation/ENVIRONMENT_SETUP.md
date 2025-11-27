# Environment Setup Guide

This guide covers setting up your development environment, configuring environment variables, and managing secrets for the Bebe Portfolio project.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Development Tools](#development-tools)
3. [Environment Variables](#environment-variables)
4. [Bunny CDN Configuration](#bunny-cdn-configuration)
5. [Firebase Configuration (Legacy)](#firebase-configuration-legacy)
6. [Local Development Setup](#local-development-setup)
7. [Production Environment](#production-environment)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

```
Operating System: macOS, Linux, or Windows 10+
Node.js: >= 18.0.0
npm: >= 9.0.0
RAM: 4GB minimum (8GB recommended)
Storage: 2GB free space
```

### Recommended Setup

```
Operating System: macOS or Linux
Node.js: 20.x LTS
npm: 10.x
RAM: 16GB
Storage: 10GB free space
SSD: Recommended for faster builds
```

### Check Your System

```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version
npm --version
# Should output: 9.0.0 or higher

# Check Git version
git --version
# Should output: git version 2.x.x or higher
```

### Installing Node.js

#### macOS (using Homebrew)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20

# Verify installation
node --version
npm --version
```

#### macOS/Linux (using nvm)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc

# Install Node.js
nvm install 20
nvm use 20

# Verify installation
node --version
```

#### Windows

Download and install from [nodejs.org](https://nodejs.org/)

## Development Tools

### Required Tools

#### 1. Git

```bash
# macOS (with Homebrew)
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get install git

# Windows
# Download from https://git-scm.com/download/win
```

#### 2. Code Editor

**VS Code (Recommended)**

```bash
# macOS
brew install --cask visual-studio-code

# Or download from https://code.visualstudio.com/
```

**Required VS Code Extensions:**

```bash
# Install via VS Code Extension Marketplace:
- ESLint (dbaeumer.vscode-eslint)
- Prettier - Code formatter (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- ES7+ React/Redux/React-Native snippets (dsznajder.es7-react-js-snippets)

# Or install via command line:
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
```

### Optional Tools

#### Browser Developer Tools

- **Chrome DevTools:** Built into Chrome
- **React Developer Tools:** [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/)
- **Redux DevTools:** [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/)

#### API Testing

- **Postman:** [Download](https://www.postman.com/downloads/)
- **Insomnia:** [Download](https://insomnia.rest/download)
- **curl:** Command-line tool (usually pre-installed)

#### Git GUI (Optional)

- **GitKraken:** [Download](https://www.gitkraken.com/)
- **SourceTree:** [Download](https://www.sourcetreeapp.com/)
- **GitHub Desktop:** [Download](https://desktop.github.com/)

## Environment Variables

### Overview

Environment variables store sensitive configuration like API keys and secrets. Never commit these to Git.

### Environment Files

```
.env.local          # Local development (gitignored)
.env.local.example  # Template (committed to Git)
.env.production     # Production (on hosting platform)
```

### Creating Your .env.local File

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your credentials
nano .env.local
# or
code .env.local
```

### Required Environment Variables

#### Current Variables (Bunny CDN)

```bash
# .env.local

# Bunny CDN Storage Configuration
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=your-storage-zone-name
BUNNY_STORAGE_PASSWORD=your-storage-password
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=your-cdn-hostname.b-cdn.net
BUNNY_STORAGE_REGION=de  # or ny, la, sg, etc.

# Optional: For private file sharing (future feature)
BUNNY_TOKEN_KEY=your-token-signing-key
```

#### Legacy Variables (Firebase - being phased out)

```bash
# Firebase Configuration (legacy - not required for new setup)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Variable Naming Conventions

- `NEXT_PUBLIC_*` - Exposed to browser (client-side)
- No prefix - Server-side only (never exposed to browser)

**Example:**

```bash
# ✅ Client-side (safe to expose)
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=cdn.example.com

# ✅ Server-side only (secure)
BUNNY_STORAGE_PASSWORD=secret123

# ❌ Wrong - password exposed to client
NEXT_PUBLIC_BUNNY_STORAGE_PASSWORD=secret123
```

### Complete .env.local Template

```bash
# ==================================
# Bunny CDN Configuration (Current)
# ==================================

# Storage zone name (find in Bunny dashboard)
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=bebe-portfolio

# Storage password (keep secret!)
BUNNY_STORAGE_PASSWORD=your-storage-password-here

# CDN hostname (your-zone.b-cdn.net)
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=bebe-portfolio.b-cdn.net

# Storage region (de, ny, la, sg, uk, etc.)
BUNNY_STORAGE_REGION=de

# Token signing key for private files (optional)
# BUNNY_TOKEN_KEY=your-secret-token-key


# ==================================
# Firebase (Legacy - Optional)
# ==================================

# Only needed if using legacy Firebase features
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# NEXT_PUBLIC_FIREBASE_APP_ID=
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=


# ==================================
# Future Configuration (Phase 3+)
# ==================================

# Google Calendar API (when booking system is implemented)
# GOOGLE_CALENDAR_CLIENT_ID=
# GOOGLE_CALENDAR_CLIENT_SECRET=
# GOOGLE_CALENDAR_REDIRECT_URI=

# Email Service (SendGrid, Mailgun, etc.)
# EMAIL_SERVICE_API_KEY=
# EMAIL_FROM_ADDRESS=

# Database (if needed)
# DATABASE_URL=
```

## Bunny CDN Configuration

### Step 1: Create Bunny Account

1. Go to [bunny.net](https://bunny.net)
2. Click "Sign Up"
3. Complete registration
4. Verify email

### Step 2: Create Storage Zone

1. Log into [Bunny Dashboard](https://dash.bunny.net/)
2. Navigate to **Storage** > **Add Storage Zone**
3. Configure:
   - **Name:** `bebe-portfolio` (or your preferred name)
   - **Region:** `DE - Falkenstein` (or closest to your users)
   - **Replication:** Off (to save costs)
4. Click **Add Storage Zone**

### Step 3: Get Storage Credentials

After creating the storage zone:

```bash
# Storage Zone Name
# Found at: Storage > Your Zone > Name
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=bebe-portfolio

# Storage Password
# Found at: Storage > Your Zone > FTP & API Access > Password
BUNNY_STORAGE_PASSWORD=abc123-def456-ghi789

# Storage Region
# Found at: Storage > Your Zone > Region
BUNNY_STORAGE_REGION=de
```

### Step 4: Create Pull Zone (CDN)

1. Navigate to **CDN** > **Add Pull Zone**
2. Configure:
   - **Name:** `bebe-portfolio-cdn`
   - **Origin Type:** Storage Zone
   - **Storage Zone:** Select your storage zone
3. Click **Add Pull Zone**

### Step 5: Get CDN Hostname

```bash
# CDN Hostname
# Found at: CDN > Your Pull Zone > Hostname
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=bebe-portfolio-cdn.b-cdn.net

# Or use custom domain (optional)
# NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=cdn.yourdomain.com
```

### Step 6: Verify Configuration

```bash
# Test API access
curl -X GET "https://storage.bunnycdn.com/$NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME/" \
  -H "AccessKey: $BUNNY_STORAGE_PASSWORD"

# Should return JSON list of files (or empty array)
```

### Step 7: Upload Test File

```bash
# Upload test image
curl -X PUT "https://storage.bunnycdn.com/$NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME/test.jpg" \
  -H "AccessKey: $BUNNY_STORAGE_PASSWORD" \
  --data-binary "@path/to/test.jpg"

# Access via CDN
# Open: https://$NEXT_PUBLIC_BUNNY_CDN_HOSTNAME/test.jpg
```

For detailed setup instructions, see [BUNNY_SETUP_GUIDE.md](BUNNY_SETUP_GUIDE.md).

## Firebase Configuration (Legacy)

Only needed if you're maintaining legacy Firebase features.

### Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new one)
3. Click **Settings** (gear icon) > **Project settings**
4. Scroll to **Your apps** > Select Web App
5. Copy configuration values to `.env.local`

### Firebase Config Example

```javascript
// Firebase config object (for reference)
{
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "bebe-portfolio.firebaseapp.com",
  projectId: "bebe-portfolio",
  storageBucket: "bebe-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
}
```

## Local Development Setup

### Complete Setup Steps

```bash
# 1. Clone repository
git clone https://gitlab.com/sergii.kovalov88/bebe.git
cd bebe

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local

# 4. Edit environment file with your credentials
code .env.local
# Add your Bunny CDN credentials

# 5. Verify environment variables
node -e "console.log(process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME)"
# Should output your CDN hostname

# 6. Start development server
npm run dev

# 7. Open browser
open http://localhost:3000

# 8. Verify setup
# - Homepage should load
# - Media should display from Bunny CDN
# - No console errors
```

### Verify Environment Variables Are Loaded

```javascript
// Add to any component temporarily
console.log('Bunny CDN:', process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME)
// Should log your CDN hostname

// Server-side only variables
console.log('Storage Password:', process.env.BUNNY_STORAGE_PASSWORD)
// Should log 'undefined' in browser console (correct - server-side only)
```

## Production Environment

### Vercel Setup

#### 1. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitLab account
3. Import your repository

#### 2. Configure Environment Variables

1. Go to **Project Settings** > **Environment Variables**
2. Add all variables from `.env.local`:

```bash
# Add each variable:
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME = bebe-portfolio
BUNNY_STORAGE_PASSWORD = your-password
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME = bebe-portfolio.b-cdn.net
BUNNY_STORAGE_REGION = de
```

3. Set environment: **Production**, **Preview**, **Development**

#### 3. Deploy

```bash
# Automatic deployment on git push
git push origin master

# Or manual deployment via Vercel dashboard
# Click "Deploy" button
```

### Custom Domain (Optional)

1. Go to **Project Settings** > **Domains**
2. Add your domain: `bebeportfolio.com`
3. Update DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48 hours)

## Security Best Practices

### Never Commit Secrets

```bash
# ✅ Good - .env.local is in .gitignore
.env.local

# ❌ Bad - committing secrets to Git
git add .env.local  # DON'T DO THIS!
```

### Check .gitignore

```bash
# Verify .env.local is ignored
cat .gitignore | grep env

# Should show:
# .env*.local
```

### Rotate Secrets Regularly

```bash
# Bunny CDN Storage Password
# 1. Generate new password in Bunny dashboard
# 2. Update .env.local
# 3. Update Vercel environment variables
# 4. Redeploy

# Repeat every 3-6 months
```

### Use Strong Passwords

```bash
# ✅ Good password
BUNNY_STORAGE_PASSWORD=aB3!xYz9#mNp2@qWe5

# ❌ Weak password
BUNNY_STORAGE_PASSWORD=password123
```

### Restrict API Access

```bash
# Bunny CDN: Restrict by IP (optional)
# Dashboard > Storage > Your Zone > Security > Allowed Referrers
# Add: yourdomain.com

# Or use signed URLs for private content
```

## Troubleshooting

### Issue: Environment Variables Not Loading

```bash
# Solution 1: Check file name
ls -la | grep env
# Must be named .env.local (not .env or env.local)

# Solution 2: Restart dev server
# Stop server: Ctrl+C
npm run dev

# Solution 3: Verify syntax
# No spaces around =
# Correct: KEY=value
# Wrong:   KEY = value
```

### Issue: "Module not found" Error

```bash
# Solution: Install dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Bunny CDN Not Working

```bash
# Verify credentials
curl -X GET "https://storage.bunnycdn.com/$NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME/" \
  -H "AccessKey: $BUNNY_STORAGE_PASSWORD"

# Check response:
# ✅ Success: Returns JSON array
# ❌ Error 401: Wrong password
# ❌ Error 404: Wrong zone name
```

### Issue: Variables Not Updating

```bash
# In Vercel:
# 1. Update environment variable
# 2. Trigger new deployment
# 3. Wait for deployment to complete

# Locally:
# 1. Edit .env.local
# 2. Restart dev server (npm run dev)
```

### Issue: CORS Errors

```bash
# Check Bunny CDN settings:
# Dashboard > CDN > Your Pull Zone > CORS
# Add allowed origins:
# - http://localhost:3000
# - https://yourdomain.com
```

## Environment Variable Reference

### Quick Reference Table

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME` | Public | Yes | Storage zone name |
| `BUNNY_STORAGE_PASSWORD` | Secret | Yes | Storage API password |
| `NEXT_PUBLIC_BUNNY_CDN_HOSTNAME` | Public | Yes | CDN hostname |
| `BUNNY_STORAGE_REGION` | Secret | Yes | Storage region code |
| `BUNNY_TOKEN_KEY` | Secret | No | Token signing key |

### Getting Values

```bash
# Storage Zone Name
# Bunny Dashboard > Storage > Your Zone > Name

# Storage Password
# Bunny Dashboard > Storage > Your Zone > FTP & API Access

# CDN Hostname
# Bunny Dashboard > CDN > Your Pull Zone > Hostname

# Storage Region
# Bunny Dashboard > Storage > Your Zone > Region
# de = Germany, ny = New York, la = Los Angeles, etc.
```

## Related Documentation

- [Bunny Setup Guide](BUNNY_SETUP_GUIDE.md) - Detailed Bunny CDN setup
- [Quick Start Guide](QUICK_START.md) - Getting started quickly
- [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflows
- [Deployment Guide](DEPLOYMENT.md) - Deployment instructions

---

**Last Updated:** 2025-11-11
**Maintained by:** Bebe Portfolio Team
