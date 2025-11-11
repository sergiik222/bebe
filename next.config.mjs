
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'firebasestorage.googleapis.com', // Firebase (legacy - can remove after migration)
            'bebe-cdn.b-cdn.net', // Bunny CDN
        ],
    },
};

export default nextConfig;