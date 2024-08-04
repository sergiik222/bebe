import React from 'react';
import Image from "next/image";

const Media = ({ media, isMiddle, isDragging, mediaSize, mediaMargin, index, windowWidth }) => {
    return (
        <div
            className={`relative transition-all duration-300 ease-in-out hover:scale-150 hover:z-50 ${isMiddle && isDragging ? 'scale-110' : 'scale-100'} ${isDragging || windowWidth < 640 ? 'mt-0 mb-0' : ''}`}
            style={{
                marginTop: isDragging || windowWidth < 640 ? 0 : `${media.marginTop}px`,
                marginBottom: isDragging || windowWidth < 640 ? 0 : `${media.marginBottom}px`,
                width: `${mediaSize}px`,
                height: `${mediaSize}px`,
                flexShrink: 0,
                marginLeft: index === 0 ? 0 : `${mediaMargin}px`,
            }}>

                <Image src={media.image} alt={media.title} fill style={{objectFit: "cover"}} draggable="false"/>


        </div>
    );
};

export default Media;
