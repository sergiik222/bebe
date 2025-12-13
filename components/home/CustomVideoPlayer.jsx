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
            className="text-xs md:text-sm tracking-widest font-medium hover:opacity-70 transition-opacity uppercase flex items-center gap-2"
            style={{ color: 'var(--accent-color)' }}
          >
            {playing ? (
              <>
                <svg className="w-5 h-5 md:hidden" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <span className="hidden md:inline">PAUSE</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 md:hidden" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="hidden md:inline">PLAY</span>
              </>
            )}
          </button>

          {/* Sound Toggle - Bottom Right */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
            className="text-xs md:text-sm tracking-widest font-medium hover:opacity-70 transition-opacity uppercase flex items-center gap-2"
            style={{ color: 'var(--accent-color)' }}
          >
            {muted ? (
              <>
                <svg className="w-5 h-5 md:hidden" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <span className="hidden md:inline">SOUND ON</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 md:hidden" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
                <span className="hidden md:inline">SOUND OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Use portal to render at document body level
  return createPortal(playerContent, document.body)
}

export default CustomVideoPlayer
