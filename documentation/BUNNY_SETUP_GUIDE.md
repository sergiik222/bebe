# Bunny.net Setup Guide

## Step-by-Step Instructions

### Step 1: Create Bunny.net Account (5 minutes)

1. Go to https://bunny.net
2. Click "Get Started" or "Sign Up"
3. Enter your email and create a password
4. Verify your email
5. Add a payment method (you won't be charged until you use it)
   - Free tier: 10GB storage, 1M requests/month
   - No credit card required for trial

---

### Step 2: Create Storage Zone (2 minutes)

1. **Login to Bunny Dashboard**
   - Go to: https://dash.bunny.net

2. **Navigate to Storage**
   - In left sidebar, click **"Storage"**
   - Click **"Add Storage Zone"**

3. **Configure Storage Zone**
   ```
   Name: bebe-portfolio
   Region: Choose closest to your users
      - US East: New York (ny)
      - US West: Los Angeles (la)
      - Europe: Frankfurt (de), London (uk)
      - Asia: Singapore (sg)

   Replication: Enable (recommended for redundancy)
   ```

4. **Click "Add Storage Zone"**

5. **Save Your Credentials**
   - After creation, you'll see your storage zone
   - Click on "bebe-portfolio" to view details
   - Copy the **Password/API Key** (looks like: `abc123-def456-ghi789-...`)
   - Keep this safe - you'll need it in Step 4

---

### Step 3: Create CDN Pull Zone (2 minutes)

1. **Navigate to CDN**
   - In left sidebar, click **"CDN"**
   - Click **"Add Pull Zone"**

2. **Configure Pull Zone**
   ```
   Name: bebe-cdn
   Type: Standard
   Origin Type: Bunny Storage Zone
   Storage Zone: Select "bebe-portfolio"
   ```

3. **Enable Optimizations** (in Settings after creation)
   - Navigate to the pull zone settings
   - Enable: **"Perma-Cache"** (keeps popular files cached)
   - Enable: **"Smart Image Optimization"**
   - Enable: **"WebP Vary Support"**

4. **Save Your CDN Hostname**
   - After creation, note the hostname
   - It will be: `bebe-cdn.b-cdn.net`

---

### Step 4: Configure Environment Variables (2 minutes)

Open your `.env.local` file and add these variables:

```bash
# Bunny.net Configuration
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=bebe-portfolio
BUNNY_STORAGE_PASSWORD=your_storage_password_here
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=bebe-cdn.b-cdn.net
BUNNY_STORAGE_REGION=ny

# Optional: For private file sharing (future feature)
# BUNNY_TOKEN_KEY=your_token_key_here
```

**Replace:**
- `your_storage_password_here` with the password from Step 2
- `ny` with your chosen region (if different)

**Keep your existing Firebase variables for now** (we'll remove them later)

---

### Step 5: Install Dependencies (1 minute)

Axios is already in your dependencies, but let's make sure:

```bash
npm install
```

That's it! No special Bunny SDK needed - we use simple REST API.

---

### Step 6: Test the Setup (2 minutes)

Let's test that everything is connected properly:

```bash
# Dry run - shows what would be migrated without actually uploading
node scripts/migrate-firebase-to-bunny.js --dry-run --test-only
```

**Expected output:**
```
╔════════════════════════════════════════════════════════════╗
║     Firebase Storage → Bunny.net CDN Migration             ║
╚════════════════════════════════════════════════════════════╝

⚠️  DRY RUN MODE - No files will be uploaded
🧪 TEST MODE - Only first 3 files per directory

Bunny Storage Zone: bebe-portfolio
Bunny Region: ny

📁 Migrating: Main Page Slider - Photos
   Firebase: main/fotos
   Bunny: main/photos
   Found 10 files (migrating first 3)
   → image1.jpg
     [DRY RUN] Would upload to: main/photos/image1.jpg
...
```

**If you see errors:**
- Check that your Bunny credentials are correct in `.env.local`
- Verify your storage zone name matches exactly
- Ensure your API password is copied correctly

---

### Step 7: Run Migration (Time varies)

Once the dry run looks good, run the actual migration:

#### Option A: Test with a few files first
```bash
node scripts/migrate-firebase-to-bunny.js --test-only
```
This uploads only the first 3 files from each directory. Great for testing!

#### Option B: Full migration
```bash
node scripts/migrate-firebase-to-bunny.js
```

**What to expect:**
- 10GB of files: ~30 minutes
- 50GB of files: ~2-3 hours
- 100GB of files: ~4-6 hours

The script will show progress for each file:
```
📁 Migrating: Main Page Slider - Photos
   → image1.jpg
     ✓ Uploaded (2.45 MB)
   → image2.jpg
     ✓ Uploaded (1.89 MB)
```

**Tips:**
- Let it run in the background
- Don't close your terminal
- If it fails, just run it again - it will retry failed files

---

### Step 8: Test Your Website (5 minutes)

After migration completes:

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test each page:**
   - Main page slider (photos and videos)
   - Portfolio page (category thumbnails)
   - Click on a photo category → verify gallery loads
   - Click on a video category → verify gallery loads

3. **Check browser console for errors:**
   - Press F12 to open DevTools
   - Look for any 404 errors or loading issues

4. **Test on mobile:**
   - Use Chrome DevTools mobile emulation
   - Or test on your actual phone

**If everything loads correctly, you're done! 🎉**

---

### Step 9: Monitor for 24-48 Hours (Recommended)

Keep both Firebase and Bunny running for a day or two to ensure stability:

1. Check your website throughout the day
2. Monitor Bunny dashboard for traffic/bandwidth
3. Check for any console errors
4. Verify all media loads quickly

---

### Step 10: Remove Firebase (After confirming success)

Once you're confident everything works:

1. **Remove Firebase from package.json:**
   ```bash
   npm uninstall firebase
   ```

2. **Delete Firebase utility file:**
   ```bash
   rm utils/firebase.utils.js
   ```

3. **Remove Firebase env variables from .env.local:**
   - Delete all lines starting with `NEXT_PUBLIC_FIREBASE_`

4. **Optional: Delete Firebase project**
   - Go to Firebase Console
   - Project Settings → Delete Project
   - This stops any future charges

5. **Git commit your changes:**
   ```bash
   git add .
   git commit -m "Migrate from Firebase to Bunny.net CDN"
   git push
   ```

---

## Troubleshooting

### Error: "Bunny credentials not found"
- Check that `.env.local` has all required variables
- Restart your dev server after updating `.env.local`
- Verify no typos in variable names

### Error: "401 Unauthorized"
- Your Bunny storage password is incorrect
- Go to Bunny Dashboard → Storage → bebe-portfolio
- Copy the password again

### Error: "404 Not Found"
- Check that your storage zone name is exactly: `bebe-portfolio`
- Verify the region matches: `ny` (or your chosen region)

### Files not loading on website
- Check the migration summary - did all files upload successfully?
- Verify CDN hostname in env: `bebe-cdn.b-cdn.net`
- Clear your browser cache (Ctrl+Shift+R)
- Check Bunny dashboard → Storage to see if files are there

### Migration is very slow
- This is normal for large files
- Run overnight if you have 50GB+
- You can stop and restart - it will continue where it left off

---

## Cost Monitoring

### Check Your Usage in Bunny Dashboard

1. Go to **Billing** in left sidebar
2. View current month usage:
   - Storage used
   - Bandwidth used
   - Estimated cost

### Expected Costs

**First Month:**
- If you migrated 100GB: ~$1 storage + $0 for initial upload
- Next month: ~$1 storage + ~$5 for 500GB bandwidth
- **Total: ~$6/month**

**Compare to Firebase:**
- Same usage on Firebase: ~$62/month
- **You're saving: ~$56/month** 💰

---

## Next Steps After Migration

### 1. Enable Additional Optimizations

**In Bunny Dashboard → Pull Zone → bebe-cdn:**
- Enable **"Origin Shield"** (extra caching layer)
- Enable **"Auto-Optimize Images"**
- Set **Cache Expiration**: 1 year for images/videos

### 2. Use Image Optimization in Your Code

Update your components to use Bunny's image optimization:

```javascript
import { getOptimizedImageUrl } from '@/utils/bunny.utils';

// Original
<img src={photo.url} />

// Optimized
<img src={getOptimizedImageUrl(photo.url, {
  width: 800,
  format: 'webp',
  quality: 85
})} />
```

### 3. Set Up Private File Sharing (Future Feature)

When you're ready to add user file sharing:

```javascript
import { uploadPrivateFile, getShareableLink } from '@/utils/bunny.utils';

// Upload a private file
const result = await uploadPrivateFile(
  userId,
  fileId,
  fileBuffer,
  'image/jpeg'
);

// Get shareable link (expires in 7 days)
const shareUrl = getShareableLink(userId, fileId, 7);
```

---

## Support

**Bunny.net Support:**
- Email: support@bunny.net
- Dashboard: Live chat in bottom-right corner
- Docs: https://docs.bunny.net

**Response time:** Usually < 1 hour

---

## Summary Checklist

- [ ] Created Bunny.net account
- [ ] Created storage zone (bebe-portfolio)
- [ ] Created CDN pull zone (bebe-cdn)
- [ ] Added env variables to .env.local
- [ ] Ran dry-run test successfully
- [ ] Ran migration script
- [ ] Tested website - all media loads
- [ ] Monitored for 24-48 hours
- [ ] Removed Firebase dependencies
- [ ] Committed changes to Git

**Once complete, you're saving ~$56/month! 🚀**
