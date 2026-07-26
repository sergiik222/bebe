'use client'

import React from 'react';
import { animated } from 'react-spring';

const ARROW_PATH = 'M12 4 L4 16 C4 16 6 16 8 16 L16 16 C16 16 18 16 20 16 Z';

const INACTIVE_TICK_COLOR = 'var(--scale-tick-idle)';
const INACTIVE_LABEL_COLOR = 'var(--scale-label-idle)';

// A centred label at either extreme would hang half-way off the viewport, so
// the first and last marks align their labels inward instead. The tick itself
// stays centred on the mark either way.
const EDGE_EPSILON = 0.001;

const labelTransformFor = (position) => {
    if (position <= EDGE_EPSILON) return 'translateX(0)';
    if (position >= 1 - EDGE_EPSILON) return 'translateX(-100%)';
    return 'translateX(-50%)';
};

// Shared camera-HUD scale bar: a track, an accent fill up to the current
// position, tick marks with labels, and a triangle marker riding the fill.
// isFlipped mirrors it for the top of the screen - ticks hang below the line
// and the marker points down at it.
function CustomScaleBar({ marks, progress, positionClassName, showLabels = true, isFlipped = false }) {
    const offset = progress.to(p => `${p * 100}%`);
    const tickColorAt = (position) => progress.to(p => (p >= position ? 'var(--accent-color)' : INACTIVE_TICK_COLOR));
    const labelColorAt = (position) => progress.to(p => (p >= position ? 'var(--accent-color)' : INACTIVE_LABEL_COLOR));

    return (
        <div className={`pointer-events-none fixed left-0 right-0 w-full z-40 hidden md:block ${positionClassName}`}>
            <div className="relative mx-auto h-px w-full bg-[color:var(--scale-track)]">
                {/* Fill to current position */}
                <animated.div
                    className="absolute inset-y-0 left-0"
                    style={{
                        width: offset,
                        backgroundColor: 'var(--accent-color)',
                        boxShadow: '0 0 8px var(--accent-glow)'
                    }}
                />
                {marks.map(({ key, position, label }) => (
                    <div
                        key={key}
                        className={`absolute ${isFlipped ? 'top-0' : '-top-4'}`}
                        style={{ left: `${position * 100}%` }}
                    >
                        <animated.div
                            className="w-px h-4 -translate-x-1/2"
                            style={{ backgroundColor: tickColorAt(position) }}
                        />
                        {showLabels && (
                            <animated.div
                                className="mt-1 text-xs leading-none select-none whitespace-nowrap font-medium"
                                style={{
                                    transform: labelTransformFor(position),
                                    color: labelColorAt(position),
                                    textShadow: progress.to(p =>
                                        p >= position ? '0 0 8px var(--accent-glow)' : 'none'
                                    )
                                }}
                            >
                                {label}
                            </animated.div>
                        )}
                    </div>
                ))}
                {/* Marker sitting on the line at the current position */}
                <animated.div
                    className={`absolute ${isFlipped ? 'top-0' : 'bottom-0'}`}
                    style={{
                        left: offset,
                        transform: isFlipped
                            ? 'translateX(-50%) translateY(-30%) rotate(180deg)'
                            : 'translateX(-50%) translateY(30%)'
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="var(--accent-color)"
                        style={{ filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}
                    >
                        <path d={ARROW_PATH} />
                    </svg>
                </animated.div>
            </div>
        </div>
    );
}

export default CustomScaleBar;
