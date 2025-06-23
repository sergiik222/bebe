import React, {useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import {useDispatch} from "react-redux";
import { setCategoryVideos } from "@/store/videos/videos.action";

const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);
    return isDesktop;
};
const VideoComponentPortfolio = ({
                                     videoUrl,
                                     alt,
                                     isPlaying,
                                     onPlay,
                                     onStop,
                                 }) => {
    const playerRef = useRef(null);
    const dispatch = useDispatch();
    const isDesktop = useIsDesktop();
    const playing = isPlaying;

    const handleMouseOver = () => {
        if (isDesktop && !playing) {
            onPlay();
        }
    };

    const handleMouseOut = () => {
        if (isDesktop && playing) {
            onStop()
        }
    };

    const handlePlayPauseButtonClick = (e) => {
        e.stopPropagation();
        if (playing) {
            onStop();
        } else {
            onPlay();
        }
    };

    useEffect(() => {
        if (playerRef.current) {
            if (playing) {
                playerRef.current.getInternalPlayer()?.play?.();
            } else {
                playerRef.current.getInternalPlayer()?.pause?.();
            }
        }
    }, [playing]);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setCategoryVideos({ category: alt }));
    };

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
                <h2 className="font-bold text-[28px] sm:text-[36px] text-primary-text text-center px-2">
                    {alt}
                </h2>
            </div>

            <button
                onClick={handlePlayPauseButtonClick}
                className="absolute bottom-4 left-4 z-10 block lg:hidden p-3 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-colors"
                aria-label={playing ? "Pause Video" : "Play Video"}
            >
                {playing ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <rect x="6" y="5" width="4" height="14" />
                        <rect x="14" y="5" width="4" height="14" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default VideoComponentPortfolio;
