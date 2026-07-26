'use client';

import {useState, useEffect} from 'react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <button
            onClick={handleClick}
            className={`fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            style={{
                background: 'var(--surface-veil)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
            aria-label="Scroll to top"
        >
            <div
                className="absolute inset-0 rounded-lg border border-line-strong group-hover:border-[var(--accent-color)] transition-colors duration-300"
            />
            <svg
                className="w-5 h-5 text-secondary-text group-hover:text-[var(--accent-color)] transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
            >
                <path d="M18 15l-6-6-6 6"/>
            </svg>
        </button>
    );
};

export default ScrollToTopButton;
