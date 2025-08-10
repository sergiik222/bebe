import React from "react";
import VideoComponentPortfolio from "@/components/portfolio/VideoPortfolio.component";
import {useDispatch, useSelector} from "react-redux";
import {selectMediaName} from "@/store/media/media.selector";
import {setChosenMediaName} from "@/store/media/media.action";

const VideosContainer = ({ videos, showVideos }) => {
    const playingVideoAlt = useSelector(selectMediaName);
    const dispatch = useDispatch();

    const handlePlayVideo = (alt) => {
        dispatch(setChosenMediaName(alt));
    };

    const handleStopVideo = () => {
        dispatch(setChosenMediaName("")); // clear playing video
    };

    if (!Array.isArray(videos) || videos.length === 0) {
        return <div></div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {videos.map((video, index) => (
                <VideoComponentPortfolio
                    key={index}
                    videoUrl={video.url}
                    alt={video.alt}
                    showVideos={showVideos}
                    isPlaying={playingVideoAlt === video.alt}
                    onPlay={() => handlePlayVideo(video.alt)}
                    onStop={handleStopVideo}
                />
            ))}
        </div>
    );
};

export default VideosContainer;
