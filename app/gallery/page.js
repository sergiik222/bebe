'use client'
import React from 'react'
import {useSelector} from "react-redux";
import {
    selectCategoryPhotos, selectCategoryPhotosIsLoading,
    selectIsCategorySelected,
} from "@/store/photos/photos.selector";
import Spinner from "@/components/helpers/Spinner";
import PhotosContainer from "@/components/portfolio/PhotosContainer.component";


const Gallery = () => {
    const categoryPhotos = useSelector(selectCategoryPhotos)
    const isCategorySelected = useSelector(selectIsCategorySelected)
    const categoryPhotosIsLoading = useSelector(selectCategoryPhotosIsLoading)

    if (!isCategorySelected){
        return (
            <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
                <div className="flex w-full mt-16">
                    No category selected
                </div>
            </div>
        )
    }

    if (categoryPhotosIsLoading) {
        return <Spinner/>;
    } else {
        return (
            <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
                <div className="flex w-full mt-16">
                    <div
                        className="block w-full" >
                        <PhotosContainer photos={categoryPhotos}/>
                        </div>
                    </div>
            </div>
        );
    }
};

export default Gallery;


