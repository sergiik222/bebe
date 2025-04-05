import React from 'react';
import VideoComponent from "@/components/home/Video.component";
import ImageComponent from "@/components/home/ImageComponent";

const Media = ({media, isMiddle, isDragging, mediaSize, mediaMargin, index, windowWidth}) => {
    const url = "https://firebasestorage.googleapis.com/v0/b/bebe-41997.appspot.com/o/main%2Fvideos%2FDancing.mp4?alt=media&token=c0e85283-ac4a-40e1-a49c-da05109d6161"
    const mediaType = media.mediaType
    var height = mediaSize
    height = mediaSize*0.5625
    return (
        <div
            className={`relative noselect transition-all duration-700 ease-in-out  ${!isDragging ? 'hover:scale-150 hover:z-50' : 'hover:scale-100'} ${isMiddle && isDragging ? 'scale-125' : 'scale-100'} ${isDragging || windowWidth < 640 ? 'mt-0 mb-0' : ''}`}
            style={{
                marginTop: isDragging || windowWidth < 640 ? 0 : `${media.marginTop}px`,
                marginBottom: isDragging || windowWidth < 640 ? 0 : `${media.marginBottom}px`,
                width: `${mediaSize}px`,
                height: `${height}px`,
                flexShrink: 0,
                marginLeft: index === 0 ? 0 : `${mediaMargin}px`,
            }}>
            {mediaType === "img" ?   <ImageComponent  src={media.url} alt={media.alt} isMiddle={isMiddle} isDragging={isDragging} /> : <VideoComponent videoUrl={media.url} alt={media.alt} draggable="false" isMiddle={isMiddle} isDragging={isDragging}/>}
        </div>
    );
};

export default Media;
