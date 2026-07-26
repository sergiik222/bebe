'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const THEME_STORAGE_KEY = 'bebe_theme';

// theme is 'light' | 'dark' | null, where null means "follow the browser".
// Only an explicit choice is stored, so someone who never touches the toggle
// keeps tracking their OS setting rather than being pinned to whatever it
// happened to be on their first visit.
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(null);
    const [systemTheme, setSystemTheme] = useState('light');

    // Read the choice the inline script in layout.js already applied, so the
    // toggle shows the right state without a second paint.
    useEffect(() => {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        setTheme(stored === 'light' || stored === 'dark' ? stored : null);
    }, []);

    // Track the OS preference so the toggle can report what "follow browser"
    // currently resolves to, and so it updates live if the OS flips.
    useEffect(() => {
        const query = window.matchMedia('(prefers-color-scheme: dark)');
        const apply = () => setSystemTheme(query.matches ? 'dark' : 'light');
        apply();
        query.addEventListener('change', apply);
        return () => query.removeEventListener('change', apply);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme) {
            root.setAttribute('data-theme', theme);
        } else {
            root.removeAttribute('data-theme');
        }
    }, [theme]);

    const resolvedTheme = theme ?? systemTheme;

    const setThemeChoice = useCallback((next) => {
        setTheme(next);
        try {
            if (next) {
                window.localStorage.setItem(THEME_STORAGE_KEY, next);
            } else {
                window.localStorage.removeItem(THEME_STORAGE_KEY);
            }
        } catch (err) {
            // Private browsing can refuse writes; the theme still applies for
            // this session, it just will not be remembered.
            console.error('Error in setThemeChoice', err);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeChoice(resolvedTheme === 'dark' ? 'light' : 'dark');
    }, [resolvedTheme, setThemeChoice]);

    const useSystemTheme = useCallback(() => setThemeChoice(null), [setThemeChoice]);

    return (
        <ThemeContext.Provider
            value={{ theme, resolvedTheme, isFollowingSystem: theme === null, toggleTheme, setThemeChoice, useSystemTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
