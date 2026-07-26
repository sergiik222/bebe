'use client'
import {useEffect, useState, useRef} from "react";
import { usePathname } from "next/navigation";
import NavLink from "@/components/navigation/NavLink";
import { useLanguage } from "@/lib/LanguageContext";
import { useMenu } from "@/lib/MenuContext";
import CustomThemeToggle from "@/components/CustomThemeToggle";

export default function Navigation() {
    const { isMenuOpen: isOpen, setIsMenuOpen: setIsOpen } = useMenu();
    const { t, language, changeLanguage, languages } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const langRef = useRef(null);
    const pathname = usePathname();

    // Check if we're on specific pages
    const isGalleryPage = pathname?.startsWith('/gallery');
    const isAdminPage = pathname === '/admin';

    // Check if admin is logged in
    useEffect(() => {
        const checkAdminToken = () => {
            const token = localStorage.getItem('adminToken');
            setIsAdminLoggedIn(!!token);
        };
        checkAdminToken();
        // Listen for storage changes (login/logout in other tabs)
        window.addEventListener('storage', checkAdminToken);
        // Listen for custom admin login/logout events (same tab)
        window.addEventListener('adminAuthChanged', checkAdminToken);
        return () => {
            window.removeEventListener('storage', checkAdminToken);
            window.removeEventListener('adminAuthChanged', checkAdminToken);
        };
    }, []);

    // Close language dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleIsOpened = () => {
        setIsOpen(!isOpen);
    }

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Track scroll position for header background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { href: "/", label: t.nav.home, size: "text-lg" },
        { href: "/about", label: t.nav.about, size: "text-base" },
        { href: "/portfolio", label: t.nav.portfolio, size: "text-lg" },
        { href: "/book", label: t.nav.book, size: "text-base" },
        { href: "/contact", label: t.nav.contact, size: "text-base" }
    ];

    return (
        <>
            {/* Header Bar - shows background on scroll */}
            <div
                className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
                    isScrolled || isOpen
                        ? 'bg-surface/90 backdrop-blur-md'
                        : 'bg-transparent'
                }`}
                style={{ height: 'calc(1.5rem + 2.5rem + 1.5rem)' }} // top-6 (24px) + h-10 (40px) + 24px bottom padding
            />

            {/* Top Right buttons */}
            <div className={`fixed top-6 right-4 md:right-6 z-[60] flex items-center gap-2 md:gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}>
                {/* Admin Button - only visible when logged in, not on gallery page or admin page */}
                {isAdminLoggedIn && !isGalleryPage && !isAdminPage && (
                    <a
                        href="/admin"
                        className="flex items-center justify-center px-3 md:px-4 h-10 bg-surface backdrop-blur-sm border border-[var(--accent-color)]/50 rounded-lg text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-colors text-xs md:text-sm font-medium"
                    >
                        Admin
                    </a>
                )}

                {/* Logout Button - only visible on admin page */}
                {isAdminLoggedIn && isAdminPage && (
                    <button
                        onClick={() => {
                            localStorage.removeItem('adminToken');
                            window.dispatchEvent(new Event('adminAuthChanged'));
                            window.location.href = '/admin';
                        }}
                        className="flex items-center justify-center px-3 md:px-4 h-10 bg-surface border border-danger/50 rounded-lg text-danger hover:border-danger hover:bg-danger/10 transition-colors text-xs md:text-sm font-medium"
                    >
                        Logout
                    </button>
                )}

                {/* Portfolio Button */}
                <a
                    href="/portfolio"
                    className="flex items-center justify-center px-3 md:px-4 h-10 bg-surface/80 backdrop-blur-sm border border-line-strong rounded-lg text-secondary-text hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors text-xs md:text-sm font-medium"
                >
                    {t.nav.portfolio}
                </a>

                {/* Instagram Button */}
                <a
                    href="https://www.instagram.com/b_spurs_photo?igsh=a2h3MjRiMGNjN3F4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-surface/80 backdrop-blur-sm border border-line-strong rounded-lg text-secondary-text hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                    aria-label="Instagram"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>

                {/* Theme Toggle */}
                <CustomThemeToggle />

                {/* Language Selector */}
                <div className="relative" ref={langRef}>
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex items-center justify-center w-10 h-10 bg-surface/80 backdrop-blur-sm border border-line-strong rounded-lg text-secondary-text hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors text-sm font-medium"
                    >
                        {language?.toUpperCase() || 'EN'}
                    </button>
                    {isLangOpen && languages && (
                        <div className="absolute right-0 mt-2 py-1 w-24 bg-surface/95 backdrop-blur-sm border border-line-strong rounded-lg shadow-xl z-50">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        changeLanguage(lang.code);
                                        setIsLangOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-center text-sm hover:bg-surface-raised transition-colors ${
                                        language === lang.code
                                            ? 'text-[var(--accent-color)] font-medium'
                                            : 'text-secondary-text'
                                    }`}
                                >
                                    {lang.code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleIsOpened}
            />

            {/* Navigation Drawer */}
            <nav
                className={`h-full fixed top-0 left-0 z-50 transition-transform duration-500 ease-out w-[90vw] max-w-[360px] md:w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{
                    background: 'var(--surface-veil-strong)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderRight: '1px solid rgba(var(--accent-color-rgb), 0.15)',
                    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3), inset 0 0 60px rgba(var(--accent-color-rgb), 0.03)'
                }}
            >
                {/* Header Section with Logo and Close Button */}
                <div
                    className="px-6 pt-6 pb-6 flex items-center justify-between"
                    style={{ borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}
                >
                    {/* Logo in menu */}
                    <a href="/" onClick={toggleIsOpened} className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10">
                            <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="var(--accent-color)" strokeWidth="1.5" className="opacity-60" />
                                <circle cx="20" cy="20" r="12" stroke="var(--accent-color)" strokeWidth="1" className="opacity-40" />
                                <circle cx="20" cy="20" r="6" fill="var(--accent-color)" className="opacity-80 group-hover:opacity-100 transition-opacity" />
                                <path d="M20 8 L22 14 M32 20 L26 22 M20 32 L18 26 M8 20 L14 18" stroke="var(--accent-color)" strokeWidth="1" className="opacity-30" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-base font-semibold tracking-wider" style={{ color: 'var(--accent-color)' }}>BEBE</span>
                            <span className="text-[10px] tracking-[0.2em] opacity-70" style={{ color: 'var(--accent-color)' }}>MEDIA</span>
                        </div>
                    </a>

                    {/* Close Button */}
                    <button
                        onClick={toggleIsOpened}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-line-strong hover:border-[var(--accent-color)] transition-colors"
                        aria-label="Close menu"
                    >
                        <svg className="w-5 h-5 text-[var(--accent-color)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <ul className="p-6 space-y-2 mt-4">
                    {menuItems.map((item, index) => (
                        <li
                            key={item.href}
                            className="menu-item"
                            style={{
                                animation: isOpen ? `slideIn 400ms ease-out ${index * 50}ms both` : 'none',
                                animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                        >
                            <NavLink
                                onClick={toggleIsOpened}
                                href={item.href}
                                className={`${item.size} font_regular block py-4 px-6 rounded-xl transition-all duration-300 ease-out text-secondary-text hover:text-primary-text hover:translate-x-2`}
                                style={{
                                    '--hover-bg': 'rgba(var(--accent-color-rgb), 0.08)',
                                    '--hover-shadow': 'inset 0 0 20px rgba(var(--accent-color-rgb), 0.05)',
                                    '--active-bg': 'rgba(var(--accent-color-rgb), 0.12)'
                                }}
                                activeStyle={{
                                    color: 'var(--accent-color)',
                                    background: 'linear-gradient(to right, rgba(var(--accent-color-rgb), 0.15), rgba(var(--accent-color-rgb), 0.05))',
                                    fontWeight: '600',
                                    boxShadow: '0 0 20px rgba(var(--accent-color-rgb), 0.15), inset 0 0 30px rgba(var(--accent-color-rgb), 0.08)'
                                }}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Footer Section with Legal Links */}
                <div
                    className="absolute bottom-0 left-0 right-0 px-6 py-4"
                    style={{ borderTop: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}
                >
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2">
                        <a
                            href="/impressum"
                            onClick={toggleIsOpened}
                            className="text-xs text-secondary-text/60 hover:text-[var(--accent-color)] transition-colors font_regular"
                        >
                            {t.legal?.impressum || 'Imprint'}
                        </a>
                        <a
                            href="/datenschutz"
                            onClick={toggleIsOpened}
                            className="text-xs text-secondary-text/60 hover:text-[var(--accent-color)] transition-colors font_regular"
                        >
                            {t.legal?.datenschutz || 'Privacy'}
                        </a>
                        <a
                            href="/agb"
                            onClick={toggleIsOpened}
                            className="text-xs text-secondary-text/60 hover:text-[var(--accent-color)] transition-colors font_regular"
                        >
                            {t.legal?.agb || 'Terms'}
                        </a>
                        <button
                            onClick={() => {
                                toggleIsOpened();
                                if (typeof window !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent('openCookieSettings'));
                                }
                            }}
                            className="text-xs text-secondary-text/60 hover:text-[var(--accent-color)] transition-colors font_regular"
                        >
                            {t.legal?.cookies || 'Cookies'}
                        </button>
                    </div>
                    <p className="text-xs text-secondary-text/40 font_regular text-center">
                        © 2025 Bebe Media
                    </p>
                </div>
            </nav>

            {/* Left side - Burger + Logo */}
            <div className={`fixed top-6 left-6 z-50 flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {/* Burger Button */}
                <button
                    onClick={toggleIsOpened}
                    className="h-10 w-10 flex items-center justify-center rounded-lg group"
                    style={{
                        background: 'var(--surface-veil)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                    aria-label="Open menu"
                    aria-expanded={isOpen}
                >
                    <div className="absolute inset-0 rounded-lg border border-line-strong group-hover:border-[var(--accent-color)] transition-colors duration-300" />
                    <svg
                        className="w-5 h-5 text-secondary-text group-hover:text-[var(--accent-color)] transition-colors"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        viewBox="0 0 24 24"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                {/* Logo next to burger */}
                <a href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10">
                        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="var(--accent-color)" strokeWidth="1.5" className="opacity-60" />
                            <circle cx="20" cy="20" r="12" stroke="var(--accent-color)" strokeWidth="1" className="opacity-40" />
                            <circle cx="20" cy="20" r="6" fill="var(--accent-color)" className="opacity-80 group-hover:opacity-100 transition-opacity" />
                            <path d="M20 8 L22 14 M32 20 L26 22 M20 32 L18 26 M8 20 L14 18" stroke="var(--accent-color)" strokeWidth="1" className="opacity-30" />
                        </svg>
                    </div>
                    <div className="hidden md:flex flex-col leading-none">
                        <span className="text-base font-semibold tracking-wider group-hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-color)' }}>BEBE</span>
                        <span className="text-[10px] tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-color)' }}>MEDIA</span>
                    </div>
                </a>
            </div>

            {/* Keyframe Animations */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
