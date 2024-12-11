'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import MediaContainer from './MediaContainer';
import Spinner from "@/components/Spinner";
import MediaNameComponent from "@/components/MediaNameComponent";

const MediaContainerAnimated = ({ medias, mediasAreLoading, mediaSize }) => {
    const mediaMargin = 50; // Distance between medias
    const scrollRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [middleIndex, setMiddleIndex] = useState(0);

    // useSpring for smoother mediaX transitions
    const [{ mediaX }, api] = useSpring(() => ({ mediaX: 0 }));

    // Reset mediaX when the medias change (photos to videos or vice versa)
    useEffect(() => {
        api.start({ mediaX: 0 });
    }, [medias, api]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
        }
    }, []);

    const bindMedias = useDrag(({ active, movement: [mx], memo = mediaX.get() }) => {
        setIsDragging(active);

        // Calculate the new X position
        const newMediaX = mx + memo;

        // Apply the transformation if dragging, else spring it back
        if (active) {
            api.start({ mediaX: newMediaX, immediate: true });
        } else {
            // Snap back if out of bounds
            const leftBound = -(mediaSize * medias.length + mediaMargin * medias.length - windowWidth + windowWidth / 2);
            const rightBound = windowWidth / 2 - mediaSize / 2;

            const clampedX = Math.max(Math.min(newMediaX, rightBound), leftBound);

            api.start({ mediaX: clampedX, immediate: false, config: { tension: 300, friction: 30 } });  // Adjust the config for smoothness
        }
        const middleBoxPosition = windowWidth / 2 - mediaSize / 2;
        const middleIndexCurrent = Math.round((middleBoxPosition - mediaX.get()) / (mediaSize + mediaMargin));
        setMiddleIndex(middleIndexCurrent);
        return memo;
    }, {
        axis: 'x',
        bounds: {
            left: -(mediaSize * medias.length + mediaMargin * medias.length - windowWidth + windowWidth / 2),
            right: windowWidth / 2 - mediaSize / 2,
        },
        rubberband: 0.5,
        pointer: { touch: true },
    });

    if (mediasAreLoading) {
        return <Spinner />;
    } else {
        return (
            <div className="relative w-full h-screen overflow-hidden " {...bindMedias()} ref={scrollRef}>
                <animated.div
                    className="flex items-center h-full cursor-grab"
                    style={{
                        transform: mediaX.to(x => `translateX(${x}px)`),
                    }}
                >
                    <MediaContainer
                        middleIndex={middleIndex}
                        isDragging={isDragging}
                        mediaSize={mediaSize}
                        mediaMargin={mediaMargin}
                        windowWidth={windowWidth}
                        medias={medias}
                    />
                </animated.div>
                <MediaNameComponent />
            </div>
        );
    }
};

export default MediaContainerAnimated;
