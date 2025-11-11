# Technology Recommendations

## Media Storage Solution

### Recommended: Cloudflare R2

**Why?**
- Zero egress fees (free data transfer out)
- S3-compatible API (easy migration path)
- Global CDN included
- $0.015/GB storage ($15 per TB)
- Generous free tier: 10GB storage, 1M reads/month
- Built for Vercel integration

**Cost Example:**
- 100GB media storage: ~$1.50/month
- Unlimited bandwidth: $0
- 1M file requests: $0

**Private Link Sharing:**
- Generate presigned URLs with expiration
- No public bucket access needed
- Secure token-based access

**Setup Steps:**
1. Create Cloudflare account
2. Enable R2 in dashboard
3. Create bucket
4. Generate API tokens
5. Install AWS SDK (S3-compatible)

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Implementation:**
```javascript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Upload file
await s3Client.send(new PutObjectCommand({
  Bucket: "bebe-media",
  Key: "videos/example.mp4",
  Body: fileBuffer,
  ContentType: "video/mp4",
}));

// Generate private link (expires in 1 hour)
const url = await getSignedUrl(s3Client, new GetObjectCommand({
  Bucket: "bebe-media",
  Key: "videos/example.mp4",
}), { expiresIn: 3600 });
```

---

### Alternative: Backblaze B2 + Cloudflare CDN

**Why?**
- Cheapest storage: $0.005/GB ($5 per TB)
- Free egress to Cloudflare
- Cloudflare CDN for speed
- S3-compatible API

**Cost Example:**
- 100GB storage: $0.50/month
- Cloudflare bandwidth: Free (with CDN setup)

**Trade-off:** Requires two services setup (B2 + Cloudflare)

---

## Backend Technology

### Recommended: Go + Fiber Framework

**Why Go?**
- Fast performance
- Low memory footprint
- Easy deployment
- Great for APIs
- Strong concurrency support

**Why Fiber?**
- Express-like API (familiar)
- Fastest Go web framework
- Easy middleware
- Built-in WebSocket support

**Setup:**
```bash
go mod init github.com/yourusername/bebe-backend

# Install dependencies
go get github.com/gofiber/fiber/v2
go get github.com/lib/pq                    # PostgreSQL driver
go get google.golang.org/api/calendar/v3    # Google Calendar
go get github.com/sendgrid/sendgrid-go      # SendGrid email
```

**Project Structure:**
```
backend/
├── cmd/server/main.go           # Entry point
├── internal/
│   ├── handlers/
│   │   ├── booking.go           # Booking endpoints
│   │   ├── contact.go           # Contact form
│   │   └── media.go             # Media management
│   ├── services/
│   │   ├── calendar.go          # Google Calendar logic
│   │   ├── email.go             # Email sending
│   │   └── storage.go           # R2/B2 interactions
│   ├── models/
│   │   ├── booking.go           # Booking model
│   │   └── user.go              # User model
│   └── middleware/
│       ├── auth.go              # Authentication
│       └── cors.go              # CORS config
├── config/
│   └── config.go                # Configuration
├── migrations/
│   └── 001_initial.sql          # Database migrations
└── go.mod
```

---

## Database

### Recommended: PostgreSQL (Neon or Supabase)

**Why PostgreSQL?**
- Reliable and robust
- JSON support for flexible data
- Good for relational data (bookings, users)
- Free tier available

**Hosting Options:**

#### Option 1: Neon (Recommended)
- Serverless PostgreSQL
- Generous free tier
- Auto-scaling
- Good for Vercel projects
- Free: 0.5GB storage

#### Option 2: Supabase
- PostgreSQL + instant APIs
- Generous free tier
- Real-time subscriptions
- Authentication included
- Free: 500MB storage

**Schema Example:**
```sql
-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  booking_date TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,  -- minutes
  status VARCHAR(50) NOT NULL,  -- pending, confirmed, cancelled
  confirmation_token VARCHAR(255) UNIQUE,
  google_event_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact submissions
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_token ON bookings(confirmation_token);
```

---

## Email Service

### Recommended: Resend

**Why Resend?**
- Modern, developer-friendly
- Simple API
- React email templates support
- 3,000 emails/month free
- $20/month for 50,000 emails
- Excellent deliverability

**Alternative: SendGrid**
- 100 emails/day free
- More established
- More features (marketing, etc.)

**Setup (Resend):**
```bash
npm install resend
```

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'booking@yourdomain.com',
  to: 'owner@example.com',
  subject: 'New Booking Request',
  html: '<p>User wants to book...</p>',
});
```

**Email Templates:**
- Use React components for emails
- `@react-email/components` package
- Version control email templates

---

## Frontend Enhancements

### Video Player

**Recommended: Video.js**
- Feature-rich
- Customizable
- Plugin ecosystem
- Mobile-friendly

```bash
npm install video.js
```

**Alternative: Plyr**
- Modern, lightweight
- Beautiful UI
- YouTube/Vimeo support

---

### Lightbox for Photos

**Already Installed: yet-another-react-lightbox**
- Modern, performant
- Customizable
- Mobile gestures
- Zoom support

**Usage:**
```javascript
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

<Lightbox
  open={open}
  close={() => setOpen(false)}
  slides={[
    { src: "/image1.jpg" },
    { src: "/image2.jpg" },
  ]}
  plugins={[Zoom]}
/>
```

---

### Calendar UI

**Recommended: react-big-calendar**
- Full-featured
- Month/week/day views
- Customizable styling
- Event handling

```bash
npm install react-big-calendar date-fns
```

**Alternative: Build Custom**
- More control
- Lighter weight
- Use `date-fns` for date logic
- Tailwind for styling

---

## Backend Hosting

### Recommended: Railway

**Why?**
- Simple deployment
- GitHub integration
- PostgreSQL included
- $5/month credit free
- Pay for usage

**Setup:**
1. Connect GitHub repo
2. Railway auto-detects Go
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

---

### Alternative: Fly.io

**Why?**
- Global edge deployment
- Free tier available
- Great for Go apps
- Built-in PostgreSQL

---

## Development Tools

### API Testing
- **Recommended:** Bruno (open-source, Git-friendly)
- **Alternative:** Postman, Insomnia

### Database Management
- **Recommended:** TablePlus (beautiful UI)
- **Alternative:** pgAdmin, DBeaver

### Go Development
- **IDE:** VS Code with Go extension
- **Tools:**
  - `air` for hot reload
  - `golangci-lint` for linting
  - `swag` for API documentation

---

## Security Considerations

### API Security
- Rate limiting (use `fiber-limiter`)
- CORS configuration
- Input validation
- SQL injection prevention (use parameterized queries)

### Media Security
- Presigned URLs for private content
- Token expiration
- Access logging

### Email Security
- Verify sender domain (SPF, DKIM, DMARC)
- Use secure tokens for confirmations
- Token expiration (24-48 hours)

---

## Performance Optimizations

### Frontend
- Image optimization (Next.js Image component)
- Video lazy loading
- Code splitting
- Bundle analysis: `npm install @next/bundle-analyzer`

### Backend
- Connection pooling (PostgreSQL)
- Redis caching (future)
- CDN for static assets
- Gzip compression

### Media Delivery
- Cloudflare CDN
- Adaptive bitrate streaming (future)
- Image formats: WebP, AVIF
- Video formats: MP4 (H.264)

---

## Cost Estimate (Monthly)

### Minimal Setup
- Cloudflare R2 (100GB): ~$1.50
- Neon PostgreSQL: Free
- Railway (Backend): $5 credit (likely free)
- Resend (Email): Free (3k emails)
- Vercel (Frontend): Free
- **Total: ~$0-2/month**

### Growing Usage (500GB media, 10k emails)
- Cloudflare R2 (500GB): ~$7.50
- Neon PostgreSQL: Free
- Railway: ~$10-15
- Resend: $20
- Vercel: Free
- **Total: ~$38-43/month**

### Comparison to Current (Firebase)
- Firebase Storage: ~$50-100/month for same usage
- **Savings: ~$50-60/month**

---

## Migration Path from Firebase

### Phase 1: Parallel Run
1. Set up R2
2. Upload new media to both Firebase and R2
3. Update code to read from R2 first, fallback to Firebase

### Phase 2: Migration
1. Copy existing Firebase media to R2
2. Update all references
3. Test thoroughly

### Phase 3: Decommission
1. Monitor for 2-4 weeks
2. Verify no Firebase usage
3. Delete Firebase storage
4. Remove Firebase dependencies

---

**Last Updated:** 2025-11-09
