import {useDispatch} from "react-redux";

import Image from "next/image";
import React from "react";
import {setCategoryPhotos} from "@/store/photos/photos.action";

const CategoryPhoto = ({key, src, alt}) => {
    const dispatch = useDispatch()
    console.log("Alt: ", alt)
    const handleOnClick = () => {
        dispatch(setCategoryPhotos({ category: alt }))
    }
    return (
            <Image key={key} src={src} alt={alt} fill
                   style={{objectFit: "cover", position: "relative"}} draggable="false" onClick={handleOnClick}/>

    )

}

export default CategoryPhoto;