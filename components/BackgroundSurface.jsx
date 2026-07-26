'use client'

import React from 'react';

// The tilt stage rotates, so it has to overhang far enough that a swung edge
// never enters frame. Anything positioned against an edge is offset by the
// same amount to stay where it was.
const OVERHANG = 140

// grid geometry: 1cm squares at 28px, major square every 5 (140px)
const MINOR = 28
const MAJOR = MINOR * 5
const RULER_LEN = MINOR * 40

// The printed marks are inline SVG rather than data-URI backgrounds on purpose:
// a data URI is a separate document, so var(--mat-guide) would not resolve
// inside it and the marks would disappear. Inline, they follow the theme.
const HEALED_CUTS = [
    [210, 140, 258, 121],
    [980, 90, 1010, 150],
    [140, 560, 120, 612],
    [700, 430, 760, 448],
    [1180, 620, 1150, 670],
    [430, 700, 470, 686],
    [1340, 300, 1372, 340]
]

function RulerPattern({ id }) {
    const ticks = []
    for (let x = 0; x <= RULER_LEN; x += MINOR) {
        const isMajor = x % MAJOR === 0
        ticks.push(
            <line
                key={`t${x}`}
                x1={x} y1={6} x2={x} y2={isMajor ? 20 : 12}
                stroke="var(--mat-guide)" strokeWidth={isMajor ? 1.2 : 0.7}
            />
        )
        if (isMajor && x > 0) {
            ticks.push(
                <text key={`n${x}`} x={x + 3} y={33} fontSize={10} fontFamily="monospace" fill="var(--mat-guide)">
                    {x / MINOR}
                </text>
            )
        }
    }
    return (
        <svg width="100%" height="40" aria-hidden="true">
            <defs>
                <pattern id={id} width={RULER_LEN} height="40" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="6" x2={RULER_LEN} y2="6" stroke="var(--mat-guide-soft)" strokeWidth="1" />
                    {ticks}
                </pattern>
            </defs>
            <rect width="100%" height="40" fill={`url(#${id})`} />
        </svg>
    )
}

export default function BackgroundSurface() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ backgroundColor: 'var(--page-bg)' }}>

            {/* perspective host for the tilt stage */}
            <div style={{ position: 'absolute', inset: -OVERHANG, perspective: '1400px' }}>

                {/* tilt stage -- tips toward the drag and slides with it. Easing
                    back to flat is done frame by frame on --bg-tilt itself, so
                    no CSS transition here: it would only add lag on top.
                    Slide and rotation share one transform, so the whole board
                    stays a single composited layer. The translate is listed
                    first, which applies it last - a screen-space slide of the
                    already-rotated board rather than a slide along its plane. */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        transformOrigin: '50% 50%',
                        transform: 'translate3d(var(--bg-shift, 0px), 0, 0) rotateY(var(--bg-tilt, 0deg)) rotateX(calc(var(--bg-tilt, 0deg) * -0.3))'
                    }}
                >
                    {/* mat base -- the board body */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--mat-deep) 0%, var(--mat-mid) 48%, var(--mat-deep) 100%)' }} />

                    {/* mottling -- uneven, used surface, irregular soft patches */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 620px 420px at 18% 28%, var(--mat-mottle), transparent 70%), radial-gradient(ellipse 520px 700px at 82% 58%, var(--mat-mottle), transparent 72%), radial-gradient(ellipse 760px 480px at 46% 88%, var(--mat-mottle-dark), transparent 70%)' }} />

                    {/* minor grid -- 1cm squares */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(to right, var(--grid-minor) 0px, var(--grid-minor) 1px, transparent 1px, transparent ${MINOR}px), repeating-linear-gradient(to bottom, var(--grid-minor) 0px, var(--grid-minor) 1px, transparent 1px, transparent ${MINOR}px)` }} />

                    {/* major grid -- every 5th square, heavier line */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(to right, var(--grid-major) 0px, var(--grid-major) 1.5px, transparent 1.5px, transparent ${MAJOR}px), repeating-linear-gradient(to bottom, var(--grid-major) 0px, var(--grid-major) 1.5px, transparent 1.5px, transparent ${MAJOR}px)` }} />

                    {/* angle guides -- 45deg / 60deg printed lines from lower-left origin */}
                    <svg
                        style={{ position: 'absolute', left: 0, bottom: 0, width: 900, height: 900 }}
                        viewBox="0 0 900 900"
                        aria-hidden="true"
                    >
                        <line x1="0" y1="900" x2="900" y2="0" stroke="var(--mat-guide-faint)" strokeWidth="1" />
                        <line x1="0" y1="900" x2="450" y2="0" stroke="var(--mat-guide-faint)" strokeWidth="1" />
                        <line x1="0" y1="450" x2="900" y2="450" stroke="var(--mat-guide-faint)" strokeWidth="1" />
                    </svg>

                    {/* ruler -- bottom edge, held inboard so it never collides with the fixed UI measurement bar */}
                    <div style={{ position: 'absolute', left: 24 + OVERHANG, right: 24 + OVERHANG, bottom: 148 + OVERHANG, height: 40 }}>
                        <RulerPattern id="bg-ruler-h" />
                    </div>

                    {/* ruler -- left edge, rotated copy, also held inboard */}
                    <div style={{ position: 'absolute', top: 24 + OVERHANG, left: 108 + OVERHANG, width: RULER_LEN, height: 40, transform: 'rotate(-90deg)', transformOrigin: 'top left' }}>
                        <RulerPattern id="bg-ruler-v" />
                    </div>

                    {/* registration cross -- centred */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 36, height: 1, transform: 'translate(-50%, -50%)', background: 'var(--mat-guide-soft)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1, height: 36, transform: 'translate(-50%, -50%)', background: 'var(--mat-guide-soft)' }} />

                    {/* healed cuts -- faint scored lines proving this is a used, physical board */}
                    <svg
                        style={{ position: 'absolute', top: '50%', left: '50%', width: 1600, height: 900, transform: 'translate(-50%, -50%)' }}
                        viewBox="0 0 1600 900"
                        aria-hidden="true"
                    >
                        {HEALED_CUTS.map(([x1, y1, x2, y2]) => (
                            <line
                                key={`${x1}-${y1}`}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="var(--mat-cut)" strokeWidth="1" strokeLinecap="round"
                            />
                        ))}
                    </svg>

                </div>
            </div>

            {/* key light -- off-centre soft pool as if lit from above */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 900px 700px at 66% 36%, var(--keylight), transparent 70%)' }} />

            {/* vignette -- room falloff toward the edges */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 120% 100% at 50% 48%, transparent 42%, var(--vignette) 100%)' }} />

            {/* scrim -- keeps the top UI zone readable. Darkens on the dark
                theme and lightens on the light one, since the text over it
                flips with the theme too. */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to bottom, var(--scrim-strong) 0px, var(--scrim-soft) 100px, transparent 160px)' }} />

            {/* scrim -- same for the bottom, and it absorbs the board's own ruler edge */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 190, background: 'linear-gradient(to top, var(--scrim-strong) 0px, var(--scrim-soft) 130px, transparent 190px)' }} />

        </div>
    )
}
