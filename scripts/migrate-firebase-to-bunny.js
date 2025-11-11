/**
 * Migration Script: Firebase Storage → Bunny.net CDN
 *
 * This script copies all media files from Firebase Storage to Bunny.net
 *
 * Prerequisites:
 * 1. Firebase project credentials (already in .env.local)
 * 2. Bunny.net account with Storage Zone and API key configured
 *
 * Usage:
 *   node scripts/migrate-firebase-to-bunny.js
 *
 * Options:
 *   --dry-run    : Show what would be migrated without actually uploading
 *   --test-only  : Migrate only first 3 files from each directory
 */

const { initializeApp } = require('firebase/app');
const { getStorage, ref, listAll, getDownloadURL, getMetadata } = require('firebase/storage');
const axios = require('axios');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isTestMode = args.includes('--test-only');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Bunny configuration
const BUNNY_STORAGE_ZONE = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
const BUNNY_STORAGE_PASSWORD = process.env.BUNNY_STORAGE_PASSWORD;
const BUNNY_STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || '';
const BUNNY_STORAGE_API_URL = BUNNY_STORAGE_REGION
  ? `https://${BUNNY_STORAGE_REGION}.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`
  : `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Statistics
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  totalBytes: 0,
};

/**
 * Upload file to Bunny Storage
 */
async function uploadToBunny(filePath, fileBuffer, contentType) {
  const url = `${BUNNY_STORAGE_API_URL}/${filePath}`;

  try {
    const response = await axios.put(url, fileBuffer, {
      headers: {
        'AccessKey': BUNNY_STORAGE_PASSWORD,
        'Content-Type': contentType || 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return { success: true, statusCode: response.status };
  } catch (error) {
    console.error(`   ✗ Upload failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Download file from Firebase Storage
 */
async function downloadFromFirebase(fileRef) {
  try {
    const url = await getDownloadURL(fileRef);
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return {
      success: true,
      buffer: Buffer.from(response.data),
      contentType: response.headers['content-type'],
    };
  } catch (error) {
    console.error(`   ✗ Download failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Get content type from file name
 */
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Migrate a single directory from Firebase to Bunny
 */
async function migrateDirectory(firebasePath, bunnyPath, description) {
  console.log(`\n📁 Migrating: ${description}`);
  console.log(`   Firebase: ${firebasePath}`);
  console.log(`   Bunny: ${bunnyPath}`);

  const listRef = ref(storage, firebasePath);

  try {
    const result = await listAll(listRef);
    const items = isTestMode ? result.items.slice(0, 3) : result.items;

    if (items.length === 0) {
      console.log(`   ⚠ No files found`);
      return;
    }

    console.log(`   Found ${result.items.length} files${isTestMode ? ' (migrating first 3)' : ''}`);

    for (const itemRef of items) {
      const fileName = itemRef.name;
      const destPath = `${bunnyPath}/${fileName}`;
      stats.total++;

      console.log(`   → ${fileName}`);

      if (isDryRun) {
        console.log(`     [DRY RUN] Would upload to: ${destPath}`);
        stats.skipped++;
        continue;
      }

      // Download from Firebase
      const downloadResult = await downloadFromFirebase(itemRef);
      if (!downloadResult.success) {
        stats.failed++;
        continue;
      }

      const fileSize = downloadResult.buffer.length;
      stats.totalBytes += fileSize;

      // Upload to Bunny
      const contentType = downloadResult.contentType || getContentType(fileName);
      const uploadResult = await uploadToBunny(destPath, downloadResult.buffer, contentType);

      if (uploadResult.success) {
        console.log(`     ✓ Uploaded (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
        stats.success++;
      } else {
        stats.failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
  }
}

/**
 * Get all subdirectories in a Firebase path
 */
async function getSubdirectories(basePath) {
  const listRef = ref(storage, basePath);

  try {
    const result = await listAll(listRef);
    return result.prefixes.map(prefix => prefix.name);
  } catch (error) {
    console.error(`Error listing subdirectories in ${basePath}:`, error.message);
    return [];
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Firebase Storage → Bunny.net CDN Migration             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN MODE - No files will be uploaded\n');
  }

  if (isTestMode) {
    console.log('\n🧪 TEST MODE - Only first 3 files per directory\n');
  }

  // Check configuration
  if (!BUNNY_STORAGE_ZONE || !BUNNY_STORAGE_PASSWORD) {
    console.error('❌ Error: Bunny.net credentials not found in .env.local');
    console.error('   Required: NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME, BUNNY_STORAGE_PASSWORD');
    process.exit(1);
  }

  console.log(`\nBunny Storage Zone: ${BUNNY_STORAGE_ZONE}`);
  console.log(`Bunny Region: ${BUNNY_STORAGE_REGION}`);

  const startTime = Date.now();

  // Migrate main slider photos
  await migrateDirectory(
    'main/fotos',
    'main/photos',
    'Main Page Slider - Photos'
  );

  // Migrate main slider videos
  await migrateDirectory(
    'main/videos',
    'main/videos',
    'Main Page Slider - Videos'
  );

  // Migrate video category thumbnails
  await migrateDirectory(
    'main/video_categories',
    'categories/videos',
    'Portfolio - Video Category Thumbnails'
  );

  // Migrate photo galleries by category
  console.log('\n📸 Discovering photo categories...');
  const photoCategories = await getSubdirectories('fotos');

  if (photoCategories.length > 0) {
    console.log(`   Found ${photoCategories.length} photo categories: ${photoCategories.join(', ')}`);

    for (const category of photoCategories) {
      await migrateDirectory(
        `fotos/${category}`,
        `galleries/photos/${category}`,
        `Photo Gallery - ${category}`
      );
    }
  } else {
    console.log('   No photo categories found');
  }

  // Migrate video galleries by category
  console.log('\n🎥 Discovering video categories...');
  const videoCategories = await getSubdirectories('videos');

  if (videoCategories.length > 0) {
    console.log(`   Found ${videoCategories.length} video categories: ${videoCategories.join(', ')}`);

    for (const category of videoCategories) {
      await migrateDirectory(
        `videos/${category}`,
        `galleries/videos/${category}`,
        `Video Gallery - ${category}`
      );
    }
  } else {
    console.log('   No video categories found');
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Print summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    Migration Summary                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nTotal files processed: ${stats.total}`);
  console.log(`✓ Successfully uploaded: ${stats.success}`);
  console.log(`✗ Failed: ${stats.failed}`);
  if (stats.skipped > 0) {
    console.log(`⊘ Skipped (dry run): ${stats.skipped}`);
  }
  console.log(`📦 Total data transferred: ${(stats.totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⏱  Duration: ${duration} seconds`);

  if (stats.failed > 0) {
    console.log('\n⚠️  Some files failed to migrate. Check the logs above for details.');
  } else if (!isDryRun && stats.success > 0) {
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Test your website to verify all media loads correctly');
    console.log('2. Monitor for 1-2 days to ensure stability');
    console.log('3. Once confirmed, you can delete Firebase storage');
    console.log('4. Run: npm uninstall firebase');
    console.log('5. Remove Firebase env variables from .env.local');
  } else if (isDryRun) {
    console.log('\n💡 Dry run complete. Remove --dry-run flag to perform actual migration.');
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
