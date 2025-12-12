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
            <div className="flex-1 p-4 md:p-8">
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
                            <h2 className="text-lg sm:text-xl font-medium mb-4 text-[var(--accent-color)] text-right">
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
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-70'
            }`} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className={`text-xl font-medium text-white transition-transform duration-300 ${
                    isHovered ? 'translate-y-0' : 'translate-y-2'
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
    const videoRef = useRef(null);
    const categoryName = category.alt || category.name.split('.')[0];

    useEffect(() => {
        if (videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(() => {});
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isHovered]);

    return (
        <div
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <video
                ref={videoRef}
                src={category.url}
                muted
                loop
                playsInline
                preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                    isHovered ? 'scale-110' : 'scale-100'
                }`}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-70'
            }`} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className={`text-xl font-medium text-white transition-transform duration-300 ${
                    isHovered ? 'translate-y-0' : 'translate-y-2'
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

export default Portfolio;
