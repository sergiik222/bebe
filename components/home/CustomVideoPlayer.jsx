'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import ReactPlayer from 'react-player'

const CustomVideoPlayer = ({ videoUrl, title, isOpen, onClose }) => {
  const playerRef = useRef(null)
  const progressRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [mounted, setMounted] = useState(false)
  const controlsTimeoutRef = useRef(null)

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00:00'
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Reset controls timeout
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false)
      }
    }, 3000)
  }, [playing])

  // Client-side only mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle open/close
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure player is ready
      const timer = setTimeout(() => {
        setPlaying(true)
      }, 100)
      setShowControls(true)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    } else {
      setPlaying(false)
      setCurrentTime(0)
      setShowControls(true)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          setPlaying(prev => !prev)
          break
        case 'm':
          e.preventDefault()
          setMuted(prev => !prev)
          break
        case 'Escape':
          e.preventDefault()
          setPlaying(false)
          onClose()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (playerRef.current) {
            playerRef.current.seekTo(Math.max(0, currentTime - 10))
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (playerRef.current) {
            playerRef.current.seekTo(Math.min(duration, currentTime + 10))
          }
          break
      }
      resetControlsTimeout()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, currentTime, duration, resetControlsTimeout])

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds)
  }

  const handleDuration = (dur) => {
    setDuration(dur)
  }

  const handleProgressBarClick = (e) => {
    if (!progressRef.current || !playerRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const newTime = clickPosition * duration
    playerRef.current.seekTo(newTime)
    resetControlsTimeout()
  }

  const handleMouseMove = () => {
    resetControlsTimeout()
  }

  const togglePlay = () => {
    setPlaying(prev => !prev)
    resetControlsTimeout()
  }

  const toggleMute = () => {
    setMuted(prev => !prev)
    resetControlsTimeout()
  }

  const handleClose = (e) => {
    e.stopPropagation()
    setPlaying(false)
    onClose()
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!isOpen || !mounted) return null

  const playerContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* Top Bar - Black background */}
      <div
        className={`flex-shrink-0 bg-black px-4 md:px-6 py-3 md:py-4 flex justify-between items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Title - Upper Left */}
        <div style={{ color: 'var(--accent-color)' }}>
          <div className="text-xs md:text-sm tracking-widest font-medium uppercase">
            {title}
          </div>
        </div>

        {/* Duration - Upper Center */}
        <div
          className="text-xs md:text-sm tracking-wider font-medium absolute left-1/2 transform -translate-x-1/2"
          style={{ color: 'var(--accent-color)' }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Close Button - Upper Right */}
        <button
          onClick={handleClose}
          className="text-xs md:text-sm tracking-widest font-medium hover:opacity-70 transition-opacity uppercase"
          style={{ color: 'var(--accent-color)' }}
        >
          CLOSE
        </button>
      </div>

      {/* Video Player - Center area */}
      <div className="flex-1 relative" onClick={togglePlay}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          muted={muted}
          controls={false}
          playsinline
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          progressInterval={100}
          config={{
            file: {
              attributes: {
                playsInline: true,
                'webkit-playsinline': 'true',
                disablePictureInPicture: true,
                controlsList: 'nodownload nofullscreen noremoteplayback',
                style: { width: '100%', height: '100%', objectFit: 'contain' }
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>

      {/* Bottom Bar - Black background */}
      <div
        className={`flex-shrink-0 bg-black px-4 md:px-6 py-3 md:py-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-[2px] cursor-pointer mb-3 group"
          style={{ backgroundColor: 'rgba(var(--accent-color-rgb), 0.3)' }}
          onClick={(e) => {
            e.stopPropagation()
            handleProgressBarClick(e)
          }}
        >
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: 'var(--accent-color)' }}
          />
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-between items-center">
          {/* Play/Pause - Bottom Left */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
            className="text-xs md:text-sm tracking-widest font-medium hover:opacity-70 transition-opacity uppercase min-w-[50px] md:min-w-[60px] text-left"
            style={{ color: 'var(--accent-color)' }}
          >
            <span className={playing ? 'inline' : 'hidden'}>PAUSE</span>
            <span className={playing ? 'hidden' : 'inline'}>PLAY</span>
          </button>

          {/* Sound Toggle - Bottom Right */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
            className="text-xs md:text-sm tracking-widest font-medium hover:opacity-70 transition-opacity uppercase"
            style={{ color: 'var(--accent-color)' }}
          >
           {muted ? <span >SOUND ON</span> : <span >SOUND OFF</span> }                 
          </button>
        </div>
      </div>
    </div>
  )

  // Use portal to render at document body level
  return createPortal(playerContent, document.body)
}

export default CustomVideoPlayer
