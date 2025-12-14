import Image from "next/image";
import React, {useEffect, useState, useCallback, memo} from "react";
import {setChosenMediaName} from "@/store/media/media.action";
import {useDispatch} from "react-redux";
import VideoBrackets from "@/components/home/VideoBrackets";
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { useMediaHover } from "@/hooks/useMediaHover";
import 'yet-another-react-lightbox/styles.css';

const ImageComponent = memo(({src, alt, isMiddle, isDragging, date, onLoaded} ) => {
    const dispatch = useDispatch()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const hasCalledOnLoaded = React.useRef(false);

    const handleImageLoad = useCallback(() => {
        if (onLoaded && !hasCalledOnLoaded.current) {
            hasCalledOnLoaded.current = true;
            onLoaded();
        }
    }, [onLoaded]);

    // Handle hover changes - dispatch to Redux
    const handleHoverChange = useCallback((hovering) => {
        dispatch(setChosenMediaName(hovering ? alt : ""));
    }, [dispatch, alt]);

    // Update chosen media when middle and dragging
    useEffect(() => {
        if (isMiddle && isDragging) {
            dispatch(setChosenMediaName(alt));
        }
    }, [isMiddle, isDragging, dispatch, alt]);

    // Use custom hook for hover and drag detection
    const { isHovered, handlers, handleClick: hookHandleClick } = useMediaHover(
        isDragging,
        handleHoverChange
    );

    const openFullscreen = useCallback(() => {
        setIsFullscreen(true);
    }, []);

    const handleCloseFullscreen = useCallback(() => {
        setIsFullscreen(false);
    }, []);

    const handleClick = useCallback(() => {
        hookHandleClick(openFullscreen);
    }, [hookHandleClick, openFullscreen]);

    return (
        <>
            <div
                className="relative w-full h-full hover:cursor-pointer"
                {...handlers}
                onClick={handleClick}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        className='object-cover'
                        src={src}
                        alt={alt}
                        fill
                        draggable="false"
                        onLoad={handleImageLoad}
                    />
                </div>

                {/* Animated brackets on hover */}
                <VideoBrackets show={isHovered && !isDragging} title={alt} showLens={true} />
            </div>

            {/* Fullscreen view */}
            {isFullscreen && (
                <Lightbox
                    open={isFullscreen}
                    close={handleCloseFullscreen}
                    slides={[{ src, alt }]}
                    plugins={[Zoom]}
                    animation={{fade: 250}}
                    carousel={{ finite: true }}
                    render={{
                        buttonPrev: () => null,
                        buttonNext: () => null,
                    }}
                />
            )}
        </>
    )
}, (prevProps, nextProps) => {
    // Custom comparison - only re-render if these specific props change
    return (
        prevProps.src === nextProps.src &&
        prevProps.alt === nextProps.alt &&
        prevProps.isMiddle === nextProps.isMiddle &&
        prevProps.isDragging === nextProps.isDragging &&
        prevProps.date === nextProps.date &&
        prevProps.onLoaded === nextProps.onLoaded
    );
});

ImageComponent.displayName = 'ImageComponent';

export default ImageComponent;