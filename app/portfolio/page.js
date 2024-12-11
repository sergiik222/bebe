'use client'
import React, {useEffect} from 'react'
import ReactPlayer from 'react-player';
import Image from "next/image";
import Divider from '@mui/material/Divider';
import {useDispatch, useSelector} from "react-redux";
import {selectMainPhotos, selectMainPhotosIsLoading} from "@/store/photos/photos.selector";
import {selectMainVideos, selectMainVideosIsLoading} from "@/store/videos/videos.selector";
import {setMainVideos} from "@/store/videos/videos.action";
import {setMainPhotos} from "@/store/photos/photos.action";
import Spinner from "@/components/Spinner";

const Portfolio = () => {
/*
    const dispatch = useDispatch()
    const mainPhotos = useSelector(selectMainPhotos)
    const mainVideos = useSelector(selectMainVideos)
    const mainPhotosAreLoading = useSelector(selectMainPhotosIsLoading)
    const mainVideosAreLoading = useSelector(selectMainVideosIsLoading)

    useEffect(() => {
        dispatch(setMainVideos())
        dispatch(setMainPhotos())
    }, [dispatch])

    if (mainPhotosAreLoading || mainVideosAreLoading){
        return <Spinner />;
    }else{
        return (
            <div className="flex">
                <div>
                    <h1>Photos</h1>
                    <div className="flex justify-between">
                        {mainPhotos.map((photo, index) => {
                                return(
                                    <Image key={index} src={photo.src} alt={photo.alt} fill style={{objectFit: "cover"}} draggable="false"/>
                                )
                            }
                        )
                        }
                    </div>
                </div>
                <Divider orientation="vertical" flexItem />
                <div >
                    <h1>Videos</h1>
                    <div className="flex justify-between">
                        {mainVideos.map((video, index) => {
                                return(
                                    <ReactPlayer
                                        key={index}
                                        url={video.url}
                                        playing={false}
                                        muted={true}
                                        width="100%"
                                        height="100%"

                                    />
                                )
                            }
                        )
                        }
                    </div>
                </div>
            </div>
        );
    }

*/
    return <></>
};

export default Portfolio;
