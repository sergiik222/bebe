'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    selectCategoryPhotos,
    selectCategoryPhotosIsLoading,
    selectIsCategorySelected,
} from "@/store/photos/photos.selector";
import Spinner from "@/components/helpers/Spinner";
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Image from "next/image";
import {useRouter} from "next/navigation";


const Gallery = () => {
    const categoryPhotos = useSelector(selectCategoryPhotos);
    const isCategorySelected = useSelector(selectIsCategorySelected);
    const categoryPhotosIsLoading = useSelector(selectCategoryPhotosIsLoading);

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const router = useRouter();

    const handleBack = () => {
        router.push("/portfolio");
    };

    if (!isCategorySelected) {
        return (
            <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
                <div className="flex w-full mt-16 font_regular">
                    No category selected
                </div>
            </div>
        );
    }

    if (categoryPhotosIsLoading) {
        return <Spinner />;
    }

    const handleClick = (i) => {
        setIndex(i);
        setOpen(true);
    };

    const slides = categoryPhotos.map(photo => ({
        src: photo.url,
        alt: photo.alt,
    }));

    return (
        <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen p-4">
            <div className='flex items-center justify-center mt-8 mb-16'>
                <button
                    className= "btn text-2xl "
                    onClick={handleBack}>
                    Back to Portfolio
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/*categoryPhotos.map((photo, i) => (
                    <div
                        key={i}
                        className="relative hover:cursor-pointer overflow-hidden"
                        onClick={() => handleClick(i)}
                    >
                        <Image
                            src={photo.thumbnailUrl || photo.url}
                            alt={photo.alt}
                            width={photo.width}
                            height={photo.height}
                            className="object-cover w-full h-auto rounded"
                            loading="lazy"
                        />
                    </div>
                ))*/}
                {categoryPhotos.map((photo, i) => (
                    <div
                        key={i}
                        className="relative w-full aspect-[4/3] hover:cursor-pointer overflow-hidden"
                        onClick={() => handleClick(i)}
                    >
                        <Image
                            src={photo.url}
                            alt={photo.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {open && (
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    index={index}
                    slides={slides}
                    plugins={[Thumbnails, Zoom]}
                    animation={{fade: 250}}
                    carousel={{preload: 3}} // optional, improves arrow navigation performance
                    thumbnails={{showToggle: true, border: 0}} // optional config
                />
            )}
        </div>
    );
};

export default Gallery;
