'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { animated } from 'react-spring';
import MediaContainer from './MediaContainer';
import DateAxes from './DateAxes';
import dayjs from "dayjs";
import {medias} from "@/medias";

const generateMedias = (num) => {
    const mediasGenerated = medias.map((media, index) => {
        return {
            ...media,
            marginTop: index % 2 === 0 ? 0 : Math.floor(Math.random() * 100) + 50,
            marginBottom: index % 2 === 0 ? Math.floor(Math.random() * 100) + 50 : 0,
        }
    })
    console.log("exportMedias: ", mediasGenerated);
    return mediasGenerated.sort((a, b) => dayjs(a.dateCreated, 'MMMM YYYY').diff(dayjs(b.dateCreated, 'MMMM YYYY')));
};

// Generate boxes only once
const mediasArray = generateMedias(10);
console.log("mediasArray", mediasArray);
const MediaComponent = () => {
    const mediaSize = 250; // Media width and height
    const mediaMargin = 50; // Distance between medias
    const scrollRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [x, setX] = useState(0);


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
            left: -(mediaSize * 10 + mediaMargin * 9 - windowWidth + windowWidth / 2),
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

    return (
        <div className="relative w-full h-screen overflow-hidden" {...bind()} ref={scrollRef}>
            <animated.div
                className="flex items-center h-full cursor-grab"
                style={{
                    transform: `translateX(${x}px)`,
                }}
            >
                <MediaContainer
                    middleIndex={middleIndex}
                    isDragging={isDragging}
                    mediaSize={mediaSize}
                    mediaMargin={mediaMargin}
                    windowWidth={windowWidth}
                    medias={mediasArray}
                />
            </animated.div>
            <DateAxes medias={mediasArray} x={x} mediaSize={mediaSize} mediaMargin={mediaMargin} currentTitle={mediasArray[middleIndex]?.title} />
        </div>
    );
};

export default MediaComponent;
