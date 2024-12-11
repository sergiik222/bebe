import Image from "next/image";
import React, {useEffect} from "react";
import {setChosenMediaName} from "@/store/media/media.action";
import {useDispatch} from "react-redux";

const ImageComponent = ({src, alt, isMiddle, isDragging} ) => {
    const dispatch = useDispatch()
    const handleMouseOver = () => {
        dispatch(setChosenMediaName(alt))
    };

    useEffect(() => {
        if (isMiddle && isDragging){
            dispatch(setChosenMediaName(alt))
        }
    }, [isMiddle, isDragging, dispatch, alt]);

    const handleMouseOut = () => {
        dispatch(setChosenMediaName(""))
    };

    return (
        <Image onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className='' src={src} alt={alt} fill style={{objectFit: "cover"}} draggable="false"/>
    )
}


export default ImageComponent