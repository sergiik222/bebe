'use client';
import React, {useRef, useEffect, useState, useCallback, memo} from 'react';
import ReactPlayer from 'react-player';
import {useDispatch} from "react-redux";
import {setChosenMediaName} from "@/store/media/media.action";
import VideoBrackets from "@/components/home/VideoBrackets";
import { useMediaHover } from "@/hooks/useMediaHover";

const VideoComponent = memo(({ videoUrl, isDragging, alt, isMiddle }) => {
    const playerRef = useRef(null);
    const canOpenRef = useRef(false);  // Use ref for immediate value access
    const dispatch = useDispatch()
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);

    // Handle hover changes - dispatch to Redux and control video playback
    const handleHoverChange = useCallback((hovering) => {
        dispatch(setChosenMediaName(hovering ? alt : ""));
        if (hovering && !isDragging && playerRef.current) {
            playerRef.current.getInternalPlayer().play();
        } else if (!hovering && playerRef.current) {
            playerRef.current.getInternalPlayer().pause();
        }
    }, [dispatch, alt, isDragging]);

    // Use custom hook for hover and drag detection
    const { isHovered, handlers, handleClick: hookHandleClick } = useMediaHover(
        isDragging,
        handleHoverChange
    );

    useEffect(() => {
        if (isDragging) {
            canOpenRef.current = false;
            if (playerRef.current) {
                playerRef.current.getInternalPlayer().pause();
            }
        } else {
            const timeoutId = setTimeout(() => {
                canOpenRef.current = true;
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [isDragging]);

    // Update chosen media when middle and dragging
    useEffect(() => {
        if (isMiddle && isDragging) {
            dispatch(setChosenMediaName(alt));
        }
    }, [isMiddle, isDragging, alt, dispatch]);

    const openFullscreen = useCallback(() => {
        if (canOpenRef.current && playerRef.current) {
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
    }, []);

    const handleClick = useCallback((e) => {
        e?.preventDefault();
        e?.stopPropagation();
        hookHandleClick(openFullscreen);
    }, [hookHandleClick, openFullscreen]);

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement && playerRef.current) {
            const player = playerRef.current.getInternalPlayer();
            if (player) {
                player.pause();
                player.muted = true;
            }
            setTimeout(() => {
                if (playerRef.current) {
                    playerRef.current.seekTo(0);
                }
            }, 100);
        }
    };

    const handleDuration = (dur) => {
        setDuration(dur);
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
            {...handlers}
            onClick={handleClick}
        >
            <div className="absolute inset-0 overflow-hidden">
                <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    playing={playing}
                    muted
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                    onDuration={handleDuration}
                />
            </div>

            {/* Animated brackets on hover */}
            <VideoBrackets show={isHovered && !isDragging} duration={duration} title={alt} />

            <button
                onClick={handlePlayPauseButtonClick}
                className="absolute bottom-4 left-4 z-20 block lg:hidden p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-colors"
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
}, (prevProps, nextProps) => {
    // Custom comparison - only re-render if these specific props change
    return (
        prevProps.videoUrl === nextProps.videoUrl &&
        prevProps.alt === nextProps.alt &&
        prevProps.isMiddle === nextProps.isMiddle &&
        prevProps.isDragging === nextProps.isDragging
    );
});

VideoComponent.displayName = 'VideoComponent';

export default VideoComponent;
