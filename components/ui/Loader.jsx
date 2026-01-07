'use client';

const Loader = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: { container: 'w-10 h-10', frame: 'w-8 h-6' },
        md: { container: 'w-16 h-16', frame: 'w-12 h-9' },
        lg: { container: 'w-24 h-24', frame: 'w-18 h-14' },
    };

    const s = sizes[size] || sizes.md;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Film Frame Loader */}
            <div className={`${s.container} relative flex items-center justify-center`}>
                {/* Film strip container */}
                <div className="relative">
                    {/* Main frame */}
                    <div
                        className={`${s.frame} relative border-2 border-zinc-600 rounded-sm bg-zinc-900 overflow-hidden`}
                    >
                        {/* Animated gradient fill - like photo developing */}
                        <div
                            className="absolute inset-0 animate-pulse"
                            style={{
                                background: `linear-gradient(180deg,
                                    transparent 0%,
                                    rgba(var(--accent-color-rgb), 0.1) 30%,
                                    rgba(var(--accent-color-rgb), 0.3) 50%,
                                    rgba(var(--accent-color-rgb), 0.1) 70%,
                                    transparent 100%)`,
                                animationDuration: '1.5s',
                            }}
                        />

                        {/* Scan line effect */}
                        <div
                            className="absolute left-0 right-0 h-0.5 bg-[var(--accent-color)]"
                            style={{
                                animation: 'scanLine 1.5s ease-in-out infinite',
                                boxShadow: '0 0 8px var(--accent-color), 0 0 16px var(--accent-color)',
                            }}
                        />

                        {/* Corner brackets */}
                        <div className="absolute top-0.5 left-0.5 w-2 h-2 border-l border-t border-[var(--accent-color)] opacity-60" />
                        <div className="absolute top-0.5 right-0.5 w-2 h-2 border-r border-t border-[var(--accent-color)] opacity-60" />
                        <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-l border-b border-[var(--accent-color)] opacity-60" />
                        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-r border-b border-[var(--accent-color)] opacity-60" />
                    </div>

                    {/* Film sprocket holes - left */}
                    <div className="absolute -left-1.5 top-0 bottom-0 flex flex-col justify-around py-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={`l-${i}`}
                                className="w-1 h-1.5 bg-zinc-700 rounded-sm animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>

                    {/* Film sprocket holes - right */}
                    <div className="absolute -right-1.5 top-0 bottom-0 flex flex-col justify-around py-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={`r-${i}`}
                                className="w-1 h-1.5 bg-zinc-700 rounded-sm animate-pulse"
                                style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Rotating ring around */}
                <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                        animationDuration: '3s',
                        background: `conic-gradient(from 0deg, transparent 0deg, var(--accent-color) 30deg, transparent 60deg)`,
                        opacity: 0.3,
                    }}
                />
            </div>

            {/* Optional loading text */}
            {text && (
                <p className="text-sm text-gray-400 animate-pulse">
                    {text}
                </p>
            )}

            <style jsx>{`
                @keyframes scanLine {
                    0%, 100% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

// Full page loader variant
export const PageLoader = ({ text = '' }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-bg/80 backdrop-blur-sm">
            <Loader size="lg" text={text} />
        </div>
    );
};

// Inline loader for buttons/small spaces
export const InlineLoader = () => {
    return (
        <div className="w-5 h-5 relative">
            <div
                className="w-5 h-5 rounded-full border-2 border-zinc-600 animate-spin"
                style={{
                    borderTopColor: 'var(--accent-color)',
                    animationDuration: '0.8s',
                }}
            />
        </div>
    );
};

export default Loader;
