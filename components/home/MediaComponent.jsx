'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {selectMainPhotosHome, selectMainPhotosIsLoading} from "@/store/photos/photos.selector";
import {setMainPhotos} from "@/store/photos/photos.action";
import {setMainVideos} from "@/store/videos/videos.action";
import {selectMainVideosHome, selectMainVideosIsLoading, selectVideosInUse} from "@/store/videos/videos.selector";
import Header from "@/components/home/Header";
import MediaContainerAnimated from "@/components/home/MediaContainerAnimated";
import {setChosenMediaName} from "@/store/media/media.action";

const MediaComponent = () => {
    const dispatch = useDispatch()
    const mainPhotos = useSelector(selectMainPhotosHome)
    const mainVideos = useSelector(selectMainVideosHome)
    const mainPhotosAreLoading = useSelector(selectMainPhotosIsLoading)
    const mainVideosAreLoading = useSelector(selectMainVideosIsLoading)
    const videosInUse = useSelector(selectVideosInUse)
    const [mediaSize, setMediaSize] = useState(350)

    useEffect(() => {
        dispatch(setMainVideos())
        dispatch(setMainPhotos())
    }, [dispatch])

    useEffect(() => {
        dispatch(setChosenMediaName(""))
        if (videosInUse){
            setMediaSize(350)
        }else{
            setMediaSize(350)
        }
    }, [dispatch, videosInUse])

        return (
            <div>
                <Header  />
                {videosInUse ? (
                    <MediaContainerAnimated medias={mainVideos} mediaSize={mediaSize} mediasAreLoading={mainVideosAreLoading}  key="videos"/>
                ) : (
                    <MediaContainerAnimated medias={mainPhotos} mediaSize={mediaSize} mediasAreLoading={mainPhotosAreLoading}  key="photos"/>
                )}
            </div>
        );
};

export default MediaComponent;
