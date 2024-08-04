import React from 'react';

const DateAxes = ({ medias, x, mediaSize, mediaMargin, currentTitle }) => {
    return (
        <div className="absolute bottom-0 w-full h-16 border-t border-gray-300">
            <div className="relative w-full h-full flex justify-between px-4" style={{marginLeft: `${x}px`}}>
                {medias.map((media, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0"
                        style={{
                            width: `${mediaSize + mediaMargin}px`,
                        }}
                    >
                        <div className="text-gray-600 text-sm text-center">{media.dateCreated}</div>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-2.5 h-6 bg-accent "></div>
            <div className="absolute bottom-16 left-0 transform p-2 rounded bg-accent text-secondary w-1/6">
                {currentTitle}
            </div>
        </div>
    );
};

export default DateAxes;
