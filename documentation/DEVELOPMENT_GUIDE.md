# Development Guide

This guide covers development workflows, coding standards, best practices, and common tasks for the Bebe Portfolio project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Git Workflow](#git-workflow)
5. [Common Tasks](#common-tasks)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Performance Optimization](#performance-optimization)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

```bash
# Required
Node.js >= 18.0.0
npm >= 9.0.0
Git

# Recommended
VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
```

### Initial Setup

```bash
# Clone repository
git clone https://gitlab.com/sergii.kovalov88/bebe.git
cd bebe

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### Verify Setup

```bash
# Check Node version
node --version  # Should be >= 18.0.0

# Check npm version
npm --version   # Should be >= 9.0.0

# Run linter
npm run lint

# Build project
npm run build
```

## Development Workflow

### Daily Workflow

```bash
# 1. Start development
git pull origin master
npm install  # If package.json changed
npm run dev

# 2. Make changes
# Edit files in your editor

# 3. Test changes
npm run lint
npm run build  # Ensure production build works

# 4. Commit changes
git add .
git commit -m "feat: add new feature"
git push origin master
```

### Hot Module Replacement (HMR)

Next.js automatically reloads when you save files:

- **Component changes:** Fast refresh (preserves state)
- **CSS changes:** Instant update
- **API route changes:** Requires manual refresh
- **Config changes:** Requires server restart

### Development Server Options

```bash
# Standard development
npm run dev

# Different port
npm run dev -- -p 3001

# Expose to network (for mobile testing)
npm run dev -- -H 0.0.0.0
```

## Coding Standards

### JavaScript/React Style

#### File Structure

```javascript
// 1. Imports (grouped)
'use client'  // If client component

import { useState, useEffect } from 'react'  // React
import { useDispatch, useSelector } from 'react-redux'  // Third-party
import { selectMedia } from '@/store/media/media.selector'  // Local
import styles from './Component.module.css'  // Styles

// 2. Component
export default function Component({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState(null)
  const dispatch = useDispatch()
  const data = useSelector(selectMedia)

  // Effects
  useEffect(() => {
    // Side effects
  }, [])

  // Handlers
  const handleClick = () => {
    // Handle click
  }

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

#### Naming Conventions

```javascript
// Components: PascalCase
function MediaComponent() {}

// Functions: camelCase
function fetchMediaData() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://...'

// Private functions: _camelCase (convention)
function _calculatePosition() {}

// Hooks: use prefix
function useMediaQuery() {}

// Event handlers: handle prefix
function handleClick() {}
function handleSubmit() {}
```

#### Code Organization

```javascript
// ✅ Good: Clear, single responsibility
function MediaCard({ media }) {
  return (
    <div className="card">
      <img src={media.url} alt={media.name} />
      <h3>{media.name}</h3>
    </div>
  )
}

// ❌ Bad: Too much logic in one component
function MediaCard({ media, onEdit, onDelete, onShare, fetchRelated }) {
  const [editing, setEditing] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [related, setRelated] = useState([])
  // Too many responsibilities...
}
```

### CSS Styling Standards

#### Tailwind CSS (Preferred)

```javascript
// ✅ Good: Utility classes
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
</div>

// ✅ Good: Responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>

// ❌ Avoid: Inline styles (unless dynamic)
<div style={{ padding: '1rem', background: 'gray' }}>
```

#### CSS Modules (For Complex Components)

```css
/* Component.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
}

.item {
  padding: 1rem;
  background: var(--color-background);
  border-radius: 8px;
  transition: transform 0.2s;
}

.item:hover {
  transform: scale(1.05);
}
```

```javascript
// Component.jsx
import styles from './Component.module.css'

<div className={styles.container}>
  <h2 className={styles.title}>Title</h2>
  <div className={styles.item}>Item</div>
</div>
```

### Redux Patterns

#### Action Types

```javascript
// media.types.js
export const FETCH_MEDIA_START = 'FETCH_MEDIA_START'
export const FETCH_MEDIA_SUCCESS = 'FETCH_MEDIA_SUCCESS'
export const FETCH_MEDIA_FAILURE = 'FETCH_MEDIA_FAILURE'
```

#### Actions (Thunks)

```javascript
// media.action.js
import { FETCH_MEDIA_START, FETCH_MEDIA_SUCCESS, FETCH_MEDIA_FAILURE } from './media.types'

export const fetchMediaStartAsync = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MEDIA_START })

    try {
      const response = await fetch('/api/media/main-photos')
      const data = await response.json()
      dispatch({ type: FETCH_MEDIA_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: FETCH_MEDIA_FAILURE, payload: error.message })
    }
  }
}
```

#### Reducers

```javascript
// media.reducer.js
import { FETCH_MEDIA_START, FETCH_MEDIA_SUCCESS, FETCH_MEDIA_FAILURE } from './media.types'

const INITIAL_STATE = {
  mediaMap: [],
  isLoading: false,
  error: null
}

export const mediaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_MEDIA_START:
      return { ...state, isLoading: true, error: null }

    case FETCH_MEDIA_SUCCESS:
      return { ...state, mediaMap: action.payload, isLoading: false }

    case FETCH_MEDIA_FAILURE:
      return { ...state, error: action.payload, isLoading: false }

    default:
      return state
  }
}
```

#### Selectors

```javascript
// media.selector.js
export const selectMediaMap = (state) => state.media.mediaMap
export const selectIsLoading = (state) => state.media.isLoading
export const selectError = (state) => state.media.error
```

### ESLint Rules

```javascript
// .eslintrc.json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "react/prop-types": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Comments and Documentation

```javascript
/**
 * Fetches media items from the API
 * @param {string} category - Category to filter by
 * @param {number} limit - Maximum number of items to return
 * @returns {Promise<MediaObject[]>} Array of media objects
 * @throws {Error} If API request fails
 */
async function fetchMedia(category, limit = 10) {
  // Validate parameters
  if (!category) {
    throw new Error('Category is required')
  }

  // Fetch data
  const response = await fetch(`/api/media/category-photos?category=${category}&limit=${limit}`)

  // Handle errors
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
```

## Git Workflow

### Branch Strategy

Currently using **trunk-based development** (all work on `master`).

```bash
# Standard workflow
git pull origin master
# Make changes
git add .
git commit -m "feat: add feature"
git push origin master
```

### Future: Feature Branch Workflow

When the team grows:

```bash
# Create feature branch
git checkout -b feature/new-gallery-layout

# Make changes and commit
git add .
git commit -m "feat: implement new gallery layout"

# Push to remote
git push origin feature/new-gallery-layout

# Create pull request on GitLab
# After review, merge to master
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting, no logic change)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Maintenance tasks (dependencies, config)
perf:     Performance improvements

# Examples
feat(gallery): add lightbox functionality
fix(slider): prevent overscroll on drag
docs(readme): update setup instructions
style(nav): format navigation component
refactor(api): simplify media fetching logic
test(slider): add unit tests for MediaContainer
chore(deps): update dependencies
perf(images): optimize image loading
```

### Example Commits

```bash
# Good commits
git commit -m "feat(booking): add calendar integration"
git commit -m "fix(slider): fix drag momentum calculation"
git commit -m "docs(api): document media endpoints"
git commit -m "refactor(redux): simplify media reducer"

# Bad commits (avoid these)
git commit -m "update"
git commit -m "fix bug"
git commit -m "WIP"
git commit -m "changes"
```

## Common Tasks

### Adding a New Page

```bash
# 1. Create page file
touch app/new-page/page.js

# 2. Add content
cat > app/new-page/page.js << 'EOF'
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  )
}
EOF

# 3. Add to navigation
# Edit components/navigation/Navigation.js
```

### Adding a New Component

```bash
# 1. Create component file
mkdir -p components/feature
touch components/feature/MyComponent.jsx

# 2. Create component
cat > components/feature/MyComponent.jsx << 'EOF'
'use client'

export default function MyComponent({ title }) {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  )
}
EOF

# 3. Use component
# Import in page: import MyComponent from '@/components/feature/MyComponent'
```

### Adding a New API Route

```bash
# 1. Create route file
mkdir -p app/api/my-endpoint
touch app/api/my-endpoint/route.js

# 2. Implement handler
cat > app/api/my-endpoint/route.js << 'EOF'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const data = { message: 'Hello' }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
EOF

# 3. Test endpoint
curl http://localhost:3000/api/my-endpoint
```

### Adding a Redux Slice

```bash
# 1. Create slice directory
mkdir -p store/feature

# 2. Create files
touch store/feature/feature.types.js
touch store/feature/feature.action.js
touch store/feature/feature.reducer.js
touch store/feature/feature.selector.js

# 3. Implement slice (see Redux Patterns above)

# 4. Add to root reducer
# Edit store/root-reducer.js
```

### Adding Media to Bunny CDN

```bash
# Using Bunny API (example with curl)
curl -X PUT "https://storage.bunnycdn.com/your-zone/main/photo.jpg" \
  -H "AccessKey: your-storage-password" \
  --data-binary "@photo.jpg"

# Or use Bunny web dashboard:
# 1. Go to https://dash.bunny.net/
# 2. Navigate to Storage > Your Zone
# 3. Upload files via web interface
```

### Running Production Build Locally

```bash
# Build production version
npm run build

# Start production server
npm run start

# Open browser
open http://localhost:3000
```

### Checking Bundle Size

```bash
# Build with bundle analysis
ANALYZE=true npm run build

# Or add to next.config.mjs:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# module.exports = withBundleAnalyzer(nextConfig)
```

## Testing

### Manual Testing Checklist

```bash
# Functionality
- [ ] Main slider drag and scroll works
- [ ] Keyboard navigation (arrow keys) works
- [ ] Gallery pages load correctly
- [ ] Navigation links work
- [ ] Mobile menu opens/closes
- [ ] Videos play correctly
- [ ] Images load and display

# Responsive Design
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

# Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

# Performance
- [ ] Page load time < 3 seconds
- [ ] Images load progressively
- [ ] Smooth animations (60fps)
- [ ] No console errors
```

### Unit Testing (Future)

Setup with Jest and React Testing Library:

```bash
# Install dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

Example test:

```javascript
// MediaComponent.test.jsx
import { render, screen } from '@testing-library/react'
import MediaComponent from './MediaComponent'

describe('MediaComponent', () => {
  it('renders media items', () => {
    const media = [{ id: '1', name: 'Photo 1', url: '...' }]
    render(<MediaComponent media={media} />)

    expect(screen.getByText('Photo 1')).toBeInTheDocument()
  })
})
```

### E2E Testing (Future)

Setup with Playwright:

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

## Debugging

### Development Tools

#### React DevTools

```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/...
# Firefox: https://addons.mozilla.org/firefox/addon/react-devtools/

# Use in browser:
# 1. Open DevTools (F12)
# 2. Click "Components" tab
# 3. Inspect component tree and props
```

#### Redux DevTools

```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore/detail/redux-devtools/...

# Use in browser:
# 1. Open DevTools (F12)
# 2. Click "Redux" tab
# 3. Inspect actions and state changes
```

### Console Debugging

```javascript
// Debug component props
function MyComponent(props) {
  console.log('Props:', props)
  return <div>...</div>
}

// Debug Redux actions
dispatch(fetchMediaStartAsync())
console.log('Dispatched fetchMediaStartAsync')

// Debug API calls
fetch('/api/media/main-photos')
  .then(r => {
    console.log('Response:', r)
    return r.json()
  })
  .then(data => console.log('Data:', data))
```

### Common Issues

#### Issue: "Module not found"

```bash
# Solution: Check import path
# Wrong:
import Component from 'components/Component'

# Correct:
import Component from '@/components/Component'
```

#### Issue: "Hydration error"

```bash
# Cause: Server and client render different content
# Solution: Use 'use client' directive or ensure consistent rendering

'use client'  // Add this at top of file
```

#### Issue: "Cannot read property of undefined"

```bash
# Solution: Add optional chaining
// Wrong:
const name = data.user.name

// Correct:
const name = data?.user?.name
```

#### Issue: API route not working

```bash
# Check:
1. File is in app/api/ directory
2. File is named route.js
3. Exports GET/POST function
4. Server restarted after creating file
```

## Performance Optimization

### Image Optimization

```javascript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/photo.jpg"
  alt="Photo"
  width={1920}
  height={1080}
  loading="lazy"
  priority={false}  // Set to true for above-fold images
/>
```

### Code Splitting

```javascript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false
})
```

### Memoization

```javascript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const MediaItem = memo(function MediaItem({ item }) {
  return <div>{item.name}</div>
})

// Memoize calculations
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
)

// Memoize callbacks
const handleClick = useCallback(
  (id) => dispatch(selectItem(id)),
  [dispatch]
)
```

### Bundle Size Optimization

```bash
# Analyze bundle
npm run build
# Check .next/analyze/ for bundle report

# Remove unused dependencies
npm uninstall unused-package

# Use dynamic imports for large libraries
const HeavyLibrary = dynamic(() => import('heavy-library'))
```

## Troubleshooting

### Development Server Won't Start

```bash
# Check if port is in use
lsof -i :3000
kill -9 <PID>

# Clear Next.js cache
rm -rf .next
npm run dev

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# Check for ESLint errors
npm run lint

# Check for TypeScript errors (if using TS)
npx tsc --noEmit
```

### Git Issues

```bash
# Discard local changes
git reset --hard HEAD

# Pull latest changes
git pull origin master

# Resolve merge conflicts
git status
# Edit conflicted files
git add .
git commit
```

### Environment Variables Not Working

```bash
# Check file name (must be .env.local)
ls -la | grep env

# Restart dev server after changing env vars
# Ctrl+C to stop
npm run dev

# Verify variables are loaded
# Add console.log(process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME)
```

## Getting Help

### Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Redux Toolkit:** https://redux-toolkit.js.org
- **Tailwind CSS:** https://tailwindcss.com/docs

### Project Documentation

- [Quick Start](QUICK_START.md)
- [Architecture](ARCHITECTURE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Component Guide](COMPONENT_GUIDE.md)

### Contact

- **GitLab Issues:** https://gitlab.com/sergii.kovalov88/bebe/issues
- **Project Lead:** [Add contact info]

---

**Last Updated:** 2025-11-11
**Maintained by:** Bebe Portfolio Team
