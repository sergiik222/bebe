'use client';
import React, { useRef, useEffect} from 'react';
import ReactPlayer from 'react-player';

const VideoComponent = ({ videoUrl, isDragging }) => {
    const playerRef = useRef(null);
    const canOpenRef = useRef(false);  // Use ref for immediate value access


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
    }, [isDragging]);


    const handleMouseOver = () => {
        if (playerRef.current && !isDragging) {
            playerRef.current.getInternalPlayer().play();
        }
    };

    const handleMouseOut = () => {
        if (playerRef.current && !isDragging) {
            playerRef.current.getInternalPlayer().pause();
        }
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
        <div>
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={false}
                muted={true}
                controls={true}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={handleClick}
                width="100%"
                height="100%"
            />
        </div>
    );
};

export default VideoComponent;
