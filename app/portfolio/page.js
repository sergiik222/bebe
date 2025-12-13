'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Portfolio = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const [photoCategories, setPhotoCategories] = useState([]);
    const [videoCategories, setVideoCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [splitPosition, setSplitPosition] = useState(50); // percentage for left panel
    const [activeTab, setActiveTab] = useState('photo'); // For mobile tab switcher
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [photosRes, videosRes] = await Promise.all([
                    fetch('/api/media/photo-categories'),
                    fetch('/api/media/video-categories')
                ]);

                const photos = await photosRes.json();
                const videos = await videosRes.json();

                setPhotoCategories(Array.isArray(photos) ? photos : []);
                setVideoCategories(Array.isArray(videos) ? videos : []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const onMouseMove = (e) => {
            if (!isDragging.current || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const position = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            // Clamp between 20% and 80%
            const clampedPosition = Math.min(Math.max(position, 20), 80);
            setSplitPosition(clampedPosition);
        };

        const onMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleCategoryClick = (category, type) => {
        const categoryName = category.alt || category.name.split('.')[0];
        if (type === 'photo') {
            router.push(`/portfolio/photos/${encodeURIComponent(categoryName)}`);
        } else {
            router.push(`/portfolio/videos/${encodeURIComponent(categoryName)}`);
        }
    };

    if (loading) {
        return (
            <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
            <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl md:text-3xl font-medium">{t.portfolio.title}</h1>
                    </div>

                    {/* Two Column Layout with Draggable Divider - Desktop */}
                    <div
                        ref={containerRef}
                        className="hidden lg:flex relative"
                    >
                        {/* Photo Column */}
                        <div
                            className="pr-8"
                            style={{ width: `${splitPosition}%` }}
                        >
                            <h2 className="text-xl xl:text-2xl font-medium mb-5 text-[var(--accent-color)]">
                                {t.portfolio.photo}
                            </h2>
                            {photoCategories.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 bg-zinc-900/30 rounded-2xl">
                                    {t.portfolio.noCategories}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {photoCategories.map((category, index) => (
                                        <PhotoCategoryCard
                                            key={index}
                                            category={category}
                                            onClick={() => handleCategoryClick(category, 'photo')}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Draggable Divider */}
                        <div
                            className="absolute top-0 bottom-0 w-6 cursor-col-resize z-10 flex items-center justify-center group"
                            style={{ left: `calc(${splitPosition}% - 12px)` }}
                            onMouseDown={handleMouseDown}
                        >
                            <div className="w-0.5 h-full bg-zinc-700 group-hover:bg-[var(--accent-color)] transition-colors rounded-full"></div>
                        </div>

                        {/* Video Column */}
                        <div
                            className="pl-8"
                            style={{ width: `${100 - splitPosition}%` }}
                        >
                            <h2 className="text-xl xl:text-2xl font-medium mb-5 text-[var(--accent-color)] text-right">
                                {t.portfolio.video}
                            </h2>
                            {videoCategories.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 bg-zinc-900/30 rounded-2xl">
                                    {t.portfolio.noCategories}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {videoCategories.map((category, index) => (
                                        <VideoCategoryCard
                                            key={index}
                                            category={category}
                                            onClick={() => handleCategoryClick(category, 'video')}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Horizontal Scroll Layout */}
                    <div className="lg:hidden space-y-8">
                        {/* Photo Section */}
                        <div>
                            <h2 className="text-lg font-medium mb-4 text-[var(--accent-color)] flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {t.portfolio.photo}
                            </h2>
                            {photoCategories.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 bg-zinc-900/30 rounded-xl">
                                    {t.portfolio.noCategories}
                                </div>
                            ) : (
                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                                    {photoCategories.map((category, index) => (
                                        <div key={index} className="snap-start flex-shrink-0 w-[75vw] max-w-[300px]">
                                            <PhotoCategoryCardLarge
                                                category={category}
                                                onClick={() => handleCategoryClick(category, 'photo')}
                                                t={t}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video Section */}
                        <div>
                            <h2 className="text-lg font-medium mb-4 text-[var(--accent-color)] flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                {t.portfolio.video}
                            </h2>
                            {videoCategories.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 bg-zinc-900/30 rounded-xl">
                                    {t.portfolio.noCategories}
                                </div>
                            ) : (
                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                                    {videoCategories.map((category, index) => (
                                        <div key={index} className="snap-start flex-shrink-0 w-[75vw] max-w-[300px]">
                                            <VideoCategoryCardLarge
                                                category={category}
                                                onClick={() => handleCategoryClick(category, 'video')}
                                                t={t}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PhotoCategoryCard = ({ category, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const categoryName = category.alt || category.name.split('.')[0];

    return (
        <div
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <Image
                src={category.url}
                alt={categoryName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-transform duration-500 ${
                    isHovered ? 'scale-110' : 'scale-100'
                }`}
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-60'
            }`} />
            {/* Category name - bottom right */}
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 text-right">
                <h3 className={`text-sm lg:text-base font-medium text-white transition-transform duration-300 ${
                    isHovered ? 'translate-y-0' : 'translate-y-1'
                }`}>
                    {categoryName}
                </h3>
            </div>
            <div className={`absolute inset-0 border-2 border-[var(--accent-color)] rounded-2xl transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
        </div>
    );
};

const VideoCategoryCard = ({ category, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const categoryName = category.alt || category.name.split('.')[0];

    // Load first frame on mount
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handleLoadedData = () => {
                setIsLoaded(true);
            };
            video.addEventListener('loadeddata', handleLoadedData);
            // Force load first frame
            video.load();
            return () => video.removeEventListener('loadeddata', handleLoadedData);
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
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
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
                src={`${category.url}#t=0.1`}
                muted
                loop
                playsInline
                webkit-playsinline="true"
                disablePictureInPicture
                preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                    isHovered ? 'scale-110' : 'scale-100'
                } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-60'
            }`} />
            {/* Category name - bottom right */}
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 text-right">
                <h3 className={`text-sm lg:text-base font-medium text-white transition-transform duration-300 ${
                    isHovered ? 'translate-y-0' : 'translate-y-1'
                }`}>
                    {categoryName}
                </h3>
            </div>
            {/* Play/Pause button - visible on mobile, bottom left */}
            <button
                onClick={handlePlayPauseClick}
                className="absolute bottom-3 left-3 z-20 block lg:hidden p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-colors"
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
            <div className={`absolute inset-0 border-2 border-[var(--accent-color)] rounded-2xl transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
        </div>
    );
};

// Masonry card - Photo (varying heights for Pinterest effect)
const PhotoCategoryCardMasonry = ({ category, onClick, variant }) => {
    const categoryName = category.alt || category.name.split('.')[0];
    // Different aspect ratios for visual variety
    const aspectClasses = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]'];
    const aspectClass = aspectClasses[variant % 3];

    return (
        <div
            className={`relative ${aspectClass} rounded-2xl overflow-hidden cursor-pointer group active:scale-[0.98] transition-transform`}
            onClick={onClick}
        >
            <Image
                src={category.url}
                alt={categoryName}
                fill
                sizes="50vw"
                className="object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Photo badge */}
            <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            {/* Category name */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-medium text-white">
                    {categoryName}
                </h3>
            </div>
            {/* Accent border on touch */}
            <div className="absolute inset-0 border-2 border-[var(--accent-color)] rounded-2xl opacity-0 group-active:opacity-100 transition-opacity" />
        </div>
    );
};

// Masonry card - Video (varying heights for Pinterest effect)
const VideoCategoryCardMasonry = ({ category, onClick, variant }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const videoRef = useRef(null);
    const categoryName = category.alt || category.name.split('.')[0];
    // Different aspect ratios for visual variety
    const aspectClasses = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square'];
    const aspectClass = aspectClasses[variant % 3];

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handleLoadedData = () => setIsLoaded(true);
            video.addEventListener('loadeddata', handleLoadedData);
            video.load();
            return () => video.removeEventListener('loadeddata', handleLoadedData);
        }
    }, []);

    return (
        <div
            className={`relative ${aspectClass} rounded-2xl overflow-hidden cursor-pointer group active:scale-[0.98] transition-transform`}
            onClick={onClick}
        >
            {!isLoaded && (
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                    <div className="animate-pulse w-8 h-8 rounded-full bg-zinc-700" />
                </div>
            )}
            <video
                ref={videoRef}
                src={`${category.url}#t=0.1`}
                muted
                loop
                playsInline
                webkit-playsinline="true"
                disablePictureInPicture
                preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Video badge */}
            <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
            {/* Category name */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-medium text-white">
                    {categoryName}
                </h3>
            </div>
            {/* Accent border on touch */}
            <div className="absolute inset-0 border-2 border-[var(--accent-color)] rounded-2xl opacity-0 group-active:opacity-100 transition-opacity" />
        </div>
    );
};

// Large card for horizontal scroll - Photo
const PhotoCategoryCardLarge = ({ category, onClick, t }) => {
    const categoryName = category.alt || category.name.split('.')[0];

    return (
        <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group active:scale-[0.98] transition-transform"
            onClick={onClick}
        >
            <Image
                src={category.url}
                alt={categoryName}
                fill
                sizes="75vw"
                className="object-cover transition-transform duration-500 group-active:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Category name */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-medium text-white mb-1">
                    {categoryName}
                </h3>
                <p className="text-xs text-gray-300 flex items-center gap-1">
                    <span>{t.portfolio.tapToExplore}</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </p>
            </div>
            {/* Accent border on touch */}
            <div className="absolute inset-0 border-2 border-[var(--accent-color)] rounded-2xl opacity-0 group-active:opacity-100 transition-opacity" />
        </div>
    );
};

// Large card for horizontal scroll - Video
const VideoCategoryCardLarge = ({ category, onClick, t }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const categoryName = category.alt || category.name.split('.')[0];

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handleLoadedData = () => setIsLoaded(true);
            video.addEventListener('loadeddata', handleLoadedData);
            video.load();
            return () => video.removeEventListener('loadeddata', handleLoadedData);
        }
    }, []);

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
            className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group active:scale-[0.98] transition-transform"
            onClick={onClick}
        >
            {!isLoaded && (
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                    <div className="animate-pulse w-12 h-12 rounded-full bg-zinc-700" />
                </div>
            )}
            <video
                ref={videoRef}
                src={`${category.url}#t=0.1`}
                muted
                loop
                playsInline
                webkit-playsinline="true"
                disablePictureInPicture
                preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Play/Pause button - bottom left */}
            <button
                onClick={handlePlayPauseClick}
                className="absolute bottom-4 left-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
                {isPlaying ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="5" width="4" height="14"/>
                        <rect x="14" y="5" width="4" height="14"/>
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                )}
            </button>
            {/* Category name - bottom right */}
            <div className="absolute bottom-0 right-0 p-4 text-right">
                <h3 className="text-lg font-medium text-white mb-1">
                    {categoryName}
                </h3>
                <p className="text-xs text-gray-300 flex items-center gap-1 justify-end">
                    <span>{t.portfolio.tapToExplore}</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </p>
            </div>
            {/* Accent border on touch */}
            <div className="absolute inset-0 border-2 border-[var(--accent-color)] rounded-2xl opacity-0 group-active:opacity-100 transition-opacity" />
        </div>
    );
};

export default Portfolio;
