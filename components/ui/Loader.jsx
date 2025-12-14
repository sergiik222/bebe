'use client';

const Loader = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: { container: 'w-8 h-8', ring: 'w-8 h-8', inner: 'w-4 h-4' },
        md: { container: 'w-16 h-16', ring: 'w-16 h-16', inner: 'w-8 h-8' },
        lg: { container: 'w-24 h-24', ring: 'w-24 h-24', inner: 'w-12 h-12' },
    };

    const s = sizes[size] || sizes.md;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Camera Lens Loader */}
            <div className={`${s.container} relative`}>
                {/* Outer ring - lens barrel */}
                <div
                    className={`${s.ring} absolute inset-0 rounded-full border-2 border-zinc-700`}
                    style={{
                        background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
                    }}
                />

                {/* Focus ring - rotating */}
                <div
                    className={`${s.ring} absolute inset-0 rounded-full animate-spin`}
                    style={{
                        animationDuration: '3s',
                        background: `conic-gradient(from 0deg, transparent 0deg, var(--accent-color) 60deg, transparent 120deg)`,
                        mask: 'radial-gradient(transparent 60%, black 62%, black 100%)',
                        WebkitMask: 'radial-gradient(transparent 60%, black 62%, black 100%)',
                    }}
                />

                {/* Aperture blades effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`${s.inner} rounded-full relative overflow-hidden`}
                        style={{
                            background: 'radial-gradient(circle, rgba(var(--accent-color-rgb), 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)',
                            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(var(--accent-color-rgb), 0.2)',
                        }}
                    >
                        {/* Aperture blade lines */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 animate-pulse"
                                style={{
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: '2s',
                                }}
                            >
                                <div
                                    className="absolute top-1/2 left-1/2 w-full h-px bg-zinc-600 origin-left"
                                    style={{
                                        transform: `rotate(${i * 60}deg) translateX(-50%)`,
                                    }}
                                />
                            </div>
                        ))}

                        {/* Center lens reflection */}
                        <div
                            className="absolute top-1/4 left-1/4 w-1/4 h-1/4 rounded-full animate-pulse"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
                                animationDuration: '2s',
                            }}
                        />
                    </div>
                </div>

                {/* Pulsing glow */}
                <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                        animationDuration: '2s',
                        background: 'transparent',
                        boxShadow: '0 0 0 2px rgba(var(--accent-color-rgb), 0.3)',
                    }}
                />
            </div>

            {/* Optional loading text */}
            {text && (
                <p className="text-sm text-secondary-text/70 font_regular animate-pulse">
                    {text}
                </p>
            )}
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
