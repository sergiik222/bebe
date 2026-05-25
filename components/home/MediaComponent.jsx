'use client'

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {selectMainPhotosHome, selectMainPhotosIsLoading} from "@/store/photos/photos.selector";
import {setMainPhotos} from "@/store/photos/photos.action";
import {setMainVideos} from "@/store/videos/videos.action";
import {selectMainVideosHome, selectMainVideosIsLoading} from "@/store/videos/videos.selector";
import MediaContainerAnimated from "@/components/home/MediaContainerAnimated";
import {setChosenMediaName} from "@/store/media/media.action";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useMediaSize } from "@/hooks/useMediaSize";

// Header import was removed: the stub component returned null and shipped no UI.

const MediaComponent = () => {
    const dispatch = useDispatch()
    const mainPhotos = useSelector(selectMainPhotosHome)
    const mainVideos = useSelector(selectMainVideosHome)
    const mainPhotosAreLoading = useSelector(selectMainPhotosIsLoading)
    const mainVideosAreLoading = useSelector(selectMainVideosIsLoading)

    // Use custom hooks for window dimensions and media sizing
    const { isMobile } = useWindowDimensions();
    const { size: mediaSize } = useMediaSize(isMobile);

    useEffect(() => {
        dispatch(setMainVideos())
        dispatch(setMainPhotos())
        dispatch(setChosenMediaName(""))
    }, [dispatch])

    // Interleave photos and videos in alternating pattern
    const mergedMedia = useMemo(() => {
        const result = [];
        const maxLength = Math.max(mainPhotos.length, mainVideos.length);

        // Seeded random function for deterministic margins
        const seededRandom = (index, multiplier = 1) => {
            const x = Math.sin(index * multiplier) * 10000;
            return Math.floor((x - Math.floor(x)) * 100);
        };

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

        // Add deterministic margins based on index for consistent alternating pattern
        return result.map((media, index) => ({
            ...media,
            marginTop: index % 2 === 0 ? 0 : seededRandom(index, 1.5) + 200,
            marginBottom: index % 2 === 0 ? seededRandom(index, 1.2) + 200 : 0,
            marginTopMobile: index % 2 === 0 ? 0 : seededRandom(index, 2) + 100,
            marginBottomMobile: index % 2 === 0 ? seededRandom(index, 2.5) + 100 : 0,
        }));
    }, [mainPhotos, mainVideos]);

    const isLoading = mainPhotosAreLoading || mainVideosAreLoading;

    return (
        <div>
            <MediaContainerAnimated
                medias={mergedMedia}
                mediaSize={mediaSize}
                mediasAreLoading={isLoading}
            />
        </div>
    );
};

export default MediaComponent;
