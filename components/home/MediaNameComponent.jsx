import React from 'react';
import {useSelector} from "react-redux";
import {selectMediaName} from "@/store/media/media.selector";

const MediaNameComponent = () => {
    const currentTitle = useSelector(selectMediaName)
    return (
        <div >
            <div className="absolute bottom-16 left-0 transform p-2  text-secondary-text text-2xl w-1/6">
                {currentTitle}
            </div>
        </div>
    );
};

export default MediaNameComponent;
