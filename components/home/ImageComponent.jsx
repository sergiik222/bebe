import Image from "next/image";
import React, {useEffect, useState, useRef} from "react";
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
    const dragStartRef = useRef({ x: 0, y: 0, wasDragging: false })

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

    const handleMouseDown = (e) => {
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            wasDragging: false
        }
    };

    const handleMouseMove = (e) => {
        if (dragStartRef.current.x !== 0 || dragStartRef.current.y !== 0) {
            const deltaX = Math.abs(e.clientX - dragStartRef.current.x)
            const deltaY = Math.abs(e.clientY - dragStartRef.current.y)
            if (deltaX > 5 || deltaY > 5) {
                dragStartRef.current.wasDragging = true
            }
        }
    };

    const handleClick = () => {
        if (!isDragging && !dragStartRef.current.wasDragging) {
            setIsFullscreen(true)
        }
        dragStartRef.current = { x: 0, y: 0, wasDragging: false }
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
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
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