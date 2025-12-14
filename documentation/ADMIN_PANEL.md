# Admin Panel - Client Media Delivery System

## Overview

The admin panel allows the photographer to send clients their photos/videos from a photoshoot. The system creates a unique link for each client to view and download their media files directly from Bunny.net storage.

## Features

1. **Admin Panel** (`/admin`) - Protected admin page with:
   - Input field for client folder name (subfolder in `clients/` on Bunny)
   - Input field for client email address
   - Send button to email the client

2. **Client Gallery** (`/gallery/[token]`) - Public page for clients to:
   - View all their media (photos/videos)
   - Select individual files or select all
   - Download selected files in original quality (100%)
   - Download as individual files (not ZIP)

3. **Email System** - Send beautiful email with gallery link to client

---

## Bunny.net Folder Structure

```
bebe-portfolio/
├── main/
│   ├── photos/
│   └── videos/
├── categories/
│   ├── photos/
│   └── videos/
└── clients/                    # NEW FOLDER
    ├── wedding-john-jane/      # Client subfolder
    │   ├── photo1.jpg
    │   ├── photo2.jpg
    │   └── video1.mp4
    ├── portrait-maria/
    │   ├── img001.jpg
    │   └── img002.jpg
    └── corporate-abc/
        └── ...
```

---

## Implementation Plan

### Phase 1: Backend API (Go)

#### 1.1 New Models

**File:** `backend/internal/models/client_gallery.go`

```go
package models

import "time"

type ClientGallery struct {
    ID          string    `json:"id"`
    Token       string    `json:"token"`       // Unique access token
    FolderName  string    `json:"folderName"`  // Bunny subfolder name
    ClientEmail string    `json:"clientEmail"`
    ClientName  string    `json:"clientName"`  // Optional, extracted from folder name
    CreatedAt   time.Time `json:"createdAt"`
    ExpiresAt   time.Time `json:"expiresAt"`   // Optional expiration
    AccessCount int       `json:"accessCount"` // Track views
}

type ClientMedia struct {
    Name     string `json:"name"`
    URL      string `json:"url"`
    Type     string `json:"type"`     // "image" or "video"
    Size     int64  `json:"size"`
    Created  string `json:"created"`
}
```

#### 1.2 New Service

**File:** `backend/internal/services/client_gallery.go`

```go
package services

// ClientGalleryService handles client gallery operations
type ClientGalleryService struct {
    emailService *EmailService
    galleries    map[string]*models.ClientGallery // In-memory storage (or use DB)
}

// CreateGalleryLink generates a unique token and stores gallery info
func (s *ClientGalleryService) CreateGalleryLink(folderName, clientEmail string) (*models.ClientGallery, error)

// GetGalleryByToken retrieves gallery info by token
func (s *ClientGalleryService) GetGalleryByToken(token string) (*models.ClientGallery, error)

// SendGalleryEmail sends email with gallery link to client
func (s *ClientGalleryService) SendGalleryEmail(gallery *models.ClientGallery, baseURL string) error
```

#### 1.3 New Handler

**File:** `backend/internal/handlers/admin.go`

```go
package handlers

// AdminHandler handles admin panel operations
type AdminHandler struct {
    galleryService *services.ClientGalleryService
}

// CreateClientGallery - POST /api/admin/gallery
// Request: { "folderName": "wedding-john", "email": "john@example.com" }
// Response: { "success": true, "token": "abc123", "galleryUrl": "..." }
func (h *AdminHandler) CreateClientGallery(c *gin.Context)

// ListClientFolders - GET /api/admin/folders
// Lists all subfolders in clients/ directory
func (h *AdminHandler) ListClientFolders(c *gin.Context)
```

#### 1.4 Update main.go

Add new routes:

```go
// Admin routes (consider adding basic auth middleware)
admin := api.Group("/admin")
{
    admin.POST("/gallery", adminHandler.CreateClientGallery)
    admin.GET("/folders", adminHandler.ListClientFolders)
}

// Client gallery route (public, token-based access)
api.GET("/gallery/:token", galleryHandler.GetGalleryMedia)
```

---

### Phase 2: Frontend - Admin Panel

#### 2.1 Admin Page

**File:** `app/admin/page.js`

```jsx
'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [folderName, setFolderName] = useState('');
    const [email, setEmail] = useState('');
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Fetch available folders on mount
    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        const res = await fetch('/api/admin/folders');
        const data = await res.json();
        setFolders(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName, email })
        });

        if (res.ok) {
            setSuccess(true);
            setFolderName('');
            setEmail('');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-900 p-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-white mb-8">
                    Admin Panel
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Folder name input with autocomplete from existing folders */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Client Folder Name
                        </label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            list="folders"
                            placeholder="e.g., wedding-john-jane"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
                            required
                        />
                        <datalist id="folders">
                            {folders.map(f => (
                                <option key={f} value={f} />
                            ))}
                        </datalist>
                    </div>

                    {/* Email input */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Client Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="client@example.com"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--accent-color)] text-black font-medium py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Gallery Link'}
                    </button>

                    {success && (
                        <div className="text-green-400 text-center">
                            Email sent successfully!
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
```

---

### Phase 3: Frontend - Client Gallery

#### 3.1 Client Gallery Page

**File:** `app/gallery/[token]/page.js`

```jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ClientGallery() {
    const { token } = useParams();
    const [media, setMedia] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchMedia();
    }, [token]);

    const fetchMedia = async () => {
        const res = await fetch(`/api/gallery/${token}`);
        const data = await res.json();
        setMedia(data.files || []);
        setLoading(false);
    };

    const toggleSelect = (name) => {
        const newSelected = new Set(selected);
        if (newSelected.has(name)) {
            newSelected.delete(name);
        } else {
            newSelected.add(name);
        }
        setSelected(newSelected);
    };

    const selectAll = () => {
        if (selected.size === media.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(media.map(m => m.name)));
        }
    };

    // Download files individually (not as ZIP)
    const downloadSelected = async () => {
        setDownloading(true);

        const selectedFiles = media.filter(m => selected.has(m.name));

        for (const file of selectedFiles) {
            // Download each file with original quality
            const response = await fetch(file.url);
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Small delay between downloads to prevent browser blocking
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setDownloading(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-zinc-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        Your Gallery
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={selectAll}
                            className="text-[var(--accent-color)] hover:underline"
                        >
                            {selected.size === media.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button
                            onClick={downloadSelected}
                            disabled={selected.size === 0 || downloading}
                            className="bg-[var(--accent-color)] text-black px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            {downloading
                                ? `Downloading ${selected.size}...`
                                : `Download (${selected.size})`}
                        </button>
                    </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <MediaCard
                            key={item.name}
                            item={item}
                            isSelected={selected.has(item.name)}
                            onToggle={() => toggleSelect(item.name)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function MediaCard({ item, isSelected, onToggle }) {
    const isVideo = item.type === 'video';

    return (
        <div
            onClick={onToggle}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
                isSelected ? 'ring-2 ring-[var(--accent-color)]' : ''
            }`}
        >
            {isVideo ? (
                <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                />
            ) : (
                <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            )}

            {/* Selection checkbox */}
            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isSelected
                    ? 'bg-[var(--accent-color)] border-[var(--accent-color)]'
                    : 'bg-black/50 border-white'
            }`}>
                {isSelected && (
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            {/* Video indicator */}
            {isVideo && (
                <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            )}

            {/* File name on hover */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{item.name}</p>
            </div>
        </div>
    );
}
```

---

### Phase 4: API Routes (Next.js)

#### 4.1 Admin API - List Folders

**File:** `app/api/admin/folders/route.js`

```javascript
import { NextResponse } from 'next/server';
import axios from 'axios';

const STORAGE_ZONE = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
const STORAGE_PASSWORD = process.env.BUNNY_STORAGE_PASSWORD;
const STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || '';

const STORAGE_API_URL = STORAGE_REGION
  ? `https://${STORAGE_REGION}.storage.bunnycdn.com/${STORAGE_ZONE}`
  : `https://storage.bunnycdn.com/${STORAGE_ZONE}`;

export async function GET() {
  try {
    const url = `${STORAGE_API_URL}/clients/`;

    const response = await axios.get(url, {
      headers: { 'AccessKey': STORAGE_PASSWORD },
    });

    // Get only directories (client folders)
    const folders = response.data
      .filter(f => f.IsDirectory)
      .map(f => f.ObjectName.replace('/', ''));

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error fetching client folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}
```

#### 4.2 Admin API - Create Gallery

**File:** `app/api/admin/gallery/route.js`

```javascript
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In production, use a database (PostgreSQL, MongoDB, etc.)
// For MVP, we can use simple token-based storage
const galleries = new Map();

export async function POST(request) {
  try {
    const { folderName, email } = await request.json();

    if (!folderName || !email) {
      return NextResponse.json(
        { error: 'Folder name and email are required' },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Store gallery info
    const gallery = {
      token,
      folderName,
      email,
      createdAt: new Date().toISOString(),
    };
    galleries.set(token, gallery);

    // Send email via backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    await fetch(`${backendUrl}/api/admin/send-gallery-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        folderName,
        galleryUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery/${token}`,
      }),
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
  }
}
```

#### 4.3 Client Gallery API - Get Media

**File:** `app/api/gallery/[token]/route.js`

```javascript
import { NextResponse } from 'next/server';
import axios from 'axios';

const STORAGE_ZONE = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
const STORAGE_PASSWORD = process.env.BUNNY_STORAGE_PASSWORD;
const CDN_HOSTNAME = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
const STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || '';

const STORAGE_API_URL = STORAGE_REGION
  ? `https://${STORAGE_REGION}.storage.bunnycdn.com/${STORAGE_ZONE}`
  : `https://storage.bunnycdn.com/${STORAGE_ZONE}`;
const CDN_URL = `https://${CDN_HOSTNAME}`;

// In production, retrieve from database
const galleries = new Map(); // Shared with gallery creation

export async function GET(request, { params }) {
  try {
    const { token } = params;

    // Validate token and get folder name
    const gallery = galleries.get(token);
    if (!gallery) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });
    }

    const url = `${STORAGE_API_URL}/clients/${gallery.folderName}/`;

    const response = await axios.get(url, {
      headers: { 'AccessKey': STORAGE_PASSWORD },
    });

    const files = response.data
      .filter(f => !f.IsDirectory)
      .filter(f => /\.(jpg|jpeg|png|webp|mp4|mov|avi|mkv)$/i.test(f.ObjectName))
      .map(file => ({
        name: file.ObjectName,
        url: `${CDN_URL}/clients/${gallery.folderName}/${file.ObjectName}`,
        type: /\.(mp4|mov|avi|mkv)$/i.test(file.ObjectName) ? 'video' : 'image',
        size: file.Length,
        created: file.DateCreated,
      }));

    return NextResponse.json({
      files,
      folderName: gallery.folderName,
      createdAt: gallery.createdAt
    });
  } catch (error) {
    console.error('Error fetching gallery media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
```

---

### Phase 5: Email Template

#### 5.1 Add to Email Service (Go Backend)

**Add to:** `backend/internal/services/email.go`

```go
// SendClientGalleryEmail sends gallery link to client
func (es *EmailService) SendClientGalleryEmail(email, folderName, galleryUrl string) error {
    // Extract client name from folder name (e.g., "wedding-john-jane" -> "John Jane")
    clientName := formatFolderName(folderName)

    html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 28px; font-weight: bold; color: #84cc16; }
        .content { background: #f9fafb; border-radius: 12px; padding: 32px; margin-bottom: 32px; }
        .button { display: inline-block; background: #84cc16; color: #000; padding: 16px 40px;
                  text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">BEBE</div>
        </div>

        <div class="content">
            <h2 style="margin-top: 0;">Your Photos Are Ready! 📸</h2>
            <p>Hello%s,</p>
            <p>Great news! Your photos from our session are now ready for viewing and download.</p>
            <p>Click the button below to access your personal gallery:</p>

            <div style="text-align: center;">
                <a href="%s" class="button">View My Gallery</a>
            </div>

            <p style="color: #666; font-size: 14px;">
                In your gallery, you can:
            </p>
            <ul style="color: #666; font-size: 14px;">
                <li>View all your photos and videos</li>
                <li>Select your favorites</li>
                <li>Download in full quality</li>
            </ul>
        </div>

        <div class="footer">
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Thank you for choosing BEBE Photography!</p>
        </div>
    </div>
</body>
</html>
    `, func() string {
        if clientName != "" {
            return " " + clientName
        }
        return ""
    }(), galleryUrl)

    return es.sendEmail(email, "Your Photos Are Ready! 📸", html)
}

func formatFolderName(folder string) string {
    // Convert "wedding-john-jane" to "John Jane"
    parts := strings.Split(folder, "-")
    if len(parts) > 1 {
        // Skip first part (event type) and capitalize rest
        names := parts[1:]
        for i, name := range names {
            names[i] = strings.Title(name)
        }
        return strings.Join(names, " ")
    }
    return ""
}
```

---

## Environment Variables

Add to `.env.local` (frontend) and `backend/.env`:

```env
# Frontend (.env.local)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Backend (.env)
SITE_URL=https://your-domain.com
DATABASE_URL=postgresql://username:password@your-koyeb-postgres-host:5432/dbname?sslmode=require
```

---

## Database Setup (PostgreSQL on Koyeb)

### Connection String

Your Koyeb PostgreSQL connection string format:
```
postgresql://[username]:[password]@[host]:[port]/[database]?sslmode=require
```

Add to `backend/.env`:
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.koyeb.app:5432/koyebdb?sslmode=require
```

### Database Schema

Run these SQL commands in your Koyeb PostgreSQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin users table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client galleries table
CREATE TABLE galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) UNIQUE NOT NULL,
    folder_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    access_count INT DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster token lookups
CREATE INDEX idx_galleries_token ON galleries(token);

-- Future tables for shop
-- CREATE TABLE products (...);
-- CREATE TABLE orders (...);
-- CREATE TABLE customers (...);

-- Insert initial admin (change password after first login!)
-- Password: admin123 (bcrypt hash)
INSERT INTO admins (email, password_hash, name) VALUES (
    'admin@bebe.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin'
);
```

### Go Backend - Database Integration

**File:** `backend/internal/database/postgres.go`

```go
package database

import (
    "database/sql"
    "os"

    _ "github.com/lib/pq"
)

var DB *sql.DB

func Init() error {
    var err error
    DB, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
    if err != nil {
        return err
    }

    // Test connection
    if err = DB.Ping(); err != nil {
        return err
    }

    return nil
}

func Close() {
    if DB != nil {
        DB.Close()
    }
}
```

**Update:** `backend/go.mod` - Add PostgreSQL driver:

```bash
cd backend
go get github.com/lib/pq
```

### Admin Authentication Flow

1. **Login** (`POST /api/admin/login`)
   - Receive email + password
   - Verify against database (bcrypt)
   - Return JWT token

2. **Protected Routes**
   - All `/api/admin/*` routes require JWT in header
   - Middleware validates token

3. **Session**
   - JWT stored in localStorage
   - Auto-logout after expiration (24h)

---

## Security Considerations

1. **Token-based Access**: Each gallery link has a unique cryptographic token
2. **No Login Required**: Clients don't need to create accounts
3. **Optional Expiration**: Links can expire after X days (configurable)
4. **Access Tracking**: Track how many times a gallery was viewed

### Future Enhancements

1. **Admin Authentication**: Add password protection to `/admin`
   - Simple: Basic HTTP auth
   - Better: NextAuth.js with credentials provider

2. **Database Storage**: Replace in-memory Map with PostgreSQL/SQLite

3. **Gallery Management**: List all sent galleries, resend links, revoke access

4. **Download Tracking**: Track which files were downloaded

5. **Watermarks**: Option to show watermarked previews

---

## File Download - Technical Details

### Why Individual Downloads (Not ZIP)?

1. **Original Quality**: ZIP compression can affect image quality
2. **Progress Visibility**: Users see each file downloading
3. **Resume Capability**: If interrupted, partial downloads are possible
4. **Simpler Implementation**: No server-side ZIP generation needed

### Download Implementation

```javascript
// Sequential download with delays to prevent browser blocking
const downloadSelected = async () => {
    for (const file of selectedFiles) {
        // Fetch with no-cache to ensure fresh download
        const response = await fetch(file.url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
            }
        });

        const blob = await response.blob();

        // Create temporary download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name; // Original filename
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(downloadUrl);

        // 500ms delay between downloads
        await new Promise(r => setTimeout(r, 500));
    }
};
```

---

## Testing Checklist

- [ ] Create `clients` folder on Bunny.net
- [ ] Add test subfolder with sample images
- [ ] Test admin panel folder listing
- [ ] Test email sending
- [ ] Test gallery link access
- [ ] Test file selection (single, multiple, all)
- [ ] Test download functionality
- [ ] Test invalid token handling
- [ ] Test mobile responsiveness

---

## Estimated Implementation Time

| Phase | Task | Time |
|-------|------|------|
| 1 | Backend API (Go) | 2-3 hours |
| 2 | Admin Panel (React) | 1-2 hours |
| 3 | Client Gallery (React) | 2-3 hours |
| 4 | Next.js API Routes | 1-2 hours |
| 5 | Email Template | 30 min |
| 6 | Testing & Fixes | 1-2 hours |
| **Total** | | **8-12 hours** |
