'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { animated } from 'react-spring';
import MediaContainer from './MediaContainer';
import { useDispatch, useSelector } from 'react-redux'
import {selectMainPhotosHome, selectMainPhotosIsLoading} from "@/store/photos/photos.selector";
import {setMainPhotos} from "@/store/photos/photos.action";
import Spinner from "@/components/Spinner";
import {setMainVideos} from "@/store/videos/videos.action";
import {selectMainVideosHome, selectMainVideosIsLoading, selectVideosInUse} from "@/store/videos/videos.selector";
import Header from "@/components/Header";

const MediaComponent = () => {
    const dispatch = useDispatch()
    const mainPhotos = useSelector(selectMainPhotosHome)
    const mainVideos = useSelector(selectMainVideosHome)
    const mainPhotosAreLoading = useSelector(selectMainPhotosIsLoading)
    const mainVideosAreLoading = useSelector(selectMainVideosIsLoading)
    const videosInUse = useSelector(selectVideosInUse)
    const [mediaSize, setMediaSize] = useState(350)
    const mediaMargin = 50; // Distance between medias
    const scrollRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [x, setX] = useState(0);

    useEffect(() => {
            dispatch(setMainVideos())
            dispatch(setMainPhotos())
    }, [dispatch])

    useEffect(() => {
        if (videosInUse){
            setMediaSize(450)
        }else{
            setMediaSize(350)
        }
    }, [dispatch, videosInUse])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
        }
    }, []);

    const bind = useDrag(({ active, movement: [mx], memo = x }) => {
        setIsDragging(active);
        setX(mx + memo);
        return memo;
    }, {
        axis: 'x',
        bounds: {
            left: -(mediaSize * 4 + mediaMargin * 3 - windowWidth + windowWidth / 2),
            right: windowWidth / 2 - mediaSize / 2,
        },
        rubberband: true,
        pointer: { touch: true },
    });

    if (windowWidth === null) {
        return <div>Loading...</div>; // Show a loading indicator until windowWidth is set
    }

    const middleBoxPosition = windowWidth / 2 - mediaSize / 2;
    const middleIndex = Math.round((middleBoxPosition - x) / (mediaSize + mediaMargin));

    if (
        mainPhotosAreLoading || mainVideosAreLoading
    ) {
        return <Spinner />
    }else{
        return (
            <div className="relative w-full h-screen overflow-hidden " {...bind()} ref={scrollRef}>
                <Header />
                <animated.div
                    className="flex items-center h-full cursor-grab "
                    style={{
                        transform: `translateX(${x}px)`,
                    }}
                >
                    {videosInUse ?
                        <MediaContainer
                            middleIndex={middleIndex}
                            isDragging={isDragging}
                            mediaSize={mediaSize}
                            mediaMargin={mediaMargin}
                            windowWidth={windowWidth}
                            medias={mainVideos}
                        />
                        :
                        <MediaContainer
                            middleIndex={middleIndex}
                            isDragging={isDragging}
                            mediaSize={mediaSize}
                            mediaMargin={mediaMargin}
                            windowWidth={windowWidth}
                            medias={mainPhotos}
                        />
                    }

                </animated.div>

            </div>
        );
    }
};

export default MediaComponent;


// <DateAxes medias={mediasArray} x={x} mediaSize={mediaSize} mediaMargin={mediaMargin} currentTitle={mediasArray[middleIndex]?.title} />