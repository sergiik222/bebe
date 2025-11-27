# API Documentation

This document provides comprehensive documentation for all API endpoints in the Bebe Portfolio application.

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)
6. [Media API Endpoints](#media-api-endpoints)
7. [Future API Endpoints](#future-api-endpoints)
8. [Rate Limiting](#rate-limiting)
9. [Examples](#examples)

## Overview

The Bebe Portfolio API provides access to media content stored in Bunny CDN. All endpoints are implemented as Next.js API routes and deployed as serverless functions on Vercel Edge Network.

### API Characteristics

- **Type:** RESTful API
- **Format:** JSON
- **Protocol:** HTTPS only
- **Architecture:** Serverless (Vercel Edge Functions)
- **Caching:** CDN-cached responses (configurable)

## Base URL

### Development
```
http://localhost:3000/api
```

### Production
```
https://[your-domain]/api
```

## Authentication

Currently, the API is **public** and does not require authentication. All media content is publicly accessible.

### Future Authentication

When the booking system is implemented, protected endpoints will use:

```http
Authorization: Bearer <jwt-token>
```

## Response Format

### Success Response

All successful responses return JSON with a 200 OK status code:

```json
{
  "data": [...],
  "count": 10,
  "timestamp": "2025-11-11T12:00:00Z"
}
```

### Media Object Structure

```typescript
interface MediaObject {
  id: string;              // Unique identifier (UUID)
  name: string;            // Display name (without extension)
  url: string;             // Full CDN URL
  thumbnail?: string;      // Thumbnail URL (videos only)
  type: 'photo' | 'video'; // Media type
  category?: string;       // Category name
  width?: number;          // Original width in pixels
  height?: number;         // Original height in pixels
  size: number;            // File size in bytes
  format: string;          // File format (jpg, mp4, etc.)
  createdAt: string;       // Upload timestamp (ISO 8601)
}
```

### Example Media Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wedding Ceremony",
  "url": "https://cdn.bunny.net/your-zone/main/wedding-ceremony.jpg",
  "type": "photo",
  "category": "wedding",
  "width": 1920,
  "height": 1080,
  "size": 2456789,
  "format": "jpg",
  "createdAt": "2025-11-11T10:30:00Z"
}
```

## Error Handling

### Error Response Structure

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2025-11-11T12:00:00Z"
}
```

### HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 404 | Not Found (category/media not found) |
| 500 | Internal Server Error |
| 503 | Service Unavailable (Bunny CDN down) |

### Error Codes

| Error Code | Description | HTTP Status |
|-----------|-------------|-------------|
| `INVALID_CATEGORY` | Category parameter is invalid or missing | 400 |
| `CATEGORY_NOT_FOUND` | Requested category does not exist | 404 |
| `MEDIA_NOT_FOUND` | Requested media file not found | 404 |
| `STORAGE_ERROR` | Error connecting to Bunny CDN | 503 |
| `INVALID_FORMAT` | Unsupported media format | 400 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

### Example Error Response

```json
{
  "error": "Category not found",
  "code": "CATEGORY_NOT_FOUND",
  "details": {
    "category": "nonexistent"
  },
  "timestamp": "2025-11-11T12:00:00Z"
}
```

## Media API Endpoints

### 1. Get Main Slider Photos

Retrieves all photos for the main landing page slider.

#### Endpoint
```
GET /api/media/main-photos
```

#### Parameters
None

#### Response
```json
[
  {
    "id": "uuid",
    "name": "Photo Title",
    "url": "https://cdn.bunny.net/...",
    "type": "photo",
    "width": 1920,
    "height": 1080,
    "size": 2456789,
    "format": "jpg",
    "createdAt": "2025-11-11T10:30:00Z"
  }
]
```

#### Example Request
```javascript
// Using fetch
const response = await fetch('/api/media/main-photos')
const photos = await response.json()

// Using axios
const { data: photos } = await axios.get('/api/media/main-photos')
```

#### Source Location
File: [app/api/media/main-photos/route.js](../app/api/media/main-photos/route.js)

---

### 2. Get Main Slider Videos

Retrieves all videos for the main landing page slider.

#### Endpoint
```
GET /api/media/main-videos
```

#### Parameters
None

#### Response
```json
[
  {
    "id": "uuid",
    "name": "Video Title",
    "url": "https://cdn.bunny.net/.../video.mp4",
    "thumbnail": "https://cdn.bunny.net/.../thumbnail.jpg",
    "type": "video",
    "width": 1920,
    "height": 1080,
    "size": 15678900,
    "format": "mp4",
    "createdAt": "2025-11-11T11:00:00Z"
  }
]
```

#### Example Request
```javascript
const response = await fetch('/api/media/main-videos')
const videos = await response.json()
```

#### Source Location
File: [app/api/media/main-videos/route.js](../app/api/media/main-videos/route.js)

---

### 3. Get Video Categories

Retrieves all video categories with thumbnail images.

#### Endpoint
```
GET /api/media/video-categories
```

#### Parameters
None

#### Response
```json
[
  {
    "id": "uuid",
    "name": "Wedding",
    "slug": "wedding",
    "thumbnail": "https://cdn.bunny.net/.../thumbnail.jpg",
    "count": 15,
    "description": "Wedding videography"
  },
  {
    "id": "uuid",
    "name": "Commercial",
    "slug": "commercial",
    "thumbnail": "https://cdn.bunny.net/.../thumbnail.jpg",
    "count": 8,
    "description": "Commercial videos"
  }
]
```

#### Example Request
```javascript
const response = await fetch('/api/media/video-categories')
const categories = await response.json()
```

#### Source Location
File: [app/api/media/video-categories/route.js](../app/api/media/video-categories/route.js)

---

### 4. Get Category Photos

Retrieves all photos in a specific category.

#### Endpoint
```
GET /api/media/category-photos
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | Yes | Category slug (e.g., "wedding", "portrait") |
| `limit` | number | No | Maximum number of results (default: all) |
| `offset` | number | No | Pagination offset (default: 0) |

#### Response
```json
{
  "category": "wedding",
  "photos": [
    {
      "id": "uuid",
      "name": "Wedding Photo 1",
      "url": "https://cdn.bunny.net/.../photo.jpg",
      "type": "photo",
      "category": "wedding",
      "width": 1920,
      "height": 1080,
      "size": 2456789,
      "format": "jpg",
      "createdAt": "2025-11-11T09:00:00Z"
    }
  ],
  "total": 25,
  "limit": 25,
  "offset": 0
}
```

#### Example Request
```javascript
// Get all wedding photos
const response = await fetch('/api/media/category-photos?category=wedding')
const data = await response.json()

// Get first 10 photos
const response = await fetch('/api/media/category-photos?category=wedding&limit=10')
```

#### Error Responses

**Invalid Category**
```json
{
  "error": "Category parameter is required",
  "code": "INVALID_CATEGORY"
}
```

**Category Not Found**
```json
{
  "error": "Category not found",
  "code": "CATEGORY_NOT_FOUND",
  "details": {
    "category": "nonexistent"
  }
}
```

#### Source Location
File: [app/api/media/category-photos/route.js](../app/api/media/category-photos/route.js)

---

### 5. Get Category Videos

Retrieves all videos in a specific category.

#### Endpoint
```
GET /api/media/category-videos
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | Yes | Category slug (e.g., "wedding", "commercial") |
| `limit` | number | No | Maximum number of results (default: all) |
| `offset` | number | No | Pagination offset (default: 0) |

#### Response
```json
{
  "category": "wedding",
  "videos": [
    {
      "id": "uuid",
      "name": "Wedding Video 1",
      "url": "https://cdn.bunny.net/.../video.mp4",
      "thumbnail": "https://cdn.bunny.net/.../thumbnail.jpg",
      "type": "video",
      "category": "wedding",
      "width": 1920,
      "height": 1080,
      "size": 45678900,
      "format": "mp4",
      "duration": 180,
      "createdAt": "2025-11-11T08:00:00Z"
    }
  ],
  "total": 15,
  "limit": 15,
  "offset": 0
}
```

#### Example Request
```javascript
// Get all wedding videos
const response = await fetch('/api/media/category-videos?category=wedding')
const data = await response.json()

// Get first 5 videos with pagination
const response = await fetch('/api/media/category-videos?category=wedding&limit=5&offset=0')
```

#### Source Location
File: [app/api/media/category-videos/route.js](../app/api/media/category-videos/route.js)

---

## Future API Endpoints

These endpoints are planned for Phase 3+ implementation.

### Booking API (Planned)

#### Create Booking
```
POST /api/booking
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "date": "2025-12-15",
  "time": "14:00",
  "service": "wedding",
  "message": "Additional details..."
}
```

**Response:**
```json
{
  "bookingId": "uuid",
  "status": "pending",
  "calendarEventId": "google-calendar-id",
  "message": "Booking request received"
}
```

---

#### Get Available Times
```
GET /api/booking/availability?date=2025-12-15
```

**Response:**
```json
{
  "date": "2025-12-15",
  "available": [
    "09:00",
    "10:00",
    "14:00",
    "15:00"
  ],
  "booked": [
    "11:00",
    "13:00"
  ]
}
```

---

### Contact API (Planned)

#### Send Contact Form
```
POST /api/contact
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "General Inquiry",
  "message": "I'd like to know more about your services..."
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "uuid",
  "message": "Your message has been sent"
}
```

---

### Calendar API (Planned)

#### Sync Calendar
```
POST /api/calendar/sync
```

**Authorization:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "synced": 15,
  "updated": "2025-11-11T12:00:00Z"
}
```

---

## Rate Limiting

### Current
No rate limiting is currently implemented.

### Future
Rate limiting will be implemented for booking and contact endpoints:

- **Public endpoints:** 100 requests per 15 minutes per IP
- **Authenticated endpoints:** 500 requests per 15 minutes per user
- **Admin endpoints:** 1000 requests per 15 minutes

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699632000
```

## Examples

### Using Fetch API

```javascript
// Get main photos
async function getMainPhotos() {
  try {
    const response = await fetch('/api/media/main-photos')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const photos = await response.json()
    return photos
  } catch (error) {
    console.error('Error fetching photos:', error)
    throw error
  }
}
```

### Using Axios

```javascript
import axios from 'axios'

// Get category photos with error handling
async function getCategoryPhotos(category) {
  try {
    const { data } = await axios.get('/api/media/category-photos', {
      params: { category }
    })
    return data.photos
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Category not found:', category)
    } else {
      console.error('API error:', error.message)
    }
    throw error
  }
}
```

### Using Redux Thunk

```javascript
// media.action.js
export const fetchMediaStartAsync = () => {
  return async (dispatch) => {
    dispatch(fetchMediaStart())

    try {
      const photos = await fetch('/api/media/main-photos').then(r => r.json())
      const videos = await fetch('/api/media/main-videos').then(r => r.json())

      const media = [...photos, ...videos].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )

      dispatch(fetchMediaSuccess(media))
    } catch (error) {
      dispatch(fetchMediaFailure(error.message))
    }
  }
}
```

### React Component Integration

```javascript
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMediaStartAsync } from '@/store/media/media.action'
import { selectMediaMap, selectIsLoading } from '@/store/media/media.selector'

export default function MediaGallery() {
  const dispatch = useDispatch()
  const media = useSelector(selectMediaMap)
  const isLoading = useSelector(selectIsLoading)

  useEffect(() => {
    dispatch(fetchMediaStartAsync())
  }, [dispatch])

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {media.map(item => (
        <div key={item.id}>
          <img src={item.url} alt={item.name} />
        </div>
      ))}
    </div>
  )
}
```

### Error Handling Best Practices

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'API error')
      }

      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
}
```

## Testing API Endpoints

### Using cURL

```bash
# Get main photos
curl http://localhost:3000/api/media/main-photos

# Get category photos
curl "http://localhost:3000/api/media/category-photos?category=wedding"

# Get videos with limit
curl "http://localhost:3000/api/media/category-videos?category=wedding&limit=5"
```

### Using Postman

1. Create a new request
2. Set method to GET
3. Enter URL: `http://localhost:3000/api/media/main-photos`
4. Click Send
5. View JSON response

### Using Browser DevTools

```javascript
// Open browser console on your site
fetch('/api/media/main-photos')
  .then(r => r.json())
  .then(console.log)
```

## Caching

### CDN Caching

All media URLs from Bunny CDN are cached at edge locations globally:

- **Cache Duration:** 1 hour (configurable)
- **Cache-Control:** `public, max-age=3600`
- **Edge Locations:** Global (Bunny CDN)

### API Response Caching

Currently, API responses are not cached. Future implementation will include:

- **Redis caching** for frequently accessed data
- **Stale-while-revalidate** pattern
- **Cache invalidation** on media uploads

## CORS

### Current Configuration

API routes allow requests from the same origin (no CORS configuration needed).

### Future Configuration

For external API access:

```javascript
// next.config.mjs
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

## Versioning

### Current Version
API version: **v1** (implicit, no version prefix)

### Future Versioning
When breaking changes are needed:

```
/api/v2/media/main-photos
```

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md) - System architecture
- [Component Guide](COMPONENT_GUIDE.md) - Frontend component integration
- [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflows
- [Bunny Setup Guide](BUNNY_SETUP_GUIDE.md) - Storage configuration

---

**Last Updated:** 2025-11-11
**API Version:** v1
**Maintained by:** Bebe Portfolio Team
