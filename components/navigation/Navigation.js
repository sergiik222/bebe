'use client'
import {useEffect, useState} from "react";
import NavLink from "@/components/navigation/NavLink";
import { useLanguage } from "@/lib/LanguageContext";
import { useMenu } from "@/lib/MenuContext";

export default function Navigation() {
    const { isMenuOpen: isOpen, setIsMenuOpen: setIsOpen } = useMenu();
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);

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
            {/* Mobile Header Bar - only visible on mobile when scrolled or menu is open */}
            <div
                className={`md:hidden fixed top-0 left-0 right-0 h-16 z-40 transition-all duration-300 ${
                    isScrolled || isOpen
                        ? 'bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800'
                        : 'bg-transparent'
                }`}
            />

            {/* Mobile Bottom Bar - same padding as top */}
            <div
                className={`md:hidden fixed bottom-0 left-0 right-0 h-16 z-40 transition-all duration-300 ${
                    isScrolled || isOpen
                        ? 'bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800'
                        : 'bg-transparent'
                }`}
            />

            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleIsOpened}
            />

            {/* Navigation Drawer */}
            <nav
                className={`h-full fixed top-0 left-0 z-50 transition-transform duration-500 ease-out w-[90vw] max-w-[360px] md:w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{
                    background: 'rgba(16, 18, 22, 0.85)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderRight: '1px solid rgba(var(--accent-color-rgb), 0.15)',
                    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3), inset 0 0 60px rgba(var(--accent-color-rgb), 0.03)'
                }}
            >
                {/* Header Section */}
                <div
                    className="px-6 pt-20 pb-6"
                    style={{ borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}
                >
                    <h2 className="text-xl font-bold text-primary-text font_bold">
                        Portfolio
                    </h2>
                    <p className="text-sm text-secondary-text/70 mt-1 font_regular">
                        Visual Storyteller
                    </p>
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

                {/* Footer Section */}
                <div
                    className="absolute bottom-0 left-0 right-0 px-6 py-6"
                    style={{ borderTop: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}
                >
                    <p className="text-xs text-secondary-text/50 font_regular text-center">
                        © 2024 Portfolio
                    </p>
                </div>
            </nav>

            {/* Toggle Button */}
            <button
                onClick={toggleIsOpened}
                className={`fixed top-6 z-50 h-10 flex items-center justify-center rounded-lg transition-all duration-500 ease-out group ${isOpen ? 'left-[250px] md:left-[250px] w-10' : 'left-6 w-10'}`}
                style={{
                    background: 'rgba(24, 27, 32, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
            >
                <div
                    className={`absolute inset-0 rounded-lg border transition-colors duration-500 ease-out ${isOpen ? 'border-[var(--accent-color)]' : 'border-zinc-700 group-hover:border-[var(--accent-color)]'}`}
                />
                <div className="relative w-5 h-5">
                    {/* Burger Icon */}
                    <svg
                        className={`absolute inset-0 w-5 h-5 transition-all duration-500 ease-out ${isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'} text-gray-300 group-hover:text-[var(--accent-color)]`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        viewBox="0 0 24 24"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                    {/* Close Icon */}
                    <svg
                        className={`absolute inset-0 w-5 h-5 transition-all duration-500 ease-out ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'} text-[var(--accent-color)]`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        viewBox="0 0 24 24"
                    >
                        <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
            </button>

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
