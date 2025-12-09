'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load saved language from localStorage
        const savedLang = localStorage.getItem('language');
        if (savedLang && translations[savedLang]) {
            setLanguage(savedLang);
        }
        setMounted(true);
    }, []);

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            localStorage.setItem('language', lang);
        }
    };

    // Always use English for SSR, then switch to saved language after mount
    const currentLang = mounted ? language : 'en';
    const t = translations[currentLang] || translations.en;

    return (
        <LanguageContext.Provider value={{ language: currentLang, changeLanguage, t, languages, mounted }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
