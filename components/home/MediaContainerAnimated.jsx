'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import MediaContainer from './MediaContainer';
import Spinner from "@/components/helpers/Spinner";

const WHEEL_MULTIPLIER = 1.05;
const DECAY = 0.93;
const MIN_VELOCITY = 0.18;

const FOCUS_MARKS = [0.7, 1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16]; // example f-stop-like values
const FOCUS_MIN = FOCUS_MARKS[0];
const FOCUS_MAX = FOCUS_MARKS[FOCUS_MARKS.length - 1];

const rafThrottle = (fn) => {
  let raf = null;
  return (...args) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      fn(...args);
      raf = null;
    });
  };
};

const MediaContainerAnimated = ({ medias, mediasAreLoading, mediaSize }) => {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [middleIndex, setMiddleIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [mediaMargin, setMediaMargin] = useState(70);

    const prefersReducedMotion = () =>
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getStride = useCallback(() => mediaSize + mediaMargin, [mediaSize, mediaMargin]);

    const getBounds = useCallback(() => {
        const rightBound = (windowWidth ?? 0) / 2 - mediaSize / 2;
        if (!medias || medias.length <= 0) {
            return { leftBound: rightBound, rightBound };
        }
        const totalWidth = medias.length * mediaSize + Math.max(0, medias.length - 1) * mediaMargin;
        const leftBound = rightBound - (totalWidth - mediaSize);
        return { leftBound, rightBound };
    }, [medias, mediaSize, mediaMargin, windowWidth]);

    const clampX = useCallback((x) => {
        const { leftBound, rightBound } = getBounds();
        return Math.max(leftBound, Math.min(rightBound, x));
    }, [getBounds]);

    const progressFromX = useCallback((x) => {
        const { leftBound, rightBound } = getBounds();
        const span = rightBound - leftBound;
        if (span === 0) return 0.5; // centered when only one item or empty
        let p = (rightBound - x) / span; // 0 at start, 1 at end
        return Math.max(0, Math.min(1, p));
    }, [getBounds]);

    const progressFromValue = useCallback((val) => {
        const span = FOCUS_MAX - FOCUS_MIN;
        if (span <= 0) return 0;
        return Math.max(0, Math.min(1, (val - FOCUS_MIN) / span));
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 767);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        setMediaMargin(isMobile ? 70 : 100);
    }, [isMobile]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
        }
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

    const [{ mediaX }, api] = useSpring(() => ({ mediaX: 0, config: { mass: 0.9, tension: 220, friction: 26 } }));

    useEffect(() => {
        api.start({ mediaX: 0 });
    }, [medias, api]);

    useEffect(() => {
        if (!medias || medias.length === 0) return;
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        api.start({ mediaX: clampX(middleBox) });
        setMiddleIndex(0);
    }, [medias, windowWidth, mediaSize, clampX, api]);

    const updateMiddleIndex = useCallback((currentX) => {
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        const stride = getStride();
        const idx = Math.round((middleBox - currentX) / stride);
        setMiddleIndex(idx);
    }, [windowWidth, mediaSize, getStride]);

    const updateMiddleIndexThrottled = useCallback(rafThrottle(updateMiddleIndex), [updateMiddleIndex]);

    const snapToNearest = useCallback((currentX) => {
        const middleBox = (windowWidth ?? 0) / 2 - mediaSize / 2;
        const stride = getStride();
        const targetIndex = Math.round((middleBox - currentX) / stride);
        const targetX = middleBox - targetIndex * stride;
        const clamped = clampX(targetX);
        api.start({ mediaX: clamped });
        setMiddleIndex(targetIndex);
    }, [api, windowWidth, mediaSize, getStride, clampX]);

    const inertiaActive = useRef(false);
    const wheelVelocity = useRef(0);

    const bindMedias = useDrag(({ active, movement: [mx], memo = mediaX.get() }) => {
        inertiaActive.current = false;
        wheelVelocity.current = 0;
        setIsDragging(active);
        const next = mx + memo;
        if (active) {
            api.start({ mediaX: next, immediate: true });
            updateMiddleIndexThrottled(next);
        } else {
            const clamped = clampX(next);
            api.start({ mediaX: clamped, immediate: false });
            updateMiddleIndex(clamped);
            snapToNearest(clamped);
        }

        return memo;
    }, {
        axis: 'x',
        pointer: { touch: true },
        rubberband: 0.25
    });

    const stepInertia = useCallback(() => {
        if (!inertiaActive.current) return;

        wheelVelocity.current *= DECAY;
        if (Math.abs(wheelVelocity.current) < MIN_VELOCITY) {
            inertiaActive.current = false;
            snapToNearest(mediaX.get());
            return;
        }

        const current = mediaX.get();
        const next = clampX(current + wheelVelocity.current);
        api.start({ mediaX: next, immediate: true });
        updateMiddleIndexThrottled(next);
        requestAnimationFrame(stepInertia);
    }, [api, mediaX, snapToNearest, clampX, updateMiddleIndexThrottled]);

    const onWheel = useCallback((e) => {
        if (prefersReducedMotion()) return;
        if (!containerRef.current) return;

        // Always treat wheel as horizontal scroll in this view
        e.preventDefault();

        const delta = e.deltaY * WHEEL_MULTIPLIER;
        wheelVelocity.current = (wheelVelocity.current + delta) / 2;
        inertiaActive.current = true;

        const current = mediaX.get();
        const next = clampX(current + delta);
        api.start({ mediaX: next, immediate: true });
        updateMiddleIndexThrottled(next);
        requestAnimationFrame(stepInertia);
    }, [api, mediaX, clampX, stepInertia, updateMiddleIndexThrottled]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const opts = { passive: false }; // we call preventDefault
        el.addEventListener('wheel', onWheel, opts);
        return () => {
            el.removeEventListener('wheel', onWheel, opts);
        };
    }, [onWheel]);

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
                        medias={medias}
                    />
                </animated.div>
                {/* Progress bar (full-width) */}
                <div className="pointer-events-none fixed bottom-6 left-0 right-0 w-full z-40">
                  <div className="relative mx-auto h-px bg-white/40" style={{ width: '100%' }}>
                    {/* Fill to current position */}
                    <animated.div
                      className="absolute inset-y-0 left-0 bg-white/70"
                      style={{ width: mediaX.to(x => `${progressFromX(x) * 100}%`) }}
                    />
                    {FOCUS_MARKS.map((v) => (
                      <div
                        key={`tick-${v}`}
                        className="absolute -top-4"
                        style={{ left: `${progressFromValue(v) * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="w-px h-4 bg-white/90"></div>
                        {!isMobile && (
                          <div className="mt-1 text-xs leading-none text-white select-none whitespace-nowrap">
                            {`f/${v}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <animated.div
                  className="pointer-events-none fixed top-0 bottom-0 w-px bg-white z-40"
                  style={{ left: mediaX.to(x => `${progressFromX(x) * 100}%`) }}
                />

            </div>
        );
    }
};

export default MediaContainerAnimated;
