'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import CustomPhotoViewer from '@/components/portfolio/CustomPhotoViewer';
import Loader from '@/components/ui/Loader';

const PhotoGallery = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const category = decodeURIComponent(params.category);

    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch(`/api/media/category-photos?category=${encodeURIComponent(category)}`);
                const data = await response.json();
                setPhotos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchPhotos();
        }
    }, [category]);

    const handlePhotoClick = (index) => {
        setCurrentIndex(index);
        setViewerOpen(true);
    };

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
                    <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4 mt-2 md:pl-0 md:mt-0 relative z-40">
                        <button
                            onClick={() => router.push('/portfolio')}
                            className="flex items-center justify-center w-10 h-10 bg-surface/80 backdrop-blur-sm border border-line-strong rounded-lg text-secondary-text hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl md:text-3xl font-medium">{category}</h1>
                    </div>

                    {/* Photo Grid */}
                    {photos.length === 0 ? (
                        <div className="text-center py-12 text-secondary-text">
                            {t.portfolio.noPhotos}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                                    onClick={() => handlePhotoClick(index)}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.alt || photo.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                                    <div className={`absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent-color)] rounded-xl transition-colors duration-300`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Photo Viewer */}
            <CustomPhotoViewer
                photos={photos}
                currentIndex={currentIndex}
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                onNavigate={setCurrentIndex}
            />
        </div>
    );
};

export default PhotoGallery;
