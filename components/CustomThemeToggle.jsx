'use client';

import React from 'react';
import { useTheme } from '@/lib/ThemeContext';

// Matches the sizing and hover treatment of the other icon buttons in the nav.
const BUTTON_CLASS =
    'flex items-center justify-center w-10 h-10 bg-surface/80 backdrop-blur-sm border border-line-strong rounded-lg text-secondary-text hover:border-accent-main hover:text-accent-main transition-colors';

function SunIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a6.8 6.8 0 0 0 11 11z" />
        </svg>
    );
}

function CustomThemeToggle() {
    const { resolvedTheme, isFollowingSystem, toggleTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    // Name the destination, not the current state - the button says what it
    // will do when pressed.
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    const following = isFollowingSystem ? ' (currently following your browser)' : '';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={BUTTON_CLASS}
            aria-label={label}
            title={`${label}${following}`}
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
}

export default CustomThemeToggle;
