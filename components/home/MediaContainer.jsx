import React, { memo } from 'react';
import Media from './Media';

const MediaContainer = memo(({  middleIndex, isDragging, mediaSize, mediaMargin, windowWidth, medias, isMobileLandscape }) => {

    if (!Array.isArray(medias) || medias.length === 0) {
       return null; // Return null instead of empty div
    }

    return (
        <div className="flex items-center h-full">
            {medias.map((media, index) => {
                const isMiddle = middleIndex === index;
                // Use media URL + index for better key uniqueness in looped array
                const key = `${media.url}-${index}`;
                return (
                    <Media
                        key={key}
                        media={media}
                        isMiddle={isMiddle}
                        isDragging={isDragging}
                        mediaSize={mediaSize}
                        mediaMargin={mediaMargin}
                        index={index}
                        windowWidth={windowWidth}
                        isMobileLandscape={isMobileLandscape}
                    />
                );
            })}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison - only re-render if these specific props change
    return (
        prevProps.middleIndex === nextProps.middleIndex &&
        prevProps.isDragging === nextProps.isDragging &&
        prevProps.mediaSize === nextProps.mediaSize &&
        prevProps.mediaMargin === nextProps.mediaMargin &&
        prevProps.windowWidth === nextProps.windowWidth &&
        prevProps.medias.length === nextProps.medias.length &&
        prevProps.isMobileLandscape === nextProps.isMobileLandscape
    );
});

MediaContainer.displayName = 'MediaContainer';

export default MediaContainer;
