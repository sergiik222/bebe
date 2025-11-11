import axios from 'axios';

// Environment variables (to be set in .env.local)
const STORAGE_ZONE = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
const STORAGE_PASSWORD = process.env.BUNNY_STORAGE_PASSWORD;
const CDN_HOSTNAME = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
const STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || '';

// API URLs - Handle default (Falkenstein) region with no prefix
const STORAGE_API_URL = STORAGE_REGION
  ? `https://${STORAGE_REGION}.storage.bunnycdn.com/${STORAGE_ZONE}`
  : `https://storage.bunnycdn.com/${STORAGE_ZONE}`;
const CDN_URL = `https://${CDN_HOSTNAME}`;

/**
 * Upload a file to Bunny Storage
 * @param {string} filePath - Path where file should be stored (e.g., 'main/photos/image.jpg')
 * @param {Buffer} fileBuffer - File data as buffer
 * @param {string} contentType - MIME type (e.g., 'image/jpeg', 'video/mp4')
 * @returns {Promise<{success: boolean, url?: string, error?: any}>}
 */
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
      statusCode: response.status,
    };
  } catch (error) {
    console.error('Bunny upload failed:', error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * List files in a directory
 * Note: This function should only be called server-side (API routes)
 * For client-side, use the portfolio-specific functions below
 * @param {string} path - Directory path (e.g., 'main/photos')
 * @returns {Promise<Array>} Array of file objects
 */
export const listFiles = async (path) => {
  // Check if we're running server-side (Node.js) or client-side (browser)
  const isServerSide = typeof window === 'undefined';

  if (!isServerSide) {
    console.error('listFiles() should only be called server-side. Use portfolio-specific functions instead.');
    return [];
  }

  const url = `${STORAGE_API_URL}/${path}/`;

  try {
    const response = await axios.get(url, {
      headers: {
        'AccessKey': STORAGE_PASSWORD,
      },
    });

    // Response is an array of file/folder objects
    return response.data.map(file => ({
      name: file.ObjectName,
      path: file.Path,
      url: `${CDN_URL}${file.Path}`,
      size: file.Length,
      dateCreated: file.DateCreated,
      isDirectory: file.IsDirectory,
    }));
  } catch (error) {
    console.error(`Bunny list failed for path "${path}":`, error.message);
    return [];
  }
};

/**
 * Delete a file from Bunny Storage
 * @param {string} filePath - Path to file to delete
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const deleteFile = async (filePath) => {
  const url = `${STORAGE_API_URL}/${filePath}`;

  try {
    await axios.delete(url, {
      headers: {
        'AccessKey': STORAGE_PASSWORD,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Bunny delete failed:', error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Generate a signed URL for private content access
 * @param {string} filePath - Path to file
 * @param {number} expiresInSeconds - Time until URL expires (default: 1 hour)
 * @returns {string} Signed URL
 */
export const getSignedUrl = (filePath, expiresInSeconds = 3600) => {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const signatureToken = process.env.BUNNY_TOKEN_KEY;

  if (!signatureToken) {
    console.warn('BUNNY_TOKEN_KEY not set, returning unsigned URL');
    return `${CDN_URL}/${filePath}`;
  }

  // Bunny URL signing format
  const crypto = require('crypto');
  const hashData = `${signatureToken}${filePath}${expires}`;
  const hash = crypto.createHash('sha256').update(hashData).digest('base64');
  const urlSafeHash = hash
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${CDN_URL}/${filePath}?token=${urlSafeHash}&expires=${expires}`;
};

/**
 * Get optimized image URL with transformations
 * @param {string} imageUrl - Original image URL
 * @param {object} options - Transformation options
 * @param {number} options.width - Width in pixels
 * @param {number} options.height - Height in pixels
 * @param {number} options.quality - Quality 1-100
 * @param {string} options.format - Format: 'webp', 'avif', 'jpg', 'png'
 * @param {string} options.crop - Crop ratio like '16:9', '4:3'
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  const params = new URLSearchParams();

  if (options.width) params.append('width', options.width);
  if (options.height) params.append('height', options.height);
  if (options.quality) params.append('quality', options.quality);
  if (options.format) params.append('format', options.format);
  if (options.crop) params.append('crop', options.crop);

  const queryString = params.toString();
  return queryString ? `${imageUrl}?${queryString}` : imageUrl;
};

// =============================================================================
// Portfolio-specific functions (matching Firebase API)
// =============================================================================

/**
 * Get photos for main page slider
 * @returns {Promise<Array>} Array of photo objects
 */
export const getMainPhotos = async () => {
  try {
    const response = await fetch('/api/media/main-photos');
    if (!response.ok) throw new Error('Failed to fetch main photos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching main photos:', error);
    return [];
  }
};

/**
 * Get videos for main page slider
 * @returns {Promise<Array>} Array of video objects
 */
export const getMainVideos = async () => {
  try {
    const response = await fetch('/api/media/main-videos');
    if (!response.ok) throw new Error('Failed to fetch main videos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching main videos:', error);
    return [];
  }
};

/**
 * Get category thumbnail images for video portfolio page
 * @returns {Promise<Array>} Array of category thumbnail objects
 */
export const getVideoCategories = async () => {
  try {
    const response = await fetch('/api/media/video-categories');
    if (!response.ok) throw new Error('Failed to fetch video categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching video categories:', error);
    return [];
  }
};

/**
 * Get photos for a specific category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of photo objects
 */
export const getCategoryPhotos = async (category) => {
  try {
    const response = await fetch(`/api/media/category-photos?category=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error(`Failed to fetch category photos for "${category}"`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category photos for "${category}":`, error);
    return [];
  }
};

/**
 * Get videos for a specific category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of video objects
 */
export const getCategoryVideos = async (category) => {
  try {
    const response = await fetch(`/api/media/category-videos?category=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error(`Failed to fetch category videos for "${category}"`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category videos for "${category}":`, error);
    return [];
  }
};

// =============================================================================
// Future: Private file sharing functions
// =============================================================================

/**
 * Upload a private file for user sharing (future feature)
 * @param {string} userId - User ID
 * @param {string} fileId - Unique file ID
 * @param {Buffer} fileBuffer - File data
 * @param {string} contentType - MIME type
 * @returns {Promise<{success: boolean, url?: string, shareToken?: string}>}
 */
export const uploadPrivateFile = async (userId, fileId, fileBuffer, contentType) => {
  const filePath = `private/${userId}/${fileId}`;
  const result = await uploadFile(filePath, fileBuffer, contentType);

  if (result.success) {
    // Generate a signed URL valid for 7 days
    const shareUrl = getSignedUrl(filePath, 7 * 24 * 60 * 60);
    return {
      success: true,
      url: result.url,
      shareToken: shareUrl,
    };
  }

  return result;
};

/**
 * Get a shareable link for a private file
 * @param {string} userId - User ID
 * @param {string} fileId - File ID
 * @param {number} expiresInDays - Days until link expires (default: 7)
 * @returns {string} Shareable URL
 */
export const getShareableLink = (userId, fileId, expiresInDays = 7) => {
  const filePath = `private/${userId}/${fileId}`;
  return getSignedUrl(filePath, expiresInDays * 24 * 60 * 60);
};
