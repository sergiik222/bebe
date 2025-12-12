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

export async function GET() {
  try {
    const url = `${STORAGE_API_URL}/categories/videos/`;

    const response = await axios.get(url, {
      headers: {
        'AccessKey': STORAGE_PASSWORD,
      },
    });

    const categories = response.data
      .filter(f => !f.IsDirectory && /\.(mp4|webm|mov)$/i.test(f.ObjectName))
      .map(file => {
        let cleanPath = file.Path.replace(`/${STORAGE_ZONE}/`, '/').replace(`/${STORAGE_ZONE}`, '/');
        if (!cleanPath.endsWith(file.ObjectName)) {
          cleanPath = cleanPath.replace(/\/$/, '') + '/' + file.ObjectName;
        }
        return {
          name: file.ObjectName,
          alt: file.ObjectName.split('.')[0],
          url: `${CDN_URL}${cleanPath}`,
          mediaType: 'video',
          dateCreated: file.DateCreated,
        };
      })
      .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching video categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
