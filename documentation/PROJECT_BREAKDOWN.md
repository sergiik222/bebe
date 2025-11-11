# Project Breakdown: Photo/Video Portfolio Website

**Project Name:** Bebe Portfolio
**Current Stack:** Next.js 14, Redux Toolkit, Tailwind CSS, React Spring
**Future Stack:** Go Backend
**Hosting:** Vercel
**Reference:** https://angusemmerson.com/

---

## Executive Summary

This portfolio website project requires completion of an interactive media slider, implementation of a booking system with Google Calendar integration, migration from Firebase to a cost-effective media storage solution, and future e-commerce capabilities.

**Estimated Timeline:** 6-8 weeks for core features
**Critical Path:** Media storage migration → Main page refinement → Booking system → Backend infrastructure

---

## Phase 1: Foundation & Infrastructure (Week 1-2)

### 1.1 Media Storage Solution - CRITICAL
**Priority:** HIGH
**Agent:** `deployment-engineer`, `database-architect`
**Status:** Not Started

**Requirements:**
- Replace expensive Firebase storage
- Fast CDN delivery for website
- Cost-effective for photos/videos
- Future: Private file sharing with unique links
- Vercel-compatible

**Recommended Solutions:**
1. **Cloudflare R2** (Recommended)
   - S3-compatible API
   - Zero egress fees
   - $0.015/GB storage
   - Fast global CDN
   - Private link sharing via presigned URLs

2. **Backblaze B2 + Cloudflare CDN**
   - $0.005/GB storage
   - Free egress to Cloudflare
   - S3-compatible

3. **DigitalOcean Spaces**
   - $5/month for 250GB + 1TB transfer
   - Built-in CDN

**Tasks:**
- [ ] Evaluate storage options (cost/performance analysis)
- [ ] Set up chosen storage service
- [ ] Implement upload/retrieval API
- [ ] Create migration script from Firebase
- [ ] Test CDN performance
- [ ] Implement presigned URL generation for private sharing

**Dependencies:** None
**Blocks:** All media-related features

---

### 1.2 Remove Cloudinary Dependencies
**Priority:** MEDIUM
**Agent:** `frontend-developer`, `code-reviewer`
**Status:** Not Started

**Tasks:**
- [ ] Audit codebase for Cloudinary usage
- [ ] Remove Cloudinary packages from package.json
- [ ] Update components using Cloudinary APIs
- [ ] Test all media display functionality

**Dependencies:** 1.1 (Media Storage Solution)

---

### 1.3 Codebase Cleanup & Optimization
**Priority:** MEDIUM
**Agent:** `code-reviewer`, `frontend-developer`
**Status:** Not Started

**Tasks:**
- [ ] Review and optimize Redux store structure
- [ ] Audit unused dependencies
- [ ] Fix ESLint warnings (MediaContainerAnimated.jsx)
- [ ] Set up proper error boundaries
- [ ] Implement loading states consistently

**Dependencies:** None

---

## Phase 2: Main Page Refinement (Week 2-3)

### 2.1 Core Slider Functionality Enhancement
**Priority:** HIGH
**Agent:** `react-component-builder`, `frontend-developer`
**Status:** Partially Complete

**Current State:**
- Basic horizontal drag/scroll implemented
- React Spring animations working
- Focus marks (f-stop style) displayed
- Progress bar implemented

**Remaining Tasks:**
- [ ] Refine alignment behavior (varying margins → single line on hold)
- [ ] Optimize scroll smoothness to match reference site
- [ ] Implement proper touch gestures for mobile
- [ ] Add keyboard navigation (arrow keys)
- [ ] Performance optimization for large media sets

**Dependencies:** None

---

### 2.2 Wave Effect Animation at Vertical Line
**Priority:** HIGH
**Agent:** `react-component-builder`, `ui-ux-designer`
**Status:** Not Started

**Requirements:**
- Vertical line moves with scroll (already implemented)
- Media items animate with "wave effect" at line intersection
- Effect should follow the line movement smoothly

**Implementation Approach:**
- Calculate distance of each media item from vertical line
- Apply CSS transform (translateY/scale) based on distance
- Use React Spring for smooth transitions
- Consider using `useSpring` with distance-based calculations

**Tasks:**
- [ ] Design wave effect animation curve
- [ ] Implement distance calculation from vertical line
- [ ] Apply React Spring animations to media items
- [ ] Fine-tune timing and easing
- [ ] Test performance with many items

**Dependencies:** 2.1 (Core Slider)

---

### 2.3 Video Interactions
**Priority:** HIGH
**Agent:** `react-component-builder`, `frontend-developer`
**Status:** Partially Implemented

**Requirements:**
- **On Hover:** Play video without sound
- **On Click:** Open fullscreen with sound
- **Hover Animation:** Lines on sides + "OPEN" text (top-right) + duration (bottom-left)

**Tasks:**
- [ ] Implement hover-to-play without sound
- [ ] Create fullscreen video player component
- [ ] Add video controls in fullscreen mode
- [ ] Implement hover overlay animations (lines + text)
- [ ] Extract and display video duration
- [ ] Handle video loading states
- [ ] Optimize video preloading strategy

**Dependencies:** 1.1 (Media Storage)

---

### 2.4 Photo Interactions
**Priority:** MEDIUM
**Agent:** `react-component-builder`, `ui-ux-designer`
**Status:** Not Started

**Proposals for Photo Click:**
1. **Lightbox View** (Recommended)
   - Open photo in fullscreen lightbox
   - Add zoom capability
   - Navigate between photos with arrows
   - Display photo metadata (optional)

2. **Detail Page**
   - Navigate to dedicated photo page
   - Show larger version with details
   - Related photos sidebar

3. **Quick Preview**
   - Expand photo in overlay
   - Keep navigation context

**Tasks:**
- [ ] Decide on interaction pattern (with client)
- [ ] Implement chosen interaction
- [ ] Add smooth transitions
- [ ] Ensure mobile compatibility

**Dependencies:** 1.1 (Media Storage)

---

### 2.5 Hover Animation System
**Priority:** MEDIUM
**Agent:** `react-component-builder`, `ui-ux-designer`
**Status:** Not Started

**Reference:** Lines appearing on sides with text overlays on angusemmerson.com

**Tasks:**
- [ ] Analyze reference site animations
- [ ] Create reusable hover overlay component
- [ ] Implement line animations (SVG or CSS)
- [ ] Add "OPEN" text animation
- [ ] Add video duration display
- [ ] Ensure smooth 60fps animations
- [ ] Test on various devices

**Dependencies:** None

---

## Phase 3: Booking System (Week 4-5)

### 3.1 Backend Infrastructure Setup
**Priority:** HIGH
**Agent:** `go-backend-developer`, `database-architect`, `deployment-engineer`
**Status:** Not Started

**Architecture:**
```
Frontend (Next.js) → API Routes → Go Backend → Google Calendar API
                                           → Email Service (SendGrid/Resend)
                                           → Database (PostgreSQL)
```

**Tasks:**
- [ ] Set up Go backend project structure
- [ ] Implement REST API endpoints
- [ ] Set up PostgreSQL database
- [ ] Design booking schema
- [ ] Configure CORS for Vercel frontend
- [ ] Deploy backend (Railway/Fly.io/DigitalOcean)
- [ ] Set up environment variables

**Dependencies:** None

---

### 3.2 Google Calendar Integration
**Priority:** HIGH
**Agent:** `go-backend-developer`
**Status:** Not Started

**Requirements:**
- Read owner's Google Calendar
- Identify booked time slots
- Auto-create events on confirmation
- Support calendar sync

**Tasks:**
- [ ] Set up Google Calendar API credentials
- [ ] Implement OAuth2 authentication for owner's calendar
- [ ] Create endpoint to fetch availability
- [ ] Implement event creation endpoint
- [ ] Handle calendar conflicts
- [ ] Set up webhook for calendar updates (optional)

**Dependencies:** 3.1 (Backend Infrastructure)

---

### 3.3 Email System
**Priority:** HIGH
**Agent:** `go-backend-developer`, `frontend-developer`
**Status:** Not Started

**Email Flow:**
1. User books → Email to owner (confirm/cancel buttons)
2. Owner confirms → Event created + confirmation email to user
3. Owner cancels → Cancellation email to user

**Recommended Service:** Resend (modern, developer-friendly) or SendGrid

**Tasks:**
- [ ] Set up email service account
- [ ] Design email templates (HTML)
- [ ] Implement confirmation link system (secure tokens)
- [ ] Create booking confirmation endpoint
- [ ] Create booking cancellation endpoint
- [ ] Handle token expiration
- [ ] Add email error handling and retries

**Dependencies:** 3.1 (Backend Infrastructure)

---

### 3.4 Calendar UI Component
**Priority:** HIGH
**Agent:** `react-component-builder`, `frontend-developer`
**Status:** Not Started

**Requirements:**
- Display monthly calendar view
- Show available/booked slots
- Time slot selection
- Responsive design

**Recommended Library:**
- `react-big-calendar` or `@fullcalendar/react`
- Custom component with `date-fns`

**Tasks:**
- [ ] Choose calendar library or build custom
- [ ] Fetch availability from backend
- [ ] Implement date/time selection
- [ ] Display booked slots as disabled
- [ ] Add timezone handling
- [ ] Create booking form
- [ ] Handle booking submission
- [ ] Show loading/success/error states

**Dependencies:** 3.1, 3.2 (Backend + Calendar API)

---

## Phase 4: Content Pages (Week 3-4)

### 4.1 About Page
**Priority:** LOW
**Agent:** `frontend-developer`, `ui-ux-designer`
**Status:** Basic Structure Exists

**Tasks:**
- [ ] Design layout (dark theme, geometric backgrounds)
- [ ] Add content sections
- [ ] Implement animations/transitions
- [ ] Add responsive design
- [ ] Optimize images

**Dependencies:** None

---

### 4.2 Contact Form
**Priority:** MEDIUM
**Agent:** `frontend-developer`, `go-backend-developer`
**Status:** Page Exists, Form Incomplete

**Requirements:**
- Name, email, message fields
- Form validation
- Send email to owner
- Success/error feedback

**Tasks:**
- [ ] Design form UI
- [ ] Implement client-side validation
- [ ] Create backend endpoint for form submission
- [ ] Integrate with email service
- [ ] Add spam protection (reCAPTCHA or honeypot)
- [ ] Implement rate limiting

**Dependencies:** 3.1, 3.3 (Backend + Email)

---

## Phase 5: Testing & Optimization (Week 5-6)

### 5.1 Performance Optimization
**Priority:** HIGH
**Agent:** `frontend-developer`, `code-reviewer`
**Status:** Not Started

**Tasks:**
- [ ] Run Lighthouse audits
- [ ] Optimize images (WebP, lazy loading)
- [ ] Implement video lazy loading
- [ ] Code splitting optimization
- [ ] Reduce JavaScript bundle size
- [ ] Optimize CSS (PurgeCSS)
- [ ] Add proper caching headers
- [ ] Test on slow 3G connection

**Dependencies:** All major features complete

---

### 5.2 Cross-browser & Device Testing
**Priority:** HIGH
**Agent:** `test-engineer`, `frontend-developer`
**Status:** Not Started

**Tasks:**
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS devices
- [ ] Test on Android devices
- [ ] Test various screen sizes
- [ ] Fix browser-specific issues
- [ ] Ensure touch gestures work properly

**Dependencies:** All major features complete

---

### 5.3 Accessibility Audit
**Priority:** MEDIUM
**Agent:** `ui-ux-designer`, `frontend-developer`
**Status:** Not Started

**Tasks:**
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers
- [ ] Check color contrast ratios
- [ ] Add focus indicators
- [ ] Ensure video controls are accessible

**Dependencies:** All major features complete

---

## Phase 6: Future Features (Week 7+)

### 6.1 Photo/Video Gallery Refinement
**Priority:** LOW
**Agent:** `react-component-builder`, `frontend-developer`
**Status:** Deferred

**Note:** Current galleries exist but will be revisited after core features are complete.

---

### 6.2 Online Shop
**Priority:** LOW (Future)
**Agent:** `go-backend-developer`, `frontend-developer`, `database-architect`
**Status:** Not Started

**Considerations:**
- E-commerce platform (Stripe, Shopify API)
- Product management
- Shopping cart
- Checkout flow
- Order management
- Inventory tracking

**Note:** This is a major feature requiring separate planning.

---

## Technical Architecture

### Frontend Architecture
```
app/
├── page.js                    # Main slider page
├── about/page.js             # About page
├── book/page.js              # Booking calendar
├── contact/page.js           # Contact form
├── gallery/page.js           # Photo gallery
├── video_gallery/page.js     # Video gallery
└── portfolio/page.js         # Portfolio overview

components/
├── home/
│   ├── MediaContainerAnimated.jsx  # Main slider
│   ├── MediaComponent.jsx
│   ├── Video.component.jsx
│   └── ImageComponent.jsx
├── booking/
│   ├── Calendar.jsx          # [TO CREATE]
│   └── BookingForm.jsx       # [TO CREATE]
└── shared/
    ├── FullscreenVideoPlayer.jsx  # [TO CREATE]
    └── Lightbox.jsx          # [TO CREATE]
```

### Backend Architecture (Go)
```
backend/
├── cmd/
│   └── server/main.go
├── internal/
│   ├── handlers/
│   │   ├── booking.go
│   │   ├── contact.go
│   │   └── media.go
│   ├── services/
│   │   ├── calendar.go
│   │   ├── email.go
│   │   └── storage.go
│   └── models/
│       ├── booking.go
│       └── user.go
└── config/
    └── config.go
```

---

## Risk Assessment & Mitigation

### High Priority Risks

#### 1. Media Storage Migration
**Risk:** Data loss or downtime during Firebase migration
**Mitigation:**
- Implement parallel storage (both Firebase and new solution temporarily)
- Gradual migration with rollback capability
- Comprehensive testing before switching
- Keep Firebase as backup for 1 month

#### 2. Google Calendar API Complexity
**Risk:** Complex OAuth flows and rate limits
**Mitigation:**
- Study Google Calendar API documentation thoroughly
- Implement proper error handling and retries
- Use service account for server-side access
- Cache availability data to reduce API calls

#### 3. Animation Performance
**Risk:** Laggy animations with many media items
**Mitigation:**
- Use CSS transforms (GPU-accelerated)
- Implement virtualization for off-screen items
- Debounce/throttle scroll events
- Test with 50+ media items
- Use `will-change` CSS property strategically

#### 4. Email Deliverability
**Risk:** Booking emails ending up in spam
**Mitigation:**
- Use reputable email service (Resend/SendGrid)
- Implement SPF, DKIM, DMARC records
- Design emails to avoid spam triggers
- Include unsubscribe links

### Medium Priority Risks

#### 5. Cross-browser Compatibility
**Risk:** Animations not working in Safari/Firefox
**Mitigation:**
- Test early and often in all browsers
- Use PostCSS with autoprefixer
- Provide fallbacks for unsupported features

#### 6. Mobile Performance
**Risk:** Poor performance on mobile devices
**Mitigation:**
- Optimize for mobile-first
- Reduce JavaScript bundle size
- Use smaller image/video sizes for mobile
- Test on real devices (not just emulators)

---

## Agent Assignment Summary

| Phase | Primary Agents | Support Agents |
|-------|---------------|----------------|
| Media Storage | deployment-engineer, database-architect | - |
| Main Page Slider | react-component-builder, frontend-developer | ui-ux-designer |
| Wave Effect | react-component-builder | ui-ux-designer |
| Video/Photo Interactions | react-component-builder | frontend-developer |
| Backend Setup | go-backend-developer | database-architect, deployment-engineer |
| Calendar Integration | go-backend-developer | - |
| Email System | go-backend-developer | frontend-developer |
| Calendar UI | react-component-builder | frontend-developer |
| Testing | test-engineer | frontend-developer, code-reviewer |
| Performance | frontend-developer | code-reviewer |

---

## Next Steps (Immediate Actions)

1. **Decision Point:** Choose media storage solution (Cloudflare R2 recommended)
2. **Decision Point:** Confirm photo click behavior (Lightbox recommended)
3. **Start Phase 1:** Begin media storage setup
4. **Start Phase 2:** Refine main page slider in parallel
5. **Document:** Keep this breakdown updated as work progresses

---

**Last Updated:** 2025-11-09
**Version:** 1.0
