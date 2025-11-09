import React from 'react';
import {useSelector} from "react-redux";
import {selectMediaName} from "@/store/media/media.selector";

const MediaNameComponent = () => {
    const currentTitle = useSelector(selectMediaName)
    return (
        <div >
            <div className="absolute bottom-32 left-0 transform p-2  font_regular text-2xl w-1/6">
                {currentTitle}
            </div>
        </div>
    );
};

export default MediaNameComponent;
