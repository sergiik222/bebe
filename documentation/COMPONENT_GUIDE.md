# Component Guide

This guide documents all React components in the Bebe Portfolio application, their props, usage patterns, and best practices.

## Table of Contents

1. [Component Organization](#component-organization)
2. [Home Components](#home-components)
3. [Portfolio Components](#portfolio-components)
4. [Navigation Components](#navigation-components)
5. [Helper Components](#helper-components)
6. [Creating New Components](#creating-new-components)
7. [Component Patterns](#component-patterns)
8. [Styling Guide](#styling-guide)
9. [Performance Best Practices](#performance-best-practices)

## Component Organization

```
components/
├── home/                 # Main landing page components
│   ├── MediaContainerAnimated.jsx
│   ├── MediaComponent.jsx
│   ├── MediaContainer.jsx
│   ├── ImageComponent.jsx
│   ├── Video.component.jsx
│   ├── MediaNameComponent.jsx
│   ├── Header.jsx
│   └── Media.jsx
├── portfolio/            # Gallery and portfolio components
│   ├── PhotosContainer.component.jsx
│   ├── VideosContainer.component.jsx
│   ├── CategoryPhoto.jsx
│   ├── VideoPortfolio.component.jsx
│   └── PortfolioHeader.jsx
├── navigation/           # Navigation components
│   ├── Navigation.js
│   ├── NavLink.jsx
│   ├── scrollToTheTop.jsx
│   ├── Burger.jsx
│   ├── Cross.jsx
│   └── Arrorup.jsx
└── helpers/              # Utility components
    ├── Spinner.jsx
    ├── SpinnerCamera.jsx
    └── Toast.jsx
```

## Home Components

### MediaContainerAnimated

**The core component** of the landing page, implementing the interactive horizontal media slider.

#### Location
[components/home/MediaContainerAnimated.jsx](../components/home/MediaContainerAnimated.jsx:1)

#### Description
Provides drag-and-scroll functionality with physics-based animations, keyboard navigation, and responsive behavior.

#### Props
```typescript
interface MediaContainerAnimatedProps {
  media: MediaObject[];    // Array of media items to display
  className?: string;      // Additional CSS classes
}
```

#### Features
- Horizontal drag/scroll with momentum
- Keyboard navigation (arrow keys)
- Touch and mouse support
- RAF-throttled scroll handling
- Responsive media sizing
- Focus marks overlay (f-stop indicators)
- Progress bar

#### Usage Example
```javascript
import MediaContainerAnimated from '@/components/home/MediaContainerAnimated'
import { useSelector } from 'react-redux'
import { selectMediaMap } from '@/store/media/media.selector'

export default function HomePage() {
  const media = useSelector(selectMediaMap)

  return <MediaContainerAnimated media={media} />
}
```

#### Key Implementation Details
```javascript
// Animation setup with React Spring
const [{ x }, api] = useSpring(() => ({
  x: 0,
  config: { tension: 300, friction: 30 }
}))

// Drag gesture binding
const bind = useDrag(({ down, movement, velocity }) => {
  const newX = calculatePosition(movement, velocity)
  api.start({ x: newX, immediate: down })
})

// RAF-throttled scroll
const handleScroll = useCallback(
  throttle((event) => {
    // Smooth scroll handling
  }, 16),
  []
)
```

#### Performance Considerations
- Uses `requestAnimationFrame` for smooth animations
- Throttles scroll events to ~60fps
- GPU-accelerated transforms
- Memoized calculations

---

### MediaComponent

Container component that fetches media data and passes it to MediaContainerAnimated.

#### Location
[components/home/MediaComponent.jsx](../components/home/MediaComponent.jsx)

#### Props
None (uses Redux)

#### Usage
```javascript
import MediaComponent from '@/components/home/MediaComponent'

export default function Page() {
  return <MediaComponent />
}
```

#### Implementation
```javascript
export default function MediaComponent() {
  const dispatch = useDispatch()
  const media = useSelector(selectMediaMap)
  const isLoading = useSelector(selectIsLoading)

  useEffect(() => {
    dispatch(fetchMediaStartAsync())
  }, [dispatch])

  if (isLoading) return <Spinner />

  return <MediaContainerAnimated media={media} />
}
```

---

### ImageComponent

Renders optimized images with lazy loading.

#### Location
[components/home/ImageComponent.jsx](../components/home/ImageComponent.jsx)

#### Props
```typescript
interface ImageComponentProps {
  src: string;             // Image URL
  alt: string;             // Alt text
  width: number;           // Image width
  height: number;          // Image height
  className?: string;      // Additional classes
  priority?: boolean;      // Load priority (above-fold)
  onLoad?: () => void;     // Load callback
}
```

#### Usage
```javascript
import ImageComponent from '@/components/home/ImageComponent'

<ImageComponent
  src="https://cdn.bunny.net/..."
  alt="Photo description"
  width={1920}
  height={1080}
  priority={false}
/>
```

#### Implementation
Uses Next.js Image component for optimization:
```javascript
import Image from 'next/image'

export default function ImageComponent({ src, alt, width, height, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  )
}
```

---

### Video.component

Renders video player with controls and autoplay support.

#### Location
[components/home/Video.component.jsx](../components/home/Video.component.jsx)

#### Props
```typescript
interface VideoComponentProps {
  url: string;             // Video URL
  thumbnail?: string;      // Thumbnail image URL
  autoPlay?: boolean;      // Auto-play on hover
  controls?: boolean;      // Show video controls
  loop?: boolean;          // Loop video
  muted?: boolean;         // Mute audio
  className?: string;      // Additional classes
  onPlay?: () => void;     // Play callback
  onPause?: () => void;    // Pause callback
}
```

#### Usage
```javascript
import VideoComponent from '@/components/home/Video.component'

<VideoComponent
  url="https://cdn.bunny.net/video.mp4"
  thumbnail="https://cdn.bunny.net/thumb.jpg"
  autoPlay={false}
  controls={true}
  loop={false}
  muted={false}
/>
```

#### Implementation
Uses React Player:
```javascript
import ReactPlayer from 'react-player'

export default function VideoComponent({ url, thumbnail, ...props }) {
  return (
    <ReactPlayer
      url={url}
      light={thumbnail}
      width="100%"
      height="100%"
      {...props}
    />
  )
}
```

---

### MediaNameComponent

Displays media title/caption with animation.

#### Location
[components/home/MediaNameComponent.jsx](../components/home/MediaNameComponent.jsx)

#### Props
```typescript
interface MediaNameComponentProps {
  name: string;            // Media title
  visible?: boolean;       // Show/hide with animation
  className?: string;      // Additional classes
}
```

#### Usage
```javascript
import MediaNameComponent from '@/components/home/MediaNameComponent'

<MediaNameComponent
  name="Wedding Ceremony"
  visible={true}
/>
```

---

### Header

Landing page header component.

#### Location
[components/home/Header.jsx](../components/home/Header.jsx)

#### Props
```typescript
interface HeaderProps {
  title?: string;          // Header title
  subtitle?: string;       // Header subtitle
}
```

#### Usage
```javascript
import Header from '@/components/home/Header'

<Header
  title="Bebe Portfolio"
  subtitle="Photography & Videography"
/>
```

---

## Portfolio Components

### PhotosContainer.component

Displays photo gallery with category filtering.

#### Location
[components/portfolio/PhotosContainer.component.jsx](../components/portfolio/PhotosContainer.component.jsx)

#### Props
```typescript
interface PhotosContainerProps {
  category?: string;       // Filter by category
  limit?: number;          // Number of photos to show
}
```

#### Usage
```javascript
import PhotosContainer from '@/components/portfolio/PhotosContainer.component'

<PhotosContainer category="wedding" limit={20} />
```

#### Features
- Masonry grid layout
- Lazy loading
- Lightbox integration (planned)
- Category filtering

---

### VideosContainer.component

Displays video gallery with category filtering.

#### Location
[components/portfolio/VideosContainer.component.jsx](../components/portfolio/VideosContainer.component.jsx)

#### Props
```typescript
interface VideosContainerProps {
  category?: string;       // Filter by category
  limit?: number;          // Number of videos to show
}
```

#### Usage
```javascript
import VideosContainer from '@/components/portfolio/VideosContainer.component'

<VideosContainer category="wedding" limit={10} />
```

---

### CategoryPhoto

Displays a single photo category card.

#### Location
[components/portfolio/CategoryPhoto.jsx](../components/portfolio/CategoryPhoto.jsx)

#### Props
```typescript
interface CategoryPhotoProps {
  category: {
    name: string;
    slug: string;
    thumbnail: string;
    count: number;
  };
  onClick?: () => void;
}
```

#### Usage
```javascript
import CategoryPhoto from '@/components/portfolio/CategoryPhoto'

<CategoryPhoto
  category={{
    name: "Wedding",
    slug: "wedding",
    thumbnail: "https://...",
    count: 25
  }}
  onClick={() => navigate('/gallery/wedding')}
/>
```

---

### VideoPortfolio.component

Video portfolio grid component.

#### Location
[components/portfolio/VideoPortfolio.component.jsx](../components/portfolio/VideoPortfolio.component.jsx)

#### Props
```typescript
interface VideoPortfolioProps {
  videos: MediaObject[];
  columns?: number;        // Grid columns (default: 3)
}
```

---

### PortfolioHeader

Header component for portfolio pages.

#### Location
[components/portfolio/PortfolioHeader.jsx](../components/portfolio/PortfolioHeader.jsx)

#### Props
```typescript
interface PortfolioHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
}
```

---

## Navigation Components

### Navigation

Main navigation menu with mobile support.

#### Location
[components/navigation/Navigation.js](../components/navigation/Navigation.js)

#### Props
None

#### Features
- Desktop and mobile navigation
- Burger menu for mobile
- Active link highlighting
- Smooth transitions

#### Usage
```javascript
import Navigation from '@/components/navigation/Navigation'

<Navigation />
```

#### Links
- Home (/)
- About (/about)
- Gallery (/gallery)
- Videos (/video_gallery)
- Portfolio (/portfolio)
- Booking (/book)
- Contact (/contact)

---

### NavLink

Individual navigation link component.

#### Location
[components/navigation/NavLink.jsx](../components/navigation/NavLink.jsx)

#### Props
```typescript
interface NavLinkProps {
  href: string;            // Link destination
  children: ReactNode;     // Link text/content
  active?: boolean;        // Active state
  onClick?: () => void;    // Click handler
}
```

#### Usage
```javascript
import NavLink from '@/components/navigation/NavLink'

<NavLink href="/gallery" active={true}>
  Gallery
</NavLink>
```

---

### scrollToTheTop

Scroll-to-top button component.

#### Location
[components/navigation/scrollToTheTop.jsx](../components/navigation/scrollToTheTop.jsx)

#### Props
```typescript
interface ScrollToTopProps {
  showAfter?: number;      // Show after scrolling N pixels (default: 300)
  smooth?: boolean;        // Smooth scroll (default: true)
}
```

#### Usage
```javascript
import ScrollToTop from '@/components/navigation/scrollToTheTop'

<ScrollToTop showAfter={300} smooth={true} />
```

---

### SVG Icon Components

#### Burger
Mobile menu burger icon.

#### Cross
Mobile menu close icon.

#### Arrorup
Scroll-to-top arrow icon.

#### Usage
```javascript
import Burger from '@/components/navigation/Burger'
import Cross from '@/components/navigation/Cross'
import Arrorup from '@/components/navigation/Arrorup'

<Burger width={24} height={24} />
<Cross width={24} height={24} />
<Arrorup width={24} height={24} />
```

---

## Helper Components

### Spinner

Loading spinner component.

#### Location
[components/helpers/Spinner.jsx](../components/helpers/Spinner.jsx)

#### Props
```typescript
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';  // Spinner size
  color?: string;                        // Spinner color
  className?: string;                    // Additional classes
}
```

#### Usage
```javascript
import Spinner from '@/components/helpers/Spinner'

// Default
<Spinner />

// Custom size and color
<Spinner size="large" color="#gold" />
```

---

### SpinnerCamera

Camera-themed loading spinner (Lottie animation).

#### Location
[components/helpers/SpinnerCamera.jsx](../components/helpers/SpinnerCamera.jsx)

#### Props
```typescript
interface SpinnerCameraProps {
  size?: number;           // Animation size (default: 200)
}
```

#### Usage
```javascript
import SpinnerCamera from '@/components/helpers/SpinnerCamera'

<SpinnerCamera size={300} />
```

#### Implementation
Uses Lottie React for animation:
```javascript
import Lottie from 'lottie-react'
import cameraAnimation from '@/public/camera.json'

export default function SpinnerCamera({ size = 200 }) {
  return (
    <Lottie
      animationData={cameraAnimation}
      style={{ width: size, height: size }}
      loop={true}
    />
  )
}
```

---

### Toast

Toast notification component.

#### Location
[components/helpers/Toast.jsx](../components/helpers/Toast.jsx)

#### Props
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;       // Auto-dismiss duration (ms)
  onClose?: () => void;    // Close callback
}
```

#### Usage
```javascript
import Toast from '@/components/helpers/Toast'
import { useState } from 'react'

function MyComponent() {
  const [toast, setToast] = useState(null)

  return (
    <>
      <button onClick={() => setToast({
        message: 'Success!',
        type: 'success'
      })}>
        Show Toast
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
```

---

## Creating New Components

### Component Template

```javascript
'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './MyComponent.module.css'

/**
 * MyComponent - Brief description
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {Function} props.onClick - Click handler
 */
export default function MyComponent({ title, onClick }) {
  const [state, setState] = useState(null)

  useEffect(() => {
    // Side effects
  }, [])

  const handleClick = useCallback(() => {
    onClick?.()
  }, [onClick])

  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}

// PropTypes or TypeScript types
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

// Default props
MyComponent.defaultProps = {
  onClick: () => {}
}
```

### File Naming Conventions

- **Functional Components:** PascalCase.jsx (e.g., `MediaComponent.jsx`)
- **Legacy Components:** PascalCase.component.jsx (e.g., `Video.component.jsx`)
- **CSS Modules:** PascalCase.module.css (e.g., `MediaComponent.module.css`)

### Component Checklist

- [ ] Clear, descriptive name
- [ ] JSDoc comments
- [ ] PropTypes or TypeScript types
- [ ] Default props where appropriate
- [ ] Error boundaries if needed
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] Performance optimization

---

## Component Patterns

### 1. Container/Presentational Pattern

```javascript
// Container (data fetching)
export function MediaContainer() {
  const media = useSelector(selectMediaMap)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMediaStartAsync())
  }, [])

  return <MediaPresentation media={media} />
}

// Presentational (UI only)
export function MediaPresentation({ media }) {
  return (
    <div>
      {media.map(item => <MediaItem key={item.id} {...item} />)}
    </div>
  )
}
```

### 2. Compound Components Pattern

```javascript
function Gallery({ children }) {
  return <div className="gallery">{children}</div>
}

Gallery.Header = function GalleryHeader({ title }) {
  return <h2>{title}</h2>
}

Gallery.Grid = function GalleryGrid({ children }) {
  return <div className="grid">{children}</div>
}

Gallery.Item = function GalleryItem({ src, alt }) {
  return <img src={src} alt={alt} />
}

// Usage
<Gallery>
  <Gallery.Header title="Photos" />
  <Gallery.Grid>
    <Gallery.Item src="..." alt="..." />
  </Gallery.Grid>
</Gallery>
```

### 3. Render Props Pattern

```javascript
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [url])

  return render({ data, loading })
}

// Usage
<DataFetcher
  url="/api/media/main-photos"
  render={({ data, loading }) =>
    loading ? <Spinner /> : <Gallery photos={data} />
  }
/>
```

### 4. Custom Hooks Pattern

```javascript
// useMediaQuery.js
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Usage
function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return isMobile ? <MobileNav /> : <DesktopNav />
}
```

---

## Styling Guide

### Tailwind CSS

Primary styling method:

```javascript
<div className="flex flex-col items-center justify-center p-4 bg-gray-100">
  <h1 className="text-4xl font-bold text-gray-900">Title</h1>
</div>
```

### CSS Modules

For component-specific styles:

```javascript
// MyComponent.module.css
.container {
  display: flex;
  padding: 1rem;
}

.title {
  font-size: 2rem;
  color: var(--color-primary);
}

// MyComponent.jsx
import styles from './MyComponent.module.css'

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

### Emotion (CSS-in-JS)

For dynamic styles:

```javascript
import styled from '@emotion/styled'

const Button = styled.button`
  background: ${props => props.primary ? 'gold' : 'gray'};
  padding: 1rem 2rem;
  border-radius: 8px;

  &:hover {
    opacity: 0.8;
  }
`

<Button primary>Click me</Button>
```

### Combining Approaches

```javascript
import styles from './MyComponent.module.css'
import { cx } from '@emotion/css'

<div className={cx(
  styles.container,
  'flex items-center',
  isActive && 'bg-blue-500'
)}>
  Content
</div>
```

---

## Performance Best Practices

### 1. Memoization

```javascript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const MediaItem = memo(function MediaItem({ id, url, name }) {
  return <div>{name}</div>
})

// Memoize expensive calculations
const sortedMedia = useMemo(
  () => media.sort((a, b) => a.name.localeCompare(b.name)),
  [media]
)

// Memoize callbacks
const handleClick = useCallback(
  (id) => {
    dispatch(selectMedia(id))
  },
  [dispatch]
)
```

### 2. Lazy Loading

```javascript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>
```

### 3. Code Splitting

```javascript
// Automatic with Next.js dynamic imports
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false // Client-side only
})
```

### 4. Image Optimization

```javascript
import Image from 'next/image'

<Image
  src="/photo.jpg"
  alt="Photo"
  width={1920}
  height={1080}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 5. Virtual Scrolling

For large lists (future implementation):

```javascript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <MediaItem {...media[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## Accessibility

### ARIA Attributes

```javascript
<button
  aria-label="Close dialog"
  aria-pressed={isOpen}
  role="button"
  tabIndex={0}
>
  <Cross />
</button>
```

### Keyboard Navigation

```javascript
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowLeft':
      navigatePrevious()
      break
    case 'ArrowRight':
      navigateNext()
      break
    case 'Escape':
      close()
      break
  }
}

<div onKeyDown={handleKeyDown} tabIndex={0}>
  Content
</div>
```

### Focus Management

```javascript
import { useRef, useEffect } from 'react'

function Modal({ isOpen }) {
  const modalRef = useRef()

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus()
    }
  }, [isOpen])

  return (
    <div ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true">
      Modal content
    </div>
  )
}
```

---

## Testing Components

### Unit Testing Example

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import MediaComponent from './MediaComponent'

describe('MediaComponent', () => {
  it('renders media items', () => {
    const media = [{ id: '1', name: 'Photo 1', url: '...' }]
    render(<MediaComponent media={media} />)

    expect(screen.getByText('Photo 1')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<MediaComponent onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

---

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)

---

**Last Updated:** 2025-11-11
**Maintained by:** Bebe Portfolio Team
