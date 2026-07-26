'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import JSZip from 'jszip';
import Loader from '@/components/ui/Loader';
import CustomVideoPlayer from '@/components/home/CustomVideoPlayer';
import { BACKEND_URL } from '@/lib/config';

// Bunny CDN optimization
const getOptimizedUrl = (url, width, quality = 60) => {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&quality=${quality}`;
};

const ClientGallery = () => {
    const { token } = useParams();
    const [gallery, setGallery] = useState(null);
    const [media, setMedia] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [zipDownloading, setZipDownloading] = useState(false);
    const [zipProgress, setZipProgress] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchGallery();
    }, [token]);

    const fetchGallery = async () => {
        try {
            setLoading(true);

            // Get gallery info from backend
            const response = await fetch(`${BACKEND_URL}/api/gallery/${token}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gallery not found');
            }

            setGallery(data);

            // Fetch media from Bunny CDN (via Next.js API route)
            const mediaResponse = await fetch(`/api/gallery/${token}/media?folder=${encodeURIComponent(data.folder_name)}`);
            if (mediaResponse.ok) {
                const mediaData = await mediaResponse.json();
                setMedia(mediaData.files || []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

    const downloadFile = async (url, filename) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
    };

    const downloadSelected = async () => {
        const selectedFiles = media.filter(m => selected.has(m.name));
        if (selectedFiles.length === 0) return;

        setDownloading(true);
        setDownloadProgress({ current: 0, total: selectedFiles.length });

        // Track download on backend
        fetch(`${BACKEND_URL}/api/gallery/${token}/download`, { method: 'POST' });

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            setDownloadProgress({ current: i + 1, total: selectedFiles.length });

            try {
                await downloadFile(file.url, file.name);
                // Small delay to prevent browser blocking
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                console.error(`Failed to download ${file.name}:`, err);
            }
        }

        setDownloading(false);
        setDownloadProgress({ current: 0, total: 0 });
    };

    const downloadSingle = async (file) => {
        // Track download
        fetch(`${BACKEND_URL}/api/gallery/${token}/download`, { method: 'POST' });
        await downloadFile(file.url, file.name);
    };

    const downloadAsZip = async () => {
        const selectedFiles = media.filter(m => selected.has(m.name));
        if (selectedFiles.length === 0) return;

        setZipDownloading(true);
        setZipProgress(0);

        // Track download on backend
        fetch(`${BACKEND_URL}/api/gallery/${token}/download`, { method: 'POST' });

        try {
            const zip = new JSZip();

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                setZipProgress(Math.round((i / selectedFiles.length) * 80)); // 80% for downloading

                const response = await fetch(file.url);
                const blob = await response.blob();
                zip.file(file.name, blob);
            }

            setZipProgress(90); // Generating ZIP
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            setZipProgress(100);
            const downloadUrl = window.URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${gallery?.title || 'gallery'}-photos.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Failed to create ZIP:', err);
            alert('Failed to create ZIP file. Please try downloading files individually.');
        } finally {
            setZipDownloading(false);
            setZipProgress(0);
        }
    };

    const handleMediaClick = (item) => {
        if (item.type === 'video') {
            setSelectedVideo(item);
        } else {
            // Find index in imageMedia array for lightbox
            const imageIndex = media.filter(m => m.type !== 'video').findIndex(m => m.name === item.name);
            setLightboxIndex(imageIndex);
            setLightboxOpen(true);
        }
    };

    // Prepare slides for lightbox (only images, videos use custom player)
    const imageMedia = media.filter(item => item.type !== 'video');
    const slides = imageMedia.map(item => ({
        src: item.url,
        alt: item.name,
        download: item.url,
    }));

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Loading your gallery..." />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-danger/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-light mb-4">Gallery Not Available</h1>
                    <p className="text-secondary-text">{error}</p>
                    <p className="text-muted-text text-sm mt-4">
                        If you believe this is an error, please contact the photographer.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24">
            {/* Header */}
            <header className="bg-surface/50 border-b border-line pl-20 pr-4 md:pl-6 md:pr-6 py-4 sticky top-20 md:top-[88px] z-40 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-xl md:text-2xl font-light tracking-wider text-[var(--accent-color)]">
                        {gallery?.title || 'Your Gallery'}
                    </h1>
                    {gallery?.message && (
                        <p className="text-secondary-text text-sm mt-1">{gallery.message}</p>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Actions row */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    <button
                        onClick={selectAll}
                        className="px-3 py-2 bg-surface-raised text-primary-text font-medium rounded-lg hover:bg-line-strong text-sm"
                    >
                        {selected.size === media.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                        onClick={downloadSelected}
                        disabled={selected.size === 0 || downloading || zipDownloading}
                        className="px-3 py-2 bg-[var(--accent-color)] text-on-accent font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {downloading
                            ? `${downloadProgress.current}/${downloadProgress.total}...`
                            : `Download (${selected.size})`}
                    </button>
                    <button
                        onClick={downloadAsZip}
                        disabled={selected.size === 0 || downloading || zipDownloading}
                        className="px-3 py-2 bg-surface-raised text-primary-text font-medium rounded-lg hover:bg-line-strong disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                    >
                        {zipDownloading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {zipProgress}%
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                ZIP
                            </>
                        )}
                    </button>
                    <span className="text-secondary-text text-sm ml-2">
                        {media.length} {media.length === 1 ? 'file' : 'files'}
                    </span>
                </div>

                {/* Media Grid */}
                {media.length === 0 ? (
                    <div className="text-center py-12 text-secondary-text">
                        No media files found in this gallery.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {media.map((item, index) => (
                            <MediaCard
                                key={item.name}
                                item={item}
                                isSelected={selected.has(item.name)}
                                onToggle={() => toggleSelect(item.name)}
                                onView={() => handleMediaClick(item)}
                                onDownload={() => downloadSingle(item)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Lightbox for images */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
                on={{
                    view: ({ index }) => setLightboxIndex(index),
                }}
                plugins={[Thumbnails, Download]}
            />

            {/* Custom Video Player for videos */}
            <CustomVideoPlayer
                videoUrl={selectedVideo?.url}
                title={selectedVideo?.name?.split('.')[0] || ''}
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
            />
        </div>
    );
};

const MediaCard = ({ item, isSelected, onToggle, onView, onDownload }) => {
    const isVideo = item.type === 'video';

    return (
        <div className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group">
            {/* Main content - clicking opens view */}
            <div onClick={onView} className="absolute inset-0">
                {isVideo ? (
                    <video
                        src={item.url}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        muted
                        preload="none"
                    />
                ) : (
                    <Image
                        src={getOptimizedUrl(item.url, 400)}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                )}
            </div>

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />

            {/* Border on hover/selected */}
            <div className={`absolute inset-0 border-2 rounded-xl transition-colors duration-300 pointer-events-none ${
                isSelected ? 'border-[var(--accent-color)]' : 'border-transparent group-hover:border-[var(--accent-color)]'
            }`} />

            {/* Selection checkbox - always visible and clickable */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
                    isSelected
                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)]'
                        : 'bg-black/50 border-white/70 hover:border-white hover:bg-black/70'
                }`}
            >
                {isSelected && (
                    <svg className="w-5 h-5 text-on-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Download button - always visible on mobile, hover on desktop */}
            <button
                onClick={(e) => { e.stopPropagation(); onDownload(); }}
                className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors active:scale-90 md:opacity-0 md:group-hover:opacity-100"
                title="Download"
            >
                <svg className="w-5 h-5 text-primary-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>

            {/* Video play indicator */}
            {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-text ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientGallery;
