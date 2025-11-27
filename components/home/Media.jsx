import React, { memo } from 'react';
import VideoComponent from "@/components/home/Video.component";
import ImageComponent from "@/components/home/ImageComponent";

const Media = memo(({media, isMiddle, isDragging, mediaSize, mediaMargin, index, windowWidth}) => {
     const mediaType = media.mediaType
    var height = mediaSize
    height = mediaSize*0.5625
    return (
        <div
            className={`relative noselect transition-all duration-700 ease-in-out ${!isDragging ? 'hover:z-50' : ''} ${isDragging || windowWidth < 640 ? 'mt-0 mb-0' : ''}`}
            style={{
                marginTop: isDragging ? `${-100}px` : windowWidth < 640 ? `${media.marginTopMobile - 100}px` : `${media.marginTop}px`,
                marginBottom: isDragging ? 0 : windowWidth < 640 ? `${media.marginBottomMobile - 100}px` : `${media.marginBottom}px`,
                width: `${mediaSize}px`,
                height: `${height}px`,
                flexShrink: 0,
                marginLeft: index === 0 ? 0 : `${mediaMargin}px`,
            }}>
            {mediaType === "img" ?   <ImageComponent  src={media.url} alt={media.alt} isMiddle={isMiddle} isDragging={isDragging} date={media.date} /> : <VideoComponent videoUrl={media.url} alt={media.alt} draggable="false" isMiddle={isMiddle} isDragging={isDragging}/>}
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
        prevProps.windowWidth === nextProps.windowWidth
    );
});

Media.displayName = 'Media';

export default Media;
