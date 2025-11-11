# Post-Migration Checklist

## ✅ Migration Complete!

Your files are now on Bunny.net. Follow these steps to finish the transition.

---

## Step 1: Test Your Website (REQUIRED)

### Start Dev Server
```bash
npm run dev
```

### Test Each Page

| Page | URL | What to Check | Status |
|------|-----|---------------|--------|
| **Main Slider** | http://localhost:3000 | Photos/videos load, scroll works | ⬜ |
| **Portfolio** | http://localhost:3000/portfolio | Category thumbnails display | ⬜ |
| **Photo Gallery** | Click photo category | Gallery opens, lightbox works | ⬜ |
| **Video Gallery** | Click video category | Videos play in lightbox | ⬜ |

### Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for any errors (red text)
4. Look for 404s in **Network** tab

**✅ Everything works?** → Proceed to Step 2
**❌ Errors?** → Share the error message and I'll help fix it

---

## Step 2: Update .gitignore (Security)

Make sure your `.env.local` is NOT committed to Git:

```bash
# Check if .env.local is ignored
git status
```

If you see `.env.local` in the output, add it to `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

**Why?** Your Bunny password is in `.env.local` - keep it secret!

---

## Step 3: Clean Up Environment Variables

Edit your `.env.local` and remove these old lines:

```bash
# DELETE THESE (Firebase - no longer used):
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# DELETE THESE (Cloudinary - not used):
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

**Keep these (Bunny - active):**
```bash
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=bebe-portfolio
BUNNY_STORAGE_PASSWORD=your_password
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=bebe-cdn.b-cdn.net
BUNNY_STORAGE_REGION=

NODE_ENV=development
```

---

## Step 4: Remove Old Dependencies

After confirming everything works, remove Firebase and Cloudinary:

### Option A: Automated Cleanup (Easy)
```bash
bash scripts/cleanup-old-dependencies.sh
```

### Option B: Manual Cleanup
```bash
# Remove packages
npm uninstall firebase @cloudinary/base @cloudinary/react cloudinary cloudinary-video-player

# Remove old utility file
rm utils/firebase.utils.js
```

---

## Step 5: Test Again After Cleanup

```bash
npm run dev
```

Visit your site again - it should still work perfectly!

---

## Step 6: Commit Your Changes

```bash
git status
git add .
git commit -m "Migrate from Firebase to Bunny.net CDN

- Replace Firebase Storage with Bunny.net
- Remove Cloudinary dependencies (unused)
- Add Bunny utility functions
- Update Redux actions to use Bunny storage
- Cost savings: ~$50/month"

git push
```

---

## Step 7: Monitor Performance (Optional but Recommended)

### Check Bunny Dashboard
1. Go to: https://dash.bunny.net
2. Click **"Billing"** in sidebar
3. Monitor:
   - Storage used
   - Bandwidth used
   - Estimated cost

### Check Website Performance
1. Run Lighthouse audit in Chrome DevTools
2. Compare load times before/after
3. Test from different locations

**Expected:** Faster loading, especially for international users!

---

## Step 8: Delete Firebase Project (After 1-2 weeks)

Once you're 100% confident everything works:

1. Go to: https://console.firebase.google.com
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Scroll to bottom
5. Click **"Delete Project"**

**⚠️ Warning:** Only do this after thoroughly testing!

**Why wait?** Just in case you need to roll back for any reason.

---

## Troubleshooting

### Images/Videos Not Loading

**Symptom:** Broken images or videos

**Solution:**
1. Check browser console for 404 errors
2. Verify Bunny credentials in `.env.local`
3. Check Bunny dashboard → Storage to see if files are there
4. Verify CDN hostname is correct

### "Access Denied" Errors

**Symptom:** 401 or 403 errors in console

**Solution:**
1. Check `BUNNY_STORAGE_PASSWORD` in `.env.local`
2. Regenerate password in Bunny dashboard if needed
3. Restart dev server after updating `.env.local`

### Slow Loading

**Symptom:** Media takes long to load

**Solution:**
1. Check Bunny dashboard → CDN → bebe-cdn
2. Verify "Perma-Cache" is enabled
3. Enable "Image Optimization"
4. Wait 24 hours for CDN to fully warm up

### Still Using Firebase Bandwidth

**Symptom:** Firebase bills still high

**Solution:**
1. Verify your code is using Bunny (check Redux actions)
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R)
4. Check Network tab in DevTools - all media should come from `bebe-cdn.b-cdn.net`

---

## Cost Monitoring

### Expected Monthly Costs

**Before (Firebase):**
- ~$40-80/month

**After (Bunny):**
- ~$8-15/month

**Savings:**
- ~$30-70/month ($360-840/year)

### Check Your Actual Usage

In Bunny Dashboard → Billing, you'll see:
```
Storage: 100GB × $0.03 = $3.00 (HDD) or $8.00 (SSD)
Bandwidth: 500GB × $0.01 = $5.00
Total: $8-13/month
```

---

## Success Indicators ✨

You know the migration succeeded when:

- ✅ All pages load media correctly
- ✅ No console errors
- ✅ Network tab shows requests to `bebe-cdn.b-cdn.net`
- ✅ Bunny dashboard shows bandwidth usage
- ✅ Firebase bandwidth drops to zero
- ✅ Website feels faster (especially for video)
- ✅ Your wallet is happier 💰

---

## Future Optimizations

Now that you're on Bunny, you can:

### 1. Use Image Optimization
```javascript
import { getOptimizedImageUrl } from '@/utils/bunny.utils';

// Responsive WebP images
<img src={getOptimizedImageUrl(photo.url, {
  width: 800,
  format: 'webp',
  quality: 85
})} />
```

### 2. Enable Bunny Stream (for video)
- Better video streaming
- Automatic transcoding
- Adaptive bitrate
- Cost: ~$5/month extra

### 3. Private File Sharing (for your future feature)
Already built into `bunny.utils.js`:
```javascript
import { getShareableLink } from '@/utils/bunny.utils';

const shareUrl = getShareableLink(userId, fileId, 7); // 7 days expiry
```

---

## Need Help?

**Bunny Support:**
- Dashboard: Live chat (bottom-right corner)
- Email: support@bunny.net
- Response time: Usually < 1 hour

**Common Issues:**
- "Images not loading" → Check credentials
- "401 Unauthorized" → Wrong password
- "404 Not Found" → Files didn't migrate or wrong path

---

## Summary

**What Changed:**
- ✅ Storage: Firebase → Bunny.net
- ✅ Removed: Cloudinary (unused)
- ✅ Cost: $60/month → $10/month
- ✅ Performance: Improved (114 CDN locations)

**What Stayed the Same:**
- ✅ Your code (just imports changed)
- ✅ Redux store structure
- ✅ Component behavior
- ✅ User experience

**Congratulations!** 🎉 You've successfully migrated to a faster, cheaper solution.

---

**Last Updated:** 2025-11-10
