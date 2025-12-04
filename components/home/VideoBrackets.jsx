'use client'

import { useEffect, useState } from 'react'

const VideoBrackets = ({ show, duration, title, showLens }) => {
  const [animate, setAnimate] = useState(false)
  const [showDuration, setShowDuration] = useState(false)

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setAnimate(true), 50)
      const durationTimer = setTimeout(() => setShowDuration(true), 450)
      return () => {
        clearTimeout(timer)
        clearTimeout(durationTimer)
      }
    } else {
      // On exit: hide duration and animate brackets out immediately
      setShowDuration(false)
      setAnimate(false)
    }
  }, [show])

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute pointer-events-none" style={{ left: '-25px', right: '-25px', top: '-25px', bottom: '-25px' }}>
      {/* Right Bracket on Left Side - Animates Bottom to Top on enter, Top to Bottom on exit */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center">
        <svg
          width="30"
          height="100%"
          viewBox="0 0 30 100"
          preserveAspectRatio="none"
          style={{ color: 'var(--accent-color)' }}
        >
          <path
            d="M 25 100 L 5 100 L 5 0 L 25 0"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 240,
              strokeDashoffset: animate ? 0 : 240,
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>
      </div>

      {/* Left Bracket on Right Side - Animates Top to Bottom on enter, Bottom to Top on exit */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center">
        <svg
          width="30"
          height="100%"
          viewBox="0 0 30 100"
          preserveAspectRatio="none"
          style={{ color: 'var(--accent-color)' }}
        >
          <path
            d="M 5 0 L 25 0 L 25 100 L 5 100"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 240,
              strokeDashoffset: animate ? 0 : 240,
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>
      </div>

      {/* Title text in upper left corner */}
      <div
        className="absolute left-0 top-0 pl-10 pt-0 text-sm font-medium transition-all duration-500 ease-out"
        style={{
          opacity: showDuration ? 1 : 0,
          transform: showDuration ? 'translateY(0)' : 'translateY(20px)',
          color: 'var(--accent-color)'
        }}
      >
        {title}
      </div>

      {/* Duration text in lower right corner - only show if duration exists */}
      {duration > 0 && (
        <div
          className="absolute right-0 bottom-0 pr-10 pb-0 text-sm font-medium transition-all duration-500 ease-out"
          style={{
            opacity: showDuration ? 1 : 0,
            transform: showDuration ? 'translateY(0)' : 'translateY(-20px)',
            color: 'var(--accent-color)'
          }}
        >
          {formatDuration(duration)}
        </div>
      )}

      {/* Camera lens icon in center - only show for photos */}
      {showLens && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{
            opacity: showDuration ? 1 : 0,
            transform: showDuration ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.5)'
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 463 463"
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="1"
          >
            <g>
              <path d="M395.195,67.805C351.471,24.08,293.336,0,231.5,0S111.529,24.08,67.805,67.805S0,169.664,0,231.5
                s24.08,119.971,67.805,163.695S169.664,463,231.5,463s119.971-24.08,163.695-67.805S463,293.336,463,231.5
                S438.92,111.529,395.195,67.805z M384.589,384.589C343.697,425.48,289.329,448,231.5,448s-112.197-22.52-153.089-63.411
                C37.52,343.697,15,289.329,15,231.5S37.52,119.303,78.411,78.411C119.303,37.52,173.671,15,231.5,15s112.197,22.52,153.089,63.411
                C425.48,119.303,448,173.671,448,231.5S425.48,343.697,384.589,384.589z"/>
              <path d="M231.5,64C139.14,64,64,139.14,64,231.5S139.14,399,231.5,399S399,323.86,399,231.5S323.86,64,231.5,64z M231.5,384
                C147.411,384,79,315.589,79,231.5S147.411,79,231.5,79S384,147.411,384,231.5S315.589,384,231.5,384z"/>
              <path d="M231.5,88C152.374,88,88,152.374,88,231.5S152.374,375,231.5,375S375,310.626,375,231.5S310.626,88,231.5,88z M231.5,360
                C160.645,360,103,302.355,103,231.5S160.645,103,231.5,103S360,160.645,360,231.5S302.355,360,231.5,360z"/>
              <path d="M231.5,112C165.607,112,112,165.607,112,231.5S165.607,351,231.5,351S351,297.393,351,231.5S297.393,112,231.5,112z
                M231.5,336C173.878,336,127,289.122,127,231.5S173.878,127,231.5,127S336,173.878,336,231.5S289.122,336,231.5,336z"/>
              <path d="M231.5,176c-30.603,0-55.5,24.897-55.5,55.5s24.897,55.5,55.5,55.5s55.5-24.897,55.5-55.5S262.103,176,231.5,176z
                M231.5,272c-22.332,0-40.5-18.168-40.5-40.5s18.168-40.5,40.5-40.5s40.5,18.168,40.5,40.5S253.832,272,231.5,272z"/>
              <path d="M157.75,62.373C181.107,52.172,205.92,47,231.5,47s50.393,5.172,73.75,15.373c0.977,0.427,1.995,0.629,2.998,0.629
                c2.891,0,5.646-1.682,6.877-4.5c1.658-3.796-0.075-8.217-3.872-9.875C285.991,37.594,259.158,32,231.5,32
                s-54.491,5.594-79.753,16.627c-3.796,1.658-5.529,6.079-3.872,9.875C149.533,62.298,153.955,64.031,157.75,62.373z"/>
              <path d="M305.25,400.627c-18.56,8.105-38.198,13.064-58.368,14.738c-4.128,0.342-7.197,3.966-6.854,8.094
                c0.325,3.917,3.604,6.88,7.466,6.88c0.208,0,0.417-0.009,0.628-0.026c21.817-1.81,43.057-7.173,63.131-15.94
                c3.796-1.658,5.529-6.079,3.872-9.875C313.467,400.702,309.043,398.97,305.25,400.627z"/>
              <path d="M216.118,415.365c-20.17-1.674-39.808-6.632-58.368-14.738c-3.795-1.659-8.217,0.075-9.875,3.872
                c-1.658,3.796,0.075,8.217,3.872,9.875c20.074,8.767,41.314,14.13,63.131,15.94c0.211,0.018,0.42,0.026,0.628,0.026
                c3.861,0,7.141-2.963,7.466-6.88C223.315,419.331,220.246,415.707,216.118,415.365z"/>
            </g>
          </svg>
        </div>
      )}
    </div>
  )
}

export default VideoBrackets
