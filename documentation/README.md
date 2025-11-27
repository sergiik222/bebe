# Bebe Portfolio - Documentation

Welcome to the Bebe Portfolio project documentation. This is an interactive photo/video portfolio web application built with Next.js, featuring a modern animated interface inspired by [angusemmerson.com](https://angusemmerson.com/).

## Project Overview

**Type:** Interactive Photo/Video Portfolio Web Application
**Status:** Early-to-mid development (MVP partially complete)
**Timeline:** 6-8 weeks to MVP
**Tech Stack:** Next.js 14, React 18, Redux Toolkit, Tailwind CSS, Bunny CDN

## Quick Links

### Getting Started
- [Environment Setup](ENVIRONMENT_SETUP.md) - Set up your development environment
- [Quick Start Guide](QUICK_START.md) - Get up and running quickly
- [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflows and patterns

### Technical Documentation
- [Architecture Overview](ARCHITECTURE.md) - System architecture and design
- [API Documentation](API_DOCUMENTATION.md) - API endpoints reference
- [Component Guide](COMPONENT_GUIDE.md) - Component documentation and usage

### Project Management
- [Project Breakdown](PROJECT_BREAKDOWN.md) - Comprehensive 6-8 week project plan
- [Technology Recommendations](TECH_RECOMMENDATIONS.md) - Technology stack decisions

### Infrastructure
- [Bunny CDN Setup Guide](BUNNY_SETUP_GUIDE.md) - Bunny CDN/Storage configuration
- [Media Storage Analysis](MEDIA_STORAGE_ANALYSIS.md) - Storage solution comparison
- [Post Migration Checklist](POST_MIGRATION_CHECKLIST.md) - Firebase to Bunny migration
- [Deployment Guide](DEPLOYMENT.md) - Deployment instructions

## Project Structure

```
bebe/
├── app/                    # Next.js App Router pages & API routes
├── components/             # React components
│   ├── home/              # Main page components
│   ├── portfolio/         # Gallery components
│   ├── navigation/        # Navigation components
│   └── helpers/           # Utility components
├── store/                 # Redux state management
├── utils/                 # Utility functions
├── public/                # Static assets
└── documentation/         # Project documentation (you are here)
```

## Key Features

### Implemented
- Interactive horizontal media slider with drag/scroll gestures
- Photo and video gallery with categorization
- Responsive design with mobile support
- Redux state management with persistence
- Bunny CDN integration for media storage
- API routes for media fetching

### In Progress
- Video hover interactions
- Photo lightbox
- Animation refinements

### Planned
- Booking system with Google Calendar integration
- Contact form with email service
- Backend Go server
- Online shop

## Development

### Prerequisites
- Node.js 18+ and npm
- Bunny CDN account (for media storage)
- Git

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see ENVIRONMENT_SETUP.md)
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Lint code
```

## Documentation Guide

### For New Developers
1. Start with [Environment Setup](ENVIRONMENT_SETUP.md)
2. Read the [Quick Start Guide](QUICK_START.md)
3. Review [Architecture Overview](ARCHITECTURE.md)
4. Check [Development Guide](DEVELOPMENT_GUIDE.md) for coding patterns

### For Contributors
1. Review [Project Breakdown](PROJECT_BREAKDOWN.md) to understand priorities
2. Follow patterns in [Component Guide](COMPONENT_GUIDE.md)
3. Consult [API Documentation](API_DOCUMENTATION.md) for API changes
4. Use [Development Guide](DEVELOPMENT_GUIDE.md) for workflow

### For DevOps
1. Read [Bunny CDN Setup Guide](BUNNY_SETUP_GUIDE.md)
2. Follow [Deployment Guide](DEPLOYMENT.md)
3. Review [Environment Setup](ENVIRONMENT_SETUP.md) for configuration

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18.3
- **State Management:** Redux Toolkit with Redux Persist
- **Styling:** Tailwind CSS + Emotion
- **Animations:** React Spring, @use-gesture/react
- **Media Player:** React Player, Cloudinary Video Player

### Backend/Storage
- **Media Storage:** Bunny CDN/Storage (migrated from Firebase)
- **API Routes:** Next.js API Routes
- **Future Backend:** Go (planned)

### Development
- **Package Manager:** npm
- **Linter:** ESLint
- **Deployment:** Vercel

## Current Status

### Phase 1: Foundation & Infrastructure ✅
- Project setup complete
- Bunny CDN integration complete
- Basic routing and navigation complete

### Phase 2: Main Page Refinement 🔄
- Interactive slider complete
- Animation refinements in progress
- Video/photo interactions in progress

### Phase 3: Booking System 📋
- Not started (planned)

### Phase 4: Content Pages 📋
- Basic pages created
- Content and styling pending

### Phase 5: Testing & Optimization 📋
- Not started

### Phase 6: Future Features 📋
- Not started

## Contributing

When contributing to this project:

1. Follow the coding patterns in [Development Guide](DEVELOPMENT_GUIDE.md)
2. Update documentation when adding features
3. Test thoroughly before committing
4. Use meaningful commit messages

## Support

For questions or issues:
- Check the relevant documentation section
- Review the [Quick Start Guide](QUICK_START.md)
- Consult the [Project Breakdown](PROJECT_BREAKDOWN.md) for context

## License

[Add your license information here]

---

**Last Updated:** 2025-11-11
**Version:** 0.1.0
**Maintained by:** Bebe Portfolio Team
