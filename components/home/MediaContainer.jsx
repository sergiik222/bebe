import React from 'react';
import Media from './Media';

const MediaContainer = ({  middleIndex, isDragging, mediaSize, mediaMargin, windowWidth, medias }) => {

    if (!Array.isArray(medias) || medias.length === 0) {
       return <div></div>
    }

    return (
        <div className="flex items-center h-full">
            {medias.map((media, index) => {
                const isMiddle = middleIndex === index;
                return (
                    <Media
                        key={index}
                        media={media}
                        isMiddle={isMiddle}
                        isDragging={isDragging}
                        mediaSize={mediaSize}
                        mediaMargin={mediaMargin}
                        index={index}
                        windowWidth={windowWidth}
                    />
                );
            })}
        </div>
    );
};

export default MediaContainer;
