'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import MediaContainer from './MediaContainer';
import Spinner from "@/components/helpers/Spinner";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useMediaSize } from "@/hooks/useMediaSize";

const WHEEL_MULTIPLIER = 1.05;
const DECAY = 0.95;
const MIN_VELOCITY = 0.05;

const FOCUS_MARKS = [0.7, 1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16]; // example f-stop-like values
const FOCUS_MIN = FOCUS_MARKS[0];
const FOCUS_MAX = FOCUS_MARKS[FOCUS_MARKS.length - 1];

const rafThrottle = (fn) => {
  let raf = null;
  const throttled = (...args) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      fn(...args);
      raf = null;
    });
  };
  throttled.cancel = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };
  return throttled;
};

const MediaContainerAnimated = ({ medias, mediasAreLoading, mediaSize }) => {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [middleIndex, setMiddleIndex] = useState(0);

    // Use custom hooks for window dimensions and media sizing
    const { width: windowWidth, isMobile } = useWindowDimensions();
    const { margin: mediaMargin } = useMediaSize(isMobile);

    const realMediaCount = medias?.length || 0;

    const getStride = useCallback(() => mediaSize + mediaMargin, [mediaSize, mediaMargin]);

    // Wrap position for infinite scrolling - continuously normalize to middle set
    const wrapX = useCallback((x) => {
        if (realMediaCount === 0) return x;
        const stride = mediaSize + mediaMargin;
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        const singleSetWidth = realMediaCount * stride;

        // Check if we need to wrap
        const secondSetStart = middleBox - realMediaCount * stride;
        const secondSetEnd = middleBox - 2 * realMediaCount * stride;

        // If scrolled past middle set boundaries, wrap back to middle set
        if (x > secondSetStart + stride * 0.5) {
            // Went too far right, wrap back
            return x - singleSetWidth;
        }
        if (x < secondSetEnd - stride * 0.5) {
            // Went too far left, wrap back
            return x + singleSetWidth;
        }
        return x;
    }, [realMediaCount, mediaSize, mediaMargin, windowWidth]);

    const progressFromX = useCallback((x) => {
        if (realMediaCount === 0) return 0.5;
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        const stride = mediaSize + mediaMargin;
        const totalIdx = Math.round((middleBox - x) / stride);
        const actualIdx = ((totalIdx % realMediaCount) + realMediaCount) % realMediaCount;
        // Calculate fractional position between snapped items for smooth progress
        const exactIdx = (middleBox - x) / stride;
        const fractionalPart = exactIdx - Math.round(exactIdx);
        const smoothIdx = actualIdx + fractionalPart;
        return (smoothIdx % realMediaCount) / Math.max(1, realMediaCount - 1);
    }, [realMediaCount, windowWidth, mediaSize, mediaMargin]);

    const progressFromValue = useCallback((val) => {
        const span = FOCUS_MAX - FOCUS_MIN;
        if (span <= 0) return 0;
        return Math.max(0, Math.min(1, (val - FOCUS_MIN) / span));
    }, []);

    useEffect(() => {
      // lock page vertical scroll while this view is active
      const html = document.documentElement;
      const body = document.body;
      const prevHtmlOverflow = html.style.overflow;
      const prevBodyOverflow = body.style.overflow;
      const prevHtmlOverscroll = html.style.overscrollBehavior;
      const prevBodyOverscroll = body.style.overscrollBehavior;

      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.style.overscrollBehavior = 'none';
      body.style.overscrollBehavior = 'none';

      return () => {
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
        html.style.overscrollBehavior = prevHtmlOverscroll;
        body.style.overscrollBehavior = prevBodyOverscroll;
      };
    }, []);

    // Create infinite loop by cloning items
    const loopedMedias = useMemo(() => {
        if (!medias || medias.length === 0) return [];
        // Clone the array 3 times for smooth infinite scrolling
        return [...medias, ...medias, ...medias];
    }, [medias]);

    const [{ mediaX }, api] = useSpring(() => ({ mediaX: 0, config: { mass: 0.9, tension: 220, friction: 26 } }));

    useEffect(() => {
        if (!medias || medias.length === 0) return;
        // Start at the middle set (second copy)
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        const startIndex = realMediaCount; // Start of second set
        const stride = mediaSize + mediaMargin;
        const startX = middleBox - startIndex * stride;
        api.start({ mediaX: startX, immediate: true });
        setMiddleIndex(0);
    }, [medias, windowWidth, mediaSize, mediaMargin, realMediaCount, api]);

    const updateMiddleIndex = useCallback((currentX) => {
        if (realMediaCount === 0) return;
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        const stride = getStride();
        const totalIdx = Math.round((middleBox - currentX) / stride);
        // Map to actual index within the original media array
        const actualIdx = ((totalIdx % realMediaCount) + realMediaCount) % realMediaCount;
        setMiddleIndex(actualIdx);
    }, [windowWidth, mediaSize, getStride, realMediaCount]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateMiddleIndexThrottled = useCallback(rafThrottle(updateMiddleIndex), [updateMiddleIndex]);

    // Cleanup effect for component unmount
    useEffect(() => {
        return () => {
            // Cancel all pending RAF on component unmount
            if (inertiaRafId.current) {
                cancelAnimationFrame(inertiaRafId.current);
                inertiaRafId.current = null;
            }
            updateMiddleIndexThrottled.cancel?.();
        };
    }, [updateMiddleIndexThrottled]);

    const snapToNearest = useCallback((currentX) => {
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        const stride = getStride();
        const targetIndex = Math.round((middleBox - currentX) / stride);
        const targetX = middleBox - targetIndex * stride;
        const wrappedX = wrapX(targetX);
        api.start({ mediaX: wrappedX });
        updateMiddleIndex(wrappedX);
    }, [api, windowWidth, mediaSize, getStride, wrapX, updateMiddleIndex]);

    const inertiaActive = useRef(false);
    const wheelVelocity = useRef(0);
    const inertiaRafId = useRef(null);

    const stepInertia = useCallback(() => {
        if (!inertiaActive.current) return;

        wheelVelocity.current *= DECAY;
        if (Math.abs(wheelVelocity.current) < MIN_VELOCITY) {
            inertiaActive.current = false;
            inertiaRafId.current = null;
            snapToNearest(mediaX.get());
            return;
        }

        const current = mediaX.get();
        const next = current + wheelVelocity.current;
        const wrapped = wrapX(next);
        api.start({ mediaX: wrapped, immediate: true });
        updateMiddleIndexThrottled(wrapped);
        inertiaRafId.current = requestAnimationFrame(stepInertia);
    }, [api, mediaX, snapToNearest, wrapX, updateMiddleIndexThrottled]);

    const bindMedias = useDrag(({ active, movement: [mx], velocity: [vx], direction: [dx], memo = mediaX.get() }) => {
        // Cancel any pending animation frame when starting drag
        if (inertiaRafId.current) {
            cancelAnimationFrame(inertiaRafId.current);
            inertiaRafId.current = null;
        }
        inertiaActive.current = false;
        wheelVelocity.current = 0;

        setIsDragging(active);
        const next = mx + memo;

        if (active) {
            const wrapped = wrapX(next);
            // If we wrapped, update memo to the new wrapped position
            if (wrapped !== next) {
                api.start({ mediaX: wrapped, immediate: true });
                updateMiddleIndexThrottled(wrapped);
                return wrapped;
            }
            api.start({ mediaX: next, immediate: true });
            updateMiddleIndexThrottled(next);
        } else {
            // On release, apply momentum based on velocity
            const wrapped = wrapX(next);

            // Calculate momentum from swipe velocity (vx is in px/ms)
            const momentum = vx * dx * 15; // Scale velocity for better feel

            if (Math.abs(momentum) > 0.5) {
                // Apply momentum scrolling
                wheelVelocity.current = momentum;
                inertiaActive.current = true;
                api.start({ mediaX: wrapped, immediate: true });
                updateMiddleIndex(wrapped);
                inertiaRafId.current = requestAnimationFrame(stepInertia);
            } else {
                // Small movement - just snap
                api.start({ mediaX: wrapped, immediate: false });
                updateMiddleIndex(wrapped);
                snapToNearest(wrapped);
            }
        }

        return memo;
    }, {
        axis: 'x',
        pointer: { touch: true },
        threshold: 5, // Start responding after just 5px of movement
        rubberband: 0.15,
        filterTaps: true
    });

    useEffect(() => {
        const handleWheel = (e) => {
            // Only handle wheel events if container exists
            if (!containerRef.current) return;

            // Always treat wheel as horizontal scroll in this view
            e.preventDefault();
            e.stopPropagation();

            const delta = -e.deltaY * WHEEL_MULTIPLIER;
            wheelVelocity.current = delta;
            inertiaActive.current = true;

            const current = mediaX.get();
            const next = current + delta;
            const wrapped = wrapX(next);
            api.start({ mediaX: wrapped, immediate: true });
            updateMiddleIndexThrottled(wrapped);
            inertiaRafId.current = requestAnimationFrame(stepInertia);
        };

        const opts = { passive: false }; // we call preventDefault
        window.addEventListener('wheel', handleWheel, opts);
        return () => {
            window.removeEventListener('wheel', handleWheel, opts);
            // Cancel any pending animation frame on cleanup
            if (inertiaRafId.current) {
                cancelAnimationFrame(inertiaRafId.current);
                inertiaRafId.current = null;
            }
            // Cancel any pending throttled updates
            updateMiddleIndexThrottled.cancel?.();
        };
    }, [api, mediaX, wrapX, stepInertia, updateMiddleIndexThrottled]);

    if (mediasAreLoading) {
        return <Spinner />;
    } else {
        return (
            <div ref={containerRef} className="relative w-full h-screen overflow-hidden touch-none">
                <animated.div
                    ref={scrollRef}
                    {...bindMedias()}
                    className={`flex items-center h-full transform-gpu will-change-transform ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ transform: mediaX.to(x => `translateX(${x}px)`) }}
                >
                    <MediaContainer
                        middleIndex={middleIndex}
                        isDragging={isDragging}
                        mediaSize={mediaSize}
                        mediaMargin={mediaMargin}
                        windowWidth={windowWidth}
                        medias={loopedMedias}
                    />
                </animated.div>
                {/* Progress bar (full-width) */}
                <div className="pointer-events-none fixed bottom-6 left-0 right-0 w-full z-40">
                  <div className="relative mx-auto h-px bg-white/30" style={{ width: '100%' }}>
                    {/* Fill to current position */}
                    <animated.div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: mediaX.to(x => `${progressFromX(x) * 100}%`),
                        backgroundColor: 'var(--accent-color)',
                        boxShadow: '0 0 8px var(--accent-glow)'
                      }}
                    />
                    {FOCUS_MARKS.map((v) => {
                      const markPosition = progressFromValue(v);
                      return (
                        <animated.div
                          key={`tick-${v}`}
                          className="absolute -top-4"
                          style={{
                            left: `${markPosition * 100}%`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <animated.div
                            className="w-px h-4"
                            style={{
                              backgroundColor: mediaX.to(x =>
                                progressFromX(x) >= markPosition ? 'var(--accent-color)' : 'rgba(255,255,255,0.7)'
                              )
                            }}
                          />
                          {!isMobile && (
                            <animated.div
                              className="mt-1 text-xs leading-none select-none whitespace-nowrap font-medium"
                              style={{
                                color: mediaX.to(x =>
                                  progressFromX(x) >= markPosition ? 'var(--accent-color)' : 'rgba(255,255,255,0.8)'
                                ),
                                textShadow: mediaX.to(x =>
                                  progressFromX(x) >= markPosition ? '0 0 8px var(--accent-glow)' : 'none'
                                )
                              }}
                            >
                              {`f/${v}`}
                            </animated.div>
                          )}
                        </animated.div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation arrow - on the progress bar line */}
                <animated.div
                  className="pointer-events-none fixed bottom-6 z-40"
                  style={{ left: mediaX.to(x => `${progressFromX(x) * 100}%`), transform: 'translateX(-50%) translateY(30%)' }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="var(--accent-color)"
                    style={{ filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}
                  >
                    <path d="M12 4 L4 16 C4 16 6 16 8 16 L16 16 C16 16 18 16 20 16 Z" />
                  </svg>
                </animated.div>

            </div>
        );
    }
};

export default MediaContainerAnimated;
