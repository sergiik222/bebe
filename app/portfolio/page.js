'use client'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {
    selectMainPhotos,
    selectMainPhotosIsLoading
} from "@/store/photos/photos.selector";
import {
    selectCategoryVideosIsLoading,
    selectMainVideos,
} from "@/store/videos/videos.selector";
import { setVideoCategories} from "@/store/videos/videos.action";
import {setCategorySelected, setMainPhotos} from "@/store/photos/photos.action";
import Spinner from "@/components/helpers/Spinner";

import PhotosContainer from "@/components/portfolio/PhotosContainer.component";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import VideosContainer from "@/components/portfolio/VideosContainer.component";

const Portfolio = () => {

    const dispatch = useDispatch()
    const mainPhotos = useSelector(selectMainPhotos)
    const [photosToShow, setPhotosToShow] = useState(mainPhotos)
    const videoCategories = useSelector(selectMainVideos)
    const mainPhotosAreLoading = useSelector(selectMainPhotosIsLoading)
    const mainVideosAreLoading = useSelector(selectCategoryVideosIsLoading)

    const [showPhotos, setShowPhotos] = useState(true)
    const [showVideos, setShowVideos] = useState(false)

    const clickSetShowPhotos = () => {
        setShowPhotos(true)
        setShowVideos(false)
    }

    const clickSetShowVideos = () => {
        setShowPhotos(false)
        setShowVideos(true)
    }

    useEffect(() => {
        dispatch(setVideoCategories())
        dispatch(setMainPhotos())
    }, [dispatch])

    useEffect(() => {
        setPhotosToShow(mainPhotos)
    }, [mainPhotos]);

    useEffect(() => {

        const url = new URL(window.location.href);
        const from = url.searchParams.get('from');
        if (from) {
            if (from === "videoGallery"){
                clickSetShowVideos()
            }
            url.searchParams.delete('from');
            window.history.replaceState({}, '', url.toString());
        }
    }, []);

    if (mainPhotosAreLoading || mainVideosAreLoading){
        return <Spinner />;
    }else{
        return (
            <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full min-h-screen">
                <PortfolioHeader showPhotos={showPhotos} setShowPhotos={clickSetShowPhotos} showVideos={showVideos} setShowVideos={clickSetShowVideos} />
                    <div className="flex w-full mt-16">
                        <div
                            className={`w-1/2 ${showPhotos ? 'block w-full' : 'w-1/2'} ${showVideos ? 'hidden w-0' : ''}`}>
                            <PhotosContainer photos={photosToShow}/>
                        </div>

                        <div
                            className={`w-1/2 ${showVideos ? 'block w-full' : 'w-1/2'} ${showPhotos ? 'hidden w-0' : ''}`}>
                            <VideosContainer videos={videoCategories}/>
                        </div>
                    </div>
            </div>
        );
    }
};

export default Portfolio;
