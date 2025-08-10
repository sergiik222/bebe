'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from "@/components/helpers/Spinner";
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Lightbox from 'yet-another-react-lightbox';
import {useRouter} from "next/navigation";
import {
    selectCategoryVideos,
    selectCategoryVideosIsLoading,
    selectVideoIsCategorySelected
} from "@/store/videos/videos.selector";
import Video from 'yet-another-react-lightbox/plugins/video';


const VideoGallery = () => {
    const categoryVideos = useSelector(selectCategoryVideos);
    const isCategorySelected = useSelector(selectVideoIsCategorySelected);
    const categoryVideosIsLoading = useSelector(selectCategoryVideosIsLoading);

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const router = useRouter();

    const handleBack = () => {
        router.push('/portfolio?from=videoGallery');
    };

    if (!isCategorySelected) {
        return (
            <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
                <div className="flex w-full mt-16">
                    No category selected
                </div>
            </div>
        );
    }

    if (categoryVideosIsLoading) {
        return <Spinner />;
    }

    const handleClick = (i) => {
        setIndex(i);
        setOpen(true);
    };

    const slides = categoryVideos.map((video) => ({
        type: 'video',
        width: 1280, // or the actual width of your video
        height: 720, // or the actual height
        poster: `${video.url}#t=1`,
        sources: [
            {
                src: video.url,
                type: 'video/mp4',
            },
        ],
        autoPlay: true,
        controls: true,
    }));

    return (
        <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen p-4">
            <div className="flex items-center justify-center mt-8 mb-16">
                <button className="btn text-2xl" onClick={handleBack}>
                    Back to Portfolio
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categoryVideos.map((video, i) => (
                    <div
                        key={i}
                        className="relative w-full aspect-[16/9] hover:cursor-pointer overflow-hidden"
                        onClick={() => handleClick(i)}
                    >
                        <video
                            src={video.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <span className="text-white text-4xl">▶</span>
                        </div>
                    </div>
                ))}
            </div>

            {open && (
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    index={index}
                    slides={slides}
                    plugins={[Video]}
                    animation={{ fade: 250 }}
                    styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
                />
            )}
        </div>
    );
};

export default VideoGallery;