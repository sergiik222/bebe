import Image from "next/image";
import React, {useEffect, useState} from "react";
import {setChosenMediaName} from "@/store/media/media.action";
import {useDispatch} from "react-redux";
import VideoBrackets from "@/components/home/VideoBrackets";
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

const ImageComponent = ({src, alt, isMiddle, isDragging, date} ) => {
    const dispatch = useDispatch()
    const [isHovered, setIsHovered] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const handleMouseOver = () => {
        if (!isDragging) {
            setIsHovered(true)
        }
        dispatch(setChosenMediaName(alt))
    };

    useEffect(() => {
        if (isDragging) {
            setIsHovered(false)
        }
        if (isMiddle && isDragging){
            dispatch(setChosenMediaName(alt))
        }
    }, [isMiddle, isDragging, dispatch, alt]);

    const handleMouseOut = () => {
        setIsHovered(false)
        dispatch(setChosenMediaName(""))
    };

    const handleClick = () => {
        if (!isDragging) {
            setIsFullscreen(true)
        }
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false)
    };

    return (
        <>
            <div
                className="relative w-full h-full hover:cursor-pointer"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={handleClick}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        className='object-cover'
                        src={src}
                        alt={alt}
                        fill
                        draggable="false"
                    />
                </div>

                {/* Animated brackets on hover */}
                <VideoBrackets show={isHovered && !isDragging} title={alt} showLens={true} />
            </div>

            {/* Fullscreen view */}
            {isFullscreen && (
                <Lightbox
                    open={isFullscreen}
                    close={handleCloseFullscreen}
                    slides={[{ src, alt }]}
                    plugins={[Zoom]}
                    animation={{fade: 250}}
                    carousel={{ finite: true }}
                    render={{
                        buttonPrev: () => null,
                        buttonNext: () => null,
                    }}
                />
            )}
        </>
    )
}


export default ImageComponent