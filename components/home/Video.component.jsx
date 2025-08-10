'use client';
import React, {useRef, useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import {useDispatch} from "react-redux";
import {setChosenMediaName} from "@/store/media/media.action";

const VideoComponent = ({ videoUrl, isDragging, alt, isMiddle }) => {
    const playerRef = useRef(null);
    const canOpenRef = useRef(false);  // Use ref for immediate value access
    const dispatch = useDispatch()
    const [playing, setPlaying] = useState(false);
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
    const handlePlayPauseButtonClick = (e) => {
        e.stopPropagation();
        if (playing) {
            setPlaying(false)
            playerRef.current.getInternalPlayer().pause();
        } else {
            setPlaying(true)
            playerRef.current.getInternalPlayer().play();
        }
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div
            className="relative w-full aspect-[16/9] group hover:cursor-pointer"
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={playing}
                muted
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
            />

            <div
                className={`absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center transition-opacity
          ${
                    playing
                        ? 'opacity-80'
                        : 'opacity-50 lg:opacity-0 group-hover:opacity-80'
                }
        `}
            >
                <h2 className="font_regular text-[24px] sm:text-[28px] text-primary-text text-center px-2">
                    {alt}
                </h2>
            </div>

            <button
                onClick={handlePlayPauseButtonClick}
                className="absolute bottom-4 left-4 z-10 block lg:hidden p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-colors"
                aria-label={playing ? "Pause Video" : "Play Video"}
            >
                {playing ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <rect x="6" y="5" width="3" height="14"/>
                        <rect x="14" y="5" width="4" height="14"/>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                )}
            </button>
        </div>

    );
};

export default VideoComponent;
