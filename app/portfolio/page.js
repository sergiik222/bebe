'use client'
import React, {useEffect, useState} from 'react'
import Divider from '@mui/material/Divider';
import {useDispatch, useSelector} from "react-redux";
import {selectCategoryPhotos, selectMainPhotos, selectMainPhotosIsLoading} from "@/store/photos/photos.selector";
import {
    selectCategoryVideosIsLoading,
    selectMainVideos,
} from "@/store/videos/videos.selector";
import { setVideoCategories} from "@/store/videos/videos.action";
import {setMainPhotos} from "@/store/photos/photos.action";
import Spinner from "@/components/helpers/Spinner";

import PhotosContainer from "@/components/portfolio/PhotosContainer.component";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import VideosContainer from "@/components/portfolio/VideosContainer.component";

const Portfolio = () => {

    const dispatch = useDispatch()
    const mainPhotos = useSelector(selectMainPhotos)
    const videoCategories = useSelector(selectMainVideos)
    const categoryPhotos = useSelector(selectCategoryPhotos)
    const mainPhotosAreLoading = useSelector(selectMainPhotosIsLoading)
    const mainVideosAreLoading = useSelector(selectCategoryVideosIsLoading)

    const [showPhotos, setShowPhotos] = useState(false)
    const [showVideos, setShowVideos] = useState(false)
    const [photoCategoryChosen, setPhotoCategoryChosen] = useState(false)
    const [photoNonCategoryChosen, setPhotoNonCategoryChosen] = useState(true)

    const clickSetShowPhotos = () => {
        setShowPhotos(true)
        setShowVideos(false)
        setPhotoCategoryChosen(false)
        setPhotoNonCategoryChosen(true)
    }

    const clickSetShowVideos = () => {
        setShowPhotos(false)
        setShowVideos(true)
        setPhotoCategoryChosen(false)
        setPhotoNonCategoryChosen(true)
    }

    const resetPhotosVideos = () => {
        setShowPhotos(false)
        setShowVideos(false)
        setPhotoCategoryChosen(false)
        setPhotoNonCategoryChosen(true)
    }

    useEffect(() => {
        dispatch(setVideoCategories())
        dispatch(setMainPhotos())
    }, [dispatch])


    useEffect(() => {
        if (categoryPhotos.length > 0) {
            setPhotoCategoryChosen(true)
            setPhotoNonCategoryChosen(false)
        }
    }, [categoryPhotos])

    if (mainPhotosAreLoading || mainVideosAreLoading){
        return <Spinner />;
    }else{
        return (
            <div>
                <PortfolioHeader showPhotos={showPhotos} setShowPhotos={clickSetShowPhotos} showVideos={showVideos} setShowVideos={clickSetShowVideos} resetPhotosVideos={resetPhotosVideos}/>

                    <div className="flex w-full mt-16">
                        <div
                            className={`w-1/2 ${showPhotos ? 'block w-full' : 'w-1/2'} ${showVideos ? 'hidden w-0' : ''}`}>
                            <PhotosContainer photos={mainPhotos} showPhotos={showPhotos}/>
                        </div>
                        <Divider orientation="vertical" flexItem/>
                        <div
                            className={`w-1/2 ${showVideos ? 'block w-full' : 'w-1/2'} ${showPhotos ? 'hidden w-0' : ''}`}>
                            <VideosContainer videos={videoCategories} showVideos={showVideos}/>
                        </div>
                    </div>


            </div>
        );
    }
};

export default Portfolio;



/*  {setPhotoNonCategoryChosen && (
                )}
                {setPhotoCategoryChosen && (
                    <div className="flex w-full mt-16">
                        <div
                            className={`block w-full`}>
                            <PhotosContainer photos={categoryPhotos} />
                        </div>
                    </div>
                )}*/

