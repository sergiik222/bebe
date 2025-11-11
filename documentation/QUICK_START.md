# Quick Start Guide

## Immediate Next Steps

### Decision Points (Need Your Input)

1. **Media Storage Solution**
   - **Recommended:** Cloudflare R2 ($0.015/GB, zero egress fees)
   - **Alternative:** Backblaze B2 ($0.005/GB + Cloudflare CDN)
   - **Question:** What's your expected storage size? Budget constraints?

2. **Photo Click Behavior**
   - **Option A (Recommended):** Lightbox with zoom capability
   - **Option B:** Navigate to detail page
   - **Option C:** Simple expand overlay
   - **Question:** Which interaction do you prefer?

3. **Backend Hosting**
   - **Options:** Railway, Fly.io, DigitalOcean App Platform
   - **Question:** Preference or budget constraints?

---

## What to Work on First

### Priority 1: Media Storage (Week 1)
**Why first?** Everything depends on this. Firebase is expensive.

**Tasks:**
1. Choose storage provider (decision needed)
2. Set up account and API keys
3. Create upload/retrieval functions
4. Test with sample media
5. Plan Firebase migration

**Agent:** `deployment-engineer`, `database-architect`

---

### Priority 2: Main Page Polish (Week 2-3)
**Why second?** It's partially done, finish what you started.

**Tasks:**
1. Fix alignment behavior (varying margins → single line)
2. Implement wave effect at vertical line
3. Add video hover → play without sound
4. Create fullscreen video player
5. Add hover animations (lines + "OPEN" text)
6. Implement photo click (lightbox)

**Agent:** `react-component-builder`, `frontend-developer`, `ui-ux-designer`

---

### Priority 3: Backend Setup (Week 4)
**Why third?** Needed for booking system.

**Tasks:**
1. Initialize Go project
2. Set up PostgreSQL database
3. Create REST API structure
4. Deploy to hosting platform
5. Connect to Next.js frontend

**Agent:** `go-backend-developer`, `deployment-engineer`

---

### Priority 4: Booking System (Week 4-5)
**Why fourth?** Complex feature requiring backend.

**Tasks:**
1. Google Calendar API integration
2. Email service setup (Resend/SendGrid)
3. Booking confirmation flow
4. Calendar UI component
5. Testing end-to-end

**Agent:** `go-backend-developer`, `react-component-builder`

---

## Quick Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

### Git Workflow
```bash
git status           # Check current changes
git add .            # Stage changes
git commit -m "..."  # Commit
git push             # Push to remote
```

---

## File Structure Reference

```
bebe/
├── app/                    # Next.js pages
│   ├── page.js            # Main slider (WORK HERE FIRST)
│   ├── book/page.js       # Booking page (LATER)
│   └── contact/page.js    # Contact form
├── components/
│   ├── home/              # Main page components
│   │   ├── MediaContainerAnimated.jsx  # Main slider (REFINE THIS)
│   │   └── Video.component.jsx
│   └── booking/           # [CREATE LATER]
├── store/                 # Redux store
├── documentation/         # Project docs (YOU ARE HERE)
└── public/               # Static assets
```

---

## Common Tasks

### Add a new npm package
```bash
npm install package-name
```

### Remove Cloudinary (after media storage is set up)
```bash
npm uninstall @cloudinary/base @cloudinary/react cloudinary cloudinary-video-player
```

### Create new component
```bash
# Example: components/booking/Calendar.jsx
touch components/booking/Calendar.jsx
```

---

## Getting Help

- **Code Review:** Ask `code-reviewer` agent
- **React Components:** Ask `react-component-builder` agent
- **Go Backend:** Ask `go-backend-developer` agent
- **Deployment:** Ask `deployment-engineer` agent
- **Bugs:** Ask `debugger` agent

---

## Resources

- **Reference Site:** https://angusemmerson.com/
- **Next.js Docs:** https://nextjs.org/docs
- **React Spring:** https://www.react-spring.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Last Updated:** 2025-11-09
