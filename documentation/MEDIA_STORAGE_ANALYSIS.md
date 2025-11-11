# Media Storage Analysis & Migration Plan

## Current Firebase Structure

### Storage Organization
```
Firebase Storage Root
├── main/
│   ├── fotos/              # Main page slider photos
│   ├── videos/             # Main page slider videos
│   └── video_categories/   # Category thumbnail images for video portfolio
├── fotos/
│   ├── {category1}/        # Photos in category1
│   ├── {category2}/        # Photos in category2
│   └── ...
└── videos/
    ├── {category1}/        # Videos in category1
    ├── {category2}/        # Videos in category2
    └── ...
```

### Usage Breakdown

#### 1. Main Page Slider
- **Path:** `main/fotos` and `main/videos`
- **Purpose:** Horizontal scrollable media shown on homepage
- **Current Implementation:** Mixed photos and videos
- **Loads:** On app initialization

#### 2. Portfolio Categories
- **Path:** `main/video_categories` (thumbnail images)
- **Purpose:** Category cards on portfolio page
- **Click Action:** Opens full gallery for that category
- **Example:** "Weddings", "Portraits", "Events" thumbnails

#### 3. Photo Galleries
- **Path:** `fotos/{categoryName}/`
- **Purpose:** Full photo collection for a category
- **Access:** After clicking category card
- **Uses:** Lightbox (yet-another-react-lightbox)

#### 4. Video Galleries
- **Path:** `videos/{categoryName}/`
- **Purpose:** Full video collection for a category
- **Access:** After clicking category card
- **Uses:** Lightbox with video player

### Current Cost Issues
- Firebase Storage pricing: ~$0.026/GB + $0.12/GB egress
- For 100GB + bandwidth: **$40-100/month**
- Problem: Costs scale rapidly with traffic

---

## Storage Solution Comparison

### Option 1: Cloudflare R2 ⭐ RECOMMENDED

**Pricing:**
- Storage: $0.015/GB/month ($15 per TB)
- Egress: **$0** (FREE - this is the killer feature)
- Class A operations (write/list): $4.50 per million
- Class B operations (read): $0.36 per million
- Free tier: 10GB storage, 1M Class B ops/month

**Monthly Cost Example (100GB, 10k visitors, 5 media/visitor):**
- Storage: $1.50
- Egress: $0
- Reads (50k): ~$0.02
- **Total: ~$1.52/month**

**Pros:**
- Zero egress fees (massive savings)
- S3-compatible API (easy migration)
- Global CDN included
- Presigned URLs for private sharing
- Excellent Vercel integration
- Simple setup

**Cons:**
- Relatively new (launched 2022)
- Less tooling ecosystem than AWS S3

**Best For:**
- High bandwidth sites
- Cost-sensitive projects
- S3-compatible workflow

---

### Option 2: Bunny.net CDN + Storage 🚀 STRONG ALTERNATIVE

**Pricing:**
- Storage: $0.01/GB/month ($10 per TB)
- Bandwidth: $0.01/GB (first 500GB), then $0.005-0.03/GB by region
- Free SSL
- 114 edge locations worldwide

**Monthly Cost Example (100GB, 10k visitors, 5 media/visitor @ 10MB each):**
- Storage: $1.00
- Bandwidth (500GB): $5.00
- **Total: ~$6.00/month**

**Bunny.net Features:**
- **Video Streaming:** Built-in video transcoding and adaptive streaming
- **Image Optimization:** Automatic WebP/AVIF conversion
- **Perma-Cache:** Keeps popular content cached forever
- **Real-time Purging:** Instant cache invalidation
- **Stream Service:** Dedicated video hosting with player
- **Replication:** 6+ storage regions
- **Simple API:** RESTful, no AWS SDK needed

**Pros:**
- Extremely fast CDN (114 locations)
- Video streaming built-in (no extra setup)
- Image optimization automatic
- Cheaper storage than R2
- Simple, developer-friendly API
- Excellent video support
- Great for media-heavy sites

**Cons:**
- Bandwidth costs (though very cheap)
- Not S3-compatible (different API)
- Less integration with other services

**Best For:**
- Video portfolio sites (like yours!)
- Media-heavy applications
- Need built-in video streaming
- Want automatic image optimization

---

### Option 3: Backblaze B2 + Cloudflare CDN

**Pricing:**
- Storage: $0.005/GB ($5 per TB) - CHEAPEST
- Egress to Cloudflare: FREE
- Cloudflare CDN: FREE

**Monthly Cost Example:**
- Storage (100GB): $0.50
- Egress: $0 (via Cloudflare)
- **Total: ~$0.50/month**

**Pros:**
- Cheapest storage option
- Free egress to Cloudflare
- S3-compatible
- Reliable

**Cons:**
- Requires two-service setup (B2 + Cloudflare)
- More complex configuration
- Cloudflare setup takes time

**Best For:**
- Minimum budget
- Willing to handle complexity
- Long-term storage

---

## Detailed Recommendation: **Bunny.net**

### Why Bunny.net for YOUR Project?

Given your specific requirements, **Bunny.net is the best choice** because:

1. **Video Portfolio Focus**
   - Built-in video streaming (no Video.js needed)
   - Adaptive bitrate streaming automatic
   - Video thumbnails generated automatically
   - Perfect for your main page slider

2. **Image Optimization**
   - Automatic WebP/AVIF conversion
   - Responsive image serving
   - No manual optimization needed

3. **Performance**
   - 114 global edge locations
   - Faster than Cloudflare R2 in many regions
   - Real-time purging

4. **Developer Experience**
   - Simple RESTful API
   - Excellent documentation
   - Great dashboard
   - Fast setup

5. **Cost-Effective**
   - ~$6/month for 100GB + 500GB bandwidth
   - Video streaming included (no extra service)
   - Room to grow

6. **Private Link Sharing**
   - Signed URLs support
   - Token authentication
   - Time-limited access

### Bunny.net Implementation Plan

#### Storage Structure
```
Bunny Storage Zone: bebe-portfolio
├── main/
│   ├── photos/              # Main slider photos
│   └── videos/              # Main slider videos
├── categories/
│   ├── photos/              # Category thumbnails
│   └── videos/              # Category thumbnails
├── galleries/
│   ├── photos/
│   │   ├── weddings/
│   │   ├── portraits/
│   │   └── ...
│   └── videos/
│       ├── weddings/
│       ├── events/
│       └── ...
└── private/                 # Future: User file sharing
    └── {userId}/
        └── {fileId}/
```

#### CDN Pull Zone Configuration
```
Pull Zone: bebe-cdn.b-cdn.net
├── Connected to: bebe-portfolio storage
├── Cache: Perma-cache enabled
├── Optimization: Image optimization ON
├── Security: Token authentication enabled
└── SSL: Free Let's Encrypt
```

---

## Migration Implementation

### Phase 1: Bunny.net Setup (Day 1)

#### Step 1: Create Account
1. Sign up at bunny.net
2. Verify email
3. Add payment method (no charge until usage)

#### Step 2: Create Storage Zone
```bash
# Via Bunny Dashboard:
1. Go to Storage → Add Storage Zone
2. Name: bebe-portfolio
3. Region: Choose closest to your users (e.g., NY for US East)
4. Replication: Enable for redundancy
```

#### Step 3: Create CDN Pull Zone
```bash
# Via Bunny Dashboard:
1. Go to CDN → Add Pull Zone
2. Type: Standard
3. Origin: Connect to bebe-portfolio storage zone
4. Hostname: bebe-cdn (full: bebe-cdn.b-cdn.net)
5. Enable: Perma-cache, Image optimization
```

#### Step 4: Get API Credentials
```bash
# Save these to .env.local:
BUNNY_STORAGE_ZONE_NAME=bebe-portfolio
BUNNY_STORAGE_PASSWORD=<from dashboard>
BUNNY_CDN_HOSTNAME=bebe-cdn.b-cdn.net
BUNNY_STORAGE_REGION=ny  # or your chosen region
```

### Phase 2: Code Implementation (Day 1-2)

#### Install Dependencies
```bash
npm install axios
# No special SDK needed - simple REST API!
```

#### Create Bunny Utility (`utils/bunny.utils.js`)
```javascript
import axios from 'axios';

const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE_NAME;
const STORAGE_PASSWORD = process.env.BUNNY_STORAGE_PASSWORD;
const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME;
const STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || 'ny';

const STORAGE_API_URL = `https://${STORAGE_REGION}.storage.bunnycdn.com/${STORAGE_ZONE}`;
const CDN_URL = `https://${CDN_HOSTNAME}`;

// Upload file to Bunny Storage
export const uploadFile = async (filePath, fileBuffer, contentType) => {
  const url = `${STORAGE_API_URL}/${filePath}`;

  try {
    const response = await axios.put(url, fileBuffer, {
      headers: {
        'AccessKey': STORAGE_PASSWORD,
        'Content-Type': contentType,
      },
    });

    return {
      success: true,
      url: `${CDN_URL}/${filePath}`,
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error };
  }
};

// List files in a directory
export const listFiles = async (path) => {
  const url = `${STORAGE_API_URL}/${path}/`;

  try {
    const response = await axios.get(url, {
      headers: {
        'AccessKey': STORAGE_PASSWORD,
      },
    });

    return response.data.map(file => ({
      name: file.ObjectName,
      path: file.Path,
      url: `${CDN_URL}${file.Path}`,
      size: file.Length,
      dateCreated: file.DateCreated,
      isDirectory: file.IsDirectory,
    }));
  } catch (error) {
    console.error('List failed:', error);
    return [];
  }
};

// Get signed URL (for private content)
export const getSignedUrl = (filePath, expiresInSeconds = 3600) => {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const signatureToken = process.env.BUNNY_TOKEN_KEY; // Set this in dashboard

  // Bunny URL signing format
  const hashData = `${signatureToken}${filePath}${expires}`;
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(hashData).digest('base64');
  const urlSafeHash = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return `${CDN_URL}/${filePath}?token=${urlSafeHash}&expires=${expires}`;
};

// Main page photos
export const getMainPhotos = async () => {
  try {
    const files = await listFiles('main/photos');
    return files
      .filter(f => !f.isDirectory && /\.(jpg|jpeg|png|webp)$/i.test(f.name))
      .map(file => ({
        name: file.name,
        alt: file.name.split('.')[0],
        url: file.url,
        mediaType: 'img',
        dateCreated: file.dateCreated,
      }));
  } catch (error) {
    console.error('Error fetching main photos:', error);
    return [];
  }
};

// Main page videos
export const getMainVideos = async () => {
  try {
    const files = await listFiles('main/videos');
    return files
      .filter(f => !f.isDirectory && /\.(mp4|webm|mov)$/i.test(f.name))
      .map(file => ({
        name: file.name,
        alt: file.name.split('.')[0],
        url: file.url,
        mediaType: 'video',
        dateCreated: file.dateCreated,
      }));
  } catch (error) {
    console.error('Error fetching main videos:', error);
    return [];
  }
};

// Video category thumbnails
export const getVideoCategories = async () => {
  try {
    const files = await listFiles('categories/videos');
    return files
      .filter(f => !f.isDirectory && /\.(jpg|jpeg|png|webp)$/i.test(f.name))
      .map(file => ({
        name: file.name,
        alt: file.name.split('.')[0],
        url: file.url,
        mediaType: 'img',
        dateCreated: file.dateCreated,
      }));
  } catch (error) {
    console.error('Error fetching video categories:', error);
    return [];
  }
};

// Category photos
export const getCategoryPhotos = async (category) => {
  try {
    const files = await listFiles(`galleries/photos/${category}`);
    return files
      .filter(f => !f.isDirectory && /\.(jpg|jpeg|png|webp)$/i.test(f.name))
      .map(file => ({
        name: file.name,
        alt: file.name.split('.')[0],
        url: file.url,
        mediaType: 'img',
        dateCreated: file.dateCreated,
      }));
  } catch (error) {
    console.error('Error fetching category photos:', error);
    return [];
  }
};

// Category videos
export const getCategoryVideos = async (category) => {
  try {
    const files = await listFiles(`galleries/videos/${category}`);
    return files
      .filter(f => !f.isDirectory && /\.(mp4|webm|mov)$/i.test(f.name))
      .map(file => ({
        name: file.name,
        alt: file.name.split('.')[0],
        url: file.url,
        mediaType: 'video',
        dateCreated: file.dateCreated,
      }));
  } catch (error) {
    console.error('Error fetching category videos:', error);
    return [];
  }
};
```

### Phase 3: Update Redux Actions (Day 2)

Replace Firebase imports with Bunny imports in:
- `store/photos/photos.action.js`
- `store/videos/videos.action.js`

```javascript
// Change from:
import { getMainPhotos, getCategoryPhotos } from "@/utils/firebase.utils";

// To:
import { getMainPhotos, getCategoryPhotos } from "@/utils/bunny.utils";
```

**That's it!** The rest of your Redux code stays the same because the function signatures match.

### Phase 4: Migration Script (Day 3)

Create script to copy Firebase → Bunny:

```javascript
// scripts/migrate-firebase-to-bunny.js
const admin = require('firebase-admin');
const { uploadFile } = require('../utils/bunny.utils');
const axios = require('axios');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-admin-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

async function migrateDirectory(firebasePath, bunnyPath) {
  console.log(`Migrating ${firebasePath} → ${bunnyPath}`);

  const [files] = await bucket.getFiles({ prefix: firebasePath });

  for (const file of files) {
    const [fileBuffer] = await file.download();
    const fileName = file.name.split('/').pop();
    const destPath = `${bunnyPath}/${fileName}`;

    console.log(`  Uploading ${fileName}...`);
    const result = await uploadFile(destPath, fileBuffer, file.metadata.contentType);

    if (result.success) {
      console.log(`  ✓ ${fileName} uploaded`);
    } else {
      console.error(`  ✗ ${fileName} failed`);
    }
  }
}

async function migrate() {
  await migrateDirectory('main/fotos', 'main/photos');
  await migrateDirectory('main/videos', 'main/videos');
  await migrateDirectory('main/video_categories', 'categories/videos');

  // Migrate all photo categories
  const [photoDirs] = await bucket.getFiles({ prefix: 'fotos/', delimiter: '/' });
  for (const dir of photoDirs.prefixes || []) {
    const category = dir.replace('fotos/', '').replace('/', '');
    await migrateDirectory(`fotos/${category}`, `galleries/photos/${category}`);
  }

  // Migrate all video categories
  const [videoDirs] = await bucket.getFiles({ prefix: 'videos/', delimiter: '/' });
  for (const dir of videoDirs.prefixes || []) {
    const category = dir.replace('videos/', '').replace('/', '');
    await migrateDirectory(`videos/${category}`, `galleries/videos/${category}`);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
```

### Phase 5: Testing (Day 3-4)

1. Test main slider loads correctly
2. Test category navigation
3. Test photo galleries
4. Test video galleries
5. Verify CDN performance
6. Check mobile performance

### Phase 6: Cleanup (Day 5)

1. Monitor for 1 week alongside Firebase
2. Confirm zero errors
3. Remove Firebase dependencies:
   ```bash
   npm uninstall firebase
   ```
4. Delete `utils/firebase.utils.js`
5. Remove Firebase env variables
6. Delete Firebase project (after confirming all works)

---

## Bunny.net Advanced Features for Future

### 1. Bunny Stream (Video Streaming)
- Dedicated video service
- Automatic transcoding
- Adaptive bitrate
- Built-in player
- Analytics

**Future Enhancement:** Move videos to Bunny Stream for better performance

### 2. Image Optimization
Already enabled! Automatic:
- WebP conversion: `?format=webp`
- Responsive: `?width=800`
- Quality: `?quality=85`
- Crop: `?crop=16:9`

**Usage:**
```javascript
const optimizedUrl = `${mediaUrl}?width=800&format=webp&quality=85`;
```

### 3. Private File Sharing
For your future feature (unique link sharing):

```javascript
// Generate 24-hour private link
const privateUrl = getSignedUrl('private/user123/file.jpg', 86400);
// Share this URL - expires in 24 hours
```

---

## Cost Projections

### Current (Firebase)
- 100GB storage: $2.60
- 500GB bandwidth: $60
- **Total: ~$62.60/month**

### With Bunny.net
- 100GB storage: $1.00
- 500GB bandwidth: $5.00
- **Total: ~$6.00/month**
- **Savings: ~$56/month ($672/year)**

### At Scale (500GB storage, 5TB bandwidth)
- Firebase: ~$612/month
- Bunny.net: ~$30/month
- **Savings: ~$582/month ($6,984/year)**

---

## Decision Matrix

| Feature | Cloudflare R2 | Bunny.net | Backblaze B2 |
|---------|---------------|-----------|--------------|
| **Storage Cost** | $0.015/GB | $0.01/GB | $0.005/GB |
| **Bandwidth Cost** | $0 | $0.01/GB | $0 (via CF) |
| **Video Streaming** | No | Yes | No |
| **Image Optimization** | No | Yes | No |
| **API Complexity** | S3 (complex) | REST (simple) | S3 (complex) |
| **CDN Speed** | Excellent | Excellent | Good |
| **Setup Complexity** | Low | Very Low | Medium |
| **Best For** | High bandwidth | Media sites | Budget |
| **Your Cost (100GB)** | ~$1.50 | ~$6.00 | ~$0.50 |

---

## Final Recommendation

**Choose Bunny.net** because:
1. Built specifically for media/video sites
2. Automatic video and image optimization
3. Simple API and setup
4. Great performance
5. Perfect for your portfolio use case
6. Room to grow with advanced features
7. Excellent documentation and support

Alternative: **Cloudflare R2** if you prefer zero bandwidth costs and S3 compatibility.

---

**Next Step:** Approve Bunny.net and I'll start implementation immediately.

