import React from "react";
import VideoComponent from "@/components/home/Video.component";


const VideosContainer = ({videos, showVideos}) => {
    console.log("showVideos", showVideos);
    if (!Array.isArray(videos) || videos.length === 0) {
        return <div></div>
    }

    return (
        <div className="flex justify-between flex-wrap gap-2 w-full">
        {videos.map((video, index) => {
                return (
                    <div key={index}
                         className={`${showVideos ? 'min-w-[25%] h-[240px] max-w-[30%]' : 'min-w-[30%] h-[240px] max-w-[50%]'} flex flex-1 items-center justify-center border border-black mx-[7.5px] mb-[15px] overflow-hidden hover:cursor-pointer group`}
                         >
                        <div
                            className="w-full h-full bg-cover bg-center">
                                <VideoComponent key={index} videoUrl={video.url} alt={video.alt} draggable="false" isMiddle={false} isDragging={false}/>
                            </div>
                        <div
                            className="absolute opacity-70 group-hover:opacity-90 transition-opacity bg-white h-[90px] flex flex-col items-center justify-center w-fit px-4">
                            <h2 className="font-bold text-[22px] text-accent w-auto">{video.alt}</h2>
                        </div>

                    </div>
                )
            }
        )
        }
        </div>
    )
}


export default VideosContainer