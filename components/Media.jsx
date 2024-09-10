import React from 'react';
import Image from "next/image";
import VideoComponent from "@/components/video.component";

const Media = ({media, isMiddle, isDragging, mediaSize, mediaMargin, index, windowWidth}) => {
    const url = "https://firebasestorage.googleapis.com/v0/b/bebe-41997.appspot.com/o/main%2Fvideos%2FDancing.mp4?alt=media&token=c0e85283-ac4a-40e1-a49c-da05109d6161"
    const mediaType = media.mediaType
    return (
        <div
            className={`relative noselect transition-all duration-300 ease-in-out  ${!isDragging ? 'hover:scale-150 hover:z-50' : 'hover:scale-100'} ${isMiddle && isDragging ? 'scale-110' : 'scale-100'} ${isDragging || windowWidth < 640 ? 'mt-0 mb-0' : ''}`}
            style={{
                marginTop: isDragging || windowWidth < 640 ? 0 : `${media.marginTop}px`,
                marginBottom: isDragging || windowWidth < 640 ? 0 : `${media.marginBottom}px`,
                width: `${mediaSize}px`,
                height: `${mediaSize}px`,
                flexShrink: 0,
                marginLeft: index === 0 ? 0 : `${mediaMargin}px`,
            }}>
            {mediaType === "img" ?   <Image src={media.url} alt={media.title} fill style={{objectFit: "cover"}} draggable="false"/> : <VideoComponent videoUrl={media.url} draggable="false" isDragging={isDragging}/>}
        </div>
    );
};

export default Media;
