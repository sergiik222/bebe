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

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const folderName = searchParams.get('folder');

    if (!folderName) {
      return NextResponse.json({ error: 'Folder name required' }, { status: 400 });
    }

    // Fetch files from Bunny Storage
    const url = `${STORAGE_API_URL}/clients/${folderName}/`;

    const response = await axios.get(url, {
      headers: { 'AccessKey': STORAGE_PASSWORD },
    });

    // Filter and map files
    const files = response.data
      .filter(f => !f.IsDirectory)
      .filter(f => /\.(jpg|jpeg|png|webp|gif|mp4|mov|avi|mkv|heic)$/i.test(f.ObjectName))
      .map(file => ({
        name: file.ObjectName,
        url: `${CDN_URL}/clients/${folderName}/${encodeURIComponent(file.ObjectName)}`,
        type: /\.(mp4|mov|avi|mkv)$/i.test(file.ObjectName) ? 'video' : 'image',
        size: file.Length,
        created: file.DateCreated,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching gallery media:', error.message);

    if (error.response?.status === 404) {
      return NextResponse.json({ error: 'Gallery folder not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
