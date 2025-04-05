import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCategoryPhotos, selectMainPhotosHome} from "@/store/photos/photos.selector";
import CategoryPhoto from "@/components/portfolio/CategoryPhoto";


const PhotosContainer = ({photos}) => {
    const categoryPhotos = useSelector(selectCategoryPhotos)
    console.log("categoryPhotos: ", categoryPhotos)
    console.log("photos", photos);

    if (!Array.isArray(photos) || photos.length === 0) {
        return <div></div>
    }

    return (
        <div className="flex justify-between flex-wrap gap-2 w-full">

        {photos.map((photo, index) => {
                return (
                    <div key={index}
                         className="min-w-[30%] h-[240px] max-w-[50%] flex flex-1 items-center justify-center border border-black mx-[7.5px] mb-[15px] overflow-hidden hover:cursor-pointer group">
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-[6000ms] ease-[cubic-bezier(0.25,0.45,0.45,0.95)] group-hover:scale-110">
                            <CategoryPhoto key={index} src={photo.url} alt={photo.alt}/>
                        </div>
                        <div
                            className="absolute opacity-70 group-hover:opacity-90 transition-opacity bg-white h-[90px] flex flex-col items-center justify-center w-fit px-4">
                            <h2 className="font-bold text-[22px] text-accent w-auto">{photo.alt}</h2>
                        </div>

                    </div>
                )
            }
        )
        }
        </div>
    )
}


export default PhotosContainer