import React, { memo } from 'react';
import VideoComponent from "@/components/home/Video.component";
import ImageComponent from "@/components/home/ImageComponent";

const Media = memo(({media, isMiddle, isDragging, mediaSize, mediaMargin, index, windowWidth, isMobileLandscape, onLoaded}) => {
     const mediaType = media.mediaType
    var height = mediaSize
    height = mediaSize*0.5625
    // On mobile (< 768px), keep staggered margins even during drag
    const isMobile = windowWidth < 768;
    const getMarginTop = () => {
        // Mobile landscape: small top margin, flat layout
        if (isMobileLandscape) {
            return '10px';
        }
        if (isMobile) {
            // Mobile portrait: always use mobile margins, never flatten
            return `${media.marginTopMobile - 100}px`;
        }
        // Desktop: flatten during drag
        return isDragging ? `${-100}px` : `${media.marginTop}px`;
    };
    const getMarginBottom = () => {
        // Mobile landscape: small bottom margin, flat layout
        if (isMobileLandscape) {
            return '10px';
        }
        if (isMobile) {
            // Mobile portrait: always use mobile margins, never flatten
            return `${media.marginBottomMobile - 100}px`;
        }
        // Desktop: flatten during drag
        return isDragging ? 0 : `${media.marginBottom}px`;
    };

    return (
        <div
            className={`relative noselect transition-all duration-700 ease-in-out ${!isDragging ? 'hover:z-50' : ''}`}
            style={{
                marginTop: getMarginTop(),
                marginBottom: getMarginBottom(),
                width: `${mediaSize}px`,
                height: `${height}px`,
                flexShrink: 0,
                marginLeft: index === 0 ? 0 : `${mediaMargin}px`,
            }}>
            {mediaType === "img" ?   <ImageComponent  src={media.url} alt={media.alt} isMiddle={isMiddle} isDragging={isDragging} date={media.date} onLoaded={onLoaded} /> : <VideoComponent videoUrl={media.url} alt={media.alt} draggable="false" isMiddle={isMiddle} isDragging={isDragging} onLoaded={onLoaded}/>}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison - only re-render if these specific props change
    return (
        prevProps.media.url === nextProps.media.url &&
        prevProps.media.mediaType === nextProps.media.mediaType &&
        prevProps.media.marginTop === nextProps.media.marginTop &&
        prevProps.media.marginBottom === nextProps.media.marginBottom &&
        prevProps.media.marginTopMobile === nextProps.media.marginTopMobile &&
        prevProps.media.marginBottomMobile === nextProps.media.marginBottomMobile &&
        prevProps.isMiddle === nextProps.isMiddle &&
        prevProps.isDragging === nextProps.isDragging &&
        prevProps.mediaSize === nextProps.mediaSize &&
        prevProps.mediaMargin === nextProps.mediaMargin &&
        prevProps.index === nextProps.index &&
        prevProps.windowWidth === nextProps.windowWidth &&
        prevProps.isMobileLandscape === nextProps.isMobileLandscape &&
        prevProps.onLoaded === nextProps.onLoaded
    );
});

Media.displayName = 'Media';

export default Media;
