'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';

const LanguageSelector = () => {
    const { language, changeLanguage, languages, mounted } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Don't render until mounted to avoid hydration issues
    if (!mounted) {
        return null;
    }

    return (
        <div className="fixed top-6 right-6 z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-gray-300 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors text-sm font-medium"
            >
                {language.toUpperCase()}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 py-1 w-24 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-xl">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-center text-sm hover:bg-zinc-800 transition-colors ${
                                language === lang.code
                                    ? 'text-[var(--accent-color)] font-medium'
                                    : 'text-gray-300'
                            }`}
                        >
                            {lang.code.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
