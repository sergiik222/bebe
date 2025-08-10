import React from "react";
import CategoryPhoto from "@/components/portfolio/CategoryPhoto";

const PhotosContainer = ({ photos }) => {
    if (!Array.isArray(photos) || photos.length === 0) {
        return <div></div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
            {photos.map((photo, index) => (
                <CategoryPhoto
                    key={index}
                    src={photo.url}
                    alt={photo.alt}
                />
            ))}
        </div>
    );
};

export default PhotosContainer;