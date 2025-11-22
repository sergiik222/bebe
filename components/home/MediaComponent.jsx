'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {selectMainPhotosHome, selectMainPhotosIsLoading} from "@/store/photos/photos.selector";
import {setMainPhotos} from "@/store/photos/photos.action";
import {setMainVideos} from "@/store/videos/videos.action";
import {selectMainVideosHome, selectMainVideosIsLoading} from "@/store/videos/videos.selector";
import Header from "@/components/home/Header";
import MediaContainerAnimated from "@/components/home/MediaContainerAnimated";
import {setChosenMediaName} from "@/store/media/media.action";

const MediaComponent = () => {
    const dispatch = useDispatch()
    const mainPhotos = useSelector(selectMainPhotosHome)
    const mainVideos = useSelector(selectMainVideosHome)
    const mainPhotosAreLoading = useSelector(selectMainPhotosIsLoading)
    const mainVideosAreLoading = useSelector(selectMainVideosIsLoading)
    const [mediaSize, setMediaSize] = useState(150)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        dispatch(setMainVideos())
        dispatch(setMainPhotos())
    }, [dispatch])

    useEffect(() => {
        dispatch(setChosenMediaName(""))
        setMediaSize(450)
        if (isMobile){
            setMediaSize(250)
        }
    }, [dispatch, isMobile])

    // Interleave photos and videos in alternating pattern
    const mergedMedia = useMemo(() => {
        const result = [];
        const maxLength = Math.max(mainPhotos.length, mainVideos.length);

        for (let i = 0; i < maxLength; i++) {
            // Add photo first (if available)
            if (i < mainPhotos.length) {
                result.push(mainPhotos[i]);
            }
            // Then add video (if available)
            if (i < mainVideos.length) {
                result.push(mainVideos[i]);
            }
        }

        // Recalculate margins based on merged array index for consistent alternating pattern
        return result.map((media, index) => ({
            ...media,
            marginTop: index % 2 === 0 ? 0 : Math.floor(Math.random() * 100) + 200,
            marginBottom: index % 2 === 0 ? Math.floor(Math.random() * 100) + 200 : 0,
            marginTopMobile: index % 2 === 0 ? 0 : Math.floor(Math.random() * 50) + 100,
            marginBottomMobile: index % 2 === 0 ? Math.floor(Math.random() * 50) + 100 : 0,
        }));
    }, [mainPhotos, mainVideos]);

    const isLoading = mainPhotosAreLoading || mainVideosAreLoading;

    return (
        <div>
            <Header  />
            <MediaContainerAnimated
                medias={mergedMedia}
                mediaSize={mediaSize}
                mediasAreLoading={isLoading}
            />
        </div>
    );
};

export default MediaComponent;
