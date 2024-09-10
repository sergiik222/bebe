'use client'
import React, { useRef }  from 'react'
import ReactPlayer from 'react-player';

const Portfolio = () => {
   const videoUrl = 'https://firebasestorage.googleapis.com/v0/b/bebe-41997.appspot.com/o/Advertising.mp4?alt=media&token=1d8b33da-8ccd-43ad-8f32-fefc1233a4ff';
   const playerRef = useRef(null);

   const handleMouseOver = () => {
      if (playerRef.current) {
         playerRef.current.getInternalPlayer().play();
      }
   };

   const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent default click behavior
      if (playerRef.current) {
         const player = playerRef.current.getInternalPlayer();
         if (player.requestFullscreen) {
            player.requestFullscreen();
         } else if (player.webkitRequestFullscreen) { /* Safari */
            player.webkitRequestFullscreen();
         } else if (player.msRequestFullscreen) { /* IE11 */
            player.msRequestFullscreen();
         }
         player.muted = false;
         player.play();
      }
   };

   return (
       <div>
          <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={false}
              muted={true}
              controls={true}
              onMouseOver={handleMouseOver}
              onClick={handleClick}
          />
       </div>
   );
};

export default Portfolio;
