'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export default function CookieBanner() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Small delay for better UX
            setTimeout(() => {
                setIsVisible(true);
                setIsAnimating(true);
            }, 1000);
        }

        // Listen for the custom event to open cookie settings
        const handleOpenSettings = () => {
            setIsVisible(true);
            setIsAnimating(true);
        };

        window.addEventListener('openCookieSettings', handleOpenSettings);
        return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        }));
        closeBanner();
    };

    const handleAcceptEssential = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        }));
        closeBanner();
    };

    const closeBanner = () => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
    };

    if (!isVisible) return null;

    const cookieT = t.cookieBanner || {
        title: 'Cookie Settings',
        description: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
        acceptAll: 'Accept All',
        acceptEssential: 'Essential Only',
        learnMore: 'Learn more',
    };

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-300 ease-out ${
                isAnimating ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            <div
                className="mx-4 mb-4 md:mx-8 md:mb-6 p-4 md:p-6 rounded-xl"
                style={{
                    background: 'rgba(16, 18, 22, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
                    boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.4)'
                }}
            >
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Cookie Icon & Text */}
                        <div className="flex-1">
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ backgroundColor: 'rgba(var(--accent-color-rgb), 0.15)' }}
                                >
                                    <svg className="w-5 h-5 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.66-.07-1.3-.18-1.93-.45.3-.99.48-1.58.48-1.54 0-2.79-1.25-2.79-2.79 0-.59.18-1.13.48-1.58-.63-.11-1.27-.18-1.93-.18zM8.5 11c-.83 0-1.5-.67-1.5-1.5S7.67 8 8.5 8s1.5.67 1.5 1.5S9.33 11 8.5 11zm2 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm md:text-base mb-1">
                                        {cookieT.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                        {cookieT.description}{' '}
                                        <a
                                            href="/datenschutz"
                                            className="text-[var(--accent-color)] hover:underline"
                                        >
                                            {cookieT.learnMore}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 md:flex-shrink-0">
                            <button
                                onClick={handleAcceptEssential}
                                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-gray-300 hover:text-white border border-zinc-700 hover:border-zinc-500"
                            >
                                {cookieT.acceptEssential}
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--accent-color)',
                                    color: '#0a0a0a'
                                }}
                            >
                                {cookieT.acceptAll}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
