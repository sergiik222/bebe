'use client';

const Loader = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: { container: 'w-12 h-12' },
        md: { container: 'w-20 h-20' },
        lg: { container: 'w-32 h-32' },
    };

    const s = sizes[size] || sizes.md;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Logo-based Loader */}
            <div className={`${s.container} relative`}>
                <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                    {/* Outer ring - rotates */}
                    <circle
                        cx="20"
                        cy="20"
                        r="18"
                        stroke="var(--accent-color)"
                        strokeWidth="1.5"
                        className="outer-ring"
                        opacity="0.6"
                    />

                    {/* Middle ring - counter rotates */}
                    <circle
                        cx="20"
                        cy="20"
                        r="12"
                        stroke="var(--accent-color)"
                        strokeWidth="1"
                        className="middle-ring"
                        opacity="0.4"
                    />

                    {/* Center dot - pulses */}
                    <circle
                        cx="20"
                        cy="20"
                        r="6"
                        fill="var(--accent-color)"
                        className="center-dot"
                    />

                    {/* Focus lines - rotate with outer ring */}
                    <g className="focus-lines">
                        <path
                            d="M20 8 L22 14 M32 20 L26 22 M20 32 L18 26 M8 20 L14 18"
                            stroke="var(--accent-color)"
                            strokeWidth="1"
                            strokeLinecap="round"
                        />
                    </g>
                </svg>
            </div>

            {/* Optional loading text */}
            {text && (
                <p className="text-sm text-gray-400 tracking-wider loader-text">
                    {text}
                </p>
            )}

            <style jsx>{`
                @keyframes rotateClockwise {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes rotateCounterClockwise {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.6;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.15);
                    }
                }

                @keyframes textFade {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

                .outer-ring {
                    animation: rotateClockwise 4s linear infinite;
                    transform-origin: 20px 20px;
                }

                .middle-ring {
                    animation: rotateCounterClockwise 3s linear infinite;
                    transform-origin: 20px 20px;
                }

                .center-dot {
                    animation: pulse 1.5s ease-in-out infinite;
                    transform-origin: 20px 20px;
                }

                .focus-lines {
                    animation: rotateClockwise 4s linear infinite;
                    transform-origin: 20px 20px;
                    opacity: 0.4;
                }

                .loader-text {
                    animation: textFade 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

// Full page loader variant
export const PageLoader = ({ text = '' }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-bg/90 backdrop-blur-sm">
            <Loader size="lg" text={text} />
        </div>
    );
};

// Inline loader for buttons/small spaces
export const InlineLoader = () => {
    return (
        <div className="w-5 h-5 relative flex items-center justify-center">
            <div
                className="w-5 h-5 rounded-full animate-spin"
                style={{
                    border: '2px solid rgba(var(--accent-color-rgb), 0.2)',
                    borderTopColor: 'var(--accent-color)',
                    animationDuration: '0.8s',
                }}
            />
        </div>
    );
};

export default Loader;
