# System Architecture

This document describes the system architecture, design patterns, and technical decisions for the Bebe Portfolio application.

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [State Management](#state-management)
4. [Media Storage Architecture](#media-storage-architecture)
5. [API Layer](#api-layer)
6. [Component Architecture](#component-architecture)
7. [Animation System](#animation-system)
8. [Data Flow](#data-flow)
9. [Design Patterns](#design-patterns)
10. [Future Architecture](#future-architecture)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Next.js Frontend (React 18)                  │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Pages     │  │  Components  │  │Redux Store  │  │  │
│  │  │ (App Router)│  │  (React)     │  │  (RTK)      │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Serverless)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/media/*  (Media fetching endpoints)           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│              Bunny CDN Storage (S3-compatible)               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Media Files: /main/, /video/, /photo/              │   │
│  │  Region: DE (Germany)                                │   │
│  │  Global CDN Edge Caching                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Future Architecture (Phase 3+):
┌─────────────────────────────────────────────────────────────┐
│               Go Backend Server (Planned)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  - Booking System                                    │   │
│  │  - Google Calendar API Integration                   │   │
│  │  - Email Service Integration                         │   │
│  │  - Contact Form Processing                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack

- **Framework:** Next.js 14 with App Router
- **UI Library:** React 18.3 (functional components + hooks)
- **State Management:** Redux Toolkit + Redux Persist
- **Styling:** Tailwind CSS (utility-first) + Emotion (CSS-in-JS)
- **Animations:** React Spring (physics-based) + @use-gesture/react

### App Router Structure

```
app/
├── layout.js                 # Root layout with Redux Provider
├── page.js                   # Main landing page (/)
├── globals.css              # Global styles
├── about/page.js            # About page
├── book/page.js             # Booking page (stub)
├── contact/page.js          # Contact form
├── gallery/page.js          # Photo gallery
├── video_gallery/page.js    # Video gallery
├── portfolio/page.js        # Portfolio overview
├── cost/page.js             # Cost/pricing page
├── not-found.js             # 404 error page
└── api/media/               # API routes
    ├── main-photos/route.js
    ├── main-videos/route.js
    ├── video-categories/route.js
    ├── category-photos/route.js
    └── category-videos/route.js
```

### Directory Structure Rationale

- **App Router:** Chosen for better performance, streaming SSR, and React Server Components support
- **API Routes:** Keeps API credentials secure (server-side only)
- **Nested Layouts:** Shared layouts reduce duplication
- **File-based Routing:** Intuitive structure that matches URLs

## State Management

### Redux Architecture

```
store/
├── store.js              # Redux store configuration
├── root-reducer.js       # Combines all slice reducers
├── media/                # Main slider media slice
│   ├── media.types.js    # Action type constants
│   ├── media.action.js   # Async thunks
│   ├── media.reducer.js  # Reducer logic
│   └── media.selector.js # State selectors
├── photos/               # Photo categories slice
│   └── [same structure]
└── videos/               # Video categories slice
    └── [same structure]
```

### State Shape

```javascript
{
  media: {
    mediaMap: [],           // Main slider media items
    isLoading: false,       // Loading state
    error: null            // Error state
  },
  photos: {
    photosMap: [],         // Photo categories
    categoryPhotos: {},    // Photos by category
    isLoading: false,
    error: null
  },
  videos: {
    videosMap: [],         // Video categories
    categoryVideos: {},    // Videos by category
    isLoading: false,
    error: null
  }
}
```

### Redux Persist

- **Storage:** localStorage
- **Whitelist:** media, photos, videos
- **Purpose:** Caches media data to reduce API calls
- **Rehydration:** Automatic on page load

### Why Redux Toolkit?

1. **Less Boilerplate:** createSlice reduces code
2. **Immer Integration:** Simpler immutable updates
3. **DevTools:** Built-in Redux DevTools support
4. **TypeScript Ready:** Better type inference
5. **Async Handling:** createAsyncThunk for API calls

## Media Storage Architecture

### Bunny CDN Storage

```
Bunny Storage Zone: [your-zone]
Region: DE (Germany)
CDN: Global edge caching

Directory Structure:
/main/                    # Main slider media
  ├── photo1.jpg
  ├── photo2.jpg
  └── video1.mp4
/video/                   # Video categories
  ├── wedding/
  │   └── video1.mp4
  └── commercial/
      └── video2.mp4
/photo/                   # Photo categories
  ├── wedding/
  │   └── photo1.jpg
  └── portrait/
      └── photo2.jpg
```

### Storage Abstraction Layer

File: [utils/bunny.utils.js](../utils/bunny.utils.js)

```javascript
// Core functions
listFiles(folderPath)              // List files in folder
uploadFile(file, path)             // Upload file
deleteFile(path)                   // Delete file
getSignedUrl(path, expiresIn)      // Generate signed URL
getOptimizedImageUrl(path, options) // Image optimization
```

### Why Bunny CDN?

1. **Cost:** $0.015/GB storage vs Firebase $0.026/GB
2. **Bandwidth:** Zero egress fees with CDN
3. **Performance:** Global CDN edge caching
4. **API:** S3-compatible REST API
5. **Features:** Image optimization, video streaming

See [MEDIA_STORAGE_ANALYSIS.md](MEDIA_STORAGE_ANALYSIS.md) for detailed comparison.

## API Layer

### API Routes Architecture

All API routes are serverless functions deployed on Vercel Edge Network.

#### Media API Endpoints

1. **GET /api/media/main-photos**
   - Returns: Main slider photos
   - Source: Bunny CDN `/main/` folder
   - Format: JSON array of media objects

2. **GET /api/media/main-videos**
   - Returns: Main slider videos
   - Source: Bunny CDN `/main/` folder
   - Format: JSON array of media objects

3. **GET /api/media/video-categories**
   - Returns: Video category thumbnails
   - Source: Bunny CDN `/video/` subfolders
   - Format: JSON array of categories

4. **GET /api/media/category-photos?category={name}**
   - Returns: Photos in specific category
   - Source: Bunny CDN `/photo/{category}/`
   - Format: JSON array of photo objects

5. **GET /api/media/category-videos?category={name}**
   - Returns: Videos in specific category
   - Source: Bunny CDN `/video/{category}/`
   - Format: JSON array of video objects

### API Response Format

```javascript
// Media object structure
{
  id: string,              // Unique identifier
  name: string,            // Display name
  url: string,             // CDN URL
  thumbnail: string,       // Thumbnail URL (videos)
  type: 'photo' | 'video', // Media type
  category: string,        // Category name
  width: number,           // Original width
  height: number,          // Original height
  size: number            // File size in bytes
}
```

### Error Handling

```javascript
// Error response format
{
  error: string,           // Error message
  code: string,            // Error code
  details: object          // Additional error details
}
```

## Component Architecture

### Component Hierarchy

```
App (layout.js)
├── Navigation
├── Page (route-specific)
│   └── Main Page (page.js)
│       └── MediaComponent
│           └── MediaContainerAnimated
│               ├── ImageComponent
│               ├── Video.component
│               └── MediaNameComponent
```

### Component Categories

#### 1. Page Components
- Location: `app/*/page.js`
- Purpose: Route-level components
- Pattern: "use client" directive for interactivity

#### 2. Feature Components
- Location: `components/{feature}/`
- Examples: MediaContainerAnimated, PhotosContainer
- Purpose: Complex, feature-specific logic

#### 3. UI Components
- Location: `components/navigation/`, `components/helpers/`
- Examples: Navigation, Spinner, Toast
- Purpose: Reusable UI elements

#### 4. Layout Components
- Location: `app/layout.js`
- Purpose: Shared layouts with Redux Provider

### Component Design Principles

1. **Single Responsibility:** Each component has one clear purpose
2. **Composition:** Build complex UIs from simple components
3. **Reusability:** Generic components in `components/helpers/`
4. **State Lifting:** Lift state to common ancestor
5. **Performance:** Use React.memo() for expensive renders

## Animation System

### Animation Stack

- **React Spring:** Physics-based animations
- **@use-gesture/react:** Touch/mouse gestures
- **RAF Throttling:** Performance optimization

### Animation Architecture

File: [components/home/MediaContainerAnimated.jsx](../components/home/MediaContainerAnimated.jsx:1)

```javascript
// Core animation hooks
const [{ x }, api] = useSpring(() => ({
  x: 0,
  config: { tension: 300, friction: 30 }
}))

// Gesture binding
const bind = useDrag(({ down, movement, velocity }) => {
  // Drag logic with velocity-based momentum
  api.start({
    x: calculateNewX(movement, velocity),
    immediate: down
  })
})

// RAF throttling for scroll performance
const throttledScroll = useCallback(
  throttle((event) => {
    // Scroll handling
  }, 16), // ~60fps
  []
)
```

### Animation Patterns

1. **Spring-based Movement:** Smooth, natural motion
2. **Gesture Detection:** Touch and mouse support
3. **Velocity Tracking:** Momentum scrolling
4. **Bounds Checking:** Prevent overscroll
5. **RAF Throttling:** Maintain 60fps

### Performance Optimizations

- RequestAnimationFrame for smooth animations
- Throttling scroll events (16ms = ~60fps)
- CSS transforms (GPU-accelerated)
- Will-change hints for animated properties
- Avoid layout thrashing

## Data Flow

### Data Fetching Flow

```
User Action
    ↓
Redux Thunk Action
    ↓
API Route Call (Next.js serverless)
    ↓
Bunny CDN API
    ↓
Response → Redux Store
    ↓
Component Re-render (via useSelector)
    ↓
UI Update
```

### Example: Loading Main Slider Media

```javascript
// 1. Component dispatches action
dispatch(fetchMediaStartAsync())

// 2. Thunk makes API call
const response = await fetch('/api/media/main-photos')

// 3. API route fetches from Bunny
const files = await listFiles('/main/')

// 4. Response updates Redux store
dispatch(fetchMediaSuccess(files))

// 5. Component receives update
const mediaMap = useSelector(selectMediaMap)
```

### Caching Strategy

1. **Redux Persist:** Caches state in localStorage
2. **Bunny CDN:** Global edge caching (1 hour default)
3. **Browser Cache:** Standard HTTP caching headers
4. **Future:** Consider React Query for advanced caching

## Design Patterns

### 1. Container/Presentational Pattern

```javascript
// Container (smart component)
const MediaComponent = () => {
  const dispatch = useDispatch()
  const media = useSelector(selectMediaMap)

  useEffect(() => {
    dispatch(fetchMediaStartAsync())
  }, [])

  return <MediaContainerAnimated media={media} />
}

// Presentational (dumb component)
const MediaContainerAnimated = ({ media }) => {
  // Just renders, no data fetching
  return <div>{media.map(...)}</div>
}
```

### 2. Facade Pattern (Storage Abstraction)

```javascript
// bunny.utils.js provides unified interface
export const listFiles = async (path) => {
  // Implementation details hidden
}

// Easy to swap storage providers
```

### 3. Observer Pattern (Redux)

```javascript
// Components subscribe to state changes
const media = useSelector(selectMediaMap)

// Auto re-render on state updates
```

### 4. Factory Pattern (Component Creation)

```javascript
// MediaContainerAnimated creates appropriate components
{media.map(item =>
  item.type === 'photo'
    ? <ImageComponent {...item} />
    : <Video.component {...item} />
)}
```

### 5. HOC Pattern (Redux Provider)

```javascript
// layout.js wraps app with provider
export default function RootLayout({ children }) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}
```

## Future Architecture

### Phase 3: Backend Server (Go)

```
┌─────────────────────────────────────────┐
│          Go Backend Server              │
│  ┌───────────────────────────────────┐  │
│  │  REST API Endpoints               │  │
│  │  - POST /api/booking              │  │
│  │  - POST /api/contact              │  │
│  │  - GET  /api/calendar/availability│  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Services                         │  │
│  │  - Calendar Service               │  │
│  │  - Email Service                  │  │
│  │  - Booking Service                │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Integrations                     │  │
│  │  - Google Calendar API            │  │
│  │  - SendGrid/Mailgun               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Why Go for Backend?

1. **Performance:** Fast execution, low memory
2. **Concurrency:** Built-in goroutines
3. **Deployment:** Single binary, easy Docker
4. **Standard Library:** HTTP server, JSON, etc.
5. **Learning:** Good language to learn

### Integration Architecture

```
Next.js Frontend
    ↓ (API calls)
Go Backend
    ↓ (OAuth2)
Google Calendar API
    ↓ (availability, create events)
Calendar Updates
```

### Database Architecture (Future)

If needed for bookings:

```
PostgreSQL/MySQL
├── users
├── bookings
│   ├── id
│   ├── user_id
│   ├── date
│   ├── time
│   ├── service_type
│   ├── status
│   └── calendar_event_id
├── services
└── availability
```

## Security Considerations

### Current

1. **API Credentials:** Stored in environment variables
2. **Server-side API Calls:** API routes hide credentials
3. **HTTPS Only:** Enforced by Vercel
4. **No Authentication:** Public portfolio (no user accounts)

### Future

1. **Authentication:** JWT tokens for booking system
2. **Rate Limiting:** Prevent API abuse
3. **Input Validation:** Sanitize all user input
4. **CSRF Protection:** For form submissions
5. **Signed URLs:** For private media files

## Performance Considerations

### Current Optimizations

1. **Code Splitting:** Automatic with Next.js
2. **Image Optimization:** Next/Image + Bunny CDN
3. **Edge Caching:** Bunny CDN global cache
4. **Redux Persist:** Reduce API calls
5. **RAF Throttling:** Smooth animations

### Future Optimizations

1. **Lazy Loading:** Load images on scroll
2. **Video Streaming:** HLS/DASH adaptive streaming
3. **Service Worker:** Offline support
4. **Bundle Analysis:** Reduce JavaScript size
5. **Critical CSS:** Inline above-fold styles

## Scalability

### Current Scale

- **Traffic:** Small (portfolio site)
- **Storage:** ~1-10 GB media files
- **API Calls:** Low frequency (cached)

### Future Scale Considerations

1. **CDN:** Already using global CDN
2. **Serverless:** Auto-scales with Next.js
3. **Database:** Connection pooling if needed
4. **Caching:** Redis for session/data caching
5. **Load Balancing:** Handled by Vercel/hosting

## Monitoring & Observability

### Current

- Vercel Analytics (basic)
- Browser console errors

### Future

1. **Error Tracking:** Sentry or similar
2. **Performance Monitoring:** Web Vitals
3. **API Monitoring:** Uptime checks
4. **Logging:** Structured logging
5. **Metrics:** Custom metrics dashboard

## Conclusion

This architecture provides a solid foundation for the Bebe Portfolio application. The use of modern technologies like Next.js 14, Redux Toolkit, and Bunny CDN ensures good performance, maintainability, and scalability.

Key architectural decisions:
- **Next.js App Router:** Modern, performant routing
- **Redux Toolkit:** Predictable state management
- **Bunny CDN:** Cost-effective, fast media delivery
- **Component-based:** Reusable, maintainable UI
- **Serverless:** Auto-scaling, low maintenance

As the project grows, the architecture can evolve to accommodate new features while maintaining these core principles.

---

**Last Updated:** 2025-11-11
**Related Documents:**
- [API Documentation](API_DOCUMENTATION.md)
- [Component Guide](COMPONENT_GUIDE.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
