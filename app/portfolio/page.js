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

                    {/* Single Column Layout - Tablet & Mobile */}
                    <div className="lg:hidden space-y-10">
                        {/* Photo Section */}
                        <div>
                            <h2 className="text-lg sm:text-xl font-medium mb-4 text-[var(--accent-color)]">
                                {t.portfolio.photo}
                            </h2>
                            {photoCategories.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 bg-zinc-900/30 rounded-xl">
                                    {t.portfolio.noCategories}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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

                        {/* Video Section */}
                        <div>
                            <h2 className="text-lg sm:text-xl font-medium mb-4 text-[var(--accent-color)]">
                                {t.portfolio.video}
                            </h2>
                            {videoCategories.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 bg-zinc-900/30 rounded-xl">
                                    {t.portfolio.noCategories}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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
            {/* Category name - bottom left */}
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
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
            {/* Category name - bottom left */}
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                <h3 className={`text-sm lg:text-base font-medium text-white transition-transform duration-300 ${
                    isHovered ? 'translate-y-0' : 'translate-y-1'
                }`}>
                    {categoryName}
                </h3>
            </div>
            {/* Play/Pause button - visible on mobile */}
            <button
                onClick={handlePlayPauseClick}
                className="absolute bottom-3 right-3 z-20 block lg:hidden p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-colors"
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

export default Portfolio;
