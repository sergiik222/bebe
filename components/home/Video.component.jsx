'use client';
import React, { useRef, useEffect} from 'react';
import ReactPlayer from 'react-player';
import {useDispatch} from "react-redux";
import {setChosenMediaName} from "@/store/media/media.action";

const VideoComponent = ({ videoUrl, isDragging, alt, isMiddle }) => {
    const playerRef = useRef(null);
    const canOpenRef = useRef(false);  // Use ref for immediate value access
    const dispatch = useDispatch()

    useEffect(() => {
        if (isDragging) {
            canOpenRef.current = false;
            if (playerRef.current) {
                playerRef.current.getInternalPlayer().pause();
            }
        } else {
            const timeoutId = setTimeout(() => {
                canOpenRef.current = true;  // Update ref immediately
            }, 300); // Delay to avoid accidental fullscreen on scroll stop
            return () => clearTimeout(timeoutId);
        }
        if (isMiddle && isDragging){
            dispatch(setChosenMediaName(alt))
        }


    }, [isDragging, isMiddle, alt, dispatch]);



    const handleMouseOver = () => {
        if (playerRef.current && !isDragging) {
            playerRef.current.getInternalPlayer().play();
        }
        dispatch(setChosenMediaName(alt))
    };

    const handleMouseOut = () => {
        if (playerRef.current && !isDragging) {
            playerRef.current.getInternalPlayer().pause();
        }
        dispatch(setChosenMediaName(""))
    };


    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (canOpenRef.current) {
            const player = playerRef.current.getInternalPlayer();
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen();
            } else if (player.msRequestFullscreen) {
                player.msRequestFullscreen();
            }
            player.muted = false;
            player.play();
        }
    };

    const handleFullscreenChange = () => {
        const player = playerRef.current.getInternalPlayer();
        if (!document.fullscreenElement) {
            player.pause();
            setTimeout(() => {
                player.seekTo(0); // Ensure seek happens after pause
            }, 100); // Short delay to ensure both actions are executed correctly
            player.muted = true;

        }
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={false}
                muted={true}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={handleClick}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
                style={{ objectFit: "cover" }}
            />
        </div>

    );
};

export default VideoComponent;
