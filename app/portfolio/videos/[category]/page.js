'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter, useParams } from 'next/navigation';
import CustomVideoPlayer from '@/components/home/CustomVideoPlayer';
import Loader from '@/components/ui/Loader';

const VideoGallery = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const category = decodeURIComponent(params.category);

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch(`/api/media/category-videos?category=${encodeURIComponent(category)}`);
                const data = await response.json();
                setVideos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchVideos();
        }
    }, [category]);

    if (loading) {
        return (
            <div className="font-roboto flex flex-col w-full min-h-screen">
                <div className="flex-1 flex items-center justify-center">
                    <Loader size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="font-roboto flex flex-col w-full min-h-screen">
            <div className="flex-1 p-4 pt-20 md:p-8 md:pt-24">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4 pl-16 md:pl-0 relative z-40">
                        <button
                            onClick={() => router.push('/portfolio')}
                            className="flex items-center justify-center w-10 h-10 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-gray-300 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl md:text-3xl font-medium">{category}</h1>
                    </div>

                    {/* Video Grid */}
                    {videos.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            {t.portfolio.noVideos}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video, index) => (
                                <VideoCard
                                    key={index}
                                    video={video}
                                    onClick={() => setSelectedVideo(video)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Video Player */}
            <CustomVideoPlayer
                videoUrl={selectedVideo?.url}
                title={selectedVideo?.alt || selectedVideo?.name?.split('.')[0] || ''}
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
            />
        </div>
    );
};

const VideoCard = ({ video, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const videoName = video.alt || video.name.split('.')[0];

    // Load first frame on mount
    useEffect(() => {
        const videoEl = videoRef.current;
        if (videoEl) {
            const handleLoadedData = () => {
                setIsLoaded(true);
            };
            videoEl.addEventListener('loadeddata', handleLoadedData);
            // Force load first frame
            videoEl.load();
            return () => videoEl.removeEventListener('loadeddata', handleLoadedData);
        }
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(() => {});
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsPlaying(false);
            }
        }
    }, [isHovered]);

    const handlePlayPauseClick = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().catch(() => {});
                setIsPlaying(true);
            }
        }
    };

    return (
        <div
            className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Loading placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                    <div className="animate-pulse w-12 h-12 rounded-full bg-zinc-700" />
                </div>
            )}
            <video
                ref={videoRef}
                src={`${video.url}#t=0.1`}
                muted
                loop
                playsInline
                webkit-playsinline="true"
                disablePictureInPicture
                preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                    isHovered ? 'scale-105' : 'scale-100'
                } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Gradient - top on mobile, bottom on desktop */}
            <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Video name - top on mobile, bottom on desktop */}
            <div className="absolute top-0 lg:hidden left-0 right-0 p-3">
                <h3 className="text-base font-medium text-white drop-shadow-lg">{videoName}</h3>
            </div>
            <div className="absolute bottom-0 hidden lg:block left-0 right-0 p-4">
                <h3 className="text-lg font-medium text-white">{videoName}</h3>
            </div>

            {/* Play/Pause button - visible on mobile */}
            <button
                onClick={handlePlayPauseClick}
                className="absolute bottom-4 left-4 z-20 block lg:hidden p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-colors"
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
                {isPlaying ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <rect x="6" y="5" width="3" height="14"/>
                        <rect x="14" y="5" width="4" height="14"/>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                )}
            </button>

            {/* Hover border */}
            <div className={`absolute inset-0 border-2 border-[var(--accent-color)] rounded-2xl transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
        </div>
    );
};

export default VideoGallery;
